import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const { data } = await api.put('/auth/updatepassword', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setMessage(data.message);
            setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Your Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input 
                        type="password" 
                        name="currentPassword" 
                        value={formData.currentPassword} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input 
                        type="password" 
                        name="newPassword" 
                        value={formData.newPassword} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input 
                        type="password" 
                        name="confirmNewPassword" 
                        value={formData.confirmNewPassword} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                        required 
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <button 
                    type="submit" 
                    className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default UpdatePassword;