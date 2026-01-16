import React from "react";
import PetCard from "../pets/PetCard";
import SearchBar from "../pets/SearchBar";
import FilterDropdown from "../pets/FilterDropdown";

function LostPetsSection() {
    return (
        <section className="pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-3xl font-bold text-start pb-10">ΑΠΟΛΕΣΘΕΝΤΑ ΚΑΤΟΙΚΙΔΙΑ</div>

                {/* Account CTA */}
                <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="font-semibold text-gray-900">
                            Θες να σχολιάσεις ή να δημοσιεύσεις αγγελία;
                        </div>
                        <div className="text-sm text-gray-700">
                            Συνδέσου ή δημιούργησε λογαριασμό.
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href="/auth"
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-100 transition"
                        >
                            Σύνδεση
                        </a>
                        <a
                            href="/auth"
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                        >
                            Εγγραφή
                        </a>
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                    <div className="flex-1 min-w-[240px]">
                        <SearchBar />
                    </div>

                    <div className="w-40">
                        <FilterDropdown />
                    </div>
                </div>

                {/* Cards */}
                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        gap-8
                    "
                >
                    <PetCard id="1" />
                    <PetCard id="2" />
                    <PetCard id="3" />
                    <PetCard id="4" />
                </div>
            </div>
        </section>
    );
}

export default LostPetsSection;
