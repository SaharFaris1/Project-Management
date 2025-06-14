import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

function RegisterAdmin() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const apiUrl = 'https://68459cbcfc51878754dbc94d.mockapi.io/AdminLogin'; 
  const navigate = useNavigate();

  const btnSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    if (password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      const res = await axios.get(apiUrl);
      const userExist = res.data.find(user => user.email === email);

      if (userExist) {
        Swal.fire("Error", "Email already used", "error");
        return;
      }

      const response = await axios.post(apiUrl, {
        fullName,
        email,
        password,
        role: "admin" 
        
      });

      Swal.fire("Success", "Registration successful", "success");

      localStorage.setItem("user", JSON.stringify({
        ...response.data,
        role: "admin" 
      }));

      navigate("/login"); 
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Please try again.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <div className="text-center flex flex-col justify-center items-center mb-6">
          <img className='h-20 w-30 rounded-2xl' src="logo.jpg" alt="Logo" />
          <h2 className="text-2xl font-bold mt-4">Register as Admin</h2>
        </div>

        <form onSubmit={btnSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block font-bold mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold mb-1">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-bold mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full font-bold bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterAdmin;