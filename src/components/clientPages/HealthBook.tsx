import React from "react";

// Mock data to match the screenshot
const mockMedicalActs = [
    { type: "Στείρωση", vet: "Άρης Παπαδόπουλος", date: "24/10/2025" },
    { type: "Εμβολιασμός", vet: "Άρης Παπαδόπουλος", date: "22/9/2024" },
    { type: "Καταχώρηση", vet: "Άρης Παπαδόπουλος", date: "22/9/2024" },
];

function HealthBook() {
    return (
        // Πρόσθεσα το 'mb-20' (margin bottom) εδώ για να αφήνει κενό στο τέλος
        <div className="bg-[#e5e5e5] rounded-3xl p-8 w-full max-w-4xl shadow-lg text-[#303030] mb-20">
            <h1 className="text-3xl font-bold mb-8 text-left">Βιβλιάριο Υγείας Κατοικιδίου</h1>

            {/* Top Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                {/* Pet Name */}
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Όνομα Κατοικιδίου</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        Φέλιξ
                    </div>
                </div>

                 {/* Species */}
                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Είδος</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        Σκύλος
                    </div>
                </div>

                 {/* Gender */}
                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Φύλο</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        Αρσενικό
                    </div>
                </div>
            </div>

            {/* Microchip & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Κωδικός Μικροτσίπ</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        123456789
                    </div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Ημερομηνία Γέννησης</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        13/12/2018
                    </div>
                </div>
            </div>

            {/* Characteristics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Χρώμα</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">Μαύρο</div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Τρίχωμα</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">Κοντό</div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Φυλή</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">Scottish Terrier</div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Μικρό ζώο &lt;10kg</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">Ναι</div>
                </div>
            </div>

            {/* Owner Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Το Όνομα σας</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        Κίμωνας
                    </div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Το Επίθετο σας</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        Σμυρλιάνος
                    </div>
                </div>
            </div>

            <div className="flex flex-col text-left mb-10">
                <label className="text-sm font-semibold mb-1 ml-1">Το Email / Τηλέφωνο σας</label>
                <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                    kimonsmirlianos@gmail.com ή (+30) 6939949788
                </div>
            </div>

            {/* Medical Acts List */}
            <h2 className="text-2xl font-bold mb-6 text-left">Ιατρικές Πράξεις</h2>
            <div className="w-full mb-8">
                 {/* Header */}
                 <div className="flex justify-between font-semibold px-4 mb-2 border-b border-gray-400 pb-2">
                    <span className="flex-1 text-left">Τύπος</span>
                    <span className="flex-1 text-center">Κτηνίατρος</span>
                    <span className="flex-1 text-right">Ημερομηνία</span>
                 </div>
                 
                 {/* Rows */}
                 <div className="flex flex-col gap-4">
                     {mockMedicalActs.map((act, index) => (
                         <div key={index} className="flex justify-between items-center text-gray-700 px-4 py-2 bg-[#f9f9f9] rounded-xl">
                             <span className="flex-1 text-left">{act.type}</span>
                             <span className="flex-1 text-center">{act.vet}</span>
                             <span className="flex-1 text-right">{act.date}</span>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Print Button */}
            <div className="flex justify-end">
                <button 
                    onClick={() => window.print()}
                    className="bg-[#5c5c5c] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#4a4a4a] transition-colors"
                >
                    Εκτύπωση
                </button>
            </div>
        </div>
    );
}

export default HealthBook;