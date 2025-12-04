import React from "react";
import PetCard from "../pets/PetCard";
import SearchBar from "../pets/SearchBar";
import FilterDropdown from "../pets/FilterDropdown";

function LostPetsSection() {
    return (
        <div className="pt-24 px-4">
            {/* Title */}
            <div className="text-3xl font-bold text-start pb-10">ΑΠΟΛΕΣΘΕΝΤΑ ΚΑΤΟΙΚΙΔΙΑ</div>

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
                <PetCard />
                <PetCard />
                <PetCard />
                <PetCard />
            </div>
        </div>
    );
}

export default LostPetsSection;
