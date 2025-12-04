import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Features from "../components/sections/Features";
import CTA from "../components/sections/CTA";
import LostPetsSection from "../components/sections/LostPetsSection";

function Landing() {
    return (
        <>
            <Navbar />
            <Hero />
            <LostPetsSection />
            <Footer />
        </>
    );
}

export default Landing;
