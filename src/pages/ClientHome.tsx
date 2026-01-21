import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ClientHomeComponent from "../components/clientPages/Home";
import { useLocation } from "react-router-dom";

export type HomeView = "dashboard" | "healthbook" | "appointments" | "declarations";

function ClientHome() {
    const location = useLocation();

    const viewFromNav = (location.state as { view?: HomeView })?.view;

    return (
        <>
            <Navbar />
            <ClientHomeComponent view={viewFromNav} />
            <Footer />
        </>
    );
}

export default ClientHome;
