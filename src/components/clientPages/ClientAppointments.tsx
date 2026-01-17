import { useState } from "react";
// Εικόνες (χρησιμοποιώ τα assets σου)
import vetProfileImg from "../../assets/Vets.webp"; 
import userProfileImg from "../../assets/profile.png"; 

export type AppointmentStep = 
    | "search" 
    | "vet-list" 
    | "vet-profile" 
    | "booking" 
    | "success" 
    | "view-details" 
    | "past-review"
    | "edit-booking"
    | "cancel-confirmation";

interface Props {
    step: AppointmentStep;
    setStep: (step: AppointmentStep) => void;
}

// --- MOCK DATA ---
const historyData = [
    { 
        id: 1,
        type: "Στείρωση Ζώου", 
        pet: "Φέλιξ", 
        date: "29/12/2025", 
        time: "11:30 ΠΜ",
        fullDate: "29/12/2025 - 11:30 ΠΜ", 
        status: "Εκκρεμές", 
        statusClass: "bg-yellow-100 text-yellow-800",
        vetName: "Άρης Παπαδόπουλος",
        vetSpec: "Χειρούργος"
    },
    { 
        id: 2,
        type: "Στείρωση Ζώου", 
        pet: "Φέλιξ", 
        date: "08/05/2025", 
        time: "-",
        fullDate: "8/5/2025", 
        status: "Ακυρωμένο", 
        statusClass: "bg-gray-200 text-gray-600",
        vetName: "Άρης Παπαδόπουλος",
        vetSpec: "Χειρούργος"
    },
    { 
        id: 3,
        type: "Καταγραφή Ζώου", 
        pet: "Φέλιξ", 
        date: "22/02/2024", 
        time: "-",
        fullDate: "22/2/2024", 
        status: "Πραγματοποιημένο", 
        statusClass: "bg-green-100 text-green-800",
        vetName: "Νίκη Ελευθεριάδου",
        vetSpec: "Ορθοπαιδικός"
    },
];

const vetsData = [
    { id: 1, name: "Άρης Παπαδόπουλος", spec: "Χειρούργος", loc: "Χολαργός, Αθήνα", status: "Διαθέσιμος", img: vetProfileImg },
    { id: 2, name: "Νίκη Ελευθεριάδου", spec: "Ορθοπαιδικός", loc: "Χολαργός, Αθήνα", status: "Διαθέσιμη", img: vetProfileImg },
];

