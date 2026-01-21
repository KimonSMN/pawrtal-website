import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
import { VetRoute } from "./auth/VetAuth";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./pages/Landing";
import VetHome from "./pages/VetHome";
import ClientHome from "./pages/ClientHome";
import OpenPet from "./pages/OpenPet";
import FoundPetReport from "./pages/FoundPetReport";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./components/auth/AuthProvider";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import MyPetsPage from "./pages/MyPetsPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/pets/:id" element={<OpenPet />} />
                    <Route path="/pets/:id/found" element={<FoundPetReport />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/mypets" element={<MyPetsPage />} />

                    {/* vet */}
                    <Route path="/vet" element={<VetHome />} />
                    <Route path="/client/home" element={<ClientHome />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
