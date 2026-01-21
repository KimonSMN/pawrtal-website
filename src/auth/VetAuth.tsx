import { Navigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

export const VetRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuth();

    if (!user || user.role !== "vet") {
        return <Navigate to="/vet" />; // redirect if unauthorized
    }

    return children;
};