// --- HELPER COMPONENTS ---
const Stepper = ({ current }: { current: number }) => {
    const steps = ["Συμπλήρωση Στοιχείων", "Επιλογή Κτηνιάτρου", "Υποβολή Ραντεβού", "Επιβεβαίωση Κτηνιάτρου"];
    return (
        <div className="flex justify-between items-start w-full max-w-2xl mx-auto mb-12 relative px-4">
            <div className="absolute top-5 left-12 right-12 h-0.5 bg-black -z-10" />
            {steps.map((label, idx) => {
                const isActive = idx <= current;
                return (
                    <div key={idx} className="flex flex-col items-center w-24">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-[#ebebeb] z-10 
                            ${isActive ? 'border-black bg-gray-400' : 'border-black'}`}>
                        </div>
                        <span className="text-xs text-center mt-2 font-medium text-gray-600 leading-tight">{label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default function ClientAppointments({ step, setStep }: Props) {
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    // --- SUB-SCREENS ---

    // 1. Search & History
    const SearchAndHistory = () => (
        <div className="w-full">
            <Stepper current={0} />
            <h2 className="text-xl font-bold mb-6 text-[#303030] text-center">Συμπληρώστε όσες πληροφορίες επιθυμείτε</h2>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-4 items-center mb-12 border border-gray-200">
                <input type="date" className="bg-white p-3 rounded-xl border border-gray-300 w-full lg:w-auto text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <select className="bg-white p-3 rounded-xl border border-gray-300 w-full lg:w-auto text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    <option value="">Επιλέξτε Ώρα</option>
                    <option value="morning">Πρωί (09:00 - 12:00)</option>
                </select>
                <div className="relative w-full lg:flex-1">
                    <input type="text" placeholder="πχ. Χολαργός" className="bg-white p-3 pr-10 rounded-xl border border-gray-300 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400" />
                    <span className="absolute right-3 top-3 text-gray-400">📍</span>
                </div>
                <select className="bg-white p-3 rounded-xl border border-gray-300 w-full lg:flex-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    <option value="">Ειδικότητα</option>
                    <option value="surgeon">Χειρούργος</option>
                </select>
                <button onClick={() => setStep("vet-list")} className="bg-[#7a7a7a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#666] transition-colors w-full lg:w-auto">
                    Αναζήτηση
                </button>
            </div>

            <div className="bg-[#e5e5e5] rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-center lg:text-left">Ιστορικό Ραντεβού</h3>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                            <tr className="text-gray-600 text-sm border-b border-gray-400">
                                <th className="pb-3 text-left pl-4 w-[20%]">Τύπος</th>
                                <th className="pb-3 text-center w-[15%]">Κατοικίδιο</th>
                                <th className="pb-3 text-center w-[25%]">Ημερομηνία</th>
                                <th className="pb-3 text-center w-[20%]">Κατάσταση</th>
                                <th className="pb-3 text-right pr-4 w-[20%]">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {historyData.map((item, idx) => (
                                <tr key={idx} className="bg-[#f9f9f9] border-b-8 border-[#e5e5e5] last:border-0 rounded-xl">
                                    <td className="py-4 pl-4 rounded-l-xl font-medium text-gray-700">{item.type}</td>
                                    <td className="py-4 text-center text-gray-600">{item.pet}</td>
                                    <td className="py-4 text-center text-gray-600">{item.fullDate}</td>
                                    <td className="py-4 text-center">
                                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.statusClass}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 rounded-r-xl text-right">
                                        <div className="flex justify-end gap-2">
                                            {item.status === "Εκκρεμές" && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedAppointment(item);
                                                        setStep("edit-booking");
                                                    }}
                                                    className="p-2 bg-[#e0e0e0] rounded-lg hover:bg-[#d0d0d0] text-gray-600"
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => item.status === "Πραγματοποιημένο" ? setStep("past-review") : setStep("success")}
                                                className="p-2 bg-[#e0e0e0] rounded-lg hover:bg-[#d0d0d0] text-gray-600"
                                            >
                                                👁️
                                            </button>
                                            {item.status === "Εκκρεμές" && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedAppointment(item);
                                                        setStep("cancel-confirmation");
                                                    }}
                                                    className="p-2 bg-[#fcdcdc] rounded-lg hover:bg-[#f5c6c6] text-red-600"
                                                >
                                                    ❌
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // 2. Vet List
    const VetList = () => (
        <div className="w-full">
            <Stepper current={1} />
            <h2 className="text-2xl font-bold mb-6 text-[#303030]">Κτηνίατροι</h2>
            <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-[#e5e5e5] rounded-xl flex items-center px-4 py-1">
                    <span className="text-gray-500 text-xl mr-2">🔍</span>
                    <input type="text" placeholder="Αναζήτηση" className="bg-transparent p-3 w-full outline-none text-gray-700 placeholder-gray-500" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vetsData.map((vet) => (
                    <div key={vet.id} className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow">
                        <div className="h-64 md:h-auto md:w-2/5 bg-gray-200 overflow-hidden relative group">
                            <img src={vet.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={vet.name} />
                        </div>
                        <div className="p-6 flex flex-col justify-between flex-1">
                            <div>
                                <h3 className="font-bold text-xl text-[#303030] mb-1">{vet.name}</h3>
                                <p className="text-gray-500 text-sm font-medium mb-2">{vet.spec}</p>
                                <p className="text-gray-400 text-sm flex items-center gap-1">📍 {vet.loc}</p>
                            </div>
                            <button onClick={() => setStep("vet-profile")} className="mt-4 w-full py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-colors">
                                Προβολή
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // 3. Vet Profile (Διορθωμένο με πλήρη στοιχεία)
    const VetProfile = () => (
        <div className="w-full">
            <Stepper current={1} />
            
            <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
                {/* Photo */}
                <div className="w-full md:w-1/3 rounded-[2rem] overflow-hidden shadow-lg h-[400px]">
                    <img src={vetProfileImg} className="w-full h-full object-cover" alt="Dr" />
                </div>
                
                {/* Info */}
                <div className="flex-1 pt-4">
                    <h1 className="text-4xl font-bold text-[#303030] mb-2">Άρης Παπαδόπουλος</h1>
                    <p className="text-xl text-gray-500 mb-8 font-medium">Χειρούργος</p>
                    
                    <div className="mb-8">
                        <h3 className="font-bold mb-3 text-lg">Περιγραφή</h3>
                        <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                            Κτηνίατρος με πάνω από μια δεκαετία εμπειρίας και εξειδίκευση στην χειρουργική. 
                            Το κτηνιατρείο μας είναι εξοπλισμένο με την τελευταία λέξη της τεχνολογίας και είναι εύκολα προσβάσιμο στον Χολαργό.
                        </p>
                    </div>
                    
                    <div className="mb-10 text-gray-600 space-y-2 bg-[#f9f9f9] p-4 rounded-xl w-fit">
                        <p className="flex items-center gap-2">📍 <span className="font-medium">Μεσογείων 24, Χολαργός, Αθήνα</span></p>
                        <p className="flex items-center gap-2">📅 <span className="font-medium">Μέλος Pawrtal από το 2022</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 border-t pt-6">
                         <div className="flex-1">
                             <h4 className="font-bold text-sm mb-2 text-gray-400 uppercase tracking-wide">Επικοινωνια</h4>
                             <p className="text-sm text-gray-700 font-medium mb-1">👤 Άρης Παπαδόπουλος</p>
                             <p className="text-sm text-gray-700 font-medium">✉️ arispapadopoulos@gmail.com</p>
                         </div>
                         
                         <div className="flex items-end">
                            <button 
                                onClick={() => setStep("booking")}
                                className="bg-[#5c5c5c] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4a4a4a] shadow-lg hover:shadow-xl transition-all"
                            >
                                Κλείστε Ραντεβού
                            </button>
                         </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-[#ebebeb] rounded-[2rem] p-8">
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-xl font-bold">Αξιολογήσεις :</span>
                    <span className="bg-[#dcdcdc] px-4 py-1.5 rounded-full font-bold shadow-sm text-lg">4.6 / 5 ★</span>
                </div>
                
                <div className="space-y-4">
                    {["Μαρία Γεωργίου", "Αντώνης Ρίκου", "Λευτέρης Μιχαηλίδης", "Κώστας Κινέτης"].map((name, i) => (
                        <div key={i} className="bg-[#e0e0e0] rounded-2xl p-5 flex justify-between items-center shadow-sm">
                            <div className="font-semibold text-lg text-[#303030]">{name}</div>
                            <div className="flex gap-6 items-center">
                                <span className="font-bold text-lg">5 / 5 ★</span>
                                <span className="text-gray-600 font-medium">15 / 11 / 2025</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // 4. Booking Form (Διορθωμένο με πλήρη φόρμα)
    const BookingForm = () => (
        <div className="w-full">
            <Stepper current={2} />
            <div className="bg-[#e5e5e5] rounded-3xl p-8 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-2 text-[#303030]">Ραντεβού</h2>
                <p className="text-sm text-gray-500 mb-8 font-medium">Παρακαλώ δώστε λεπτομέρειες σχετικά με το κατοικίδιο σας</p>

                <div className="grid grid-cols-3 gap-6 mb-6">
                     <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Όνομα Κατοικιδίου (αυτόματα)</label>
                        <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Φέλιξ ▼</div>
                     </div>
                     <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Είδος (αυτόματα)</label>
                        <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Σκύλος</div>
                     </div>
                     <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Φύλο (αυτόματα)</label>
                        <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Αρσενικό</div>
                     </div>
                </div>
                
                <div className="mb-8">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Κωδικός Μικροτσίπ (αυτόματα)</label>
                    <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium w-1/3">123456789</div>
                </div>

                {/* Calendar Mock */}
                <div className="mb-8">
                    <label className="text-xs font-bold ml-1 mb-2 block text-gray-600">Διαθεσιμότητα ημερών που επιλέξατε</label>
                    <div className="bg-white p-4 rounded-xl w-72 shadow-sm text-center border border-gray-200">
                         <div className="flex justify-between text-sm mb-4 font-bold px-2">
                             <span className="cursor-pointer text-gray-400 hover:text-black">&lt;</span> 
                             <span>Dec 2025</span> 
                             <span className="cursor-pointer text-gray-400 hover:text-black">&gt;</span>
                         </div>
                         <div className="grid grid-cols-7 gap-2 text-[11px] text-gray-500 font-medium mb-2">
                             <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                         </div>
                         <div className="grid grid-cols-7 gap-2 text-xs">
                             {[...Array(31)].map((_, i) => {
                                 const day = i + 1;
                                 let classes = "p-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors";
                                 if (day === 9) classes = "p-1.5 bg-red-500 text-white rounded-lg shadow-sm";
                                 if (day >= 10 && day <= 12) classes = "p-1.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200";
                                 if (day === 13) classes = "p-1.5 bg-green-500 text-white rounded-lg shadow-md transform scale-110 font-bold";
                                 return <span key={i} className={classes}>{day}</span>
                             })}
                         </div>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Επιλέξτε διαθέσιμη ώρα</label>
                    <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm w-40 font-medium shadow-sm cursor-pointer hover:border-gray-400 transition-colors">11:30 ΠΜ ▼</div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Το Όνομα σας (αυτόματα)</label>
                        <div className="bg-[#f2f2f2] border border-gray-200 p-3.5 rounded-xl text-sm text-gray-700">Κίμωνας</div>
                    </div>
                    <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Το Επίθετο σας (αυτόματα)</label>
                        <div className="bg-[#f2f2f2] border border-gray-200 p-3.5 rounded-xl text-sm text-gray-700">Σμυρλιάνος</div>
                    </div>
                </div>
                <div className="mb-8">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Email / Τηλέφωνο (αυτόματα)</label>
                    <div className="bg-[#f2f2f2] border border-gray-200 p-3.5 rounded-xl text-sm text-gray-700">kimonsmirlianos@gmail.com</div>
                </div>

                <div className="mb-10">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Ιατρική πράξη ή επιπλέον πληροφορίες</label>
                    <textarea className="w-full h-28 bg-white border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" placeholder="πχ. Στείρωση και οποιαδήποτε πρόσθετη πληροφορία που μπορεί να βοηθήσει..."></textarea>
                </div>

                <div className="flex justify-center">
                    <button onClick={() => setStep("success")} className="bg-[#5c5c5c] text-white px-16 py-4 rounded-xl font-bold hover:bg-[#4a4a4a] text-lg shadow-lg hover:shadow-xl transition-all">
                        Υποβολή
                    </button>
                </div>
            </div>
        </div>
    );

    // 5. Success Page
    const SuccessPage = () => (
        <div className="w-full text-center">
            <Stepper current={2} />
            <h2 className="text-3xl font-bold mb-4 mt-8 text-[#303030]">Επιτυχής Υποβολή Ραντεβού</h2>
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-[#303030] flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#303030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            </div>
            <p className="text-gray-600 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
                Όταν ο κτηνίατρος επιβεβαιώσει το ραντεβού θα ειδοποιηθείτε μέσω email και η κατάσταση του ραντεβού θα αλλάξει από "Εκκρεμές" σε "Επιβεβαιωμένο".
            </p>
            <div className="bg-[#e5e5e5] rounded-[2rem] p-10 shadow-lg max-w-4xl mx-auto text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#303030]"></div>
                <h2 className="text-3xl font-bold mb-2 text-[#303030]">Εκκρεμές Ραντεβού</h2>
                <h3 className="text-xl font-bold text-gray-700 mb-1">Άρης Παπαδόπουλος</h3>
                <p className="text-gray-500 text-sm mb-8">Χειρούργος • Μεσογείων 24, Χολαργός</p>
                <div className="grid grid-cols-3 gap-6 mb-6 opacity-75">
                     <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Φέλιξ</div>
                     <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Σκύλος</div>
                     <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Αρσενικό</div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-6 opacity-75">
                    <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">123456789</div>
                    <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">13/12/2025</div>
                    <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">11:30 ΠΜ</div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6 opacity-75">
                    <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Κίμωνας</div>
                    <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Σμυρλιάνος</div>
                </div>
                <div className="mb-6 opacity-75">
                    <div className="bg-[#dcdcdc] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">kimonsmirlianos@gmail.com</div>
                </div>
                <div className="mb-10 opacity-75">
                    <div className="bg-[#dcdcdc] border border-gray-300 p-4 rounded-xl text-sm h-24 font-medium italic">Στείρωση. Για οποιαδήποτε επικοινωνία πάρτε με τηλέφωνο στο κινητό.</div>
                </div>
                <div className="flex justify-end gap-6">
                    <button className="bg-[#9ca3af] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#888f9b] shadow-md transition-colors">
                        Ακύρωση Ραντεβού
                    </button>
                    <button onClick={() => setStep("search")} className="bg-[#5c5c5c] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4a4a4a] shadow-md hover:shadow-lg transition-all text-center leading-tight">
                        Επιστροφή στο <br/> Ιστορικό Ραντεβού
                    </button>
                </div>
            </div>
        </div>
    );

    // 6. Past Appointment & Review
    const PastReview = () => (
        <div className="bg-[#e5e5e5] rounded-3xl p-10 shadow-lg max-w-4xl mx-auto w-full mt-8">
            <h2 className="text-3xl font-bold mb-8 text-[#303030]">Πραγματοποιημένο Ραντεβού</h2>
            <div className="mb-8 pl-1">
                <h3 className="text-2xl font-bold text-[#303030] mb-1">Άρης Παπαδόπουλος</h3>
                <p className="text-gray-600 font-medium">Χειρούργος</p>
                <p className="text-gray-500 text-sm mt-1">📍 Μεσογείων 24, Χολαργός, Αθήνα</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Φέλιξ</div>
                 <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Σκύλος</div>
                 <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Αρσενικό</div>
            </div>
            <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium w-full md:w-1/3 mb-6">123456789</div>
            <div className="flex gap-6 mb-8">
                <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium w-40 text-center">13/12/2025</div>
                <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium w-40 text-center">11:30 ΠΜ</div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Κίμωνας</div>
                <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Σμυρλιάνος</div>
            </div>
            <div className="mb-8">
                <div className="bg-[#e0e0e0] border border-gray-300 p-3.5 rounded-xl text-sm font-medium">kimonsmirlianos@gmail.com</div>
            </div>
            <div className="mb-10 bg-[#e0e0e0] border border-gray-300 p-4 rounded-xl text-sm h-24 text-gray-600 italic font-medium">
                Στείρωση. Για οποιαδήποτε επικοινωνία πάρτε με τηλέφωνο.
            </div>
            <h3 className="text-3xl font-bold mb-4">Αξιολόγηση</h3>
            <div className="text-4xl mb-6 cursor-pointer text-gray-400 hover:text-black transition-colors w-fit">☆ ☆ ☆ ☆ ☆</div>
            <textarea className="w-full bg-white border border-gray-300 rounded-xl p-4 h-32 mb-8 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm font-medium" placeholder="Αφήστε κάποιο σχόλιο..."></textarea>
            <div className="flex justify-end">
                <button onClick={() => setStep("search")} className="bg-[#5c5c5c] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#4a4a4a] text-center leading-tight shadow-md transition-all">
                    Επιστροφή στο <br/> Ιστορικό Ραντεβού
                </button>
            </div>
        </div>
    );

    // 7. Edit Booking
    const EditBookingForm = () => (
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-[#303030] text-center">Επεξεργασία Ραντεβού</h2>
            
            <div className="bg-[#e5e5e5] rounded-3xl p-8 shadow-lg max-w-4xl mx-auto">
                <div className="mb-8 border-b border-gray-300 pb-4">
                    <h3 className="text-xl font-bold text-gray-700">{selectedAppointment?.vetName}</h3>
                    <p className="text-gray-500 text-sm">{selectedAppointment?.vetSpec}</p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                     <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Όνομα Κατοικιδίου</label>
                        <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium">{selectedAppointment?.pet}</div>
                     </div>
                     <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Είδος</label>
                        <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Σκύλος</div>
                     </div>
                     <div>
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Φύλο</label>
                        <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium">Αρσενικό</div>
                     </div>
                </div>

                <div className="mb-8">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Κωδικός Μικροτσίπ</label>
                    <div className="bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium w-1/3">123456789</div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1">
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Αλλαγή Ημερομηνίας</label>
                        <input 
                            type="date" 
                            defaultValue={selectedAppointment?.date ? selectedAppointment.date.split('/').reverse().join('-') : ''}
                            className="w-full bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-gray-400 outline-none" 
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Αλλαγή Ώρας</label>
                        <select className="w-full bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-gray-400 outline-none">
                            <option>{selectedAppointment?.time}</option>
                            <option>09:00 ΠΜ</option>
                            <option>05:00 MM</option>
                        </select>
                    </div>
                </div>

                <div className="mb-10">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Ιατρική πράξη ή επιπλέον πληροφορίες</label>
                    <textarea 
                        className="w-full h-28 bg-white border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" 
                        defaultValue={selectedAppointment?.type + " (Επεξεργασία)"}
                    ></textarea>
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={() => setStep("search")} className="px-8 py-3 bg-[#9ca3af] text-white font-bold rounded-xl hover:bg-[#888f9b] transition-colors">
                        Ακύρωση
                    </button>
                    <button onClick={() => setStep("success")} className="px-8 py-3 bg-[#5c5c5c] text-white font-bold rounded-xl hover:bg-[#4a4a4a] shadow-md transition-all">
                        Αποθήκευση Αλλαγών
                    </button>
                </div>
            </div>
        </div>
    );

    // 8. Cancel Confirmation
    const CancelConfirmation = () => (
        <div className="w-full text-center mt-8">
            <div className="bg-[#e5e5e5] rounded-[2rem] p-10 shadow-lg max-w-2xl mx-auto relative overflow-hidden border-t-8 border-red-500">
                <h2 className="text-3xl font-bold mb-6 text-[#303030]">Ακύρωση Ραντεβού</h2>
                <p className="text-gray-600 font-medium mb-8">
                    Είστε σίγουροι ότι θέλετε να ακυρώσετε το παρακάτω ραντεβού;
                    <br/> Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
                </p>
                <div className="bg-white rounded-xl p-6 mb-8 text-left shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg text-gray-700">{selectedAppointment?.type}</span>
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-500">ID: {selectedAppointment?.id}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Κτηνίατρος:</strong> {selectedAppointment?.vetName}</p>
                        <p><strong>Κατοικίδιο:</strong> {selectedAppointment?.pet}</p>
                        <p><strong>Ημερομηνία:</strong> {selectedAppointment?.fullDate}</p>
                    </div>
                </div>
                <div className="flex justify-center gap-6">
                    <button onClick={() => setStep("search")} className="px-8 py-3 bg-[#9ca3af] text-white font-bold rounded-xl hover:bg-[#888f9b] transition-colors">
                        Όχι, Επιστροφή
                    </button>
                    <button onClick={() => setStep("search")} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md transition-all flex items-center gap-2">
                        <span>❌</span> Ναι, Ακύρωση
                    </button>
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDERER ---
    return (
        <div className="w-full flex justify-center pb-24"> 
            {step === "search" && <SearchAndHistory />}
            {step === "vet-list" && <VetList />}
            {step === "vet-profile" && <VetProfile />}
            {step === "booking" && <BookingForm />}
            {step === "success" && <SuccessPage />}
            {step === "past-review" && <PastReview />}
            {step === "edit-booking" && <EditBookingForm />}
            {step === "cancel-confirmation" && <CancelConfirmation />}
        </div>
    );
}