import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  Wifi, 
  FileText, 
  Shield, 
  Star, 
  Camera, 
  Gift, 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ArrowRight,
  Info,
  Users,
  Calendar,
  Globe,
  Heart,
  Zap,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChecklistTask {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  completed: boolean;
  guestBenefit: string;
  action: string;
  category: 'setup' | 'enhancement';
  priority?: 'high' | 'medium' | 'low';
  stats?: string;
}

interface HostDashboardChecklistProps {
  onTaskClick?: (taskId: string) => void;
  onSectionClick?: (section: string) => void;
}

const HostDashboardChecklist: React.FC<HostDashboardChecklistProps> = ({
  onTaskClick,
  onSectionClick
}) => {
  const [setupExpanded, setSetupExpanded] = useState(true);
  const [enhancementsExpanded, setEnhancementsExpanded] = useState(true);
  const [showGuestBenefit, setShowGuestBenefit] = useState<string | null>(null);

  // Mock data - in real app this would come from props or API
  const tasks: ChecklistTask[] = [
    // Setup Tasks (Required)
    {
      id: 'wifi-setup',
      icon: Wifi,
      title: 'Wi-Fi Setup',
      description: 'Add network name & password with QR code',
      completed: false,
      guestBenefit: 'Guests can copy or scan instantly → smoother arrival experience',
      action: 'Add Wi-Fi Info',
      category: 'setup'
    },
    {
      id: 'house-rules',
      icon: FileText,
      title: 'House Rules',
      description: 'Set check-in/out times and property rules',
      completed: false,
      guestBenefit: 'Guests know what to expect → fewer questions for you',
      action: 'Set Rules',
      category: 'setup'
    },
    {
      id: 'essentials',
      icon: Shield,
      title: 'Essentials & Emergency Info',
      description: 'Add nearby stores, pharmacy, ATM, hospital',
      completed: true,
      guestBenefit: 'Guests trust your guide as their local reference',
      action: 'View Details',
      category: 'setup'
    },
    {
      id: 'recommendations',
      icon: Star,
      title: 'Host Recommendations',
      description: 'Share your favorite local spots',
      completed: false,
      guestBenefit: 'Explore page feels personal → higher guest satisfaction',
      action: 'Add Recommendations',
      category: 'setup'
    },
    {
      id: 'property-gallery',
      icon: Camera,
      title: 'Property Gallery',
      description: 'Upload 3+ property photos',
      completed: true,
      guestBenefit: 'Guests get a clear visual impression of the stay',
      action: 'View Gallery',
      category: 'setup'
    },
    {
      id: 'offers',
      icon: Gift,
      title: 'Offers & Monetization',
      description: 'Enable affiliate or add custom offers',
      completed: false,
      guestBenefit: 'Guests see value-added options → boosts your revenue',
      action: 'Setup Offers',
      category: 'setup'
    },
    // Suggested Enhancements (Optional)
    {
      id: 'more-photos',
      icon: Camera,
      title: 'Add More Photos',
      description: 'Properties with 10+ photos get 30% more engagement',
      completed: false,
      guestBenefit: 'Richer gallery = more trust and excitement before arrival',
      action: 'Upload Photos',
      category: 'enhancement',
      priority: 'high',
      stats: '+30% engagement'
    },
    {
      id: 'exclusive-offers',
      icon: Sparkles,
      title: 'Enable Exclusive Offers',
      description: 'Earn extra revenue with eSIMs, tours, transfers',
      completed: false,
      guestBenefit: 'Guests see instant travel solutions (connectivity, activities)',
      action: 'Activate Offers',
      category: 'enhancement',
      priority: 'high',
      stats: '+$200/month avg'
    },
    {
      id: 'welcome-note',
      icon: Heart,
      title: 'Add Personalized Welcome Note',
      description: 'Builds guest trust and connection',
      completed: false,
      guestBenefit: 'Guests feel personally welcomed → better reviews',
      action: 'Edit Profile',
      category: 'enhancement',
      priority: 'medium'
    },
    {
      id: 'highlight-recommendations',
      icon: TrendingUp,
      title: 'Highlight Top Recommendations',
      description: 'Pin your best cafés, bars, or attractions',
      completed: false,
      guestBenefit: 'Explore Page feels curated → higher usage of your picks',
      action: 'Add Highlights',
      category: 'enhancement',
      priority: 'medium'
    },
    {
      id: 'calendar-integration',
      icon: Calendar,
      title: 'Connect Calendar Integration',
      description: 'Sync bookings with Airbnb/Booking.com',
      completed: false,
      guestBenefit: 'Guests see accurate availability → fewer errors & cancellations',
      action: 'Set Up Integration',
      category: 'enhancement',
      priority: 'low'
    }
  ];

  const setupTasks = tasks.filter(task => task.category === 'setup');
  const enhancementTasks = tasks.filter(task => task.category === 'enhancement');
  
  const completedSetupTasks = setupTasks.filter(task => task.completed).length;
  const totalSetupTasks = setupTasks.length;
  const setupProgress = (completedSetupTasks / totalSetupTasks) * 100;

  const handleTaskClick = (task: ChecklistTask) => {
    if (onTaskClick) {
      onTaskClick(task.id);
    } else {
      toast.info(`Opening ${task.title} setup...`);
    }
  };

  const handleGuestBenefitToggle = (taskId: string) => {
    setShowGuestBenefit(showGuestBenefit === taskId ? null : taskId);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const TaskRow: React.FC<{ task: ChecklistTask; isEnhancement?: boolean }> = ({ task, isEnhancement = false }) => {
    const IconComponent = task.icon;
    
    return (
      <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
        isEnhancement 
          ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50 dark:border-blue-800/30' 
          : 'bg-card border-border'
      }`}>
        <div className="flex items-start space-x-3">
          {/* Icon & Status */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              task.completed 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-muted'
            }`}>
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <IconComponent className={`w-5 h-5 ${isEnhancement ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
            </div>
            {isEnhancement && (
              <Sparkles className="w-4 h-4 text-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-sm">{task.title}</h4>
                  {task.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs">
                      Done
                    </Badge>
                  )}
                  {!task.completed && !isEnhancement && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                  {task.priority && (
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                
                {task.stats && (
                  <p className="text-xs font-medium text-primary mb-2">{task.stats}</p>
                )}

                {/* Guest Benefit Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={() => handleGuestBenefitToggle(task.id)}
                >
                  <Info className="w-3 h-3 mr-1" />
                  How this helps guests {showGuestBenefit === task.id ? '↑' : '↓'}
                </Button>

                {/* Guest Benefit Explanation */}
                {showGuestBenefit === task.id && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                    <div className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">{task.guestBenefit}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button
                variant={task.completed ? "outline" : "default"}
                size="sm"
                className="ml-3 flex-shrink-0"
                onClick={() => handleTaskClick(task)}
              >
                {task.action}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Setup & Suggestions</CardTitle>
          <Badge variant="outline" className="text-xs">
            {completedSetupTasks}/{totalSetupTasks} Required Complete
          </Badge>
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Setup Progress</span>
            <span className="font-medium">{Math.round(setupProgress)}%</span>
          </div>
          <Progress value={setupProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Setup Tasks Section */}
        <Collapsible open={setupExpanded} onOpenChange={setSetupExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">Setup Tasks</span>
                <Badge variant="secondary" className="text-xs">
                  {totalSetupTasks - completedSetupTasks} remaining
                </Badge>
              </div>
              {setupExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-3">
            <p className="text-sm text-muted-foreground">
              Complete these essential tasks to give guests the best experience.
            </p>
            {setupTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Suggested Enhancements Section */}
        <Collapsible open={enhancementsExpanded} onOpenChange={setEnhancementsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold">Suggested Enhancements</span>
                <Badge variant="outline" className="text-xs text-primary">
                  Optional but Recommended
                </Badge>
              </div>
              {enhancementsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-3">
            <p className="text-sm text-muted-foreground">
              Boost guest satisfaction and your earnings with these proven enhancements.
            </p>
            {enhancementTasks.map((task) => (
              <TaskRow key={task.id} task={task} isEnhancement />
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Summary Footer */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-4 border border-green-200/50 dark:border-green-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">
                {completedSetupTasks === totalSetupTasks 
                  ? "Setup Complete! Consider the enhancements above to maximize guest satisfaction." 
                  : `${totalSetupTasks - completedSetupTasks} more steps to complete your guest experience setup.`
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Each improvement directly impacts your guest reviews and booking rates.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostDashboardChecklist;