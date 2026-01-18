import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import About from "../components/sections/About";

import LostPetsSection from "../components/sections/LostPetsSection";

function Landing() {
    return (
        <>
            <Navbar />
            <LostPetsSection />
            <Footer />
        </>
    );
}

export default Landing;
