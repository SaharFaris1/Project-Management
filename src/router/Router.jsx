import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from '../pages/Home';
import LoginAdmin from '../pages/LoginAdmin';
import LoginTeacher from '../pages/LoginTeacher';
import LoginStu from '../pages/LoginStu';
import RegisterAdmin from '../pages/RegisterAdmin';
import RegisterStu from '../pages/RegisterStu';
import RegisterTeacher from '../pages/RegisterTeacher';
import AdminDashboard from '../pages/AdminDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
import Layout from '../components/Layout'; 
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      // تسجيل الدخول
      { path: "login", element: <LoginAdmin /> },
      { path: "loginTeacher", element: <LoginTeacher /> },
      { path: "loginStu", element: <LoginStu /> },

      // التسجيل
      { path: "registerAdmin", element: <RegisterAdmin /> },
      { path: "registerStu", element: <RegisterStu /> },
      { path: "registerTeacher", element: <RegisterTeacher /> },
      
      { path: "/student", element: <StudentDashboard /> },
      { path: "/teacher", element: <TeacherDashboard /> },
      { path: "/admin", element: <AdminDashboard /> },

    ]
  },

 
  { path: "/student", element: <StudentDashboard /> },
  { path: "/teacher", element: <TeacherDashboard /> },
  { path: "/admin", element: <AdminDashboard /> }
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;