import React, { useState } from "react";
import PetCard from "../pets/PetCard";
import SearchBar from "../pets/SearchBar";
import FilterDropdown from "../pets/FilterDropdown";

export default function LostPetsSection() {
    const [query, setQuery] = useState("");

    return (
        <section className="h-screen pt-24">
            <div className="mx-auto flex h-full max-w-7xl flex-col px-8">
                {/* Title */}
                <div className="pb-4 text-start">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                        ΑΠΟΛΕΣΘΕΝΤΑ ΚΑΤΟΙΚΙΔΙΑ
                    </h1>
                </div>

                {/* Account CTA */}
                <div className="mb-8 rounded-2xl border border-black/10 bg-white/85 p-5 shadow-sm backdrop-blur">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="font-semibold text-zinc-900">
                                Θες να σχολιάσεις ή να δημοσιεύσεις αγγελία;
                            </div>
                            <div className="text-sm text-zinc-600">
                                Συνδέσου ή δημιούργησε λογαριασμό.
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <a
                                href="/auth"
                                className={[
                                    "rounded-xl border border-black/15 bg-white px-4 py-2.5",
                                    "text-sm font-medium text-zinc-900",
                                    "transition-colors hover:bg-zinc-50",
                                ].join(" ")}
                            >
                                Σύνδεση
                            </a>
                            <a
                                href="/auth"
                                className={[
                                    "rounded-xl bg-black px-4 py-2.5",
                                    "text-sm font-medium text-white",
                                    "transition-colors hover:bg-zinc-900",
                                ].join(" ")}
                            >
                                Εγγραφή
                            </a>
                        </div>
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="min-w-[240px] flex-1">
                        <SearchBar value={query} onChange={setQuery} />
                    </div>

                    <div className="w-40">
                        <FilterDropdown />
                    </div>
                </div>

                {/* Cards */}
                <div className="min-h-0 flex-1 overflow-y-auto pb-8 p-4 pr-2 mb-24 scrollbar-zinc overflow-x-hidden">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <PetCard id="1" />
                        <PetCard id="2" />
                        <PetCard id="3" />
                        <PetCard id="4" />
                        <PetCard id="5" />
                        <PetCard id="6" />
                        <PetCard id="7" />
                        <PetCard id="8" />
                        <PetCard id="9" />
                        <PetCard id="10" />
                        <PetCard id="11" />
                        <PetCard id="12" />
                        <PetCard id="13" />
                        <PetCard id="14" />
                        <PetCard id="15" />
                        <PetCard id="16" />
                    </div>
                </div>
            </div>
        </section>
    );
}
