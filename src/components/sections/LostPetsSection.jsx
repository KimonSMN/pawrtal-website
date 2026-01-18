import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PetCard from "../pets/PetCard";
import SearchBar from "../pets/SearchBar";
import { useAuth } from "../auth/AuthProvider";

const API = "http://localhost:3001";

async function asJson(res) {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
}

// Normalize a String
function normalize(s) {
    return (s ?? "").toString().trim().toLowerCase();
}

// Check if pet matches search query
function matchesQuery(pet, q) {
    if (!q) return true;
    const hay = [pet.name, pet.breed, pet.species, pet.location, pet.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return hay.includes(q);
}

export default function LostPetsSection() {
    const [query, setQuery] = useState("");
    const [species, setSpecies] = useState("all"); // all | dog | cat | other

    const { isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await asJson(await fetch(`${API}/pets`)); // fetch lost pets
                if (!cancelled) setPets(Array.isArray(data) ? data : []); // set pets array
            } catch (e) {
                if (!cancelled) setError(e?.message ?? "Αποτυχία φόρτωσης αγγελιών.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const q = useMemo(() => normalize(query), [query]); // normalized search query, for filtering pets by search

    // Filtered pets based on search query and species
    const filteredPets = useMemo(() => {
        return pets
            .filter((p) => matchesQuery(p, q))
            .filter((p) => {
                if (species === "all") return true;
                return normalize(p.species) === species;
            });
    }, [pets, q, species]);

    return (
        <section className="h-screen pt-24">
            <div className="mx-auto flex h-full max-w-7xl flex-col px-8">
                {/* Title */}
                <div className="text-start">
                    <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-900">
                        ΑΠΟΛΕΣΘΕΝΤΑ ΚΑΤΟΙΚΙΔΙΑ
                    </h1>
                </div>

                {/* Account CTA (hidden when logged in) */}
                {!isAuthenticated && (
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
                                <Link
                                    to="/auth"
                                    className={[
                                        "rounded-xl border border-black/15 bg-white px-4 py-2.5",
                                        "text-sm font-medium text-zinc-900",
                                        "transition-colors hover:bg-zinc-50",
                                    ].join(" ")}
                                >
                                    Σύνδεση
                                </Link>
                                <Link
                                    to="/auth"
                                    className={[
                                        "rounded-xl bg-black px-4 py-2.5",
                                        "text-sm font-medium text-white",
                                        "transition-colors hover:bg-zinc-900",
                                    ].join(" ")}
                                >
                                    Εγγραφή
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search + Filter */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="min-w-[240px] flex-1">
                        <SearchBar value={query} onChange={setQuery} />
                    </div>

                    <div className="w-44">
                        <select
                            className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                        >
                            <option value="all">Όλα</option>
                            <option value="dog">Σκύλος</option>
                            <option value="cat">Γάτα</option>
                            <option value="other">Άλλο</option>
                        </select>
                    </div>
                </div>

                {/* Cards */}
                <div className="min-h-0 flex-1 overflow-y-auto pb-8 pr-2 mb-24 overflow-x-hidden">
                    {loading ? (
                        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                            Φόρτωση…
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700">
                            {error}
                            <div className="mt-2 text-xs text-red-700/80">
                                Έλεγξε ότι τρέχει το JSON Server στο <b>{API}</b> και ότι υπάρχει
                                collection <b>pets</b>.
                            </div>
                        </div>
                    ) : filteredPets.length === 0 ? ( // if no pets found
                        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                            Δεν βρέθηκαν αγγελίες.
                        </div>
                    ) : (
                        // if pets found
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {filteredPets.map((pet) => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
