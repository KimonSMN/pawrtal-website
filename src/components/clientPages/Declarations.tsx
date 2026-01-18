import { ChangeEvent } from "react";
// Χρησιμοποιούμε τις εικόνες που έχεις ήδη στα assets
import lostPetImg from "../../assets/lost_a_pet.jpg"; 
import foundPetImg from "../../assets/dog_1.jpg"; 
import previewDog from "../../assets/dog_1.jpg"; 

// Τύποι που θα χρησιμοποιήσει και το Home.tsx
export type DeclarationStep = "list" | "lost-form" | "found-form" | "preview";

interface DeclarationsProps {
    step: DeclarationStep;
    setStep: (step: DeclarationStep) => void;
}

const historyData = [
    { type: "Δήλωση Εύρεσης", pet: "-", date: "24/10/2025", status: "Προσωρινή Αποθήκευση", statusColor: "bg-yellow-100 text-yellow-800" },
    { type: "Δήλωση Εύρεσης", pet: "-", date: "8/3/2025", status: "Οριστική Υποβολή", statusColor: "bg-green-100 text-green-800" },
    { type: "Δήλωση Απώλειας", pet: "Φέλιξ", date: "22/9/2024", status: "Οριστική Υποβολή", statusColor: "bg-green-100 text-green-800" },
];

