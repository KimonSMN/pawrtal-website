import { useState } from "react";
import NewRecords from "../vetSections/NewRecords";
import OldRecords from "../vetSections/OldRecords";
import AddPet from "../vetSections/AddPet";

import BackArrow from "../../assets/back_arrow.png";
import NewPet from "../../assets/new_pet.png";
import Clinic from "../../assets/clinic.png";
import Pet_history from "../../assets/pet_history.png";

function Records({ onChangeMessage }) {
    const [view, setView] = useState<"dashboard" | "add_pet" | "new_record" | "old_records">(
        "dashboard",
    );

    const cards = [
        {
            id: 1,
            title: "Νεα Kαταχωρηση",
            image: NewPet,
            action: () => {
                setView("add_pet");
                onChangeMessage("disapear");
            },
            instructions: ["Προσθήκη κατοικιδίου στο σύστημα", "Δυνατοτητα Προσωρινής αποθήκευσης"],
        },
        {
            id: 2,
            title: "Καταγραφή Επίσκεψης",
            image: Clinic,
            action: () => {
                setView("new_record");
                onChangeMessage("disapear");
            },
            instructions: [
                "Καταγραφη λογου επίσκεψης ενος κατοικιδίου",
                "Προσθηκη της καταγραφης στο βιβλιαριο υγείας",
            ],
        },
        {
            id: 3,
            title: "Ιστορικό",
            image: Pet_history,
            action: () => {
                setView("old_records");
                onChangeMessage("disapear");
            },
            instructions: [
                "Προβολη ιστορικού επισκέψεων",
                "Δυνατότητα προβολής στοιχειων κατοικιδίου",
                "Δυνατότητα εκτύπωση του βιβλιάριου υγείας",
                "Αναζήτηση κατοικίδιων στο σύστημα",
            ],
        },
    ];

    return (
        <>
            {/* page load */}

            {view !== "dashboard" && (
                <div className="w-full px-12 py-4 items-left">
                    <button
                        onClick={() => {
                            setView("dashboard");
                            onChangeMessage("appear");
                        }}
                        className="flex flex-row items-center gap-0.5 text-gray-800 font-sm p-2 px-4 border rounded-xl  cursor-pointer hover:font-semibold "
                    >
                        <img src={BackArrow} alt={"<-"} className="w-4 h-4" />
                        Μενου Καταχωρήσεων
                    </button>
                </div>
            )}
            {view === "dashboard" && (
                <>
                    <h1 className="text-[#303030] w-full mb-8 px-4 sm:px-16 text-center text-3xl ">
                        Καλώς ήρθες ,
                        <br /> στις Καταχωρήσεις Κατοικίδιων
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
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
                                <div className="p-4 flex flex-col gap-2 items-center justify-center bg-white relative z-10">
                                    <h2 className="text-xl sm:text-2xl font-medium text-black text-center leading-tight">
                                        {card.title}
                                    </h2>
                                    {/* card instructions */}
                                    <ul className="text-sm text-gray-500 list-disc list-inside">
                                        {card.instructions?.map((instr, idx) => (
                                            <li key={idx}>{instr}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {view === "add_pet" && <AddPet />}
            {view === "new_record" && <NewRecords />}
            {view === "old_records" && <OldRecords />}
        </>
    );
}

export default Records;
