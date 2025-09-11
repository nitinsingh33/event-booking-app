import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(response.data.event);
      setTimeSlots(response.data.timeSlots || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load event details:', error);
      setError('Failed to load event details');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleRegister = async () => {
    if (!isLoggedIn) {
      alert('Please login to register for events');
      navigate('/login');
      return;
    }

    if (!selectedSlot && timeSlots.length > 0) {
      alert('Please select a time slot');
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/events/register',
        {
          eventId: id,
          timeSlotId: selectedSlot || null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      alert(`Registration successful! Your ticket ID is: ${response.data.ticketId}`);
      fetchEventDetails(); // Refresh to update available seats
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'TECHNICAL': 'bg-blue-100 text-blue-800 border-blue-200',
      'CULTURAL': 'bg-purple-100 text-purple-800 border-purple-200',
      'WORKSHOP': 'bg-green-100 text-green-800 border-green-200',
      'SPORTS': 'bg-orange-100 text-orange-800 border-orange-200',
      'CONFERENCE': 'bg-gray-100 text-gray-800 border-gray-200',
      'SEMINAR': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'MEETUP': 'bg-pink-100 text-pink-800 border-pink-200',
      'OTHER': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getEventTypeColor(event.type)} bg-white`}>
                    {event.type?.charAt(0) + event.type?.slice(1).toLowerCase()}
                  </span>
                  {event.fee > 0 ? (
                    <span className="ml-4 text-2xl font-bold">₹{event.fee}</span>
                  ) : (
                    <span className="ml-4 text-2xl font-bold text-green-300">FREE</span>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                
                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{new Date(event.date).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seats Info */}
              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">Available Seats</div>
                <div className="text-3xl font-bold">
                  {event.availableSeats}/{event.maxSeats}
                </div>
                <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${(event.availableSeats / event.maxSeats) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>

                {/* Time Slots */}
                {timeSlots.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Time Slots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedSlot === slot.id
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedSlot(slot.id)}
                        >
                          <div className="font-medium">{slot.start_time} - {slot.end_time}</div>
                          <div className="text-sm text-gray-500">
                            {slot.available_seats} seats available
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Register for Event</h3>
                  
                  {!isLoggedIn ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Please login to register for this event</p>
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Login to Register
                      </button>
                    </div>
                  ) : event.availableSeats === 0 ? (
                    <div className="text-center">
                      <p className="text-red-600 font-medium mb-4">This event is fully booked</p>
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Logged in as:</p>
                        <p className="font-medium">{userInfo.name || userInfo.email}</p>
                      </div>
                      
                      {timeSlots.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Time Slot *
                          </label>
                          <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Choose a time slot</option>
                            {timeSlots.map((slot) => (
                              <option key={slot.id} value={slot.id}>
                                {slot.start_time} - {slot.end_time} ({slot.available_seats} seats)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        onClick={handleRegister}
                        disabled={registering}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      >
                        {registering ? 'Registering...' : 'Register Now'}
                      </button>
                      
                      {event.fee > 0 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Registration fee: ₹{event.fee}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
