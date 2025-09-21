import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { supabase } from './database.js';
import { logger } from '../utils/logger.js';
import { JWTPayload } from '../types/index.js';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    user_type: 'guest' | 'host' | 'both';
  };
}

// Socket.IO event handlers
export function setupSocketIO(io: SocketIOServer): void {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, user_type, is_active')
        .eq('id', decoded.user_id)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        return next(new Error('Invalid or expired token'));
      }

      socket.user = {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      };

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user!.id;
    const userType = socket.user!.user_type;

    logger.info('User connected to Socket.IO', { userId, userType });

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Join user to appropriate mode room
    if (userType === 'host' || userType === 'both') {
      socket.join('hosts');
    }
    if (userType === 'guest' || userType === 'both') {
      socket.join('guests');
    }

    // Handle joining property-specific rooms
    socket.on('join:property', (propertyId: string) => {
      socket.join(`property:${propertyId}`);
      logger.info('User joined property room', { userId, propertyId });
    });

    // Handle leaving property-specific rooms
    socket.on('leave:property', (propertyId: string) => {
      socket.leave(`property:${propertyId}`);
      logger.info('User left property room', { userId, propertyId });
    });

    // Handle joining stay-specific rooms
    socket.on('join:stay', (stayId: string) => {
      socket.join(`stay:${stayId}`);
      logger.info('User joined stay room', { userId, stayId });
    });

    // Handle leaving stay-specific rooms
    socket.on('leave:stay', (stayId: string) => {
      socket.leave(`stay:${stayId}`);
      logger.info('User left stay room', { userId, stayId });
    });

    // Handle new message
    socket.on('message:send', async (data: {
      receiver_id: string;
      property_id?: string;
      stay_id?: string;
      content: string;
      message_type?: 'text' | 'image' | 'file' | 'system';
    }) => {
      try {
        // Save message to database
        const { data: message, error } = await supabase
          .from('messages')
          .insert({
            sender_id: userId,
            receiver_id: data.receiver_id,
            property_id: data.property_id,
            stay_id: data.stay_id,
            content: data.content,
            message_type: data.message_type || 'text',
            is_read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('*')
          .single();

        if (error) {
          socket.emit('message:error', { error: 'Failed to send message' });
          return;
        }

        // Emit to receiver
        io.to(`user:${data.receiver_id}`).emit('message:new', message);

        // Emit to property room if applicable
        if (data.property_id) {
          io.to(`property:${data.property_id}`).emit('message:new', message);
        }

        // Emit to stay room if applicable
        if (data.stay_id) {
          io.to(`stay:${data.stay_id}`).emit('message:new', message);
        }

        // Confirm to sender
        socket.emit('message:sent', { messageId: message.id });

        logger.info('Message sent via Socket.IO', {
          messageId: message.id,
          senderId: userId,
          receiverId: data.receiver_id
        });
      } catch (error) {
        logger.error('Failed to send message via Socket.IO', { error, userId });
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    // Handle message read status
    socket.on('message:read', async (data: { messageId: string }) => {
      try {
        const { error } = await supabase
          .from('messages')
          .update({
            is_read: true,
            read_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', data.messageId)
          .eq('receiver_id', userId);

        if (error) {
          socket.emit('message:error', { error: 'Failed to mark message as read' });
          return;
        }

        // Emit read status to sender
        const { data: message } = await supabase
          .from('messages')
          .select('sender_id')
          .eq('id', data.messageId)
          .single();

        if (message) {
          io.to(`user:${message.sender_id}`).emit('message:read', {
            messageId: data.messageId,
            readAt: new Date().toISOString()
          });
        }

        logger.info('Message marked as read via Socket.IO', {
          messageId: data.messageId,
          userId
        });
      } catch (error) {
        logger.error('Failed to mark message as read via Socket.IO', { error, userId });
        socket.emit('message:error', { error: 'Failed to mark message as read' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { receiver_id: string; property_id?: string; stay_id?: string }) => {
      socket.to(`user:${data.receiver_id}`).emit('typing:start', {
        user_id: userId,
        property_id: data.property_id,
        stay_id: data.stay_id
      });
    });

    socket.on('typing:stop', (data: { receiver_id: string; property_id?: string; stay_id?: string }) => {
      socket.to(`user:${data.receiver_id}`).emit('typing:stop', {
        user_id: userId,
        property_id: data.property_id,
        stay_id: data.stay_id
      });
    });

    // Handle booking updates
    socket.on('booking:update', async (data: { bookingId: string; status: string }) => {
      try {
        // Verify user has permission to update this booking
        const { data: booking } = await supabase
          .from('bookings')
          .select(`
            id,
            properties!inner(account_id)
          `)
          .eq('id', data.bookingId)
          .eq('properties.account_id', userId)
          .single();

        if (!booking) {
          socket.emit('booking:error', { error: 'Booking not found or access denied' });
          return;
        }

        // Update booking status
        const { data: updatedBooking, error } = await supabase
          .from('bookings')
          .update({
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.bookingId)
          .select('*')
          .single();

        if (error) {
          socket.emit('booking:error', { error: 'Failed to update booking' });
          return;
        }

        // Emit to relevant rooms
        io.to(`property:${updatedBooking.property_id}`).emit('booking:update', updatedBooking);
        io.to('hosts').emit('booking:update', updatedBooking);

        logger.info('Booking updated via Socket.IO', {
          bookingId: data.bookingId,
          status: data.status,
          userId
        });
      } catch (error) {
        logger.error('Failed to update booking via Socket.IO', { error, userId });
        socket.emit('booking:error', { error: 'Failed to update booking' });
      }
    });

    // Handle stay updates
    socket.on('stay:update', async (data: { stayId: string; status: string }) => {
      try {
        // Verify user has permission to update this stay
        const { data: stay } = await supabase
          .from('stays')
          .select(`
            id,
            properties!inner(account_id)
          `)
          .eq('id', data.stayId)
          .eq('properties.account_id', userId)
          .single();

        if (!stay) {
          socket.emit('stay:error', { error: 'Stay not found or access denied' });
          return;
        }

        // Update stay status
        const { data: updatedStay, error } = await supabase
          .from('stays')
          .update({
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.stayId)
          .select('*')
          .single();

        if (error) {
          socket.emit('stay:error', { error: 'Failed to update stay' });
          return;
        }

        // Emit to relevant rooms
        io.to(`property:${updatedStay.property_id}`).emit('stay:update', updatedStay);
        io.to(`stay:${data.stayId}`).emit('stay:update', updatedStay);
        io.to('hosts').emit('stay:update', updatedStay);

        logger.info('Stay updated via Socket.IO', {
          stayId: data.stayId,
          status: data.status,
          userId
        });
      } catch (error) {
        logger.error('Failed to update stay via Socket.IO', { error, userId });
        socket.emit('stay:error', { error: 'Failed to update stay' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info('User disconnected from Socket.IO', { userId, reason });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket.IO error', { userId, error });
    });
  });

  // Broadcast notifications to users
  io.broadcastNotification = (notification: {
    user_id: string;
    title: string;
    message: string;
    type: string;
    data?: any;
  }) => {
    io.to(`user:${notification.user_id}`).emit('notification:new', notification);
  };

  // Broadcast to all hosts
  io.broadcastToHosts = (event: string, data: any) => {
    io.to('hosts').emit(event, data);
  };

  // Broadcast to all guests
  io.broadcastToGuests = (event: string, data: any) => {
    io.to('guests').emit(event, data);
  };

  // Broadcast to property room
  io.broadcastToProperty = (propertyId: string, event: string, data: any) => {
    io.to(`property:${propertyId}`).emit(event, data);
  };

  // Broadcast to stay room
  io.broadcastToStay = (stayId: string, event: string, data: any) => {
    io.to(`stay:${stayId}`).emit(event, data);
  };

  logger.info('Socket.IO server configured successfully');
}

// Extend Socket.IO Server interface
declare module 'socket.io' {
  interface Server {
    broadcastNotification: (notification: any) => void;
    broadcastToHosts: (event: string, data: any) => void;
    broadcastToGuests: (event: string, data: any) => void;
    broadcastToProperty: (propertyId: string, event: string, data: any) => void;
    broadcastToStay: (stayId: string, event: string, data: any) => void;
  }
}