import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/login-icon.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postData } from '../utils/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Ganti URL di bawah dengan endpoint backend yang sesuai
    try {
      const data = await postData("/auth/login", { email, password });
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        toast.success("Login successful");
        navigate("/");
        window.location.reload();
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="h-50 mb-2 w-50" />
          <h2 className="text-3xl font-bold text-teal-700">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Login to your Calmora account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userEmail" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="userEmail"
              id="userEmail"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="userPassword" className="block text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="userPassword"
                id="userPassword"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash  size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          {/* {error && <div className="text-red-500 text-sm">{error}</div>} */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-teal-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
