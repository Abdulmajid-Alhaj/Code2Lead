import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Trainee } from "../layouts/traineeLayout";
import Exercises from "../pages/Student/Exersices";
import Login from "../pages/Public/Login";
import ForgotPassword from "../pages/Public/ForgetPassword";
import OTP from "../pages/Public/OTP";


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/otp" element={<OTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
