import React, { useState, useRef } from 'react';
import { Heart, MapPin, Star, MoreHorizontal, Share, Bookmark, Navigation, Edit3, Filter, ArrowUpDown, List, Map, Trash2, HeartOff, Coffee, Utensils, Wine, Calendar, MapIcon, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

const FavoritesScreen: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    restaurants: true,
    cafes: true,
    bars: true,
    attractions: true,
    events: true
  });
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'recent'>('recent');
  const [selectedBottomSheetVenue, setSelectedBottomSheetVenue] = useState<typeof favorites[0] | null>(null);

  // Sample favorites data with Google Places API structure
  const favorites = [
    {
      id: 'place_1',
      title: 'Café Vanille',
      category: 'Café',
      type: 'cafes',
      emoji: '☕',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewCount: 245,
      distance: '300m',
      address: '123 Main Street, Downtown',
      openingHours: 'Open until 9 PM',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      savedDate: '2024-01-15',
      // Google Places API fields (for future integration)
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      vicinity: 'Downtown District',
      priceLevel: 2,
      types: ['cafe', 'food', 'establishment']
    },
    {
      id: 'place_2',
      title: 'Bor Pen Nyang',
      category: 'Bar',
      type: 'bars',
      emoji: '🍸',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewCount: 378,
      distance: '800m',
      address: '456 Sunset Boulevard',
      openingHours: 'Open until 2 AM',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      savedDate: '2024-01-12',
      placeId: 'ChIJKxjxuaNYwokRVf__s8CPn-o',
      vicinity: 'Nightlife District',
      priceLevel: 3,
      types: ['bar', 'night_club', 'establishment']
    },
    {
      id: 'place_3',
      title: 'Night Market',
      category: 'Attraction',
      type: 'attractions',
      emoji: '🗺️',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewCount: 1205,
      distance: '1.2 km',
      address: '789 Market Street',
      openingHours: 'Open 6 PM - 12 AM',
      coordinates: { lat: 40.7614, lng: -73.9776 },
      savedDate: '2024-01-10',
      placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
      vicinity: 'Market District',
      priceLevel: 1,
      types: ['tourist_attraction', 'establishment']
    },
    {
      id: 'place_4',
      title: 'Naked Espresso',
      category: 'Restaurant',
      type: 'restaurants',
      emoji: '🍴',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewCount: 189,
      distance: '500m',
      address: '321 Coffee Lane',
      openingHours: 'Open until 10 PM',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      savedDate: '2024-01-08',
      placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
      vicinity: 'Coffee District',
      priceLevel: 2,
      types: ['restaurant', 'food', 'establishment']
    },
    {
      id: 'place_5',
      title: 'Jazz Night',
      category: 'Event',
      type: 'events',
      emoji: '🎉',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewCount: 89,
      distance: '900m',
      address: 'Blue Note Club, 131 W 3rd St',
      openingHours: 'Event: 8 PM - 11 PM',
      coordinates: { lat: 40.7505, lng: -74.0010 },
      savedDate: '2024-01-05',
      placeId: 'ChIJmQJIxlVYwokRLgvuCNP3Xa4',
      vicinity: 'Entertainment District',
      priceLevel: 3,
      types: ['establishment', 'point_of_interest']
    },
    {
      id: 'place_6',
      title: 'Spirit House',
      category: 'Bar',
      type: 'bars',
      emoji: '🍸',
      image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewCount: 267,
      distance: '1.0km',
      address: '654 High Street',
      openingHours: 'Open until 1 AM',
      coordinates: { lat: 40.7282, lng: -73.9942 },
      savedDate: '2024-01-03',
      placeId: 'ChIJrTLr-GyuEmsRBfy61i59si0',
      vicinity: 'Historic District',
      priceLevel: 3,
      types: ['bar', 'establishment']
    }
  ];

  const categories = [
    { id: 'restaurants', label: 'Restaurants', icon: Utensils, emoji: '🍴' },
    { id: 'cafes', label: 'Cafés', icon: Coffee, emoji: '☕' },
    { id: 'bars', label: 'Bars', icon: Wine, emoji: '🍸' },
    { id: 'attractions', label: 'Attractions', icon: MapIcon, emoji: '🗺️' },
    { id: 'events', label: 'Events', icon: Calendar, emoji: '🎉' }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Recently Added', icon: Star },
    { id: 'distance', label: 'Distance', icon: MapPin },
    { id: 'rating', label: 'Rating', icon: Star }
  ];

  const getFilteredAndSortedFavorites = () => {
    let filtered = favorites.filter(item => selectedFilters[item.type as keyof typeof selectedFilters]);
    
    // Sort favorites
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const handleRemoveFavorite = (venueId: string) => {
    toast.success('Removed from favorites');
    console.log('Remove favorite:', venueId);
  };

  const handleViewOnMap = (venue: typeof favorites[0]) => {
    if (activeView === 'list') {
      setActiveView('map');
      toast.info(`Showing ${venue.title} on map`);
    } else {
      // Open external maps app
      toast.info('Opening in Maps app...');
    }
  };

  const handleVenueDetail = (venue: typeof favorites[0]) => {
    toast.info(`Opening ${venue.title} details with Google Places info`);
  };

  const handleMapPinClick = (venue: typeof favorites[0]) => {
    setSelectedBottomSheetVenue(venue);
  };

  const toggleFilter = (category: keyof typeof selectedFilters) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      restaurants: true,
      cafes: true,
      bars: true,
      attractions: true,
      events: true
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
    toast.success('Filters applied');
  };

  const filteredFavorites = getFilteredAndSortedFavorites();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Favourites</h1>
            <p className="text-sm text-muted-foreground">
              {filteredFavorites.length} saved places
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={`border-primary/30 h-9 px-4 rounded-full ${
              isEditing 
                ? 'bg-destructive/10 text-destructive border-destructive/30' 
                : 'text-primary hover:bg-primary/10'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Done
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="px-4 py-3 border-b border-border/20">
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'list' | 'map')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span>List View</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters & Sorting */}
      <div className="px-4 py-3 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Filter Sheet */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 rounded-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[60vh]">
                <SheetHeader>
                  <SheetTitle>Filter by Category</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedFilters[category.id as keyof typeof selectedFilters] ? "default" : "outline"}
                          onClick={() => toggleFilter(category.id as keyof typeof selectedFilters)}
                          className="h-12 justify-start"
                        >
                          <span className="mr-2">{category.emoji}</span>
                          {category.label}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button onClick={applyFilters} className="flex-1">
                      Apply Filters
                    </Button>
                    <Button variant="outline" onClick={clearFilters} className="px-6">
                      Clear All
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <DropdownMenu open={showSort} onOpenChange={setShowSort}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 rounded-full">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {sortOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as typeof sortBy);
                        setShowSort(false);
                        toast.success(`Sorted by ${option.label.toLowerCase()}`);
                      }}
                      className={sortBy === option.id ? 'bg-primary/10 text-primary' : ''}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {option.label}
                      {sortBy === option.id && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active filter count */}
          {Object.values(selectedFilters).filter(Boolean).length < categories.length && (
            <Badge variant="secondary" className="text-xs">
              {Object.values(selectedFilters).filter(Boolean).length} of {categories.length} categories
            </Badge>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeView === 'list' ? (
          /* List View */
          <ScrollArea className="h-full">
            <div className="px-4 py-4 space-y-3">
              {filteredFavorites.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <HeartOff className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <p className="font-medium">No favorites match your filters</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filter criteria
                    </p>
                  </div>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                filteredFavorites.map((venue) => (
                  <Card key={venue.id} className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="flex h-24">
                        <div className="w-24 h-24 flex-shrink-0 relative">
                          <ImageWithFallback
                            src={venue.image}
                            alt={venue.title}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                          {isEditing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-l-lg">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveFavorite(venue.id)}
                                className="h-8 w-8 p-0 rounded-full"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 p-3 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{venue.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {venue.category} {venue.emoji} | {venue.distance}
                            </p>
                            
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-current text-yellow-400" />
                                <span className="text-sm font-medium">{venue.rating}</span>
                                <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{venue.openingHours}</p>
                            
                            {!isEditing && (
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFavorite(venue.id)}
                                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Heart className="w-4 h-4 fill-current text-red-500" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewOnMap(venue)}
                                  className="h-8 w-8 p-0"
                                >
                                  <MapPin className="w-4 h-4 text-primary" />
                                </Button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleVenueDetail(venue)}>
                                      <Star className="w-4 h-4 mr-2" />
                                      View More Info
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewOnMap(venue)}>
                                      <Navigation className="w-4 h-4 mr-2" />
                                      Directions
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Share className="w-4 h-4 mr-2" />
                                      Share
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleRemoveFavorite(venue.id)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        ) : (
          /* Map View */
          <div className="relative h-full">
            {/* Google Maps Placeholder */}
            <div className="w-full h-full bg-muted/30 flex items-center justify-center relative">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Map className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Google Maps Integration</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    This will show your {filteredFavorites.length} saved places on an interactive Google Maps view with custom pins
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {filteredFavorites.slice(0, 4).map((venue) => (
                    <Button
                      key={venue.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleMapPinClick(venue)}
                      className="text-xs"
                    >
                      <span className="mr-1">{venue.emoji}</span>
                      {venue.title}
                    </Button>
                  ))}
                  {filteredFavorites.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{filteredFavorites.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Map Control Overlay */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-background/95 backdrop-blur-sm shadow-md"
                onClick={() => toast.info('Centering map on your location')}
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet for Map Pin Details */}
      {selectedBottomSheetVenue && activeView === 'map' && (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <Card className="rounded-t-xl shadow-xl border-t">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <ImageWithFallback
                    src={selectedBottomSheetVenue.image}
                    alt={selectedBottomSheetVenue.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{selectedBottomSheetVenue.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedBottomSheetVenue.category} {selectedBottomSheetVenue.emoji} | {selectedBottomSheetVenue.distance}
                  </p>
                  
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{selectedBottomSheetVenue.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedBottomSheetVenue.openingHours}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBottomSheetVenue(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button size="sm" className="flex-1" onClick={() => handleVenueDetail(selectedBottomSheetVenue)}>
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewOnMap(selectedBottomSheetVenue)}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FavoritesScreen;