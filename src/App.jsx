import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./pages/Landing";
import Vet from "./pages/Vet";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/vet" element={<Vet />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
