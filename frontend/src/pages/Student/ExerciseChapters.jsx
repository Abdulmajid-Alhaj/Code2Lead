import React from "react";
import { useParams, Link } from "react-router-dom";
import background from "../../assets/background.png";

export default function ExerciseCategory() {
  const { category } = useParams();

  // Example exercises (later can come from JSON or API)
  const allExercises = {
    html: [
      "Create a simple HTML page with a title and paragraph.",
      "Add an image and a link to your HTML page.",
      "Use a table to display data.",
    ],
    css: [
      "Center a div using Flexbox.",
      "Style a button with hover effects.",
      "Create a responsive grid layout.",
    ],
    js: [
      "Write a function to reverse a string.",
      "Filter even numbers from an array.",
      "Create a simple counter using DOM manipulation.",
    ],
    react: [
      "Build a simple counter component.",
      "Display a list of items using props.",
      "Handle form input using state.",
    ],
    "node js": [
      "Create a basic Express server.",
      "Set up a route that returns JSON data.",
      "Build a REST API endpoint.",
    ],
    mongodb: [
      "Insert multiple documents into a collection.",
      "Find all users older than 25.",
      "Update a document in a MongoDB collection.",
    ],
  };

  const exercises = allExercises[category.toLowerCase()] || [];

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center p-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full max-w-3xl bg-[#19173a]/60 backdrop-blur-md rounded-2xl border border-gray-500 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 capitalize">
          {category} Exercises
        </h1>

        {exercises.length > 0 ? (
          <ul className="space-y-4 list-disc list-inside text-gray-200">
            {exercises.map((ex, index) => (
              <li key={index} className="bg-[#22214a]/50 p-3 rounded-lg">
                {ex}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">
            No exercises available for this category yet.
          </p>
        )}

        <div className="text-center mt-8">
          <Link
            to="/exercises"
            className="text-gray-300 hover:text-white underline transition"
          >
            ← Back to All Exercises
          </Link>
        </div>
      </div>
    </div>
  );
}
