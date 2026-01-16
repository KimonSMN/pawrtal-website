import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { VetRoute } from "./auth/VetAuth";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./pages/Landing";
import Vet from "./pages/Vet";
import VetHome from "./pages/VetHome";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/vet" element={<Vet />} />
                        <Route
                            path="/vet/home"
                            element={
                                <VetRoute>
                                    <VetHome />
                                </VetRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
