import { useState } from "react";
import { Link } from "react-router-dom";
import HealthBook from "./HealthBook";
import ClientAppointments, { AppointmentStep } from "./ClientAppointments"; // <-- Import
import Declarations, { DeclarationStep } from "./Declarations";

// Imports εικόνων
import healthBookImg from "../../assets/dog_1.jpg"; 
import lostFoundImg from "../../assets/lost_a_pet.jpg"; 
import vetImg from "../../assets/Vets.webp"; 

export default function ClientHomeComponent() {
  const [view, setView] = useState<"dashboard" | "healthbook" | "appointments" | "declarations">("dashboard");
  const [declarationStep, setDeclarationStep] = useState<DeclarationStep>("list");
  // ΝΕΟ: State για τα ραντεβού
  const [appointmentStep, setAppointmentStep] = useState<AppointmentStep>("search");

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
          setAppointmentStep("search"); // Reset στην αρχή
      },
    },
  ];

  const handleBack = () => {
      // Logic για επιστροφή στις Δηλώσεις
      if (view === "declarations" && declarationStep !== "list") {
          setDeclarationStep("list");
          return;
      }
      // Logic για επιστροφή στα Ραντεβού
      if (view === "appointments" && appointmentStep !== "search") {
          // Αν είμαστε σε βαθύτερο βήμα (π.χ. προφίλ ή φόρμα), γυρνάμε στο search/list
          // Μπορούμε να το κάνουμε πιο έξυπνο (π.χ. από booking -> profile), αλλά για τώρα:
          setAppointmentStep("search"); 
          return;
      }
      
      setView("dashboard");
  };

  const Breadcrumbs = () => (
    <div className="text-[#5d5d5d] text-sm sm:text-base mb-4 font-light flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-black hover:underline transition-all">Αρχική</Link> 
        <span>&gt;</span>
        <button 
            onClick={() => setView("dashboard")} 
            className={`hover:text-black hover:underline transition-all ${view === 'dashboard' ? 'font-bold text-black' : ''}`}
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
                            className={`hover:text-black hover:underline transition-all ${declarationStep === 'list' ? 'font-medium text-black' : ''}`}
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
                    // Logic για τα Breadcrumbs των Ραντεβού
                    <>
                         <button 
                            onClick={() => setAppointmentStep("search")}
                            className={`hover:text-black hover:underline transition-all ${appointmentStep === 'search' ? 'font-medium text-black' : ''}`}
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
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 pt-16">
        <Breadcrumbs />
        
        <button 
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black font-semibold transition-colors text-sm"
        >
            <span className="text-xl">←</span> Πίσω
        </button>
        
        {view === "healthbook" && <HealthBook />}
        {view === "appointments" && (
            <ClientAppointments step={appointmentStep} setStep={setAppointmentStep} />
        )}
        {view === "declarations" && (
            <Declarations step={declarationStep} setStep={setDeclarationStep} />
        )}
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="min-h-screen w-full bg-[#ebebeb]">
      <main className="px-4 md:px-8 lg:px-16 pb-8 pt-16">
        <Breadcrumbs />
        
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-medium text-black mb-2">
            Καλως ήρθες, Κίμωνα!
          </h1>
          <p className="text-lg text-[#616161] font-light max-w-3xl mx-auto">
            Φρόντισε τον Φέλιξ, τον Πέρρη και την Κάτια με λίγα μόνο κλικ.
          </p>
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
      </main>
    </div>
  );
}