import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import { FaStar, FaSearch } from 'react-icons/fa';
import UpdatePassword from '../common/UpdatePassword'; 

const StarRating = ({ rating, onRate, editable = false }) => {
    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={ratingValue}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => editable && onRate(ratingValue)}
                            className="hidden"
                        />
                        <FaStar
                            className={`cursor-${editable ? 'pointer' : 'default'}`}
                            color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
                            size={20}
                        />
                    </label>
                );
            })}
        </div>
    );
};

const NormalUserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const [rating, setRating] = useState(0);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/stores');
            setStores(data.data);
            setFilteredStores(data.data);
        } catch (err) {
            setError('Failed to fetch stores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    useEffect(() => {
        const results = stores.filter(store =>
            store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStores(results);
    }, [searchTerm, stores]);

    const handleRatingSubmit = async () => {
        if (rating === 0) return;
        try {
            await api.post(`/stores/${selectedStore._id}/rate`, { rating });
            setSelectedStore(null);
            setRating(0);
            fetchStores(); 
        } catch (err) {
            setError('Failed to submit rating.');
        }
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search stores by name or address..."
                    className="w-full p-3 pl-10 border rounded-lg shadow-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map(store => (
                    <div key={store._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{store.name}</h3>
                            <p className="text-gray-600 mt-1">{store.address}</p>
                            <div className="flex items-center mt-4">
                                <span className="text-gray-700 mr-2">Overall Rating:</span>
                                <StarRating rating={store.overallRating} />
                                <span className="ml-2 font-semibold">{store.overallRating}</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <span className="text-gray-700 mr-2">Your Rating:</span>
                                {store.userSubmittedRating ? (
                                    <StarRating rating={store.userSubmittedRating} />
                                ) : (
                                    <span className="text-gray-500">Not Rated</span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedStore(store);
                                setRating(store.userSubmittedRating || 0);
                            }}
                            className="mt-4 w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            {store.userSubmittedRating ? 'Modify Your Rating' : 'Submit a Rating'}
                        </button>
                    </div>
                ))}
            </div>

           
            {selectedStore && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4">Rate {selectedStore.name}</h3>
                        <div className="flex justify-center mb-6">
                            <StarRating rating={rating} onRate={setRating} editable={true} />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setSelectedStore(null)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                            <button onClick={handleRatingSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Submit</button>
                        </div>
                    </div>
                </div>
            )}
            <UpdatePassword />
        </div>
    );
};

export default NormalUserDashboard;