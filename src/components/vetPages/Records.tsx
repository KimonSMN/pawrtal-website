import { useState } from "react";
import NewRecords from "../vetSections/NewRecords";
import OldRecords from "../vetSections/OldRecords";

import BackArrow from "../../assets/back_arrow.png";
import NewPet from "../../assets/new_pet.png";
import Pet_history from "../../assets/pet_history.png";

function Records({ onChangeMessage }) {
    const [view, setView] = useState<"dashboard" | "new_record" | "old_records">("dashboard");

    const cards = [
        {
            id: 1,
            title: "Νεα Kαταχωρηση",
            image: NewPet,
            action: () => {
                setView("new_record");
                onChangeMessage("disapear");
            },
        },
        {
            id: 2,
            title: "Ιστορικό",
            image: Pet_history,
            action: () => {
                setView("old_records");
                onChangeMessage("disapear");
            },
        },
    ];

    return (
        <>
            {/* page load */}

            {view !== "dashboard" && (
                <div className="w-full p-12 items-left">
                    <button
                        onClick={() => {
                            setView("dashboard");
                            onChangeMessage("appear");
                        }}
                        className="flex flex-row items-center gap-0.5 text-gray-800 font-sm px-2 border rounded-2xl"
                    >
                        <img src={BackArrow} alt={"<-"} className="w-4 h-4" />
                        Μενου Καταχωρήσεων
                    </button>
                </div>
            )}
            {view === "dashboard" && (
                <>
                    <div className="flex flex-col items-center w-full  mb-8 text-left">
                        <h1 className="text-[#303030] w-full mb-8 px-4 text-center text-3xl ">
                            Καλως Ηρθες στις Καταχωρήσεις Κατοικίδιων
                        </h1>
                        <p>Για καινουργια καταχωρηση πατα πανω στο κουμπί Νεα καταχωρηση</p>
                        <p>
                            Για την προβολη του Ιστορικου καταχωρησεων πατα πανω στο κουμπί Ιστορικό
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                onClick={card.action}
                                className="bg-white rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                            >
                                <div className="h-50 sm:h-55 overflow-hidden bg-gray-200 relative p-2">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full  object-contain scale-95  group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                                <div className="p-4 flex items-center justify-center bg-white relative z-10">
                                    <h2 className="text-xl sm:text-2xl font-medium text-black text-center leading-tight">
                                        {card.title}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {view === "new_record" && <NewRecords />}
            {view === "old_records" && <OldRecords />}
        </>
    );
}

export default Records;
