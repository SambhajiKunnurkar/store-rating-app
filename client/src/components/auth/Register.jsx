import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { register } = useAuth();

    const validatePassword = (password) => {
        
        if (!regex.test(password)) {
            setPasswordError('Password must be 8-16 chars, with an uppercase letter & a special character.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'password') {
            validatePassword(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validatePassword(formData.password)) return;

        try {
            await register(formData);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" required minLength="20" maxLength="60"
                               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                               onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" required
                               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                               onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <textarea name="address" required maxLength="400"
                                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  onChange={handleChange}></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" required
                               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                               onChange={handleChange} />
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    </div>
                    <button type="submit"
                            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign Up
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;