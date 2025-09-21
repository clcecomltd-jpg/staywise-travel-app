import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  MessageCircle, Send, Search, Filter, MoreHorizontal, Phone, Mail, 
  User, Calendar, MapPin, Paperclip, Image as ImageIcon, Smile, 
  Check, CheckCheck, Circle, Clock, Star, AlertCircle, Info,
  ChevronLeft, Plus, Archive, Trash2, Flag, BookOpen, Camera,
  Mic, Video, Settings, Bell, BellOff, UserX, Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'booking' | 'system';
  attachments?: string[];
  bookingRef?: string;
}

interface Conversation {
  id: string;
  guestId: string;
  guestName: string;
  guestAvatar: string;
  property: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
  bookingStatus?: 'upcoming' | 'current' | 'past';
  priority: 'normal' | 'high' | 'urgent';
  messages: Message[];
  guestRating?: number;
  isOnline?: boolean;
  lastSeen?: string;
}

const HostMessagesScreen: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mockConversations: Conversation[] = useMemo(() => [
    {
      id: '1',
      guestId: 'g1',
      guestName: 'Sarah Johnson',
      guestAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80',
      property: 'Downtown Loft',
      lastMessage: 'Thank you for the great stay! Everything was perfect.',
      lastMessageTime: '2 hours ago',
      unreadCount: 0,
      status: 'active',
      bookingStatus: 'current',
      priority: 'normal',
      guestRating: 5,
      isOnline: true,
      messages: [
        {
          id: 'm1',
          senderId: 'host',
          senderName: 'You',
          text: 'Welcome to Downtown Loft! I hope you have a wonderful stay.',
          timestamp: '2024-02-01 14:30',
          read: true,
          type: 'text'
        },
        {
          id: 'm2',
          senderId: 'g1',
          senderName: 'Sarah Johnson',
          text: 'Thank you! The place is absolutely beautiful. Quick question - where can I find extra towels?',
          timestamp: '2024-02-01 15:15',
          read: true,
          type: 'text'
        },
        {
          id: 'm3',
          senderId: 'host',
          senderName: 'You',
          text: 'Great question! Extra towels are in the hall closet next to the bathroom. Let me know if you need anything else!',
          timestamp: '2024-02-01 15:20',
          read: true,
          type: 'text'
        },
        {
          id: 'm4',
          senderId: 'g1',
          senderName: 'Sarah Johnson',
          text: 'Perfect, found them! Thank you for the great stay! Everything was perfect.',
          timestamp: '2024-02-01 18:45',
          read: false,
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      guestId: 'g2',
      guestName: 'Mike Chen',
      guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80',
      property: 'Cozy Studio',
      lastMessage: 'Is early check-in possible?',
      lastMessageTime: '1 day ago',
      unreadCount: 2,
      status: 'active',
      bookingStatus: 'upcoming',
      priority: 'high',
      guestRating: 4,
      isOnline: false,
      lastSeen: '3 hours ago',
      messages: [
        {
          id: 'm5',
          senderId: 'g2',
          senderName: 'Mike Chen',
          text: 'Hi! I have a booking for next week. Is early check-in possible?',
          timestamp: '2024-01-31 10:00',
          read: true,
          type: 'text'
        },
        {
          id: 'm6',
          senderId: 'g2',
          senderName: 'Mike Chen',
          text: 'My flight lands at 10 AM and standard check-in is at 3 PM.',
          timestamp: '2024-01-31 10:05',
          read: false,
          type: 'text'
        }
      ]
    },
    {
      id: '3',
      guestId: 'g3',
      guestName: 'Emma Wilson',
      guestAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80',
      property: 'Beach House',
      lastMessage: 'Amazing stay! Left a 5-star review.',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
      status: 'active',
      bookingStatus: 'past',
      priority: 'normal',
      guestRating: 5,
      isOnline: false,
      lastSeen: '2 days ago',
      messages: [
        {
          id: 'm7',
          senderId: 'g3',
          senderName: 'Emma Wilson',
          text: 'Just wanted to say thank you for an amazing stay! The beach house exceeded all expectations.',
          timestamp: '2024-01-29 20:00',
          read: true,
          type: 'text'
        },
        {
          id: 'm8',
          senderId: 'host',
          senderName: 'You',
          text: 'Thank you so much Emma! It was a pleasure hosting you and your family.',
          timestamp: '2024-01-29 20:30',
          read: true,
          type: 'text'
        },
        {
          id: 'm9',
          senderId: 'g3',
          senderName: 'Emma Wilson',
          text: 'Amazing stay! Left a 5-star review. Hope to book again soon!',
          timestamp: '2024-01-30 09:00',
          read: true,
          type: 'text'
        }
      ]
    },
    {
      id: '4',
      guestId: 'g4',
      guestName: 'David Rodriguez',
      guestAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
      property: 'Downtown Loft',
      lastMessage: 'Booking confirmation received',
      lastMessageTime: '5 days ago',
      unreadCount: 1,
      status: 'active',
      bookingStatus: 'upcoming',
      priority: 'urgent',
      guestRating: 3,
      isOnline: true,
      messages: [
        {
          id: 'm10',
          senderId: 'system',
          senderName: 'System',
          text: 'New booking confirmed for Downtown Loft',
          timestamp: '2024-01-27 12:00',
          read: true,
          type: 'booking',
          bookingRef: 'BK-2024-001'
        },
        {
          id: 'm11',
          senderId: 'g4',
          senderName: 'David Rodriguez',
          text: 'Hi, I have some mobility issues. Is the property wheelchair accessible?',
          timestamp: '2024-01-27 14:30',
          read: false,
          type: 'text'
        }
      ]
    }
  ], []);

  const filteredConversations = useMemo(() => {
    return mockConversations.filter(conv => {
      const matchesSearch = conv.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'unread' && conv.unreadCount > 0) ||
                           (filterStatus === 'archived' && conv.status === 'archived') ||
                           (filterStatus === 'priority' && conv.priority !== 'normal');
      
      return matchesSearch && matchesFilter;
    });
  }, [mockConversations, searchTerm, filterStatus]);

  const currentConversation = useMemo(() => {
    return mockConversations.find(conv => conv.id === selectedConversation);
  }, [mockConversations, selectedConversation]);

  const totalUnread = useMemo(() => {
    return mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  }, [mockConversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'host',
      senderName: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text'
    };

    // In a real app, this would be handled by state management
    toast.success('Message sent!');
    setNewMessage('');
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
    if (priority === 'high') return <Badge variant="default" className="text-xs">High</Badge>;
    return null;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Calendar className="w-3 h-3 text-blue-500" />;
      case 'current': return <Circle className="w-3 h-3 text-green-500 fill-current" />;
      case 'past': return <Check className="w-3 h-3 text-gray-500" />;
      default: return null;
    }
  };

  const quickReplies = [
    "Thanks for your message!",
    "I'll get back to you shortly.",
    "Let me check and get back to you.",
    "Welcome! Hope you enjoy your stay.",
    "Check-in instructions sent!",
    "Thank you for being a great guest!"
  ];

  // Mobile view - show conversation list or chat
  if (isMobileView) {
    if (selectedConversation && currentConversation) {
      return (
        <div className="flex flex-col h-full">
          {/* Mobile Chat Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentConversation.guestAvatar} alt={currentConversation.guestName} />
                <AvatarFallback>{currentConversation.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{currentConversation.guestName}</h3>
                <p className="text-xs text-muted-foreground">
                  {currentConversation.isOnline ? 'Online' : `Last seen ${currentConversation.lastSeen}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowConversationInfo(true)}>
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'host' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.senderId === 'host'
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'system'
                        ? 'bg-muted text-muted-foreground text-center text-sm'
                        : 'bg-muted'
                  }`}>
                    {message.type === 'booking' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Booking Update</span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === 'host' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                      {message.senderId === 'host' && (
                        <span className="ml-1">
                          {message.read ? <CheckCheck className="w-3 h-3 inline" /> : <Check className="w-3 h-3 inline" />}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t">
            <ScrollArea orientation="horizontal">
              <div className="flex space-x-2 pb-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap text-xs"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[40px] max-h-[120px] resize-none pr-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Mobile conversation list
    return (
      <div className="space-y-4">
        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Conversations */}
        <div className="space-y-2">
          {filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.guestAvatar} alt={conversation.guestName} />
                      <AvatarFallback>{conversation.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium truncate">{conversation.guestName}</h3>
                        {getStatusIcon(conversation.bookingStatus)}
                        {conversation.guestRating && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            <span className="text-xs text-muted-foreground ml-1">{conversation.guestRating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {getPriorityBadge(conversation.priority)}
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {conversation.property}
                      </span>
                      <span>{conversation.lastMessageTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No conversations found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Messages from guests will appear here"}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="md:col-span-1 space-y-4">
        {/* Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Messages
              </CardTitle>
              {totalUnread > 0 && (
                <Badge variant="destructive">{totalUnread}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conversations</SelectItem>
                <SelectItem value="unread">Unread ({mockConversations.filter(c => c.unreadCount > 0).length})</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Conversations */}
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className={`cursor-pointer transition-all ${
                  selectedConversation === conversation.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.guestAvatar} alt={conversation.guestName} />
                        <AvatarFallback>{conversation.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium truncate ${
                          conversation.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {conversation.guestName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      
                      <p className={`text-xs truncate mb-1 ${
                        conversation.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(conversation.bookingStatus)}
                          {getPriorityBadge(conversation.priority)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="md:col-span-2 lg:col-span-3">
        {currentConversation ? (
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentConversation.guestAvatar} alt={currentConversation.guestName} />
                    <AvatarFallback>{currentConversation.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{currentConversation.guestName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{currentConversation.property}</span>
                      <span>•</span>
                      <span>{currentConversation.isOnline ? 'Online' : `Last seen ${currentConversation.lastSeen}`}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowConversationInfo(true)}>
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'host' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.senderId === 'host'
                        ? 'bg-primary text-primary-foreground'
                        : message.type === 'system'
                          ? 'bg-muted text-muted-foreground text-center'
                          : 'bg-muted'
                    }`}>
                      {message.type === 'booking' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">Booking Update</span>
                        </div>
                      )}
                      <p>{message.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.senderId === 'host' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                        {message.senderId === 'host' && (
                          <span className="ml-2">
                            {message.read ? 
                              <CheckCheck className="w-3 h-3 text-primary-foreground/70" /> : 
                              <Check className="w-3 h-3 text-primary-foreground/70" />
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t">
              <ScrollArea orientation="horizontal">
                <div className="flex space-x-2 pb-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px] max-h-[160px] resize-none pr-12"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="absolute right-2 bottom-2"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </Card>
        )}
      </div>

      {/* Conversation Info Sheet */}
      <Sheet open={showConversationInfo} onOpenChange={setShowConversationInfo}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Conversation Details</SheetTitle>
          </SheetHeader>
          
          {currentConversation && (
            <div className="space-y-6 mt-6">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={currentConversation.guestAvatar} alt={currentConversation.guestName} />
                  <AvatarFallback className="text-lg">{currentConversation.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{currentConversation.guestName}</h3>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {currentConversation.guestRating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-current text-yellow-500 mr-1" />
                      <span>{currentConversation.guestRating}/5</span>
                    </div>
                  )}
                  <Badge variant={currentConversation.isOnline ? 'default' : 'secondary'}>
                    {currentConversation.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Property</h4>
                  <p className="text-muted-foreground">{currentConversation.property}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Booking Status</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(currentConversation.bookingStatus)}
                    <span className="capitalize">{currentConversation.bookingStatus}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Priority</h4>
                  {getPriorityBadge(currentConversation.priority) || <span className="text-muted-foreground">Normal</span>}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Guest
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Booking
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Conversation
                </Button>
                <Button className="w-full" variant="outline" onClick={() => {
                  currentConversation.status === 'active' ? 
                    toast.success('Notifications muted') : 
                    toast.success('Notifications enabled');
                }}>
                  {currentConversation.status === 'active' ? <BellOff className="w-4 h-4 mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
                  {currentConversation.status === 'active' ? 'Mute' : 'Unmute'} Notifications
                </Button>
                <Button className="w-full" variant="destructive">
                  <UserX className="w-4 h-4 mr-2" />
                  Block Guest
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HostMessagesScreen;