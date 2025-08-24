import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import UserAction from './redux/action/userAction'

/*Custom hook*/
import { useAuth, AuthProvider } from "./hooks/AuthContext";
import ProtectedRoute from "./hooks/ProtectedRoute";


/* Css*/
import "./assets/css/index.css";

/*App Routes*/
import AppIndex from "./AppIndex";
import Onboard from './pages/onboard'
import EditArticle from './pages/articles/EditArticle'

/* Public Pages */
import Login from "./pages/auth/login";
import VerifyLogin from "./pages/auth/verifylogin";

/*handler*/
import SubscriptionsHandler from './handlers/subscriptions/subscriptions'


const App = () => {

  const subscriptionsHandler = new SubscriptionsHandler()
  const dispatch = useDispatch()
  const store = useSelector(state => state)
  const { updateState } = new UserAction

  const checkSubscription = async () => {

    const userdetails = JSON.parse(localStorage.getItem('userdetails') || "{}")

    if (!Object.keys(userdetails).length) return

    let response = await subscriptionsHandler.get({})

    if (response.success) {

      dispatch(updateState({
        type: 'SET_SUBSCRIPTION',
        payload: {
          subscription: response.data
        }
      }))
    }
  }

  useEffect(() => {

    checkSubscription()
  }, [])

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
            <Route path="/get-started" element={<Onboard />} />
            <Route path="/article/:id*" element={<EditArticle />} />

          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
