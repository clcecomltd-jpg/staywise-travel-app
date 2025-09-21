import React, { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, 
  CreditCard, Banknote, PieChart, BarChart3, Eye, EyeOff, RefreshCw,
  ArrowUpRight, ArrowDownRight, Plus, Minus, Info, AlertCircle,
  Building, Home, MapPin, Users, Star, Clock, Target, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  pendingPayouts: number;
  nextPayout: string;
  payoutMethod: string;
  averageNightlyRate: number;
  occupancyRate: number;
  totalBookings: number;
  growth: {
    monthly: number;
    yearly: number;
  };
}

interface PropertyEarnings {
  id: string;
  name: string;
  image: string;
  location: string;
  totalEarnings: number;
  monthlyEarnings: number;
  bookings: number;
  averageRate: number;
  occupancyRate: number;
  growth: number;
  status: 'active' | 'inactive';
}

interface Transaction {
  id: string;
  type: 'earning' | 'fee' | 'tax' | 'refund' | 'payout';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  property?: string;
  bookingId?: string;
  payoutId?: string;
}

interface Payout {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  processingTime: string;
  fees: number;
  netAmount: number;
}

const HostEarningsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [showEarnings, setShowEarnings] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const mockEarningsData: EarningsData = useMemo(() => ({
    totalEarnings: 45670,
    monthlyEarnings: 8920,
    yearlyEarnings: 42340,
    pendingPayouts: 2150,
    nextPayout: '2024-02-15',
    payoutMethod: 'Bank Transfer',
    averageNightlyRate: 125,
    occupancyRate: 87,
    totalBookings: 156,
    growth: {
      monthly: 12.5,
      yearly: 8.3
    }
  }), []);

  const mockPropertyEarnings: PropertyEarnings[] = useMemo(() => [
    {
      id: '1',
      name: 'Downtown Loft',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300',
      location: 'City Center',
      totalEarnings: 22500,
      monthlyEarnings: 4200,
      bookings: 78,
      averageRate: 140,
      occupancyRate: 92,
      growth: 15.2,
      status: 'active'
    },
    {
      id: '2',
      name: 'Beach House',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      location: 'Coastal Area',
      totalEarnings: 14770,
      monthlyEarnings: 2800,
      bookings: 45,
      averageRate: 180,
      occupancyRate: 85,
      growth: 8.7,
      status: 'active'
    },
    {
      id: '3',
      name: 'Cozy Studio',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300',
      location: 'Arts District',
      totalEarnings: 8400,
      monthlyEarnings: 1920,
      bookings: 33,
      averageRate: 85,
      occupancyRate: 78,
      growth: -2.1,
      status: 'active'
    }
  ], []);

  const mockTransactions: Transaction[] = useMemo(() => [
    {
      id: 't1',
      type: 'earning',
      description: 'Booking payment - Downtown Loft',
      amount: 750,
      date: '2024-02-01',
      status: 'completed',
      property: 'Downtown Loft',
      bookingId: 'BK-2024-001'
    },
    {
      id: 't2',
      type: 'fee',
      description: 'Platform service fee',
      amount: -112.50,
      date: '2024-02-01',
      status: 'completed',
      property: 'Downtown Loft',
      bookingId: 'BK-2024-001'
    },
    {
      id: 't3',
      type: 'payout',
      description: 'Bank transfer payout',
      amount: -2150,
      date: '2024-01-31',
      status: 'completed',
      payoutId: 'PO-2024-015'
    },
    {
      id: 't4',
      type: 'earning',
      description: 'Booking payment - Beach House',
      amount: 1200,
      date: '2024-01-30',
      status: 'pending',
      property: 'Beach House',
      bookingId: 'BK-2024-002'
    },
    {
      id: 't5',
      type: 'refund',
      description: 'Guest refund - Cozy Studio',
      amount: -340,
      date: '2024-01-29',
      status: 'completed',
      property: 'Cozy Studio',
      bookingId: 'BK-2024-003'
    }
  ], []);

  const mockPayouts: Payout[] = useMemo(() => [
    {
      id: 'PO-2024-016',
      amount: 2150,
      date: '2024-02-01',
      status: 'pending',
      method: 'Bank Transfer',
      processingTime: '1-3 business days',
      fees: 0,
      netAmount: 2150
    },
    {
      id: 'PO-2024-015',
      amount: 1875,
      date: '2024-01-15',
      status: 'completed',
      method: 'Bank Transfer',
      processingTime: '1-3 business days',
      fees: 0,
      netAmount: 1875
    },
    {
      id: 'PO-2024-014',
      amount: 2340,
      date: '2024-01-01',
      status: 'completed',
      method: 'PayPal',
      processingTime: 'Instant',
      fees: 23.40,
      netAmount: 2316.60
    }
  ], []);

  const chartData = useMemo(() => ({
    earnings: [
      { month: 'Aug', earnings: 7200, bookings: 15 },
      { month: 'Sep', earnings: 8100, bookings: 18 },
      { month: 'Oct', earnings: 7800, bookings: 16 },
      { month: 'Nov', earnings: 8900, bookings: 22 },
      { month: 'Dec', earnings: 8200, bookings: 19 },
      { month: 'Jan', earnings: 8920, bookings: 21 },
      { month: 'Feb', earnings: 9500, bookings: 24 }
    ],
    propertyBreakdown: [
      { name: 'Downtown Loft', value: 22500, percentage: 49.3 },
      { name: 'Beach House', value: 14770, percentage: 32.4 },
      { name: 'Cozy Studio', value: 8400, percentage: 18.3 }
    ],
    monthlyComparison: [
      { category: 'Gross Earnings', thisMonth: 8920, lastMonth: 8200 },
      { category: 'Platform Fees', thisMonth: -1338, lastMonth: -1230 },
      { category: 'Cleaning Fees', thisMonth: 450, lastMonth: 380 },
      { category: 'Net Earnings', thisMonth: 8032, lastMonth: 7350 }
    ]
  }), []);

  const CHART_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    return `${amount < 0 ? '-' : ''}$${absAmount.toLocaleString()}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'payout': return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      case 'fee': return <Minus className="w-4 h-4 text-red-600" />;
      case 'refund': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'tax': return <Minus className="w-4 h-4 text-orange-600" />;
      default: return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePayout = () => {
    toast.success('Payout initiated! You\'ll receive your money in 1-3 business days.');
  };

  const handleExport = (type: string) => {
    toast.success(`${type} report exported successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {showEarnings ? (
              <>
                <DollarSign className="w-6 h-6 mr-2" />
                {formatCurrency(mockEarningsData.totalEarnings)}
              </>
            ) : (
              <>
                <EyeOff className="w-6 h-6 mr-2" />
                Earnings Hidden
              </>
            )}
          </h1>
          <p className="text-muted-foreground">Total lifetime earnings</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-earnings" className="text-sm">Show earnings</Label>
            <Switch
              id="show-earnings"
              checked={showEarnings}
              onCheckedChange={setShowEarnings}
            />
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('earnings')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {showEarnings ? formatCurrency(mockEarningsData.monthlyEarnings) : '••••••'}
                </p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{mockEarningsData.growth.monthly}%</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-2xl font-bold">
                  {showEarnings ? formatCurrency(mockEarningsData.pendingPayouts) : '••••••'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Next: {mockEarningsData.nextPayout}
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Nightly Rate</p>
                <p className="text-2xl font-bold">
                  {showEarnings ? formatCurrency(mockEarningsData.averageNightlyRate) : '••••••'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockEarningsData.totalBookings} bookings
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold">{mockEarningsData.occupancyRate}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${mockEarningsData.occupancyRate}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Ready for Payout
              </h3>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                {showEarnings ? formatCurrency(mockEarningsData.pendingPayouts) : '••••••'}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Available to {mockEarningsData.payoutMethod} • Processing in 1-3 business days
              </p>
            </div>
            <Button 
              onClick={handlePayout}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Earnings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.earnings}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'earnings' ? formatCurrency(value as number) : value,
                          name === 'earnings' ? 'Earnings' : 'Bookings'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Property Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Property Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData.propertyBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {chartData.propertyBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {chartData.propertyBreakdown.map((property, index) => (
                    <div key={property.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: CHART_COLORS[index] }}
                        />
                        <span>{property.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{showEarnings ? formatCurrency(property.value) : '••••••'}</span>
                        <span className="text-muted-foreground ml-2">({property.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.monthlyComparison.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Last Month</div>
                        <div className="font-medium">
                          {showEarnings ? formatCurrency(item.lastMonth) : '••••••'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">This Month</div>
                        <div className="font-medium">
                          {showEarnings ? formatCurrency(item.thisMonth) : '••••••'}
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        {item.thisMonth > item.lastMonth ? (
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              +{(((item.thisMonth - item.lastMonth) / Math.abs(item.lastMonth)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {(((item.thisMonth - item.lastMonth) / Math.abs(item.lastMonth)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Property Performance</h3>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {mockPropertyEarnings.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockPropertyEarnings
              .filter(property => selectedProperty === 'all' || property.id === selectedProperty)
              .map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={property.image} 
                          alt={property.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold">{property.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {property.location}
                          </p>
                          <Badge 
                            variant={property.status === 'active' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        {property.growth > 0 ? (
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">+{property.growth}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            <span className="text-sm">{property.growth}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Earnings</span>
                        <span className="font-semibold">
                          {showEarnings ? formatCurrency(property.totalEarnings) : '••••••'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">This Month</span>
                        <span className="font-semibold">
                          {showEarnings ? formatCurrency(property.monthlyEarnings) : '••••••'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bookings</span>
                        <span className="font-semibold">{property.bookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Rate</span>
                        <span className="font-semibold">
                          {showEarnings ? formatCurrency(property.averageRate) : '••••••'}/night
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Occupancy</span>
                          <span className="font-semibold">{property.occupancyRate}%</span>
                        </div>
                        <Progress value={property.occupancyRate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="earning">Earnings</SelectItem>
                  <SelectItem value="payout">Payouts</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleExport('transactions')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockTransactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted/30 rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            {transaction.property && (
                              <>
                                <span>•</span>
                                <span>{transaction.property}</span>
                              </>
                            )}
                            {transaction.bookingId && (
                              <>
                                <span>•</span>
                                <span>{transaction.bookingId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {showEarnings ? formatCurrency(transaction.amount) : '••••••'}
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    {index < mockTransactions.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Payout History</h3>
            <Button onClick={handlePayout}>
              <Plus className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </div>

          <div className="space-y-4">
            {mockPayouts.map((payout) => (
              <Card key={payout.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{payout.method}</h4>
                        <p className="text-sm text-muted-foreground">
                          Payout ID: {payout.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payout.date} • {payout.processingTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {showEarnings ? formatCurrency(payout.amount) : '••••••'}
                      </div>
                      {payout.fees > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Fee: {showEarnings ? formatCurrency(-payout.fees) : '••••••'}
                        </p>
                      )}
                      <p className="text-sm font-medium">
                        Net: {showEarnings ? formatCurrency(payout.netAmount) : '••••••'}
                      </p>
                      {getStatusBadge(payout.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HostEarningsScreen;