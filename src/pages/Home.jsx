import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="text-center max-w-xl mx-auto">
      <h1 className="text-4xl font-extrabold text-shadow-2xs text-gray-800 mb-6">Welcome to Graduation Projects Management System</h1>
      <p className="text-lg  font-bold text-gray-600 mb-10">
          Choose your account type to start your journey with us.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  
          <Link
            to="/loginStu"
            className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded shadow-md transition transform hover:scale-105"
          >
            Student
          </Link>

       
          <Link
            to="/loginTeacher"
            className="bg-orange-300 hover:bg-orange-400 text-white font-bold py-4 px-6 rounded shadow-md transition transform hover:scale-105"
          >
            Teacher
          </Link>

        
          <Link
            to="/login"
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded shadow-md transition transform hover:scale-105"
          >
            Admin
          </Link>
        </div>

        <div className="mt-12 font-bold text-gray-500 text-md">
        <p>Select a role to access your dashboard and get started.</p>
        </div>
      </div>
    </div>
  );
}

export default Home