import React from "react";
import { useNavigate } from "react-router-dom";
// import fallbackImg from "../../assets/dog_1.jpg";

function speciesLabel(species) {
    const s = (species || "").toLowerCase();
    if (s === "dog") return "Σκύλος";
    if (s === "cat") return "Γάτα";
    return "Άλλο";
}

function formatDate(iso) {
    if (!iso) return "";
    // expects YYYY-MM-DD
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
}

function PetCard({ pet }) {
    const navigate = useNavigate();

    const imgSrc = pet?.photo;

    return (
        <div
            onClick={() => navigate(`/pets/${pet.id}`)}
            className="
        w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 
        flex flex-col cursor-pointer 
        transition-transform duration-300 ease-out 
        hover:scale-105
      "
        >
            {/* Image section */}
            <div className="h-60 w-full bg-zinc-100">
                <img src={imgSrc} alt={pet?.name || "Pet"} className="w-full h-full object-cover" />
            </div>

            {/* Text */}
            <div className="p-5 text-start">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-lg font-semibold tracking-tight text-zinc-900 truncate">
                            {pet?.name || "Χωρίς όνομα"}
                        </div>
                        <div className="mt-1 text-sm text-zinc-600 truncate">
                            {pet?.breed || "—"}
                        </div>
                    </div>

                    <div className="shrink-0 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {speciesLabel(pet?.species)}
                    </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-zinc-600">
                    <div className="truncate">{pet?.location || "—"}</div>
                    <div>{pet?.lastSeenDate ? `Εθεάθη ${formatDate(pet.lastSeenDate)}` : "—"}</div>
                </div>
            </div>
        </div>
    );
}

export default PetCard;
