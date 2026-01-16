import { createContext, useContext, useState } from "react";

// User object
type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

// function for storing info
type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // setUser parses data to local storage
    const [user, setUser] = useState<User | null>(
        JSON.parse(localStorage.getItem("user") || "null"),
    );

    // store User
    const login = (user: User) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    // Remove user
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext)!;
