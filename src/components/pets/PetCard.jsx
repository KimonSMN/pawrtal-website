import React from "react";
import dog_image from "../../assets/dog_1.jpg";

function PetCard() {
    return (
        <div
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
            <div className="p-5 flex flex-col text-start gap-1">
                <div className="text-xl font-semibold">Max</div>
                <div className="text-md text-gray-700">Test</div>
                <div className="text-gray-600">Location</div>
                <div className="text-gray-600">Εθεάθη 13/09/2024</div>
            </div>
        </div>
    );
}

export default PetCard;
