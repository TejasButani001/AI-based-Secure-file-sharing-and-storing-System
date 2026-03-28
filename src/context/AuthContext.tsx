import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "admin" | "user";

interface User {
    name: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    login: (name: string, role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Initial check for token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const base64Url = token.split('.')[1];
            if (base64Url) {
                try {
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const payload = JSON.parse(jsonPayload);
                    
                    // Check token expiration
                    const currentTime = Math.floor(Date.now() / 1000);
                    if (payload.exp && payload.exp < currentTime) {
                        console.warn("Session expired. Logging out.");
                        localStorage.removeItem("token");
                        setUser(null);
                    } else {
                        setUser({ name: payload.email || "User", role: payload.role || "user" });
                    }
                } catch (e) {
                    console.error("Failed to decode token", e);
                    localStorage.removeItem("token");
                }
            }
        }
    }, []);

    // Listen for global unauthorized events
    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = (name: string, role: UserRole) => {
        setUser({ name, role });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
