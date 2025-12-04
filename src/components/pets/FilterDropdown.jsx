import React, { useState } from "react";
import arrow from "../../assets/down_arrow.png";

export default function FilterDropdown() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("Σκύλοι");

    const options = ["Σκύλοι", "Γάτες", "Άλλο"].filter((o) => o !== selected);

    return (
        <div className="relative w-40">
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className={`cursor-pointer w-full bg-gray-200 h-12 flex items-center justify-between px-4 
                           rounded-2xl transition ${open ? "rounded-b-none" : ""}`}
            >
                <span>{selected}</span>

                <img
                    src={arrow}
                    className={`h-5 w-5 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 right-0 bg-gray-200 rounded-b-2xl shadow-md overflow-hidden z-20">
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => {
                                setSelected(option);
                                setOpen(false);
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-300 transition"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
