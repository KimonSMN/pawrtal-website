import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Features from "../components/sections/Features";
import CTA from "../components/sections/CTA";

function Landing() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <CTA />
            <Footer />
        </>
    );
}

export default Landing;
