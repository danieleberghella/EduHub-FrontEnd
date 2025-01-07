import IUser from "@/interfaces/User";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAlert } from "@/contexts/AlertContext";

const API_URL = import.meta.env.VITE_API_URL;

interface IAuthContextProps {
    user?: IUser;
    setAsLogged: (token: string) => void;
    logout: () => void;
    userPath: "admin" | "student" | "teacher";
}

const AuthContext = createContext<IAuthContextProps | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser>();
    const [userPath, setUserPath] = useState<"admin" | "student" | "teacher">();
    const [loading, setLoading] = useState(true);
    const firstLogin = localStorage.getItem("isLogin") !== "true";
    const [isLogin, setIsLogin] = useState(firstLogin);
    const { showAlert, hideAlert } = useAlert();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");

        if (!token) {
            if (location.pathname !== "/auth/signup" && location.pathname !== "/") {
                navigate("/auth/login");
            }
            setLoading(false);
            return;
        }

        getUser(token).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (user && userPath && isLogin) {
            localStorage.setItem("isLogin", "true")
            navigate(`/${userPath}`);
        }
    }, [userPath]);



    const getUserIdFromToken = (token: string): string | null => {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.sub || null;
        } catch (err) {
            return null;
        }
    };

    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            if (!decoded.exp) return false;
            const now = Date.now() / 1000;
            return decoded.exp < now;
        } catch (err) {
            return true;
        }
    };

    const notifyTokenExpiration = (timeUntilExpiration: number) => {
        setTimeout(() => {
            showAlert("Your session is about to expire", "Please log in again", "destructive");
        }, timeUntilExpiration - 60000);
    };

    const setupAutoLogout = (token: string, logout: () => void) => {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp) {
            const expirationTime = decoded.exp * 1000;
            const now = Date.now();
            const timeUntilExpiration = expirationTime - now;

            if (timeUntilExpiration > 0) {
                notifyTokenExpiration(timeUntilExpiration);
                setTimeout(() => {
                    logout();
                    hideAlert();
                }, timeUntilExpiration);
            } else {
                logout();
            }
        }
    };

    const getUser = async (token: string) => {
        const userId = getUserIdFromToken(token);

        if (token && userId) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            try {
                const { data: authUser } = await axios.get(`${API_URL}/users/${userId}`, {
                    headers: { "Content-Type": "text/plain" },
                });
                setUser(authUser);

                switch (authUser?.role) {
                    case "STUDENT":
                        await setUserPath("student");
                        break;
                    case "TEACHER":
                        await setUserPath("teacher");
                        break;
                    case "REGISTRATION":
                        showAlert(
                            "Login Not Allowed!",
                            "Your account is under review",
                            "destructive",
                            10000
                        );
                        logout();
                        break;
                    default:
                        await setUserPath("admin");
                        break;
                }
            } catch (err) {
                navigate("/auth/login");
            }
        } else {
            navigate("/auth/login");
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(undefined);
        setUserPath(undefined);
        navigate("/");
    };

    const setAsLogged = async (token: string) => {
        localStorage.setItem("ACCESS_TOKEN", token);
        setIsLogin(true)
        if (isTokenExpired(token)) {
            logout();
        } else {
            setupAutoLogout(token, logout);
        }
        await getUser(token);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setAsLogged, logout, userPath: userPath || "admin" }}>
            {children}
        </AuthContext.Provider>
    );
};
