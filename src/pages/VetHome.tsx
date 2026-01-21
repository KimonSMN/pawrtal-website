import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../components/vetPages/Home";
import { useLocation } from "react-router-dom";

export type VetHomeView = "dashboard" | "profile" | "appointments" | "records";

function VetHome() {
    const location = useLocation();

    const viewFromNav = (location.state as { view?: VetHomeView })?.view;

    return (
        <>
            <Navbar />
            <Home view={viewFromNav} />
            <Footer />
        </>
    );
}

export default VetHome;
