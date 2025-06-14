import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import TeacherDashboard from '../pages/TeacherDashboard';

function Layout() {
  const navigate = useNavigate();

 
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage')); 
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav onLogout={handleLogout} />
      
 
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
       
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-white text-center">
   
      </footer>
    </div>
  );
}

export default Layout;