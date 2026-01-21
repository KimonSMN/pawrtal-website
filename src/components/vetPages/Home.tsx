import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import Appointments from "./Appointments";
import Records from "./Records";

import profileImg from "../../assets/account.png";
import vetImg from "../../assets/Vets.webp";
import healthBookImg from "../../assets/dog_1.jpg";
import BackArrow from "../../assets/back_arrow.png";
import { VetHomeView } from "../../pages/VetHome";

function Home({ view: initialView = "dashboard" }: { view?: VetHomeView }) {
    const storedUser = localStorage.getItem("pawrtal_user");
    const userName = storedUser ? JSON.parse(storedUser).name : null;
    const [message, setMessage] = useState("appear");
    const [view, setView] = useState<VetHomeView>(initialView);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    const cards = [
        {
            id: 1,
            title: "Λογαριασμός",
            image: profileImg,
            action: () => setView("profile"),
            instructions: [
                "Προβολη και επεξεργ/σια των προσωπικών σας στοιχειών",
                "Δείτε τις αξιολογήσεις σας",
            ],
        },
        {
            id: 2,
            title: "Ραντεβού",
            image: vetImg,
            action: () => {
                setView("appointments");
            },
            instructions: [
                "Δείτε τα προγραμματισμένα ραντεβού",
                "Δειτε τα νέα αιτηματα για ραντεβού",
                "Κάντε αποδοχή ή απόρριψη των νεων αιτημάτων",
                "Δείτε το ιστορικό προγρ/μενων ραντεβού",
            ],
        },
        {
            id: 3,
            title: "Καταχωρήσεις",
            image: healthBookImg,
            action: () => {
                setView("records");
            },
            instructions: [
                "Προσθήκη κατοικιδίου στο σύστημα",
                "Καταγραφη επίσκεψης",
                "Προβολή ιστορικού επισκέψεων",
            ],
        },
    ];

    const breadcrumbMap: Record<typeof view, string> = {
        profile: "Λογαριασμός",
        appointments: "Ραντεβού",
        records: "Καταχωρήσεις",
    };

    return (
        <div className="flex flex-col justify-center  items-center m-auto mt-20 mb-25">
            <div className="w-full text-left mx-10 mb-4 px-12">
                <nav className="text-sm text-gray-500 flex items-center gap-2">
                    <Link to="/" className="hover:text-black hover:underline transition-all">
                        Αρχική
                    </Link>
                    <span>&gt;</span>
                    <button
                        onClick={() => setView("dashboard")}
                        className="hover:text-black  hover:underline transition"
                    >
                        Κτηνίατρος
                    </button>
                    {view !== "dashboard" && (
                        <>
                            <span>&gt;</span>
                            <button
                                onClick={() => setView(view)}
                                className="text-gray-800 font-medium hover:underline"
                            >
                                {breadcrumbMap[view]}
                            </button>
                        </>
                    )}
                    <span> &gt;</span>
                </nav>
            </div>
            {/* page load */}

            {message === "appear" && view !== "dashboard" && (
                <div className="w-full pl-12 p-4 items-left">
                    <button
                        onClick={() => setView("dashboard")}
                        className="flex flex-row items-center gap-0.5 text-gray-800 font-sm p-2 px-4 border rounded-2xl"
                    >
                        <img src={BackArrow} alt={"<-"} className="w-4 h-4" />
                        Aρχική Κτηνίατρου
                    </button>
                </div>
            )}
            {view === "dashboard" && (
                <>
                    <div className="flex flex-col items-center w-full  mb-8 text-left">
                        <h1 className="text-[#303030] mb-4 text-3xl ">Καλως ήρθες</h1>
                        <div className="flex flex-row items-center mb-4 gap-6 ">
                            <h2 className="text-4xl text-gray-600">{userName}</h2>
                        </div>
                        <h2 className="text-xl text-gray-600 max-w-sm px-2 ">
                            Διαλέξτε την επόμενη ενέργεια για να συνεχίσετε
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                onClick={card.action}
                                className="bg-white rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                            >
                                {/* card image */}
                                <div className="h-50 sm:h-55 overflow-hidden bg-gray-200 relative">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                                <div className="p-4 flex flex-col gap-2 items-center justify-center bg-white relative z-10">
                                    {/* card title */}
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

            {view === "profile" && <Profile />}
            {view === "appointments" && <Appointments />}
            {view === "records" && <Records onChangeMessage={setMessage} />}
        </div>
    );
}

export default Home;
