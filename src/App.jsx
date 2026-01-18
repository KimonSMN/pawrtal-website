import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
// import { AuthProvider } from "./auth/AuthContext";
import { VetRoute } from "./auth/VetAuth";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./pages/Landing";
import Vet from "./pages/Vet";
import VetHome from "./pages/VetHome";
import ClientHome from "./pages/ClientHome";
import OpenPet from "./pages/OpenPet";
import FoundPetReport from "./pages/FoundPetReport";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./components/auth/AuthProvider";
import Profile from "./pages/Profile";
import MyPetsPage from "./pages/MyPetsPage";
import Notifications from "./pages/Notifications";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    // user
                    <Route path="/" element={<Landing />} />
                    <Route path="/pets/:id" element={<OpenPet />} />
                    <Route path="/pets/:id/found" element={<FoundPetReport />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/mypets" element={<MyPetsPage />} />
                    <Route path="/notifications" element={<Notifications />} />
                    // vet
                    <Route path="/vet" element={<Vet />} />
                    <Route
                        path="/vet/home"
                        element={
                            <VetRoute>
                                <VetHome />
                            </VetRoute>
                        }
                    />
                    <Route path="/client/home" element={<ClientHome />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
