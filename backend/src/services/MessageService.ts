import { supabase, DatabaseHelper } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { Message, Notification } from '../types/index.js';

export class MessageService {
  private static instance: MessageService;

  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  // Send message
  async sendMessage(messageData: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Promise<Message> {
    const message = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('messages')
        .insert({
          ...messageData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, avatar_url),
          receiver:users!messages_receiver_id_fkey(id, name, avatar_url),
          properties (id, name),
          stays (id, guest_name)
        `)
        .single()
    );

    // Create notification for receiver
    await this.createNotification({
      user_id: messageData.receiver_id,
      title: 'New Message',
      message: `You have a new message from ${message.sender?.name || 'Unknown'}`,
      type: 'message',
      data: {
        message_id: message.id,
        sender_id: messageData.sender_id,
        property_id: messageData.property_id,
        stay_id: messageData.stay_id
      }
    });

    logger.info('Message sent', { 
      messageId: message.id, 
      senderId: messageData.sender_id, 
      receiverId: messageData.receiver_id 
    });

    return message;
  }

  // Get messages for user
  async getMessagesForUser(userId: string, page: number = 1, limit: number = 20): Promise<{ messages: Message[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data: messages, error, count } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, name, avatar_url),
        properties (id, name),
        stays (id, guest_name)
      `, { count: 'exact' })
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return {
      messages: messages || [],
      total: count || 0
    };
  }

  // Get conversation between two users
  async getConversation(user1Id: string, user2Id: string, page: number = 1, limit: number = 50): Promise<{ messages: Message[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data: messages, error, count } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, name, avatar_url),
        properties (id, name),
        stays (id, guest_name)
      `, { count: 'exact' })
      .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch conversation: ${error.message}`);
    }

    return {
      messages: messages || [],
      total: count || 0
    };
  }

  // Mark message as read
  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('receiver_id', userId)
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, avatar_url),
          receiver:users!messages_receiver_id_fkey(id, name, avatar_url),
          properties (id, name),
          stays (id, guest_name)
        `)
        .single()
    );

    logger.info('Message marked as read', { messageId, userId });
    return message;
  }

  // Mark all messages as read for a conversation
  async markConversationAsRead(user1Id: string, user2Id: string): Promise<void> {
    await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
      .eq('is_read', false);

    logger.info('Conversation marked as read', { user1Id, user2Id });
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    return count || 0;
  }

  // Create notification
  async createNotification(notificationData: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const notification = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('notifications')
        .insert({
          ...notificationData,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single()
    );

    logger.info('Notification created', { 
      notificationId: notification.id, 
      userId: notificationData.user_id,
      type: notificationData.type
    });

    return notification;
  }

  // Get notifications for user
  async getNotificationsForUser(userId: string, page: number = 1, limit: number = 20): Promise<{ notifications: Notification[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }

    return {
      notifications: notifications || [],
      total: count || 0
    };
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select('*')
        .single()
    );

    logger.info('Notification marked as read', { notificationId, userId });
    return notification;
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    logger.info('All notifications marked as read', { userId });
  }

  // Get unread notification count
  async getUnreadNotificationCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    return count || 0;
  }

  // Send system notification
  async sendSystemNotification(userId: string, title: string, message: string, data?: any): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: 'system',
      data: data || {},
      is_read: false
    });
  }

  // Send booking notification
  async sendBookingNotification(userId: string, bookingId: string, type: 'created' | 'confirmed' | 'cancelled'): Promise<Notification> {
    const titles = {
      created: 'New Booking Request',
      confirmed: 'Booking Confirmed',
      cancelled: 'Booking Cancelled'
    };

    const messages = {
      created: 'You have a new booking request',
      confirmed: 'Your booking has been confirmed',
      cancelled: 'Your booking has been cancelled'
    };

    return this.createNotification({
      user_id: userId,
      title: titles[type],
      message: messages[type],
      type: 'booking',
      data: { booking_id: bookingId },
      is_read: false
    });
  }

  // Send reminder notification
  async sendReminderNotification(userId: string, title: string, message: string, reminderDate: Date): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: 'reminder',
      data: { reminder_date: reminderDate.toISOString() },
      is_read: false
    });
  }

  // Delete old notifications (cleanup)
  async deleteOldNotifications(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const { count } = await supabase
      .from('notifications')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select('*', { count: 'exact' });

    logger.info('Old notifications deleted', { count: count || 0, daysOld });
    return count || 0;
  }
}

export const messageService = MessageService.getInstance();