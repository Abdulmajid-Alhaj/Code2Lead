import React from "react";
import TraineeSidebar from "../components/Sidebar/TraineeSidebar";
import background from "../assets/background.png";

export  function Trainee({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: `url(${background})` }}
    >
      <TraineeSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}