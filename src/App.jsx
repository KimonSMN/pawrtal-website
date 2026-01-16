import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
import OpenPet from "./pages/OpenPet";
import FoundPetReport from "./pages/FoundPetReport";
import Auth from "./pages/Auth";

function App() {
    const [count, setCount] = useState(0);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/pets/:id" element={<OpenPet />} />
                <Route path="/pets/:id/found" element={<FoundPetReport />} />

                <Route path="/auth" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
