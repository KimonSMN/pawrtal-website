import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HealthBook from "./HealthBook";
import ClientAppointments, { AppointmentStep } from "./ClientAppointments";
import Declarations, { DeclarationStep } from "./Declarations";

// Imports εικόνων
import healthBookImg from "../../assets/cat_holding_paper.jpg";
import lostFoundImg from "../../assets/lost_a_pet.jpg";
import vetImg from "../../assets/Vets.webp";
import { HomeView } from "../../pages/ClientHome";

export default function ClientHomeComponent({
    view: initialView = "dashboard",
}: {
    view?: HomeView;
}) {
    const [view, setView] = useState<HomeView>(initialView);
    const [declarationStep, setDeclarationStep] = useState<DeclarationStep>("list");
    const [appointmentStep, setAppointmentStep] = useState<AppointmentStep>("search");

    // State για τα προσωποποιημένα δεδομένα
    const [userName, setUserName] = useState("Χρήστη");
    const [petMessage, setPetMessage] = useState("τα κατοικίδιά σου");

    // --- FETCH DATA ---
    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = localStorage.getItem("pawrtal_user");
            if (!storedUser) {
                console.log("No user found in pawrtal_user storage");
                return;
            }

            const currentUser = JSON.parse(storedUser);
            console.log("Logged in user (Home):", currentUser);

            let firstName = currentUser.name ? currentUser.name.split(" ")[0] : "Χρήστη";

            // Κλητική πτώση
            if (firstName.endsWith("ς") || firstName.endsWith("s")) {
                firstName = firstName.slice(0, -1);
            }
            setUserName(firstName);

            // 3. Ρύθμιση Μηνύματος Κατοικιδίων
            try {
                const res = await fetch(`http://localhost:3001/pets?ownerId=${currentUser.id}`);
                const pets = await res.json();

                if (pets.length > 0) {
                    const petStrings = pets.map((p: any) => {
                        const article =
                            p.gender === "female" || p.species === "cat" ? "την" : "τον";
                        return `${article} ${p.name}`;
                    });

                    if (petStrings.length === 1) {
                        setPetMessage(petStrings[0]);
                    } else {
                        const lastPet = petStrings.pop();
                        setPetMessage(`${petStrings.join(", ")} και ${lastPet}`);
                    }
                } else {
                    setPetMessage("τα κατοικίδιά σου");
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
                setPetMessage("τα κατοικίδιά σου");
            }
        };

        loadUserData();
    }, []);

    const cards = [
        {
            id: 1,
            title: "Βιβλιάριο Υγείας",
            image: healthBookImg,
            action: () => setView("healthbook"),
        },
        {
            id: 2,
            title: "Δηλώσεις Απώλειας",
            image: lostFoundImg,
            action: () => {
                setView("declarations");
                setDeclarationStep("list");
            },
        },
        {
            id: 3,
            title: "Ραντεβού",
            image: vetImg,
            action: () => {
                setView("appointments");
                setAppointmentStep("search");
            },
        },
    ];

    const handleBack = () => {
        if (view === "declarations" && declarationStep !== "list") {
            setDeclarationStep("list");
            return;
        }
        if (view === "appointments" && appointmentStep !== "search") {
            setAppointmentStep("search");
            return;
        }
        setView("dashboard");
    };

    const Breadcrumbs = () => (
        // Αφαιρέθηκε το max-w-6xl για να πάει τέρμα αριστερά
        <div className="text-sm text-gray-500 flex items-start gap-2 pt-4">
            <Link to="/" className="hover:text-black hover:underline transition-all">
                Αρχική
            </Link>
            <span>&gt;</span>
            <button
                onClick={() => setView("dashboard")}
                className={`hover:text-black hover:underline transition-all cursor-pointer ${view === "dashboard" ? "font-medium text-black underline" : ""}`}
            >
                Ιδιοκτήτης
            </button>
            {view !== "dashboard" && (
                <>
                    <span>&gt;</span>
                    {view === "declarations" ? (
                        <>
                            <button
                                onClick={() => setDeclarationStep("list")}
                                className={`hover:text-black hover:underline transition-all cursor-pointer ${declarationStep === "list" ? "font-medium text-black underline" : ""}`}
                            >
                                Δηλώσεις
                            </button>
                            {declarationStep !== "list" && (
                                <>
                                    <span>&gt;</span>
                                    <span className="font-medium text-black">
                                        {declarationStep === "preview" ? "Προεπισκόπηση" : "Φόρμα"}
                                    </span>
                                </>
                            )}
                        </>
                    ) : view === "appointments" ? (
                        <>
                            <button
                                onClick={() => setAppointmentStep("search")}
                                className={`hover:text-black hover:underline transition-all cursor-pointer ${appointmentStep === "search" ? "font-medium text-black underline" : ""}`}
                            >
                                Ραντεβού
                            </button>
                            {appointmentStep !== "search" && (
                                <>
                                    <span>&gt;</span>
                                    <span className="font-medium text-black">
                                        {appointmentStep === "vet-list" && "Λίστα"}
                                        {appointmentStep === "vet-profile" && "Προφίλ"}
                                        {appointmentStep === "booking" && "Κράτηση"}
                                        {appointmentStep === "success" && "Επιβεβαίωση"}
                                    </span>
                                </>
                            )}
                        </>
                    ) : (
                        <span className="font-medium text-black">
                            {view === "healthbook" && "Βιβλιάριο"}
                        </span>
                    )}
                </>
            )}
        </div>
    );

    // --- Sub-Views ---
    if (view !== "dashboard") {
        return (
            <div className="min-h-screen w-full bg-[#ffffff]">
                <main className="px-4 md:px-8 lg:px-16 pb-8 pt-16">
                    {/* Breadcrumbs τέρμα αριστερά */}
                    <Breadcrumbs />

                    <button
                        onClick={handleBack}
                        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black font-semibold transition-colors text-sm cursor-pointer mt-4"
                    >
                        <span className="text-xl">←</span> Πίσω
                    </button>

                    {/* Κεντραρισμένο περιεχόμενο (κάρτες/φόρμες) */}
                    <div className="max-w-6xl mx-auto w-full">
                        {view === "healthbook" && <HealthBook />}
                        {view === "appointments" && (
                            <ClientAppointments
                                step={appointmentStep}
                                setStep={setAppointmentStep}
                            />
                        )}
                        {view === "declarations" && (
                            <Declarations step={declarationStep} setStep={setDeclarationStep} />
                        )}
                    </div>
                </main>
            </div>
        );
    }

    // --- Dashboard View ---
    return (
        <div className="min-h-screen w-full bg-[#ffffff]">
            <main className="px-4 md:px-8 lg:px-16 pb-8 pt-16">
                {/* Breadcrumbs τέρμα αριστερά */}
                <Breadcrumbs />

                {/* Κεντραρισμένο περιεχόμενο (τίτλος και κάρτες) */}
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl sm:text-4xl font-medium text-black mb-2">
                            Καλώς ήρθες, {userName}!
                        </h1>
                        <p className="text-lg text-[#616161] font-light max-w-3xl mx-auto">
                            Φρόντισε {petMessage} με λίγα μόνο κλικ.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                </div>
            </main>
        </div>
    );
}
