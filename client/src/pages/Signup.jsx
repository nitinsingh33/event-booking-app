import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      if (res.status === 201) {
        // Save only relevant data
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {[
          { name: 'name', type: 'text', placeholder: 'Full Name' },
          { name: 'email', type: 'email', placeholder: 'Email' },
          { name: 'password', type: 'password', placeholder: 'Password' },
          { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
        ].map(({ name, type, placeholder }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder}
            className="w-full mb-4 px-4 py-2 border rounded"
            value={formData[name]}
            onChange={handleChange}
            required
          />
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
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
