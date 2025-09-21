import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, User, MapPin, DollarSign, CheckCircle, XCircle, 
  AlertCircle, Filter, Search, MoreHorizontal, Phone, Mail, MessageCircle,
  Download, RefreshCw, Eye, Edit, Trash2, Plus, CalendarCheck, CalendarX,
  CreditCard, Receipt, FileText, Banknote, TrendingUp, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface Booking {
  id: string;
  guestName: string;
  guestAvatar: string;
  guestEmail: string;
  guestPhone: string;
  property: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingDate: string;
  source: 'direct' | 'airbnb' | 'booking.com' | 'vrbo';
  specialRequests?: string;
  cleaningFee: number;
  serviceFee: number;
  commission: number;
}

const HostBookingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  const mockBookings: Booking[] = useMemo(() => [
    {
      id: '1',
      guestName: 'Sarah Johnson',
      guestAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80',
      guestEmail: 'sarah@example.com',
      guestPhone: '+1 (555) 123-4567',
      property: 'Downtown Loft',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300',
      checkIn: '2024-02-15',
      checkOut: '2024-02-20',
      nights: 5,
      guests: 2,
      totalAmount: 750,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-01-28',
      source: 'direct',
      specialRequests: 'Late check-in requested',
      cleaningFee: 50,
      serviceFee: 30,
      commission: 0
    },
    {
      id: '2',
      guestName: 'Mike Chen',
      guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80',
      guestEmail: 'mike@example.com',
      guestPhone: '+1 (555) 987-6543',
      property: 'Cozy Studio',
      propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300',
      checkIn: '2024-02-10',
      checkOut: '2024-02-12',
      nights: 2,
      guests: 1,
      totalAmount: 220,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: '2024-02-08',
      source: 'airbnb',
      cleaningFee: 25,
      serviceFee: 15,
      commission: 33
    },
    {
      id: '3',
      guestName: 'Emma Wilson',
      guestAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80',
      guestEmail: 'emma@example.com',
      guestPhone: '+1 (555) 456-7890',
      property: 'Beach House',
      propertyImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      checkIn: '2024-01-20',
      checkOut: '2024-01-27',
      nights: 7,
      guests: 4,
      totalAmount: 1400,
      status: 'checked-out',
      paymentStatus: 'paid',
      bookingDate: '2024-01-15',
      source: 'booking.com',
      cleaningFee: 75,
      serviceFee: 45,
      commission: 210
    },
    {
      id: '4',
      guestName: 'David Rodriguez',
      guestAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
      guestEmail: 'david@example.com',
      guestPhone: '+1 (555) 321-0987',
      property: 'Downtown Loft',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300',
      checkIn: '2024-02-25',
      checkOut: '2024-02-28',
      nights: 3,
      guests: 2,
      totalAmount: 450,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-02-01',
      source: 'vrbo',
      specialRequests: 'Ground floor preferred due to mobility issues',
      cleaningFee: 50,
      serviceFee: 25,
      commission: 67.5
    }
  ], []);

  const filteredBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'upcoming' && ['pending', 'confirmed'].includes(booking.status)) ||
                        (activeTab === 'current' && booking.status === 'checked-in') ||
                        (activeTab === 'past' && ['checked-out', 'cancelled'].includes(booking.status));
      
      return matchesSearch && matchesStatus && matchesTab;
    });
  }, [mockBookings, searchTerm, filterStatus, activeTab]);

  const bookingStats = useMemo(() => {
    const total = mockBookings.length;
    const pending = mockBookings.filter(b => b.status === 'pending').length;
    const confirmed = mockBookings.filter(b => b.status === 'confirmed').length;
    const current = mockBookings.filter(b => b.status === 'checked-in').length;
    const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    
    return { total, pending, confirmed, current, totalRevenue };
  }, [mockBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'checked-in': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'checked-out': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'direct': return '🏠';
      case 'airbnb': return '🏠';
      case 'booking.com': return '🏨';
      case 'vrbo': return '🏡';
      default: return '📱';
    }
  };

  const handleBookingAction = async (action: string, bookingId: string) => {
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) return;

    switch (action) {
      case 'accept':
        toast.success(`Booking ${bookingId} accepted`);
        break;
      case 'decline':
        toast.error(`Booking ${bookingId} declined`);
        break;
      case 'message':
        toast.info(`Opening message thread with ${booking.guestName}`);
        break;
      case 'call':
        toast.info(`Calling ${booking.guestName}`);
        break;
      case 'email':
        toast.info(`Opening email to ${booking.guestName}`);
        break;
      case 'check-in':
        toast.success(`${booking.guestName} checked in successfully`);
        break;
      case 'check-out':
        toast.success(`${booking.guestName} checked out successfully`);
        break;
      default:
        toast.info(`Action ${action} completed`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookingStats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{bookingStats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">${bookingStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({bookingStats.total})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({bookingStats.pending + bookingStats.confirmed})</TabsTrigger>
          <TabsTrigger value="current">Current ({bookingStats.current})</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.guestAvatar} alt={booking.guestName} />
                          <AvatarFallback>{booking.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{booking.guestName}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.replace('-', ' ')}
                            </Badge>
                            <span className="text-sm">{getSourceIcon(booking.source)}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {booking.property}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {booking.checkIn} - {booking.checkOut}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {booking.guests} guest{booking.guests > 1 ? 's' : ''} • {booking.nights} night{booking.nights > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />
                              ${booking.totalAmount}
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              {booking.paymentStatus}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Booked {booking.bookingDate}
                            </div>
                          </div>

                          {booking.specialRequests && (
                            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm font-medium mb-1">Special Requests:</p>
                              <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleBookingAction('accept', booking.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleBookingAction('decline', booking.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <Button 
                            size="sm"
                            onClick={() => handleBookingAction('check-in', booking.id)}
                          >
                            <CalendarCheck className="w-4 h-4 mr-1" />
                            Check In
                          </Button>
                        )}

                        {booking.status === 'checked-in' && (
                          <Button 
                            size="sm"
                            onClick={() => handleBookingAction('check-out', booking.id)}
                          >
                            <CalendarX className="w-4 h-4 mr-1" />
                            Check Out
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedBooking(booking);
                              setShowBookingDetails(true);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBookingAction('message', booking.id)}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message Guest
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBookingAction('call', booking.id)}>
                              <Phone className="w-4 h-4 mr-2" />
                              Call Guest
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBookingAction('email', booking.id)}>
                              <Mail className="w-4 h-4 mr-2" />
                              Email Guest
                            </DropdownMenuItem>
                            <Separator />
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Generate Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Export Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Bookings will appear here once guests start booking your properties"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Modal */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6 py-4">
              {/* Guest Info */}
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedBooking.guestAvatar} alt={selectedBooking.guestName} />
                  <AvatarFallback>{selectedBooking.guestName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedBooking.guestName}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{selectedBooking.guestEmail}</p>
                    <p>{selectedBooking.guestPhone}</p>
                  </div>
                  <Badge className={`${getStatusColor(selectedBooking.status)} mt-2`}>
                    {selectedBooking.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Stay Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property:</span>
                      <span>{selectedBooking.property}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span>{selectedBooking.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span>{selectedBooking.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nights:</span>
                      <span>{selectedBooking.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests:</span>
                      <span>{selectedBooking.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="flex items-center">
                        {getSourceIcon(selectedBooking.source)} {selectedBooking.source}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>${(selectedBooking.totalAmount - selectedBooking.cleaningFee - selectedBooking.serviceFee).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cleaning Fee:</span>
                      <span>${selectedBooking.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee:</span>
                      <span>${selectedBooking.serviceFee}</span>
                    </div>
                    {selectedBooking.commission > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Platform Commission:</span>
                        <span>-${selectedBooking.commission}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${selectedBooking.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status:</span>
                      <Badge variant={selectedBooking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Special Requests</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={() => handleBookingAction('message', selectedBooking.id)}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Guest
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleBookingAction('call', selectedBooking.id)}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleBookingAction('email', selectedBooking.id)}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostBookingsScreen;