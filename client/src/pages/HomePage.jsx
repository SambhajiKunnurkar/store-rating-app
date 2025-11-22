import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="text-center bg-white p-12 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to StoreRater</h1>
            <p className="text-lg text-gray-600 mb-8">
                The best place to find and rate your favorite local stores.
            </p>
            <div className="space-x-4">
                <Link to="/register" className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 text-lg">
                    Get Started
                </Link>
                <Link to="/login" className="px-6 py-3 font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 text-lg">
                    Login
                </Link>
            </div>
            <h4 className="px-6 py-3 font-extrabold text-gray-300 mb-4">Admin Details</h4>
            

            <h4 className="px-6 font-extrabold text-gray-300 mb-4">Admin Email: admin@gmail.com</h4>
            <h4 className="px-6 font-extrabold text-gray-300 mb-4">Admin Password: Admin@1234</h4>

            
        </div>
    );
};

export default HomePage;
