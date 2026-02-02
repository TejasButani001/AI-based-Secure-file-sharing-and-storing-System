import { createContext, useContext, useState, ReactNode } from "react";

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
    useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // In a real app, you'd validate the token with the backend here
            // For now, we'll just assume specific admin/user based on some decoding or just persistent state
            // But strict decoding is unsafe on client without verification. 
            // Let's just keep simple state for now, assuming user re-logs in or we decoded it.
            // Simplified: If token exists, we set a default user to keep them logged in (or decode if possible)
            const base64Url = token.split('.')[1];
            if (base64Url) {
                try {
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const payload = JSON.parse(jsonPayload);
                    setUser({ name: payload.email || "User", role: payload.role || "user" });
                } catch (e) {
                    console.error("Failed to decode token", e);
                    localStorage.removeItem("token");
                }
            }
        }
    });

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
