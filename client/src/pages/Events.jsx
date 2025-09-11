import { useState } from 'react';
import EventCard from '../components/EventCard';

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Sample events data (this will be replaced with API calls later)
  const [events] = useState([
    {
      id: 1,
      title: 'Tech Innovation Summit 2024',
      description: 'Join industry leaders for the biggest technology innovation summit of the year.',
      date: '2024-03-15',
      time: '10:00 AM',
      venue: 'Main Auditorium',
      category: 'technology',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 150,
      totalSlots: 200,
      organizer: 'Tech Club'
    },
    {
      id: 2,
      title: 'AI & Machine Learning Workshop',
      description: 'Learn the fundamentals of AI and ML with hands-on projects and expert guidance.',
      date: '2024-03-20',
      time: '2:00 PM',
      venue: 'Computer Lab A',
      category: 'workshop',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 30,
      totalSlots: 40,
      organizer: 'CS Department'
    },
    {
      id: 3,
      title: 'Annual Cultural Fest',
      description: 'Celebrate diversity and culture with performances, food, and competitions.',
      date: '2024-03-25',
      time: '6:00 PM',
      venue: 'Campus Grounds',
      category: 'cultural',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 500,
      totalSlots: 1000,
      organizer: 'Cultural Committee'
    },
    {
      id: 4,
      title: 'Career Development Seminar',
      description: 'Get insights on career planning, resume building, and interview preparation.',
      date: '2024-03-30',
      time: '11:00 AM',
      venue: 'Seminar Hall B',
      category: 'career',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 80,
      totalSlots: 100,
      organizer: 'Placement Cell'
    },
    {
      id: 5,
      title: 'Blockchain & Cryptocurrency Workshop',
      description: 'Explore the world of blockchain technology and understand cryptocurrency fundamentals.',
      date: '2024-04-05',
      time: '9:00 AM',
      venue: 'Innovation Lab',
      category: 'technology',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 25,
      totalSlots: 30,
      organizer: 'Blockchain Society'
    },
    {
      id: 6,
      title: 'Photography Contest & Exhibition',
      description: 'Showcase your photography skills and view amazing works from fellow students.',
      date: '2024-04-10',
      time: '3:00 PM',
      venue: 'Art Gallery',
      category: 'cultural',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 200,
      totalSlots: 250,
      organizer: 'Photography Club'
    },
    {
      id: 7,
      title: 'Startup Pitch Competition',
      description: 'Present your innovative business ideas to industry experts and investors.',
      date: '2024-04-15',
      time: '1:00 PM',
      venue: 'Business Incubator',
      category: 'career',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 40,
      totalSlots: 50,
      organizer: 'Entrepreneurship Cell'
    },
    {
      id: 8,
      title: 'Web Development Bootcamp',
      description: 'Intensive 3-day bootcamp covering modern web development technologies.',
      date: '2024-04-20',
      time: '9:00 AM',
      venue: 'Computer Lab B',
      category: 'workshop',
      price: 'Free',
      image: '/api/placeholder/400/250',
      availableSlots: 20,
      totalSlots: 25,
      organizer: 'Web Dev Society'
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'career', label: 'Career' },
    { value: 'sports', label: 'Sports' }
  ];

  const dateFilters = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'title', label: 'Title' },
    { value: 'popularity', label: 'Popularity' }
  ];

  const getFilteredAndSortedEvents = () => {
    let filtered = events.filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date filtering logic would go here
      const matchesDate = selectedDate === 'all'; // Simplified for now
      
      return matchesCategory && matchesSearch && matchesDate;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return (b.totalSlots - b.availableSlots) - (a.totalSlots - a.availableSlots);
        case 'date':
        default:
          return new Date(a.date) - new Date(b.date);
      }
    });

    return filtered;
  };

  const filteredEvents = getFilteredAndSortedEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
            <p className="text-gray-600">Discover and register for amazing events happening around campus</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Events</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by title, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {dateFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDate('all');
                setSearchTerm('');
                setSortBy('date');
              }}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 0v10m0-10h8m-4 10v4a4 4 0 01-8 0v-4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              No events match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDate('all');
                setSearchTerm('');
                setSortBy('date');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
