import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Trainee from "../layouts/traineeLayout";
import Exercises from "../pages/Student/Exersices";
import Login from "../pages/Public/Login";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Login page with its own design */}
        <Route path="/login" element={<Login />} />

        {/* Student pages with shared background */}
        <Route
          path="/student/exercises"
          element={
            <Trainee>
              <Exercises />
            </Trainee>
          }
        />

        {/* Add more routes/layouts as needed */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
