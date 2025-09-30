import React from "react";
import Chevron from "../components/Chevron";
import html from '../assets/html.png';
import css from '../assets/css.png';
import js from '../assets/js.png';
import react from '../assets/react.png';
import node from '../assets/node.png';
import mongo from '../assets/mongo.png';


export default function Exercises() {
const items = [
    { name: "HTML", img: html },
    { name: "CSS", img: css },
    { name: "JS", img: js },
    { name: "React", img: react },
    { name: "Node Js", img: node },
    { name: "MongoDB", img: mongo },
];

  return (
    <div className="relative min-h-screen bg-[#0a0b1e] text-white flex items-center justify-center">
      {/* Background Circles */}
      <div className="absolute top-10 right-1/3 w-72 h-72 rounded-full bg-gradient-to-b from-purple-700/80 to-transparent blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-gradient-to-b from-purple-700/80 to-transparent blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-52 h-52 rounded-full bg-gradient-to-b from-indigo-700/80 to-transparent blur-3xl"></div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-16">
        {items.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center space-x-6">
              {/* Left Chevron */}
              <Chevron direction="left" className="w-16 h-16" />

              {/* Icon */}
              <img src={item.img} alt={item.name} className="w-24 h-24" />

              {/* Right Chevron */}
              <Chevron direction="right" className="w-16 h-16" />
            </div>
            <span className="mt-3 text-lg">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


