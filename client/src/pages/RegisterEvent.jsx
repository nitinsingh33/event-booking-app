import { useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // ✅ navigate added

export default function RegisterEvent() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventName: '',
    date: '',
    timeSlot: '',
    college: '',
    seats: 1,
    comments: '',
    agree: false,
  });

  const navigate = useNavigate(); // ✅ initialize navigate

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.error("⚠️ You must agree to the terms.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/event/register', formData);

      if (res.status === 201) {
        toast.success("Registration successful!");

        setFormData({
          fullName: '',
          email: '',
          phone: '',
          eventName: '',
          date: '',
          timeSlot: '',
          college: '',
          seats: 1,
          comments: '',
          agree: false,
        });

        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Registration failed');
    }
  };

  const eventOptions = ['Hackathon', 'Workshop', 'Cultural Fest', 'Seminar'];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Event Registration</h2>

        {['fullName', 'email', 'phone', 'college'].map((field) => (
          <input
            key={field}
            type={field === 'email' ? 'email' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-2 border rounded"
          />
        ))}

        <select
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        >
          <option value="">Select Event</option>
          {eventOptions.map((event) => (
            <option key={event} value={event}>{event}</option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <select
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        >
          <option value="">Select Time Slot</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
        </select>

        <input
          type="number"
          name="seats"
          min="1"
          value={formData.seats}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <textarea
          name="comments"
          placeholder="Any special requests"
          value={formData.comments}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mr-2"
          />
          I agree to the terms and conditions.
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
