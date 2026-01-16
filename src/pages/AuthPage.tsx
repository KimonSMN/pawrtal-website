import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Auth from "../components/auth/Auth";

export default function AuthPage() {
    return (
        <>
            <Navbar />
            <Auth />
            <Footer />
        </>
    );
}
