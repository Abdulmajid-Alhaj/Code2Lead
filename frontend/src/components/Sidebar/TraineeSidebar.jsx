// import React from "react";

// export default function TraineeSidebar() {
//   return (
//     <aside className="w-64 bg-gray-800 text-white">
//       {/* Sidebar content */}
//       Trainee Sidebar
//     </aside>
//   );
// }

import React, { useState } from 'react';

// --- ICON URLs ---
// Note: We are adding the icons seen in the image (Users, Profile, Log Out)
const HomeIcon = "https://img.icons8.com/?size=100&id=44013&format=png&color=7B66FF";
const ModulesIcon = "https://img.icons8.com/?size=100&id=49446&format=png&color=7B66FF";
const ExercisesIcon = "https://img.icons8.com/?size=100&id=WMvhDPZBJ9X2&format=png&color=7B66FF";
const TasksIcon = "https://img.icons8.com/?size=100&id=44806&format=png&color=7B66FF";
const LogOutIcon = "https://img.icons8.com/?size=100&id=44001&format=png&color=000000"; // Log Out icon 
const arrow = "https://img.icons8.com/?size=100&id=49411&format=png&color=000000"

import logo from '../../assets/logo.png'; // Ensure the logo path is correct

const LogoPlaceholder = "<CODE2LEAD/>";

// --- NAVIGATION DATA ---
const navItems = [
  { name: 'Home', icon: HomeIcon, href: '#home' },
  { name: 'Modules', icon: ModulesIcon, href: '#modules' },
  { name: 'Exercises', icon: ExercisesIcon, href: '#exercises' },
  { name: 'Tasks', icon: TasksIcon, href: '#tasks' },
];

const TraineeSidebar = () => {
  // 1. Initialize state for the active link (set 'Modules' as default active)
  const [activeItem, setActiveItem] = useState('Modules');
  // 2. Initialize state for the collapse/expand state (Default: not collapsed)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle function
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine the width class based on the collapse state and add transition
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  // --- RENDER COMPONENT ---
  return (
    // The main sidebar container: dynamically adjust width and add transition
    <div
      className={`flex flex-col h-screen ${sidebarWidth}  text-white shadow-xl relative transition-all duration-300 ease-in-out`}
      style={{ minWidth: isCollapsed ? '5rem' : '16rem' }}
    >

      {/* Collapse/Expand Toggle Button (New Addition) */}
      <button
        onClick={toggleCollapse}
        title={isCollapsed ? "Expand" : "Collapse"}
        className={`
                    absolute top-1/4 -right-8 p-1 rounded-full bg-[#110f27] border-2 border-gray-700/50 text-white z-10 transition-all duration-300 hover:bg-[#191636]
                `}
      >
        {/* 📌 هنا يمكنك إضافة الأيقونة الخاصة بك، نستخدم placeholder الآن */}
        <img
          src={arrow}
          alt="Toggle"
          className={`w-8 h-8 transition-transform duration-300 
                        ${isCollapsed ? 'rotate-180' : ''}
                    `}
        />
      </button>

      {/* Logo/Header Section */}
      <div className={`p-5 border-b border-gray-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {/* Text logo is visible only when expanded */}
        <div
          className={`text-2xl font-bold text-purple-400 overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 h-0' : 'opacity-100'}`}
        >
          {/* For demonstration, using the placeholder text if logo is not found */}
          {logo ? <img src={logo} alt={LogoPlaceholder} /> : LogoPlaceholder}
        </div>
        {/* For the collapsed view, show a short identifier (e.g., first letters) */}
        {isCollapsed && (
          <div >
            {<img src={logo} alt={LogoPlaceholder} />}
          </div>
        )}
      </div>

      {/* Navigation Links (Flex-grow to push log out to bottom) */}
      <nav className="flex flex-col flex-grow p-3 space-y-1">
        {navItems.map((item) => {
          const isCurrent = item.name === activeItem;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`
                                flex items-center p-3 rounded-lg transition duration-200 cursor-pointer relative
                                ${isCurrent
                  ? // ACTIVE STYLES
                  'bg-[#191636] text-purple-400 font-semibold'
                  : // INACTIVE STYLES
                  'text-gray-300 hover:bg-[#191636] hover:text-white'
                }
                                ${isCollapsed ? 'justify-center p-2' : ''} 
                            `}
              title={isCollapsed ? item.name : ''} // Show tooltip when collapsed
            >
              {/* Left Active Bar (Vertical line) */}
              {isCurrent && (
                <div className="absolute left-0 top-1 bottom-1 w-[4px] rounded-full bg-purple-500"></div>
              )}

              {/* Icon */}
              <img
                src={item.icon}
                alt={item.name}
                className={`w-7 h-7 mr-4 ${isCurrent && !isCollapsed ? 'ml-1' : ''} ${isCollapsed ? 'm-0 mr-0' : ''}`}
              />

              {/* Text: Hidden when collapsed */}
              <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                {item.name}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Log Out Section (Pushed to bottom) */}
      <div className={`p-3 border-t  border-gray-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          className={`
                        flex items-center p-3 rounded-lg  transition duration-200 cursor-pointer text-gray-400 hover:bg-[#da1b1b] hover:text-white w-full 
                        ${isCollapsed ? 'justify-center p-2 w-auto' : ''}
                    `}
          title={isCollapsed ? "Log Out" : ''}
        >
          <img
            src={LogOutIcon}
            alt="Log Out"
            className={`w-7 h-7 mr-4 ${isCollapsed ? 'm-0 mr-0' : ''}`}
          />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
};

export default TraineeSidebar;
