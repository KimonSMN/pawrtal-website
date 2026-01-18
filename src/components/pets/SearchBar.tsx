// SearchBar.jsx
import React from "react";

export default function SearchBar({
    defaultValue = "",
    onChange,
    placeholder = "Αναζήτηση",
    className = "",
}) {
    return (
        <div
            className={[
                "h-12 w-full",
                "flex items-center gap-3 px-4",
                "rounded-2xl border border-black/15 bg-white/85",
                "shadow-sm backdrop-blur",
                "transition-[box-shadow,border-color,background-color]",
                "focus-within:ring-2 focus-within:ring-black/10 focus-within:border-black/25",
                "hover:bg-white",
                className,
            ].join(" ")}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>

            <input
                defaultValue={defaultValue}
                onChange={(e) => onChange?.(e.target.value)}
                type="text"
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
            />
        </div>
    );
}
