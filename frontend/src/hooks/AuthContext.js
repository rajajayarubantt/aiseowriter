import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("access_token") != null);
    const [OnboardCompleted, setOnboardCompleted] = useState(false);

    const navigate = useNavigate();

    const login = (access_token, userdetails) => {

        const UserDetails = JSON.parse(userdetails)

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("userdetails", userdetails);
        localStorage.removeItem("login-email");
        setIsAuthenticated(true);
        setOnboardCompleted(UserDetails.onboarding_status == '1')

        if (!UserDetails.onboarding_status) return navigate("/get-started")
        else return navigate("/")

    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("userdetails");
        setIsAuthenticated(false);
        navigate("/login");
    };

    useEffect(() => {
        const UserDetails = JSON.parse(localStorage.getItem("userdetails"))

        let onboardCompleted = UserDetails && UserDetails.onboarding_status == '1'

        setOnboardCompleted(onboardCompleted)

        if (isAuthenticated && !onboardCompleted) navigate("/get-started")

    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, OnboardCompleted, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
