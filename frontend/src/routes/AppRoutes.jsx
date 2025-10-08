import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Trainee, } from "../layouts/traineeLayout";
import Exercises from "../pages/Student/Exersices";
import Login from "../pages/Public/Login";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/student/exercises"
          element={
            <Trainee>
              <Exercises />
            </Trainee>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
