import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import useAuth from '../../hooks/useAuth'; 
import { FaUsers, FaStore, FaStar, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user: currentUser } = useAuth(); 

    
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    
    const [showAddStoreForm, setShowAddStoreForm] = useState(false);
    const [showAddUserForm, setShowAddUserForm] = useState(false);

    
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner: '' });
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    
    const [nameWarning, setNameWarning] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, usersRes, storesRes] = await Promise.all([
                    api.get('/users/dashboard'),
                    api.get('/users'),
                    api.get('/stores')
                ]);
                setStats(statsRes.data.data);
                setUsers(usersRes.data.data);
                setStores(storesRes.data.data);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleStoreFormChange = (e) => {
        setNewStore({ ...newStore, [e.target.name]: e.target.value });
    };

    const handleUserFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            if (value.length > 0 && value.length < 20) {
                setNameWarning('Name must be at least 20 characters long.');
            } else {
                setNameWarning('');
            }
        }
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (nameWarning) {
            alert('Please fix the errors before submitting.');
            return;
        }
        try {
            const response = await api.post('/users', newUser);
            setUsers([...users, response.data.data]);
            alert('User created successfully!');
            setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
            setShowAddUserForm(false);
        } catch (err) {
            alert('Failed to create user: ' + (err.response?.data?.message || 'Please check the console for details.'));
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        if (!newStore.owner) {
            alert('Please select a store owner.');
            return;
        }
        try {
            await api.post('/stores', newStore);
            alert('Store added successfully!');
            window.location.reload(); 
        } catch (err) {
            alert('Failed to add store: ' + (err.response?.data?.message || 'Please check the console for errors.'));
        }
    };

    const handleDeleteStore = async (storeId) => {
        if (window.confirm('Are you sure you want to delete this store and all its ratings? This action cannot be undone.')) {
            try {
                await api.delete(`/stores/${storeId}`);
                setStores(stores.filter(store => store._id !== storeId));
                alert('Store deleted successfully.');
            } catch (err) {
                alert('Failed to delete store.');
            }
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                await api.put(`/users/${userId}`, { role: newRole });
                setUsers(users.map(user => 
                    user._id === userId ? { ...user, role: newRole } : user
                ));
                alert('User role updated successfully.');
            } catch (err) {
                alert('Failed to update user role.');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? If they are a store owner, their store and all its ratings will also be deleted.')) {
            try {
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
                alert('User deleted successfully.');
            } catch (err) {
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">{error}</p>;

    const storeOwners = users.filter(user => user.role === 'Store Owner');

    const StatCard = ({ icon, label, value, color }) => (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className={`p-4 rounded-full mr-4 ${color}`}>{icon}</div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<FaUsers size={24} className="text-white" />} label="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                <StatCard icon={<FaStore size={24} className="text-white" />} label="Total Stores" value={stats.totalStores} color="bg-green-500" />
                <StatCard icon={<FaStar size={24} className="text-white" />} label="Total Ratings" value={stats.totalRatings} color="bg-yellow-500" />
            </div>

            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-700">Manage Users</h3>
                    <button onClick={() => setShowAddUserForm(!showAddUserForm)} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        {showAddUserForm ? 'Cancel' : '+ Add User'}
                    </button>
                </div>
                {showAddUserForm && (
                    <form onSubmit={handleAddUser} className="mt-6 space-y-4 border-t pt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" placeholder="Full Name (must be at least 20 characters)" value={newUser.name} onChange={handleUserFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                            {nameWarning && <p className="text-red-500 text-xs mt-1">{nameWarning}</p>}
                        </div>
                        <input type="email" name="email" placeholder="Email Address" value={newUser.email} onChange={handleUserFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        <input type="password" name="password" placeholder="Password (min. 8 characters)" value={newUser.password} onChange={handleUserFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" name="address" placeholder="Address" value={newUser.address} onChange={handleUserFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        <select name="role" value={newUser.role} onChange={handleUserFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required>
                            <option value="Normal User">Normal User</option>
                            <option value="Store Owner">Store Owner</option>
                            <option value="System Administrator">System Administrator</option>
                        </select>
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Confirm and Add User</button>
                    </form>
                )}
            </div>
            
            
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">All Users</h3>
                <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Role</th>
                                
                                <th className="p-3 text-left">Store Rating</th> 
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-t">
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'System Administrator' ? 'bg-red-200 text-red-800' : user.role === 'Store Owner' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>{user.role}</span>
                                    </td>
                                   
                                    <td className="p-3">
                                        {user.role === 'Store Owner' && user.storeRating && (
                                            <span className="flex items-center">{user.storeRating} <FaStar className="ml-1 text-yellow-500" /></span>
                                        )}
                                    </td>
                                    <td className="p-3 flex items-center space-x-2">
                                        {user.role === 'Normal User' && (
                                            <button onClick={() => handleRoleChange(user._id, 'Store Owner')} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                                                Make Owner
                                            </button>
                                        )}
                                        {user.role === 'Store Owner' && (
                                            <button onClick={() => handleRoleChange(user._id, 'Normal User')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                                Make User
                                            </button>
                                        )}
                                        {currentUser?._id !== user._id && user.role !== 'System Administrator' && (
                                            <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                                <FaTrash size={12} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-700">Manage Stores</h3>
                    <button onClick={() => setShowAddStoreForm(!showAddStoreForm)} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        {showAddStoreForm ? 'Cancel' : '+ Add Store'}
                    </button>
                </div>
                {showAddStoreForm && (
                    <form onSubmit={handleAddStore} className="mt-6 space-y-4 border-t pt-6">
                        <input type="text" name="name" placeholder="Store Name" onChange={handleStoreFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        <input type="email" name="email" placeholder="Store Email" onChange={handleStoreFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" name="address" placeholder="Store Address" onChange={handleStoreFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assign Owner</label>
                            <select name="owner" onChange={handleStoreFormChange} defaultValue="" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required>
                                <option value="" disabled>Select a Store Owner</option>
                                {storeOwners.length > 0 ? (
                                    storeOwners.map(owner => (
                                        <option key={owner._id} value={owner._id}>{owner.name} ({owner.email})</option>
                                    ))
                                ) : (
                                    <option disabled>No users with 'Store Owner' role found.</option>
                                )}
                            </select>
                        </div>
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                            Confirm and Add Store
                        </button>
                    </form>
                )}
            </div>
            
            
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">All Stores</h3>
                <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                
                                <th className="p-3 text-left">Owner</th>
                                <th className="p-3 text-left">Rating</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map(store => (
                                <tr key={store._id} className="border-t">
                                    <td className="p-3">{store.name}</td>
                                    <td className="p-3">{store.email}</td>
                                    {/* --- NEW CELL --- */}
                                    <td className="p-3">{store.owner ? store.owner.name : 'N/A'}</td>
                                    <td className="p-3 flex items-center">{store.overallRating.toFixed(1)} <FaStar className="ml-2 text-yellow-500" /></td>
                                    <td className="p-3">
                                        <button onClick={() => handleDeleteStore(store._id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;