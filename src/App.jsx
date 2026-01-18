import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
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
                    <Route path="/" element={<Landing />} />
                    <Route path="/pets/:id" element={<OpenPet />} />
                    <Route path="/pets/:id/found" element={<FoundPetReport />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/mypets" element={<MyPetsPage />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
