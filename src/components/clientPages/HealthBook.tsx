import React, { useState, useEffect } from "react";

interface MedicalAct {
    id: string;
    type: string;
    vetName: string;
    date: string;
}

function HealthBook() {
    // State
    const [pets, setPets] = useState<any[]>([]); // Λίστα με όλα τα κατοικίδια
    const [selectedPet, setSelectedPet] = useState<any>(null); // Το επιλεγμένο κατοικίδιο
    const [user, setUser] = useState<any>(null);
    const [medicalActs, setMedicalActs] = useState<MedicalAct[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper για μορφοποίηση ημερομηνίας (YYYY-MM-DD -> DD/MM/YYYY)
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("el-GR"); // π.χ. 15/01/2021
    };

    // 1. Fetch User & Pets
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Χρήση του σωστού κλειδιού από το AuthProvider
                const storedUser = localStorage.getItem("pawrtal_user");
                if (!storedUser) {
                    setLoading(false);
                    return;
                }

                const currentUser = JSON.parse(storedUser);
                const userId = currentUser.id;

                // Φέρνουμε τον User από DB
                const userRes = await fetch(`http://localhost:3001/users/${userId}`);
                const userData = await userRes.json();
                setUser(userData);

                // Φέρνουμε ΟΛΑ τα κατοικίδια του χρήστη
                const petsRes = await fetch(`http://localhost:3001/pets?ownerId=${userId}`);
                const petsData = await petsRes.json();

                if (petsData.length > 0) {
                    setPets(petsData);
                    setSelectedPet(petsData[0]); // Επιλέγουμε αυτόματα το πρώτο
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // 2. Fetch Medical Acts
    useEffect(() => {
        if (selectedPet) {
            const fetchActs = async () => {
                try {
                    // Χρησιμοποιούμε το petId αν υπάρχει, αλλιώς το id
                    const targetId = selectedPet.id;
                    const actsRes = await fetch(`http://localhost:3001/medical_acts?petId=${targetId}`);
                    const actsData = await actsRes.json();
                    setMedicalActs(actsData);
                } catch (error) {
                    console.error("Error fetching medical acts:", error);
                }
            };
            fetchActs();
        }
    }, [selectedPet]);

    // Handler για αλλαγή κατοικιδίου
    const handlePetChange = (petId: string) => {
        const newPet = pets.find(p => p.id === petId);
        if (newPet) {
            setSelectedPet(newPet);
        }
    };

    if (loading) return <div className="p-10 text-center text-xl">Φόρτωση Βιβλιαρίου...</div>;
    if (!user) return <div className="p-10 text-center text-xl text-red-600">Παρακαλώ συνδεθείτε.</div>;
    
    if (!selectedPet) return (
        <div className="bg-[#e5e5e5] rounded-3xl p-8 w-full max-w-4xl shadow-lg text-[#303030] mb-20 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Βιβλιάριο Υγείας</h1>
            <p className="text-xl text-gray-600">Δεν βρέθηκαν κατοικίδια για τον λογαριασμό σας.</p>
        </div>
    );

    return (
        <div className="bg-[#e5e5e5] rounded-3xl p-8 w-full max-w-4xl shadow-lg text-[#303030] mb-20">
            <h1 className="text-3xl font-bold mb-8 text-left">Βιβλιάριο Υγείας Κατοικιδίου</h1>

            {/* Top Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                {/* Pet Name - Dropdown */}
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Όνομα Κατοικιδίου</label>
                    {pets.length > 1 ? (
                        <div className="relative">
                            <select
                                value={selectedPet.id}
                                onChange={(e) => handlePetChange(e.target.value)}
                                className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer font-medium"
                            >
                                {pets.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3 font-medium">
                            {selectedPet.name}
                        </div>
                    )}
                </div>

                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Είδος</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3 capitalize">
                        {/* Μετάφραση αν είναι στα αγγλικά στο DB */}
                        {selectedPet.species === "dog" ? "Σκύλος" : selectedPet.species === "cat" ? "Γάτα" : selectedPet.species}
                    </div>
                </div>
                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Φύλο</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        {selectedPet.gender === "male" ? "Αρσενικό" : selectedPet.gender === "female" ? "Θηλυκό" : (selectedPet.gender || "-")}
                    </div>
                </div>
            </div>

            {/* Υπόλοιπα Στοιχεία */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Κωδικός Μικροτσίπ</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        {selectedPet.microchip || selectedPet.id}
                    </div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Ηλικία / Ημ. Γέννησης</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        {selectedPet.birthDate 
                            ? `${formatDate(selectedPet.birthDate)} (${selectedPet.age} ετών)` 
                            : `${selectedPet.age} ετών`
                        }
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Χρώμα</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">{selectedPet.color || "-"}</div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Τρίχωμα</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">{selectedPet.coat || "-"}</div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Φυλή</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">{selectedPet.breed || "-"}</div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Περιοχή</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">{selectedPet.location || "-"}</div>
                </div>
            </div>

            {/* Στοιχεία Ιδιοκτήτη */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Ονοματεπώνυμο</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                        {user.fullName || user.name}
                    </div>
                </div>
                <div className="flex flex-col text-left">
                    <label className="text-sm font-semibold mb-1 ml-1">Πόλη</label>
                    <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">{user.city || "-"}</div>
                </div>
            </div>

            <div className="flex flex-col text-left mb-10">
                <label className="text-sm font-semibold mb-1 ml-1">Email / Τηλέφωνο</label>
                <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3">
                    {user.email} / {user.phone_number}
                </div>
            </div>

            {/* Ιατρικές Πράξεις List */}
            <h2 className="text-2xl font-bold mb-6 text-left">Ιατρικές Πράξεις: {selectedPet.name}</h2>
            <div className="w-full mb-8">
                 <div className="flex justify-between font-semibold px-4 mb-2 border-b border-gray-400 pb-2">
                    <span className="flex-1 text-left">Τύπος</span>
                    <span className="flex-1 text-center">Κτηνίατρος</span>
                    <span className="flex-1 text-right">Ημερομηνία</span>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                     {medicalActs.length === 0 ? (
                         <div className="text-center text-gray-500 py-4 italic">
                             Δεν υπάρχουν καταχωρημένες πράξεις για τον/την {selectedPet.name}.
                         </div>
                     ) : (
                         medicalActs.map((act) => (
                             <div key={act.id} className="flex justify-between items-center text-gray-700 px-4 py-2 bg-[#f9f9f9] rounded-xl">
                                 <span className="flex-1 text-left">{act.type}</span>
                                 <span className="flex-1 text-center">{act.vetName}</span>
                                 <span className="flex-1 text-right">{act.date}</span>
                             </div>
                         ))
                     )}
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