import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600">
                    StoreRater
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-700">Welcome, {user.name.split(' ')[0]}!</span>
                            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                            <button onClick={logout} className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                            <Link to="/register" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;