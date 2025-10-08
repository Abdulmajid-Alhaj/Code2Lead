import React, { useState } from "react";
import logo from "../../assets/logo.png";
import background from "../../assets/background.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulated user data (like your JSON file)
  const users = [
    { email: "test@example.com", password: "12345678", firstName: "Ali" },
    { email: "dev@code2lead.com", password: "password123", firstName: "Ahmed" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("token", "mockToken123"); // fake token
        window.location.href = "/home"; // redirect to home
      } else {
        setError("Invalid email or password");
      }

      setLoading(false);
    }, 800); // simulate small delay like real API
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
            <span className="text-2xl md:text-3xl text-white font-semibold italic">
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
              <div className="relative mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-white focus:outline-none focus:border-[#a259c6] transition pr-10"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                  👁️
                </span>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-2 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md bg-gradient-to-r from-[#628EFF] to-[#580475] text-white font-semibold text-lg mt-2 mb-2 transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Checking..." : "Login"}
              </button>
            </form>

            <div className="text-center mb-4">
              <a href="#" className="text-gray-300 hover:underline text-sm">
                Forgot password ?
              </a>
            </div>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-500" />
              <span className="mx-3 text-gray-400">Or</span>
              <hr className="flex-grow border-gray-500" />
            </div>

            <div className="flex justify-center gap-6">
              <button className="text-2xl">
                <span role="img" aria-label="Google">
                  🌐
                </span>
              </button>
              <button className="text-2xl text-blue-600">
                <span role="img" aria-label="Facebook">
                  📘
                </span>
              </button>
              <button className="text-2xl">
                <span role="img" aria-label="GitHub">
                  🐱
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
