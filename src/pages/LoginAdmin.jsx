import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const apiUrl = 'https://68459cbcfc51878754dbc94d.mockapi.io/AdminLogin';

    const btnLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire("Error", "Please fill in all fields", "error");
            return;
        }

        try {
            const res = await axios.get(apiUrl);
            const user = res.data.find(u => u.email === email);

            if (!user) {
                Swal.fire("Error", "Email not found", "error");
                return;
            }

            if (user.password !== password) {
                Swal.fire("Error", "Incorrect password", "error");
                return;
            }


            localStorage.setItem("admin", JSON.stringify({
                ...user,
                role: "admin"
            }));


            Swal.fire({
                title: 'Success!',
                text: 'Logged in successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });


            navigate("/admin");

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 min-h-screen">
            <div className="w-full max-w-md p-6 bg-white rounded shadow">
                <div className="text-center flex flex-col justify-center items-center mb-6">
                    <img className='h-20 w-30 rounded-2xl' src="logo.jpg" alt="Logo" />
                    <h2 className="text-2xl font-bold mt-4">Welcome Back!</h2>
                </div>

                <form onSubmit={btnLogin} className="space-y-6">
                    {/*  Email */}
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

                    {/* Password*/}
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

                    {/* Buttons*/}
                    <button
                        type="submit"
                        className="w-full font-bold bg-gray-900 text-white py-2 rounded hover:bg-gray-600 transition"
                    >
                        Login
                    </button>


                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Don't have an account?{" "}
                        <Link to="/registerAdmin" className="text-orange-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginAdmin;