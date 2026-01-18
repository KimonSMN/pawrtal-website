import { useState } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import Appointments from "./Appointments";
import Records from "./Records";

import profileImg from "../../assets/account.png";
import vetImg from "../../assets/Vets.webp";
import healthBookImg from "../../assets/dog_1.jpg";

function Home() {
    //const [mode, setMode] = useState<"profile" | "appointments" | "records">("profile");
    const storedUser = localStorage.getItem("user");
    const userName = storedUser ? JSON.parse(storedUser).name : null;
    const [view, setView] = useState<"dashboard" | "profile" | "appointments" | "records">(
        "dashboard",
    );

    const cards = [
        {
            id: 1,
            title: "Λογαριασμός",
            image: profileImg,
            action: () => setView("profile"),
        },
        {
            id: 2,
            title: "Ραντεβού",
            image: vetImg,
            action: () => {
                setView("appointments");
            },
        },
        {
            id: 3,
            title: "Καταγραφές",
            image: healthBookImg,
            action: () => {
                setView("records");
            },
        },
    ];

    const breadcrumbMap: Record<typeof view, string> = {
        profile: "Λογαριασμός",
        appointments: "Ραντεβού",
        records: "Καταγραφές",
    };

    return (
        <div className="flex flex-col justify-center  items-center m-auto mt-10 mb-20">
            <div className="w-full text-left mx-10 mb-8 px-12">
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
            {view === "dashboard" && (
                <>
                    <div className="flex flex-col items-center w-full mx-10 mb-8 px-12">
                        <h1 className="text-[#303030] w-full mb-4 text-left text-3xl ">
                            Καλως ήρθες
                        </h1>
                        <div className="flex flex-row items-start mb-4 gap-6 w-full">
                            <h2 className="text-4xl text-left  text-gray-600  ">{userName} </h2>
                        </div>
                        <h2 className="text-xl text-left  text-gray-600 w-full">
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
                                <div className="h-[200px] sm:h-[220px] overflow-hidden bg-gray-200 relative">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                                <div className="p-4 h-[90px] flex items-center justify-center bg-white relative z-10">
                                    <h2 className="text-xl sm:text-2xl font-medium text-black text-center leading-tight">
                                        {card.title}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {view === "profile" && <Profile />}
            {view === "appointments" && <Appointments />}
            {view === "records" && <Records />}
        </div>
    );
}

export default Home;

/*

            <div className={styles.vet_bar}>
                <div className={styles.vet_bar_toggle}>
                    <div className={`${styles.slider} ${styles[mode]}`} />
                    <button
                        className={mode === "profile" ? styles.active : ""}
                        onClick={() => setMode("profile")}
                    >
                        To profile μου
                    </button>
                    <button
                        className={mode === "appointments" ? styles.active : ""}
                        onClick={() => setMode("appointments")}
                    >
                        Τα ραντεβού μου
                    </button>
                    <button
                        className={mode === "records" ? styles.active : ""}
                        onClick={() => setMode("records")}
                    >
                        Καταγραφες
                    </button>
                </div>
            </div>

            <div
                className="
                flex-1 bg-transparent p-8
            "
            >
                <div className="flex flex-col items-center">
                    {/* Load component }
                    {mode === "profile" ? (
                        <Profile />
                    ) : mode === "appointments" ? (
                        <Appointments />
                    ) : (
                        <Records />
                    )}
                </div>
            </div>

 */
