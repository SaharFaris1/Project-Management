import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'
function ProtectedRoute({ allowedRoles }) {
  const storedUser = localStorage.getItem('user')
  const teacherUser = localStorage.getItem('teacher')
  const adminUser = localStorage.getItem('admin')
  let user = null
  if (storedUser) user = JSON.parse(storedUser);
  else if (teacherUser) user = JSON.parse(teacherUser);
  else if (adminUser) user = JSON.parse(adminUser)
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
export default ProtectedRoute