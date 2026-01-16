// FilterDropdown.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import arrow from "../../assets/down_arrow.png";

export default function FilterDropdown() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("Σκύλοι");
    const rootRef = useRef(null);

    const options = useMemo(() => {
        return ["Σκύλοι", "Γάτες", "Άλλο"].filter((o) => o !== selected);
    }, [selected]);

    // Close on outside click
    useEffect(() => {
        function onDown(e) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    // Close on Escape
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div ref={rootRef} className="relative w-full">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={[
                    "h-12 w-full",
                    "flex items-center justify-between px-4",
                    "rounded-2xl border border-black/15 bg-white/85 text-zinc-900",
                    "shadow-sm backdrop-blur",
                    "transition-[border-radius,background-color] hover:bg-white",
                    open ? "rounded-b-none" : "",
                ].join(" ")}
            >
                <span className="text-sm font-medium">{selected}</span>

                <img
                    alt=""
                    src={arrow}
                    className={[
                        "h-5 w-5 opacity-70 transition-transform duration-200",
                        open ? "rotate-180" : "",
                    ].join(" ")}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 right-0 z-20 overflow-hidden rounded-b-2xl border border-black/10 border-t-0 bg-white/90 shadow-sm backdrop-blur">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                setSelected(option);
                                setOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-100"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
