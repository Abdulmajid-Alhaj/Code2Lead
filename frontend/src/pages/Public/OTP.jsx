import React, { useState } from "react";
import { Link } from "react-router-dom";
import background from "../../assets/background.png";
import logo from "../../assets/logo.png";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();

    // simulate verification
    if (otp === "123456") {
      setMessage("✅ Verification successful! You can reset your password.");
      // later: navigate("/reset-password")
    } else {
      setMessage("❌ Invalid verification code. Try again.");
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
              Verify Your Code
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-[#19173a]/20 backdrop-blur-md border border-gray-500 rounded-2xl pt-32 pb-32 pl-8 pr-8 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-left">
            Enter OTP
          </h2>
          <p className="text-gray-300 mb-6 text-left">
            We’ve sent a verification code to your email.
          </p>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-md bg-transparent border border-gray-300 text-white focus:outline-none focus:border-[#a259c6] transition text-center tracking-widest"
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-gradient-to-r from-[#5f6fff] to-[#580475] text-white font-semibold text-lg mt-2 mb-2 transition hover:opacity-90"
            >
              Verify Code
            </button>
          </form>

          {message && (
            <p className="text-green-400 mt-4 text-center text-sm">{message}</p>
          )}

          <div className="text-center mt-6">
            <Link to="/forgot-password" className="text-gray-300 hover:underline text-sm">
              Back to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
