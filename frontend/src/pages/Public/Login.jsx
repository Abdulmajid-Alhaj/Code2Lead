import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios"; // centralized axios instance
import logo from "../../assets/logo.png";
import background from "../../assets/background.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      // ✅ Backend should return: { token, user: { ... } }
      const { user } = res.data;

      // 🧁 Store only necessary info in cookies (token is HTTP-only)
      document.cookie = `firstName=${user.firstName}; path=/; SameSite=Strict;`;
      document.cookie = `email=${user.email}; path=/; SameSite=Strict;`;
      document.cookie = `image=${user.image}; path=/; SameSite=Strict;`;

      // 👉 Now redirect to Profile
      window.location.href = "/profile";
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl z-10 justify-between px-4 md:px-0">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-start w-full md:w-1/2 pl-0 md:pl-12 mb-8 md:mb-0">
          <img src={logo} alt="Code2Lead Logo" className="w-64 md:w-80 mb-8" />
          <div className="border-4 border-white px-6 md:px-8 py-4">
            <span className="text-2xl md:text-xl text-white font-semibold italic">
              Welcome Back
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-opacity-10">
          <div className="bg-[#19173a]/10 backdrop-blur-md rounded-2xl shadow-2xl px-6 md:px-12 py-10 w-full max-w-md border border-gray-400">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Login
            </h2>
            <p className="text-gray-300 mb-6">Glad you’re back.!</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-md bg-transparent border border-gray-300 text-white focus:outline-none focus:border-[#a259c6] transition"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-md bg-transparent border border-gray-300 text-white focus:outline-none focus:border-[#a259c6] transition"
              />

              {error && (
                <p className="text-red-400 text-sm mb-2 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md bg-gradient-to-r from-[#5f6fff] to-[#580475] text-white font-semibold text-lg mt-2 mb-2 transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-gray-300 hover:underline text-sm transition"
              >
                Forgot password ?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
