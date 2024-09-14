import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request
      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
        email,
        password,
      });
      const { token, role } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Redirect based on role
      if (role === "super_user") {
        navigate("/admin-dashboard"); // Replace with actual admin dashboard route
      } else if (role === "buyer") {
        navigate("/user-dashboard"); // Replace with actual user dashboard route
      } else {
        setError("Unknown role");
      }

      setError("");
      setSuccess("Login successful!");
    } catch (err) {
      setError("Login failed");
      setSuccess("");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-green-500 to-green-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>
        <div className="mb-6">
          <label htmlFor="email" className="block text-lg text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-lg text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 text-lg font-bold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
