import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@college.edu',
    rollNumber: 'CS21001',
    department: 'Computer Science Engineering',
    year: '3rd',
    college: 'Sample University'
  });

  const [stats] = useState({
    eventsRegistered: 8,
    eventsAttended: 6,
    upcomingEvents: 3,
    certificates: 4
  });

  const [recentEvents] = useState([
    {
      id: 1,
      title: 'Tech Innovation Summit 2024',
      date: '2024-02-15',
      status: 'attended',
      type: 'workshop'
    },
    {
      id: 2,
      title: 'AI/ML Workshop Series',
      date: '2024-02-20',
      status: 'registered',
      type: 'workshop'
    },
    {
      id: 3,
      title: 'Career Fair 2024',
      date: '2024-02-25',
      status: 'upcoming',
      type: 'career'
    }
  ]);

  const [upcomingEvents] = useState([
    {
      id: 4,
      title: 'Blockchain Fundamentals',
      date: '2024-03-01',
      time: '10:00 AM',
      venue: 'Auditorium A',
      type: 'seminar'
    },
    {
      id: 5,
      title: 'Hackathon 2024',
      date: '2024-03-15',
      time: '9:00 AM',
      venue: 'Computer Lab',
      type: 'competition'
    }
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      attended: 'bg-green-100 text-green-800',
      registered: 'bg-blue-100 text-blue-800',
      upcoming: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'workshop':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'seminar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'competition':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 0v10m0-10h8m-4 10v4a4 4 0 01-8 0v-4" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Link to="/events" className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Browse Events
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events Registered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsRegistered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events Attended</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.rollNumber}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Department</p>
                    <p className="text-sm text-gray-600">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Year</p>
                    <p className="text-sm text-gray-600">{user.year} Year</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">College</p>
                    <p className="text-sm text-gray-600">{user.college}</p>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity & Upcoming Events */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <Link to="/events" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        {event.date} at {event.time} • {event.venue}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-500 font-medium text-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                <Link to="/my-events" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  View history
                </Link>
              </div>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
