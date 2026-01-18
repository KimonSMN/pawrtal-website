import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "user" | "vet";

export type AuthUser = {
    id: string; // keep string because db.json ids are often strings (uuid-like)
    email: string;
    role: Role;
    name?: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_TOKEN = "pawrtal_token";
const LS_USER = "pawrtal_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);

    // Hydrate once on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(LS_TOKEN);
        const storedUser = localStorage.getItem(LS_USER);

        if (!storedToken || !storedUser) return;

        try {
            const parsed = JSON.parse(storedUser) as AuthUser;
            setToken(storedToken);
            setUser(parsed);
        } catch {
            localStorage.removeItem(LS_TOKEN);
            localStorage.removeItem(LS_USER);
            setToken(null);
            setUser(null);
        }
    }, []);

    const login = (nextToken: string, nextUser: AuthUser) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem(LS_TOKEN, nextToken);
        localStorage.setItem(LS_USER, JSON.stringify(nextUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_USER);
    };

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token && user),
            login,
            logout,
        }),
        [user, token],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
