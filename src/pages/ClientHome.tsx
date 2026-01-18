import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ClientHomeComponent from "../components/clientPages/Home";

function ClientHome() {
    return (
        <>
            <Navbar />
            <ClientHomeComponent />
            <Footer />
        </>
    );
}

export default ClientHome;