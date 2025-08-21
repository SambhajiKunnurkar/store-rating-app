import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center">
            <h1 className="text-6xl font-bold text-indigo-600">404</h1>
            <p className="text-2xl text-gray-700 mt-4">Page Not Found</p>
            <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="mt-6 inline-block px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;