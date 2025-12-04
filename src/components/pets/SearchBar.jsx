import React from "react";

function SearchBar() {
    return (
        <div className="w-full bg-gray-200 rounded-2xl h-12 flex items-center px-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>

            <input
                type="text"
                placeholder="Αναζήτηση"
                className="bg-transparent outline-none ml-3 w-full placeholder-gray-500"
            />
        </div>
    );
}

export default SearchBar;
