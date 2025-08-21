import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import { FaStar } from 'react-icons/fa';

const StoreOwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/stores/mydashboard');
                setDashboardData(data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (dashboardData.length === 0) return <p className="text-center text-gray-600">No store data available.</p>;

    return (
        <div className="space-y-8">
            {dashboardData.map(store => (
                <div key={store.storeId} className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">My Store: {store.storeName}</h2>
                    <div className="flex items-center text-xl mb-6">
                        <span className="font-semibold text-gray-700 mr-3">Average Rating:</span>
                        <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                            <FaStar className="mr-2" />
                            <span className="font-bold">{store.averageRating}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">User Ratings</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {store.ratings.map(({ _id, user, rating }) => (
                                    <tr key={_id}>
                                        <td className="py-4 px-6 whitespace-nowrap">{user ? user.name : 'Deleted User'}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{user ? user.email : 'N/A'}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="mr-2">{rating}</span>
                                                <FaStar color="#ffc107" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {store.ratings.length === 0 && <p className="text-center mt-4 text-gray-500">No ratings submitted for this store yet.</p>}
                </div>
            ))}
        </div>
    );
};

export default StoreOwnerDashboard;