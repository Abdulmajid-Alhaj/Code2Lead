import React from "react";
import Chevron from "../../../components/Chevron";
import html from "../../../assets/html.png";
import css from "../../../assets/css.png";
import js from "../../../assets/js.png";
import react from "../../../assets/react.png";
import node from "../../../assets/node.png";
import mongo from "../../../assets/mongo.png";
import { useNavigate } from "react-router-dom";

export default function Exercises() {
  const items = [
    { name: "HTML", img: html },
    { name: "CSS", img: css },
    { name: "JS", img: js },
    { name: "React", img: react },
    { name: "Node Js", img: node },
    { name: "MongoDB", img: mongo },
  ];

  // Placeholder for handling card click
  const handleCardClick = (item) => {
    const navigate = useNavigate();

    const handleCardClick = (item) => {
      navigate(`/exercises/${item.name.toLowerCase()}`);
    };
  };

  return (
    <div className="relative min-h-screen  text-white flex items-center justify-center px-2">
      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 w-full max-w-5xl">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleCardClick(item)}
          >
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-2.5">
              {/* Left Chevron */}
              <Chevron
                direction="left"
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
              />

              {/* Icon and Header */}
              <div className="flex flex-col items-center">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-2"
                />
                <span className="text-base sm:text-lg">{item.name}</span>
              </div>

              {/* Right Chevron */}
              <Chevron
                direction="right"
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
