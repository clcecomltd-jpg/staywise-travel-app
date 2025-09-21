import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Home as HomeIcon, Wifi, Brush, Shirt, Car, Clock, Wrench, Globe, Smartphone, Shield, Home } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  text: string;
  sender: 'guest' | 'host' | 'system';
  timestamp: Date;
  serviceCard?: ServiceCard;
}

interface ServiceCard {
  id: string;
  type: 'taxi' | 'esim' | 'cleaning' | 'maintenance';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  ctaText: string;
  ctaAction: () => void;
}

interface ChatScreenProps {
  onBack: () => void;
  onBackToOnboarding?: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, onBackToOnboarding }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to Sunset Villa! I'm Maria, your host. Feel free to ask me anything about your stay. 😊",
      sender: 'host',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: '2', 
      text: "Hi Maria! Thank you for the warm welcome. The place looks amazing!",
      sender: 'guest',
      timestamp: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
    },
    {
      id: '3',
      text: "So glad you like it! Let me know if you need any assistance during your stay. I'm here to help! 🏡",
      sender: 'host',
      timestamp: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hostInfo = {
    name: "Maria Santos",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    isOnline: true
  };

  const quickRequests = [
    {
      id: 'checkin',
      icon: HomeIcon,
      text: 'Check-in Instructions',
      message: "Hi Maria! Could you please share the check-in instructions?",
      deepLink: 'checkin'
    },
    {
      id: 'wifi',
      icon: Wifi,
      text: 'Wi-Fi Details',
      message: "Hi! Could I get the Wi-Fi network name and password please?",
      deepLink: 'wifi'
    },
    {
      id: 'cleaning',
      icon: Brush,
      text: 'Request Cleaning',
      message: "Hi Maria! Could we arrange room cleaning service please?",
      serviceCard: 'cleaning'
    },
    {
      id: 'towels',
      icon: Shirt,
      text: 'Fresh Towels',
      message: "Hi! Could we get some fresh towels please?",
      serviceCard: 'cleaning'
    },
    {
      id: 'taxi',
      icon: Car,
      text: 'Book Taxi',
      message: "Hi Maria! Could you help me book a taxi please?",
      serviceCard: 'taxi'
    },
    {
      id: 'checkout',
      icon: Clock,
      text: 'Late Check-out',
      message: "Hi! Is it possible to arrange a late check-out?",
      serviceCard: null
    },
    {
      id: 'maintenance',
      icon: Wrench,
      text: 'Maintenance Help',
      message: "Hi Maria! I need some help with maintenance in the room.",
      serviceCard: 'maintenance'
    }
  ];

  const serviceCards = {
    taxi: {
      id: 'taxi-service',
      type: 'taxi' as const,
      title: 'Book Taxi or Grab',
      subtitle: 'Instant rides nearby • Estimated arrival: 3-5 mins',
      icon: Car,
      ctaText: 'Book Ride',
      ctaAction: () => {
        toast.success('Opening Grab app...');
        // This would open Grab deep link
      }
    },
    esim: {
      id: 'esim-service',
      type: 'esim' as const,
      title: 'Need More Data?',
      subtitle: 'Travel eSIM deals • No roaming fees • Instant activation',
      icon: Globe,
      ctaText: 'View eSIM Offers',
      ctaAction: () => {
        toast.info('Opening eSIM offers...');
        // This would navigate to eSIM offers
      }
    },
    cleaning: {
      id: 'cleaning-service',
      type: 'cleaning' as const,
      title: 'Room Cleaning Service',
      subtitle: 'Professional cleaning • Available today • ฿500',
      icon: Brush,
      ctaText: 'Request Cleaning',
      ctaAction: () => {
        toast.success('Cleaning request sent!');
      }
    },
    maintenance: {
      id: 'maintenance-service',
      type: 'maintenance' as const,
      title: 'Maintenance Support',
      subtitle: '24/7 assistance • Quick response • Professional service',
      icon: Wrench,
      ctaText: 'Request Help',
      ctaAction: () => {
        toast.success('Maintenance request sent!');
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleQuickRequest = (request: typeof quickRequests[0]) => {
    if (request.deepLink) {
      // Handle deep links to other pages
      if (request.deepLink === 'checkin' || request.deepLink === 'wifi') {
        toast.info(`Opening ${request.text} page...`);
        return;
      }
    }
    
    setInputMessage(request.message);
    inputRef.current?.focus();
  };

  const simulateHostResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      let hostResponse = "I'll help you with that right away! 😊";
      let serviceCard: ServiceCard | undefined;

      // Determine response based on user message
      if (userMessage.toLowerCase().includes('taxi') || userMessage.toLowerCase().includes('grab')) {
        hostResponse = "I can help you book a ride! Here's the quickest option for you:";
        serviceCard = serviceCards.taxi;
      } else if (userMessage.toLowerCase().includes('cleaning') || userMessage.toLowerCase().includes('towels')) {
        hostResponse = "I can arrange that for you! Here are the cleaning service options:";
        serviceCard = serviceCards.cleaning;
      } else if (userMessage.toLowerCase().includes('wifi') || userMessage.toLowerCase().includes('internet')) {
        hostResponse = "Here's the Wi-Fi info, and I've also included some data options if you need more:";
        serviceCard = serviceCards.esim;
      } else if (userMessage.toLowerCase().includes('maintenance') || userMessage.toLowerCase().includes('fix') || userMessage.toLowerCase().includes('broken')) {
        hostResponse = "I'm sorry to hear you're having an issue! Let me connect you with our maintenance team:";
        serviceCard = serviceCards.maintenance;
      } else if (userMessage.toLowerCase().includes('check-out')) {
        hostResponse = "Late check-out is usually possible! Standard rate is ฿200/hour after 11 AM. Would you like me to arrange it?";
      } else if (userMessage.toLowerCase().includes('check-in')) {
        hostResponse = "Here are your check-in details: Use code 1234 on the smart lock. Your room is on the 2nd floor. Welcome! 🏡";
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: hostResponse,
        sender: 'host',
        timestamp: new Date(),
        serviceCard
      };

      setMessages(prev => [...prev, newMessage]);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'guest',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate host response
    simulateHostResponse(inputMessage);
    
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderMessage = (message: Message) => {
    const isGuest = message.sender === 'guest';
    const isSystem = message.sender === 'system';

    return (
      <div key={message.id} className="animate-fade-in">
        <div className={`flex ${isGuest ? 'justify-end' : 'justify-start'} mb-4`}>
          {!isGuest && !isSystem && (
            <div className="flex-shrink-0 mr-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={hostInfo.avatar} alt={hostInfo.name} />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
            </div>
          )}
          
          <div className={`max-w-[80%] ${isGuest ? 'mr-3' : 'ml-0'}`}>
            <div
              className={`px-4 py-3 rounded-2xl ${
                isGuest
                  ? 'bg-primary text-primary-foreground ml-auto rounded-br-md'
                  : isSystem
                  ? 'bg-muted text-muted-foreground text-center'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
            
            <p className={`text-xs text-muted-foreground mt-1 px-1 ${
              isGuest ? 'text-right' : 'text-left'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>

        {/* Service Card */}
        {message.serviceCard && (
          <div className="mb-4 ml-11">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <message.serviceCard.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1">{message.serviceCard.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{message.serviceCard.subtitle}</p>
                    
                    <Button
                      onClick={message.serviceCard.ctaAction}
                      className="w-full h-10"
                      aria-label={`${message.serviceCard.ctaText} - ${message.serviceCard.title}`}
                    >
                      {message.serviceCard.ctaText}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-full"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={hostInfo.avatar} alt={hostInfo.name} />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              {hostInfo.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground">{hostInfo.name}</h1>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="py-4">
            {messages.map(renderMessage)}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex-shrink-0 mr-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={hostInfo.avatar} alt={hostInfo.name} />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                </div>
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Request Pills */}
        <div className="px-4 py-3 border-t border-border/20">
          <ScrollArea orientation="horizontal">
            <div className="flex space-x-2 pb-2">
              {quickRequests.map((request) => {
                const IconComponent = request.icon;
                return (
                  <Button
                    key={request.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickRequest(request)}
                    className="flex-shrink-0 h-8 px-3 bg-muted/30 hover:bg-muted/50 border-border/40"
                    aria-label={`Quick request: ${request.text}`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" aria-hidden="true" />
                    {request.text}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Message Input Bar */}
        <div className="px-4 py-3 border-t border-border/20 bg-background">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-muted rounded-full flex-shrink-0"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message…"
                className="pr-12 bg-muted/30 border-border/40 focus:bg-background"
                aria-label="Type your message"
              />
              
              <Button
                onClick={handleSendMessage}
                size="sm"
                disabled={!inputMessage.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 p-0 rounded-full"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;