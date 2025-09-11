import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const getCategoryColor = (category) => {
    const colors = {
      'technology': 'bg-blue-100 text-blue-800',
      'workshop': 'bg-green-100 text-green-800',
      'cultural': 'bg-purple-100 text-purple-800',
      'career': 'bg-orange-100 text-orange-800',
      'sports': 'bg-red-100 text-red-800',
      'seminar': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getSlotsColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Event Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
            {event.price}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {/* Date & Time */}
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 0v10m0-10h8m-4 10v4a4 4 0 01-8 0v-4" />
            </svg>
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.venue}</span>
          </div>

          {/* Organizer */}
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>By {event.organizer}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className={`font-medium ${getSlotsColor(event.availableSlots, event.totalSlots)}`}>
              {event.availableSlots} spots left
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {event.totalSlots - event.availableSlots}/{event.totalSlots} registered
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((event.totalSlots - event.availableSlots) / event.totalSlots) * 100}%` }}
          ></div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/event/${event.id}`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
        >
          {event.availableSlots > 0 ? 'View Details & Register' : 'View Details (Full)'}
        </Link>
      </div>
    </div>
  );
}
