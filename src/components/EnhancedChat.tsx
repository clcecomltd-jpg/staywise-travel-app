import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Send, Paperclip, MapPin, Phone, Mail, Clock, Check, CheckCheck } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface Message {
  id: string;
  propertyId: string;
  userId: string;
  userEmail: string;
  userType: 'guest' | 'host';
  message: string;
  messageType: 'text' | 'image' | 'location' | 'file';
  metadata: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EnhancedChatProps {
  propertyId: string;
  currentUser: {
    id: string;
    email: string;
    userType: 'guest' | 'host';
    firstName?: string;
    lastName?: string;
  };
  onBack?: () => void;
}

const EnhancedChat: React.FC<EnhancedChatProps> = ({
  propertyId,
  currentUser,
  onBack
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadMessages();
    loadUnreadCount();
    initializeWebSocket();
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [propertyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeWebSocket = () => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      // Join chat room
      ws.send(JSON.stringify({
        type: 'join-chat',
        data: {
          propertyId,
          userId: currentUser.id,
          userType: currentUser.userType
        }
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'new-message':
          setMessages(prev => [...prev, data.data]);
          break;
        case 'user-typing':
          setOtherUserTyping(data.data.isTyping);
          break;
        case 'error':
          toast.error(data.message);
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!isConnected) {
          initializeWebSocket();
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setSocket(ws);
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await apiService.getChatMessages(propertyId);
      
      if (response.success) {
        setMessages(response.data || []);
      } else {
        setError(response.error || 'Failed to load messages');
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadMessageCount(propertyId);
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !socket) return;

    const messageData = {
      propertyId,
      userId: currentUser.id,
      userType: currentUser.userType,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      // Send via WebSocket for real-time delivery
      socket.send(JSON.stringify({
        type: 'send-message',
        data: messageData
      }));

      // Also send via API for persistence
      await apiService.sendMessage(propertyId, inputMessage.trim());
      
      setInputMessage('');
      setIsTyping(false);
    } catch (err) {
      toast.error('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket?.send(JSON.stringify({
        type: 'typing',
        data: {
          propertyId,
          userId: currentUser.id,
          isTyping: true
        }
      }));
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.send(JSON.stringify({
        type: 'typing',
        data: {
          propertyId,
          userId: currentUser.id,
          isTyping: false
        }
      }));
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      await apiService.markMessagesAsRead(propertyId, messageIds);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMessageIcon = (messageType: string) => {
    switch (messageType) {
      case 'image':
        return '📷';
      case 'location':
        return '📍';
      case 'file':
        return '📎';
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-96">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadMessages}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(currentUser.firstName + ' ' + currentUser.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Chat</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
          {onBack && (
            <Button size="sm" variant="ghost" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.userId === currentUser.id;
            const isHost = message.userType === 'host';
            
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={`text-xs ${isHost ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    {getInitials(message.userEmail)}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-xs ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getMessageIcon(message.messageType) && (
                        <span>{getMessageIcon(message.messageType)}</span>
                      )}
                      <span className="text-sm font-medium">
                        {isHost ? 'Host' : 'Guest'}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{formatTime(message.createdAt)}</span>
                    {isOwnMessage && (
                      <div className="flex items-center">
                        {message.isRead ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {otherUserTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-muted">...</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Reconnecting...
          </p>
        )}
      </div>
    </Card>
  );
};

export default EnhancedChat;