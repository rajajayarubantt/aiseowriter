import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

/* Redux Setup*/
import { useSelector } from "react-redux";

/*Custom hook*/
import { useAuth, AuthProvider } from "./hooks/AuthContext";
import ProtectedRoute from "./hooks/ProtectedRoute";


/* Css*/
import "./assets/css/index.css";

/*App Routes*/
import AppIndex from "./AppIndex";
import EditArticle from './pages/articles/EditArticle'

/* Public Pages */
import Login from "./pages/auth/login";
import VerifyLogin from "./pages/auth/verifylogin";

const App = () => {

  return (
    <AuthProvider>
      <div className="main-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login type="signup" />} />
          <Route path="/verify-login" element={<VerifyLogin />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppIndex />} />
            <Route path="/article/:id*" element={<EditArticle />} />

          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
