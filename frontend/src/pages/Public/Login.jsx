import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* LEFT SIDE - Light Trapezoid */}
      <div
        className="w-1/2 flex items-center justify-center bg-gradient-to-br from-white via-[#d8d8ff] to-[#b3b3ff]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
        }}
      >
        <img
          src="/path-to-your-logo.png"
          alt="Code2Lead Logo"
          className="w-3/4 max-w-md"
        />
      </div>

      {/* RIGHT SIDE - Dark Trapezoid */}
      <div
        className="w-1/2 bg-[#0c0b21] flex flex-col justify-center items-center relative overflow-hidden"
        style={{
          clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        {/* Glowing accents */}
        <div className="absolute w-64 h-64 bg-purple-600/30 blur-[100px] top-10 right-10"></div>
        <div className="absolute w-64 h-64 bg-emerald-400/20 blur-[120px] bottom-10 left-10"></div>

        {/* Form */}
        <div className="z-10 w-full max-w-sm px-6">
          <h2 className="text-white text-xl font-semibold mb-8 tracking-widest text-center">
            LOGIN
          </h2>

          <form className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              className="rounded-full px-5 py-3 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7111ee]"
            />
            <input
              type="password"
              placeholder="Password"
              className="rounded-full px-5 py-3 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7111ee]"
            />
            <button
              type="submit"
              className="mt-4 rounded-full bg-gradient-to-r from-[#00D084] to-[#3a0e73] text-white font-semibold py-2 px-8 w-fit self-center hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
