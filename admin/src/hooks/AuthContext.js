import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("access_token") != null);

    const navigate = useNavigate();

    const login = (access_token, userdetails) => {

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("userdetails", JSON.stringify(userdetails));
        localStorage.removeItem("login-email");
        setIsAuthenticated(true);

        return navigate("/")

    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("userdetails");
        setIsAuthenticated(false);
        navigate("/login");
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
