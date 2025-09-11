import { useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Events', icon: '🎯' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'workshop', label: 'Workshops', icon: '🛠️' },
    { value: 'cultural', label: 'Cultural', icon: '🎭' },
    { value: 'career', label: 'Career', icon: '💼' },
    { value: 'sports', label: 'Sports', icon: '⚽' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const upcomingEvents = events.slice(0, 3);
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + (event.totalSlots - event.availableSlots), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join thousands of students in exciting workshops, seminars, and cultural events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse All Events
              </Link>
              <Link
                to="/register-event"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Host an Event
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{totalEvents}+</div>
              <div className="text-gray-600 mt-2">Active Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{totalRegistrations}+</div>
              <div className="text-gray-600 mt-2">Student Registrations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600 mt-2">Partner Organizations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-xl text-gray-600">Don't miss these popular upcoming events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Event</h2>
            <p className="text-xl text-gray-600">Search and filter events by category</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Filtered Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-2.206 0-4.194-.94-5.291-2.709L3 20l1.291-3.709A7.962 7.962 0 014 12a8 8 0 018-8 8 8 0 018 8 7.962 7.962 0 01-.709 3.291L21 20l-3.709-1.291z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students already using EventHub to discover amazing opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
