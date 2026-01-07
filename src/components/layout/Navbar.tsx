import React from "react";
import logo from "../../assets/pawrtal_logo.png";
import profile from "../../assets/profile.png";

function Navbar() {
    return (
        <header className="w-full py-3 border-b-2 border-gray-300 bg-gray-100 top-0 left-0 fixed z-10">
            <div className="px-4 flex justify-between items-center">
                {/* Logo & Pawrtal text */}
                <a href="/">
                    <div className="flex items-center gap-3 hover:cursor-pointer">
                        <img className="h-7" src={logo} alt="Pawrtal logo" />
                        <div className="text-xl font-medium">Pawrtal</div>
                    </div>
                </a>

                {/* Navigation */}
                <nav className="flex items-center space-x-6 font-medium">
                    <a href="#information" className="hover:text-gray-500">
                        Πληροφορίες
                    </a>
                    <a href="#contact" className="hover:text-gray-500">
                        Επικοινωνία
                    </a>
                    <img className="h-6 w-6 object-contain" src={profile} alt="Profile icon" />
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
