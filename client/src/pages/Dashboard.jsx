import React from 'react';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../components/roles/AdminDashboard';
import NormalUserDashboard from '../components/roles/NormalUserDashboard';
import StoreOwnerDashboard from '../components/roles/StoreOwnerDashboard';
import Loader from '../components/common/Loader';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    const renderDashboard = () => {
        switch (user?.role) {
            case 'System Administrator':
                return <AdminDashboard />;
            case 'Normal User':
                return <NormalUserDashboard />;
            case 'Store Owner':
                return <StoreOwnerDashboard />;
            default:
                return <p>No dashboard available for your role.</p>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Dashboard</h1>
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;