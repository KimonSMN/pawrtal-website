import React from "react";
import { useNavigate } from "react-router-dom";
import dog_image from "../../assets/dog_1.jpg";

function PetCard({ id }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/pets/${id}`)}
            className="
                w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 
                flex flex-col cursor-pointer 
                transition-transform duration-300 ease-out 
                hover:scale-105
            "
        >
            {/* Image section */}
            <div className="h-60 w-full">
                <img src={dog_image} alt="Pet" className="w-full h-full object-cover" />
            </div>

            {/* Text */}
            <div className="p-5 text-start">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-lg font-semibold tracking-tight text-zinc-900">
                            Max
                        </div>
                        <div className="mt-1 text-sm text-zinc-600">Test</div>
                    </div>

                    <div className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        Σκύλος
                    </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-zinc-600">
                    <div>Location</div>
                    <div>Εθεάθη 13/09/2024</div>
                </div>
            </div>
        </div>
    );
}

export default PetCard;
