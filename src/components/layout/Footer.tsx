import React from "react";

const Footer = () => {
    return (
        <footer className="w-full bottom-0 left-0 fixed py-8 bg-gray-100 mt-20">
            <div className="mx-auto text-center text-gray-600">
                <p className="text-sm">
                    © {new Date().getFullYear()} Pawrtal. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
