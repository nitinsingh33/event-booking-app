import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    phone: '',
    branch: '',
    department: '',
    otherDepartment: '',
    year: '',
    password: '',
    confirmPassword: '',
    otp: '',
    termsAccepted: false,
  });

  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOtpRequest = async () => {
    if (!formData.email) {
      return setError('Please enter your college email first.');
    }

    try {
      await axios.post('http://localhost:5000/api/auth/request-otp', {
        email: formData.email,
      });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      rollNumber,
      phone,
      branch,
      department,
      otherDepartment,
      year,
      password,
      confirmPassword,
      otp,
      termsAccepted,
    } = formData;

    if (!termsAccepted) return setError('Please accept the terms to continue.');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!otp) return setError('Please enter the OTP sent to your email.');

    try {
      const finalDepartment = department === 'Other' ? otherDepartment : department;
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        rollNumber,
        phone,
        branch,
        department: finalDepartment,
        year,
        password,
        otp,
      });

      if (res.status === 201) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">College Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" type="text" placeholder="Full Name" required onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="email" type="email" placeholder="College Email" required onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="rollNumber" type="text" placeholder="Roll Number" required onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="branch" type="text" placeholder="Branch" required onChange={handleChange} className="border px-3 py-2 rounded" />
          
          <select name="department" value={formData.department} onChange={handleChange} required className="border px-3 py-2 rounded">
            <option value="">Select Department</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>

          {formData.department === 'Other' && (
            <input
              name="otherDepartment"
              type="text"
              placeholder="Mention other department"
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            />
          )}

          <select name="year" value={formData.year} onChange={handleChange} required className="border px-3 py-2 rounded">
            <option value="">Year of Study</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>

          <button
            type="button"
            onClick={handleOtpRequest}
            className="bg-yellow-500 text-white rounded py-2 px-4 hover:bg-yellow-600 transition"
          >
            {otpSent ? 'Resend OTP' : 'Request OTP'}
          </button>

          <input name="otp" type="text" placeholder="Enter OTP" required onChange={handleChange} className="border px-3 py-2 rounded" />
        </div>

        <div className="mt-4 space-y-4">
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="w-full border px-3 py-2 rounded" />

          <label className="flex items-center text-sm mt-2">
            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mr-2" />
            I agree to the terms & conditions
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition">
          Create Account
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
