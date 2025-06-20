import { useState } from "react";

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registering:", formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <input 
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full mb-3 p-2 border rounded"
                    onChange={handleChange} 
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-3 p-2 border rounded"
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    name="password"
                    placeholder="Password"
                    className="w-full mb-4 p-2 border rounded"
                    onChange={handleChange}
                />
               <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
                Register
                </button> 
            </form>
        </div>
    );
};

export default Register;