export default function Declarations({ step, setStep }: DeclarationsProps) {

    // --- SUB-COMPONENT: Η Αρχική Οθόνη (Κάρτες & Πίνακας) ---
    const Dashboard = () => (
        <div className="flex flex-col gap-10">
            {/* Κάρτες Επιλογής */}
            <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                <div 
                    onClick={() => setStep("lost-form")}
                    className="flex-1 bg-white rounded-3xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all group max-w-md mx-auto w-full border border-transparent hover:border-gray-200"
                >
                    <div className="h-48 overflow-hidden">
                        <img src={lostPetImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Lost" />
                    </div>
                    <div className="p-6 text-center font-bold text-xl text-[#303030]">Δήλωση Απώλειας</div>
                </div>

                <div 
                    onClick={() => setStep("found-form")}
                    className="flex-1 bg-white rounded-3xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all group max-w-md mx-auto w-full border border-transparent hover:border-gray-200"
                >
                    <div className="h-48 overflow-hidden">
                        <img src={foundPetImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Found" />
                    </div>
                    <div className="p-6 text-center font-bold text-xl text-[#303030]">Δήλωση Εύρεσης</div>
                </div>
            </div>

            {/* Πίνακας Ιστορικού */}
            <div className="bg-[#e5e5e5] rounded-3xl p-6 sm:p-10 shadow-sm">
                <h2 className="text-xl font-bold mb-8 text-[#303030] text-center sm:text-left">Ιστορικό Δηλώσεων</h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                            <tr className="text-gray-600 border-b border-gray-400">
                                <th className="pb-4 pl-4 text-left w-[25%]">Τύπος</th>
                                <th className="pb-4 text-center w-[15%]">Κατοικίδιο</th>
                                <th className="pb-4 text-center w-[20%]">Ημερομηνία</th>
                                <th className="pb-4 text-center w-[25%]">Κατάσταση</th>
                                <th className="pb-4 pr-4 text-right w-[15%]">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {historyData.map((item, idx) => {
                                const isFinal = item.status === "Οριστική Υποβολή";
                                return (
                                    <tr key={idx} className="bg-[#f9f9f9] border-b-8 border-[#e5e5e5] last:border-0 rounded-xl">
                                        <td className="py-5 pl-4 rounded-l-xl font-medium text-gray-700 text-left">{item.type}</td>
                                        <td className="py-5 text-gray-600 text-center">{item.pet}</td>
                                        <td className="py-5 text-gray-600 text-center">{item.date}</td>
                                        <td className="py-5 text-center">
                                            <span className={`px-4 py-2 rounded-full text-xs font-bold ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-5 pr-4 rounded-r-xl text-right">
                                            <div className="flex justify-end gap-3">
                                                {/* Edit Button */}
                                                <button 
                                                    disabled={isFinal}
                                                    title={isFinal ? "Δεν επιτρέπεται η επεξεργασία" : "Επεξεργασία"}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isFinal 
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-[#e0e0e0] hover:bg-[#d0d0d0] text-gray-700'
                                                    }`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                                
                                                {/* View Button */}
                                                <button 
                                                    onClick={() => setStep("preview")} 
                                                    title="Προβολή"
                                                    className="p-2 bg-[#e0e0e0] rounded-lg hover:bg-[#d0d0d0] text-gray-700 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // --- SUB-COMPONENT: Φόρμα (Κοινή για Απώλεια/Εύρεση) ---
    const DeclarationForm = ({ type }: { type: "lost" | "found" }) => (
        <div className="bg-[#e5e5e5] rounded-3xl p-6 sm:p-12 shadow-lg max-w-5xl mx-auto w-full">
            <h1 className="text-3xl font-bold mb-3 text-[#303030] text-left">
                {type === "lost" ? "Δήλωση απώλειας κατοικιδίου" : "Δήλωση εύρεσης κατοικιδίου"}
            </h1>
            <p className="text-gray-600 mb-10 text-sm text-left">
                Παρακαλώ δώστε όσες λεπτομέρειες γνωρίζετε σχετικά με το κατοικίδιο
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Όνομα Κατοικιδίου {type==="lost" && "(αυτόματα)"}</label>
                    {type === "lost" ? (
                        <select className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                            <option>Φέλιξ</option>
                            <option>Πέρρης</option>
                        </select>
                    ) : (
                        <input type="text" placeholder="π.χ. -" className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
                    )}
                </div>
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Είδος *</label>
                    <select className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                        <option>Σκύλος</option>
                        <option>Γάτα</option>
                    </select>
                </div>
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Φύλο {type==="lost" && "(αυτόματα)"}</label>
                    <select className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                        <option>Αρσενικό</option>
                        <option>Θηλυκό</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                 <div className="flex flex-col items-start max-w-md w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Κωδικός Μικροτσίπ {type==="lost" && "(αυτόματα)"}</label>
                    <input type="text" placeholder="123456789" className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="flex flex-col items-start max-w-xl w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Τοποθεσία που {type==="lost" ? "χάθηκε" : "βρέθηκε"} *</label>
                    <input type="text" placeholder="π.χ. Αετιδέων 43, Χολαργός, Αθήνα" className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="flex flex-col items-start max-w-xs w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Ημερομηνία που {type==="lost" ? "χάθηκε" : "βρέθηκε"} *</label>
                    <input type="date" className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400" />
                </div>
            </div>

            <div className="mb-10 w-full">
                <label className="text-xs font-bold mb-2 ml-1 text-gray-600 block text-left">Ανεβάστε φωτογραφία του κατοικιδίου *</label>
                <div className="w-full bg-white border border-dashed border-gray-400 rounded-xl p-12 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-50 transition-colors">
                    Επιλέξτε αρχεία ή σύρετε τα εδώ
                </div>
            </div>

            <hr className="border-gray-300 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Το Όνομα σας</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-300 rounded-xl p-3.5 text-sm text-gray-700 text-left">Κίμωνας</div>
                </div>
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Το Επίθετο σας</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-300 rounded-xl p-3.5 text-sm text-gray-700 text-left">Σμυρλιάνος</div>
                </div>
            </div>

            <div className="mb-8 w-full flex flex-col items-start">
                 <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Το Email / Τηλέφωνο σας</label>
                 <div className="w-full bg-[#dcdcdc] border border-gray-300 rounded-xl p-3.5 text-sm text-gray-700 text-left">kimonsmirlianos@gmail.com ή (+30) 6939949788</div>
            </div>

            <div className="mb-12 w-full flex flex-col items-start">
                 <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Επιπλέον Πληροφορίες</label>
                 <textarea rows={4} className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" placeholder="Οποιαδήποτε πρόσθετη πληροφορία που μπορεί να βοηθήσει..."></textarea>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
                <button 
                    onClick={() => setStep("preview")} 
                    className="px-8 py-3 bg-[#5c5c5c] text-white font-bold rounded-xl hover:bg-[#4a4a4a] transition-colors shadow-md"
                >
                    Οριστική Υποβολή
                </button>
                <button className="px-8 py-3 bg-[#9ca3af] text-white font-bold rounded-xl hover:bg-[#888f9b] transition-colors shadow-md">
                    Προσωρινή Αποθήκευση
                </button>
            </div>
        </div>
    );

    // --- SUB-COMPONENT: Προεπισκόπηση ---
    const Preview = () => (
        <div className="bg-[#e5e5e5] rounded-3xl p-6 sm:p-12 shadow-lg max-w-5xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-10 text-[#303030] text-center">Προεπισκόπηση Δήλωσης Εύρεσης Κατοικιδίου</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-2 text-gray-600">Όνομα Κατοικιδίου</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm text-center">Φέλιξ</div>
                </div>
                <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-2 text-gray-600">Είδος</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm text-center">Σκύλος</div>
                </div>
                <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-2 text-gray-600">Φύλο</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm text-center">Αρσενικό</div>
                </div>
            </div>

            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col items-center md:items-start max-w-xs mx-auto md:mx-0">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Κωδικός Μικροτσίπ</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm text-center">123456789</div>
                </div>
            </div>

            <div className="mb-8 flex flex-col items-center">
                 <label className="text-xs font-bold mb-2 text-gray-600">Τοποθεσία που βρέθηκε</label>
                 <div className="bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm w-full md:w-2/3 text-center">Αετιδέων 43, Χολαργός, Αθήνα</div>
            </div>

            <div className="mb-8 flex flex-col items-center">
                 <label className="text-xs font-bold mb-2 text-gray-600">Ημερομηνία που βρέθηκε</label>
                 <div className="bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm w-48 text-center">12/12/2024</div>
            </div>

            <div className="mb-10 flex flex-col items-center">
                <label className="text-xs font-bold mb-2 text-gray-600">Φωτογραφία του κατοικιδίου</label>
                <div className="h-64 w-full md:w-2/3 rounded-xl overflow-hidden bg-gray-300 shadow-inner">
                    <img src={previewDog} className="w-full h-full object-cover" alt="Preview" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-2 text-gray-600">Το Όνομα σας</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm text-center">Κίμωνας</div>
                </div>
                <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-2 text-gray-600">Το Επίθετο σας</label>
                    <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm text-center">Σμυρλιάνος</div>
                </div>
            </div>

            <div className="mb-8 flex flex-col items-center">
                 <label className="text-xs font-bold mb-2 text-gray-600">Το Email / Τηλέφωνο σας</label>
                 <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm text-center">kimonsmirlianos@gmail.com / (+30) 6939949788</div>
            </div>

            <div className="mb-12 flex flex-col items-center">
                 <label className="text-xs font-bold mb-2 text-gray-600">Επιπλέον Πληροφορίες</label>
                 <div className="w-full bg-[#dcdcdc] border border-gray-400 rounded-xl p-3.5 text-sm h-24 text-center flex items-center justify-center">Καλέστε με στο κινητό μου απογευματινές ώρες.</div>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={() => setStep("list")}
                    className="px-8 py-3 bg-[#7a7a7a] text-white font-bold rounded-xl hover:bg-[#666] transition-colors shadow-md"
                >
                    Επιστροφή στο Ιστορικό Δηλώσεων
                </button>
            </div>
        </div>
    );

    // --- MAIN RETURN ---
    return (
        // Πρόσθεσα το pb-24 εδώ για να υπάρχει αέρας κάτω
        <div className="w-full pb-24">
            {step === "list" && <Dashboard />}
            {step === "lost-form" && <DeclarationForm type="lost" />}
            {step === "found-form" && <DeclarationForm type="found" />}
            {step === "preview" && <Preview />}
        </div>
    );
}