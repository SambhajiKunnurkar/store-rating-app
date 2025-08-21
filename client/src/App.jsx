import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';


function App() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          
        </Routes>
      </main>
    </div>
  );
}

export default App;