import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// Εικόνες
import vetProfileImg from "../../assets/Vets.webp"; 
import Empty from "../../assets/empty.png";
import Half from "../../assets/half.png";
import Full from "../../assets/full.svg";

export type AppointmentStep = 
    | "search" 
    | "vet-list" 
    | "vet-profile" 
    | "booking" 
    | "success" 
    | "view-details" 
    | "edit-booking"
    | "cancel-confirmation";

interface Props {
    step: AppointmentStep;
    setStep: (step: AppointmentStep) => void;
}

// --- HELPER COMPONENTS ---

const Stepper = ({ current }: { current: number }) => {
    const steps = ["Συμπλήρωση Στοιχείων", "Επιλογή Κτηνιάτρου", "Υποβολή Ραντεβού", "Επιβεβαίωση"];
    return (
        <div className="flex justify-between items-start w-full max-w-2xl mx-auto mb-12 relative px-4 z-0">
            <div className="absolute top-5 left-12 right-12 h-0.5 bg-black -z-10" />
            {steps.map((label, idx) => {
                const isActive = idx <= current;
                return (
                    <div key={idx} className="flex flex-col items-center w-24">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-[#ebebeb] 
                            ${isActive ? 'border-black bg-gray-400' : 'border-black'}`}>
                        </div>
                        <span className="text-xs text-center mt-2 font-medium text-gray-600 leading-tight">{label}</span>
                    </div>
                );
            })}
        </div>
    );
};

// --- SUB COMPONENTS ---

// 1. Search & History
const SearchAndHistory = ({ 
    searchFilters, 
    setSearchFilters, 
    handleSearch, 
    setStep, 
    appointments, 
    pets, 
    setSelectedAppointment 
}: any) => (
    <div className="w-full">
        <Stepper current={0} />
        
        <h2 className="text-xl font-bold mb-4 text-[#303030]">Συμπληρώστε όσες πληροφορίες επιθυμείτε</h2>
        
        {/* SEARCH BAR CONTAINER */}
        <div className="w-full shadow-md rounded-lg overflow-hidden mb-4 border border-gray-300">
            <div className="grid grid-cols-[1fr_1fr_1.5fr_1.5fr_160px]">
                
                {/* HEADER ROW */}
                <div className="bg-[#dcdcdc] py-3 text-center text-sm font-bold text-gray-700 border-r border-b border-gray-300">Ημερομηνία</div>
                <div className="bg-[#dcdcdc] py-3 text-center text-sm font-bold text-gray-700 border-r border-b border-gray-300">Ώρα</div>
                <div className="bg-[#dcdcdc] py-3 text-center text-sm font-bold text-gray-700 border-r border-b border-gray-300">Περιοχή</div>
                <div className="bg-[#dcdcdc] py-3 text-center text-sm font-bold text-gray-700 border-r border-b border-gray-300">Ειδίκευση</div>
                <div className="bg-[#dcdcdc] border-b border-gray-300"></div>

                {/* INPUT ROW */}
                <div className="bg-white flex items-center justify-center px-2 border-r border-gray-200 h-16">
                    <input 
                        type="date" 
                        className="w-full text-sm text-gray-600 focus:outline-none bg-transparent text-center" 
                        value={searchFilters.date}
                        onChange={(e) => setSearchFilters((prev: any) => ({...prev, date: e.target.value}))}
                    />
                </div>

                <div className="bg-white flex items-center justify-center px-2 border-r border-gray-200 h-16">
                    <input 
                        type="time" 
                        className="focus:outline-none bg-transparent text-sm text-gray-600 text-center w-full" 
                        value={searchFilters.time}
                        onChange={(e) => setSearchFilters((prev: any) => ({...prev, time: e.target.value}))}
                    />
                </div>

                <div className="bg-white flex items-center px-4 border-r border-gray-200 h-16 relative">
                    <input 
                        type="text" 
                        placeholder="πχ. Χολαργός" 
                        className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent" 
                        value={searchFilters.location}
                        onChange={(e) => setSearchFilters((prev: any) => ({...prev, location: e.target.value}))}
                    />
                    <span className="text-gray-400 absolute right-2">📍</span>
                </div>

                <div className="bg-white flex items-center px-4 border-r border-gray-200 h-16">
                    <select 
                        className="w-full text-sm text-gray-600 focus:outline-none bg-transparent cursor-pointer"
                        value={searchFilters.specialty}
                        onChange={(e) => setSearchFilters((prev: any) => ({...prev, specialty: e.target.value}))}
                    >
                        <option value="">Όλες οι ειδικότητες</option>
                        <option value="Χειρούργος">Χειρούργος</option>
                        <option value="Ορθοπαιδικός">Ορθοπαιδικός</option>
                        <option value="Παθολόγος">Παθολόγος</option>
                        <option value="Δερματολόγος">Δερματολόγος</option>
                    </select>
                </div>

                <div className="bg-white flex items-center justify-center px-2 h-16">
                    <button 
                        onClick={handleSearch} 
                        className="bg-[#7a7a7a] text-white w-full py-2.5 rounded-lg font-bold hover:bg-[#666] transition-colors text-sm shadow-sm"
                    >
                        Αναζήτηση
                    </button>
                </div>
            </div>
        </div>

        <div className="text-center mb-12">
            <button 
                onClick={() => { setSearchFilters({ date: "", time: "", location: "", specialty: "" }); setStep("vet-list"); }}
                className="text-gray-500 text-sm underline hover:text-black transition-colors"
            >
                Προβολή όλων των κτηνιάτρων χωρίς κριτήρια
            </button>
        </div>

        {/* History Table */}
        <div className="bg-[#e5e5e5] rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-[#303030]">Ιστορικό Ραντεβού</h3>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr className="text-gray-600 text-sm border-b border-gray-400">
                            <th className="pb-3 text-left pl-4 w-[20%]">Λόγος</th>
                            <th className="pb-3 text-center w-[15%]">Κατοικίδιο</th>
                            <th className="pb-3 text-center w-[25%]">Ημερομηνία</th>
                            <th className="pb-3 text-center w-[20%]">Κατάσταση</th>
                            <th className="pb-3 text-right pr-4 w-[20%]">Ενέργειες</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {appointments.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-4 text-gray-500">Δεν βρέθηκαν ραντεβού.</td></tr>
                        ) : (
                            appointments.map((item: any) => {
                                const dateObj = new Date(item.date);
                                const dateStr = dateObj.toLocaleDateString("el-GR");
                                const timeStr = dateObj.toLocaleTimeString("el-GR", { hour: '2-digit', minute: '2-digit' });
                                
                                let statusLabel = item.status;
                                let statusClass = "bg-gray-200 text-gray-600";
                                if (item.status === "new" || item.status === "pending") { statusLabel = "Εκκρεμές"; statusClass = "bg-yellow-100 text-yellow-800"; }
                                if (item.status === "approved") { statusLabel = "Εγκεκριμένο"; statusClass = "bg-blue-100 text-blue-800"; }
                                if (item.status === "completed") { statusLabel = "Πραγματοποιημένο"; statusClass = "bg-green-100 text-green-800"; }
                                if (item.status === "canceled") { statusLabel = "Ακυρωμένο"; statusClass = "bg-red-100 text-red-800"; }

                                const petName = item.petName || pets.find((p:any) => p.id === item.petId)?.name || "-";

                                return (
                                    <tr key={item.id} className="bg-[#f9f9f9] border-b-8 border-[#e5e5e5] last:border-0 rounded-xl">
                                        <td className="py-4 pl-4 rounded-l-xl font-medium text-gray-700">{item.reason}</td>
                                        <td className="py-4 text-center text-gray-600">{petName}</td>
                                        <td className="py-4 text-center text-gray-600">{dateStr} - {timeStr}</td>
                                        <td className="py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 rounded-r-xl text-right">
                                            <div className="flex justify-end gap-2">
                                                {(item.status === "new" || item.status === "approved") && (
                                                    <button 
                                                        onClick={() => { setSelectedAppointment(item); setStep("edit-booking"); }}
                                                        className="p-2 bg-[#e0e0e0] rounded-lg hover:bg-[#d0d0d0] text-gray-600 transition-colors"
                                                        title="Επεξεργασία"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                        </svg>
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    onClick={() => { setSelectedAppointment(item); setStep("view-details"); }}
                                                    className="p-2 bg-[#e0e0e0] rounded-lg hover:bg-[#d0d0d0] text-gray-600 transition-colors"
                                                    title="Προβολή"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </button>

                                                {(item.status === "new" || item.status === "approved") && (
                                                    <button 
                                                        onClick={() => { setSelectedAppointment(item); setStep("cancel-confirmation"); }}
                                                        className="p-2 bg-[#fcdcdc] rounded-lg hover:bg-[#f5c6c6] text-red-600 transition-colors"
                                                        title="Ακύρωση"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// 2. View Appointment Details
const AppointmentDetails = ({ selectedAppointment, setStep }: any) => {
    if (!selectedAppointment) return null;
    const dateObj = new Date(selectedAppointment.date);
    
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-[#303030] text-center">Λεπτομέρειες Ραντεβού</h2>
            <div className="bg-[#e5e5e5] rounded-[2rem] p-10 shadow-lg max-w-3xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-[#5c5c5c]"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-[#303030]">{selectedAppointment.vetName}</h3>
                        <p className="text-gray-500 font-medium">Κτηνίατρος</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        selectedAppointment.status === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {selectedAppointment.status === 'new' ? 'Εκκρεμές' : 
                         selectedAppointment.status === 'approved' ? 'Εγκεκριμένο' :
                         selectedAppointment.status === 'canceled' ? 'Ακυρωμένο' : 'Ολοκληρωμένο'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-300">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Κατοικιδιο</p>
                        <p className="text-lg font-medium text-gray-800">{selectedAppointment.petName || selectedAppointment.pet}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-300">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Αιτιολογια</p>
                        <p className="text-lg font-medium text-gray-800">{selectedAppointment.reason}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-300">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Ημερομηνια</p>
                        <p className="text-lg font-medium text-gray-800">{dateObj.toLocaleDateString("el-GR")}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-300">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Ωρα</p>
                        <p className="text-lg font-medium text-gray-800">{dateObj.toLocaleTimeString("el-GR", {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button onClick={() => setStep("search")} className="bg-[#5c5c5c] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4a4a4a] shadow-md transition-all">
                        Επιστροφή
                    </button>
                </div>
            </div>
        </div>
    );
};

// 3. Edit Appointment Form
const EditAppointmentForm = ({ selectedAppointment, setStep, handleUpdateAppointment }: any) => {
    const [date, setDate] = useState(selectedAppointment?.date ? new Date(selectedAppointment.date).toISOString().split('T')[0] : "");
    const [time, setTime] = useState(selectedAppointment?.date ? new Date(selectedAppointment.date).toLocaleTimeString("el-GR", {hour: '2-digit', minute:'2-digit'}) : "09:00");
    const [reason, setReason] = useState(selectedAppointment?.reason || "");

    const handleSave = () => {
        // Confirmation Dialog
        if (!window.confirm("Είστε σίγουροι ότι θέλετε να αποθηκεύσετε τις αλλαγές στο ραντεβού;")) {
            return;
        }

        // Construct new date object
        const newDateObj = new Date(date);
        const [hours, minutes] = time.split(':');
        newDateObj.setHours(parseInt(hours), parseInt(minutes));

        const updatedData = {
            date: newDateObj.toISOString(),
            reason: reason
        };
        handleUpdateAppointment(selectedAppointment.id, updatedData);
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-[#303030] text-center">Επεξεργασία Ραντεβού</h2>
            <div className="bg-[#e5e5e5] rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
                <div className="mb-6">
                    <label className="block text-gray-600 font-bold mb-2">Κτηνίατρος</label>
                    <div className="bg-white p-3 rounded-xl border border-gray-300 text-gray-500">{selectedAppointment?.vetName}</div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-600 font-bold mb-2">Κατοικίδιο</label>
                    <div className="bg-white p-3 rounded-xl border border-gray-300 text-gray-500">{selectedAppointment?.petName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-600 font-bold mb-2">Ημερομηνία</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-bold mb-2">Ώρα</label>
                        <input 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-white border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-gray-600 font-bold mb-2">Αιτιολογία</label>
                    <select 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        <option value="Εμβολιασμός">Εμβολιασμός</option>
                        <option value="Εξέταση">Εξέταση / Check-up</option>
                        <option value="Στείρωση">Στείρωση</option>
                        <option value="Έκτακτο">Έκτακτο Περιστατικό</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={() => setStep("search")} className="px-6 py-3 bg-gray-400 text-white font-bold rounded-xl hover:bg-gray-500">
                        Ακύρωση
                    </button>
                    <button onClick={handleSave} className="px-6 py-3 bg-[#5c5c5c] text-white font-bold rounded-xl hover:bg-[#4a4a4a] shadow-md">
                        Αποθήκευση
                    </button>
                </div>
            </div>
        </div>
    );
}

// 4. Vet List Component
const VetList = ({ vets, searchFilters, setSearchFilters, setStep, setSelectedVet }: any) => {
    const filteredVets = vets.filter((vet: any) => {
        const matchesLocation = searchFilters.location === "" || 
            (vet.city && vet.city.toLowerCase().includes(searchFilters.location.toLowerCase())) ||
            (vet.address && vet.address.toLowerCase().includes(searchFilters.location.toLowerCase()));

        const matchesSpecialty = searchFilters.specialty === "" || 
            (vet.specialty && vet.specialty === searchFilters.specialty) || 
            (vet.role === "vet" && searchFilters.specialty === ""); 

        return matchesLocation && matchesSpecialty;
    });

    return (
        <div className="w-full">
            <Stepper current={1} />
            <h2 className="text-2xl font-bold mb-6 text-[#303030]">
                {searchFilters.location || searchFilters.specialty ? "Αποτελέσματα Αναζήτησης" : "Όλοι οι Κτηνίατροι"}
            </h2>
            
            {(searchFilters.location || searchFilters.specialty) && (
                <div className="flex gap-2 mb-6">
                    {searchFilters.location && <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">📍 {searchFilters.location}</span>}
                    {searchFilters.specialty && <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">🩺 {searchFilters.specialty}</span>}
                    <button onClick={() => setSearchFilters({ ...searchFilters, location: "", specialty: "" })} className="text-red-500 text-sm underline ml-2">Καθαρισμός</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVets.length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-gray-500">
                        Δεν βρέθηκαν κτηνίατροι με αυτά τα κριτήρια.
                    </div>
                ) : (
                    filteredVets.map((vet: any) => (
                        <div key={vet.id} className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow">
                            <div className="h-64 md:h-auto md:w-2/5 bg-gray-200 overflow-hidden relative group">
                                <img src={vet.photo || vetProfileImg} className="w-full h-full object-cover" alt={vet.fullName} />
                            </div>
                            <div className="p-6 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="font-bold text-xl text-[#303030] mb-1">{vet.fullName || vet.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-2">{vet.specialty || "Κτηνίατρος"}</p>
                                    <p className="text-gray-400 text-sm flex items-center gap-1">📍 {vet.city || "Αθήνα"}</p>
                                </div>
                                <button 
                                    onClick={() => { setSelectedVet(vet); setStep("vet-profile"); }} 
                                    className="mt-4 w-full py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-colors"
                                >
                                    Προβολή
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// 5. Vet Profile Component
const VetProfile = ({ selectedVet, setStep }: any) => {
    if (!selectedVet) return <div>Error loading vet</div>;
    return (
        <div className="w-full">
            <Stepper current={1} />
            <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
                <div className="w-full md:w-1/3 rounded-[2rem] overflow-hidden shadow-lg h-[400px]">
                    <img src={selectedVet.photo || vetProfileImg} className="w-full h-full object-cover" alt="Dr" />
                </div>
                <div className="flex-1 pt-4">
                    <h1 className="text-4xl font-bold text-[#303030] mb-2">{selectedVet.fullName || selectedVet.name}</h1>
                    <p className="text-xl text-gray-500 mb-8 font-medium">{selectedVet.specialty || "Κτηνίατρος"}</p>
                    
                    <div className="mb-8">
                        <h3 className="font-bold mb-3 text-lg">Περιγραφή</h3>
                        <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                            {selectedVet.description || "Ο γιατρός δεν έχει προσθέσει περιγραφή."}
                        </p>
                    </div>
                    
                    <div className="mb-10 text-gray-600 space-y-2 bg-[#f9f9f9] p-4 rounded-xl w-fit">
                        <p className="flex items-center gap-2">📍 <span className="font-medium">{selectedVet.address}, {selectedVet.city}</span></p>
                        <p className="flex items-center gap-2">📞 <span className="font-medium">{selectedVet.phone_number}</span></p>
                    </div>

                    <button 
                        onClick={() => setStep("booking")}
                        className="bg-[#5c5c5c] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4a4a4a] shadow-lg hover:shadow-xl transition-all"
                    >
                        Κλείστε Ραντεβού
                    </button>
                </div>
            </div>
        </div>
    );
};

// 6. Booking Form Component
const BookingForm = ({ selectedVet, pets, bookingData, setBookingData, handleCreateAppointment }: any) => {
    const [date, setDate] = useState(bookingData.date);

    // Helper for dots
    const getStatusDot = (d: Date) => {
        const day = d.getDate();
        if (day % 3 === 0) return <img src={Full} alt="busy" className="w-4 h-4" />;
        if (day % 2 === 0) return <img src={Half} alt="half" className="w-4 h-4" />;
        return <img src={Empty} alt="free" className="w-4 h-4" />;
    };

    return (
        <div className="w-full">
            <Stepper current={2} />
            <div className="bg-[#e5e5e5] rounded-3xl p-8 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-2 text-[#303030]">Κράτηση Ραντεβού</h2>
                <p className="text-sm text-gray-500 mb-8 font-medium">με τον/την {selectedVet?.fullName || selectedVet?.name}</p>

                {/* Pet Selection */}
                <div className="mb-6">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Επιλογή Κατοικιδίου</label>
                    <select 
                        className="w-full bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium"
                        onChange={(e) => setBookingData((prev:any) => ({...prev, petId: e.target.value}))}
                        value={bookingData.petId}
                    >
                        <option value="">Επιλέξτε...</option>
                        {pets.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                        ))}
                    </select>
                </div>

                {/* Reason */}
                <div className="mb-6">
                    <label className="text-xs font-bold ml-1 mb-1 block text-gray-600">Αιτιολογία / Τύπος Ραντεβού</label>
                    <select 
                        className="w-full bg-white border border-gray-300 p-3.5 rounded-xl text-sm font-medium"
                        onChange={(e) => setBookingData((prev:any) => ({...prev, reason: e.target.value}))}
                        value={bookingData.reason}
                    >
                        <option value="">Επιλέξτε...</option>
                        <option value="Εμβολιασμός">Εμβολιασμός</option>
                        <option value="Εξέταση">Εξέταση / Check-up</option>
                        <option value="Στείρωση">Στείρωση</option>
                        <option value="Έκτακτο">Έκτακτο Περιστατικό</option>
                    </select>
                </div>

                {/* Calendar & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="text-xs font-bold ml-1 mb-2 block text-gray-600">Επιλογή Ημερομηνίας</label>
                        <div className="flex flex-col items-center bg-white p-4 rounded-xl border border-gray-300">
                            <div className="flex gap-4 mb-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><img src={Empty} className="w-3" /> Πολλή</span>
                                <span className="flex items-center gap-1"><img src={Half} className="w-3" /> Μέτρια</span>
                                <span className="flex items-center gap-1"><img src={Full} className="w-3" /> Καμία</span>
                            </div>
                            <Calendar
                                onChange={(d) => { setDate(d as Date); setBookingData((prev:any) => ({...prev, date: d as Date})) }}
                                value={date}
                                tileContent={({ date, view }) => view === "month" ? <div className="flex justify-center mt-1">{getStatusDot(date)}</div> : null}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold ml-1 mb-2 block text-gray-600">Επιλογή Ώρας</label>
                        <div className="grid grid-cols-3 gap-3">
                            {["09:00", "10:00", "11:00", "12:00", "17:00", "18:00", "19:00", "20:00"].map(time => (
                                <button 
                                    key={time}
                                    onClick={() => setBookingData((prev:any) => ({...prev, time}))}
                                    className={`p-2 rounded-lg border text-sm font-medium transition-colors 
                                        ${bookingData.time === time ? 'bg-[#5c5c5c] text-white border-[#5c5c5c]' : 'bg-white border-gray-300 hover:border-gray-400'}`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button onClick={handleCreateAppointment} className="bg-[#5c5c5c] text-white px-16 py-4 rounded-xl font-bold hover:bg-[#4a4a4a] text-lg shadow-lg hover:shadow-xl transition-all">
                        Οριστικοποίηση
                    </button>
                </div>
            </div>
        </div>
    );
};

// 7. Success Page
const SuccessPage = ({ setStep }: any) => (
    <div className="w-full text-center">
        <Stepper current={3} />
        <h2 className="text-3xl font-bold mb-4 mt-8 text-[#303030]">Επιτυχής Υποβολή!</h2>
        <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#303030] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#303030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
        </div>
        <p className="text-gray-600 max-w-xl mx-auto mb-12 font-medium">
            Το αίτημά σας καταχωρήθηκε. Θα λάβετε ειδοποίηση όταν ο κτηνίατρος το επιβεβαιώσει.
        </p>
        <button onClick={() => setStep("search")} className="bg-[#5c5c5c] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4a4a4a] shadow-md">
            Επιστροφή
        </button>
    </div>
);

// 8. Cancel Confirmation
const CancelConfirmation = ({ selectedAppointment, handleCancelAppointment, setStep }: any) => (
    <div className="w-full text-center mt-8">
        <div className="bg-[#e5e5e5] rounded-[2rem] p-10 shadow-lg max-w-2xl mx-auto relative overflow-hidden border-t-8 border-red-500">
            <h2 className="text-3xl font-bold mb-6 text-[#303030]">Ακύρωση Ραντεβού</h2>
            <p className="text-gray-600 font-medium mb-8">
                Είστε σίγουροι ότι θέλετε να ακυρώσετε το ραντεβού;
            </p>
            <div className="bg-white rounded-xl p-6 mb-8 text-left shadow-sm border border-gray-200">
                <p><strong>Λόγος:</strong> {selectedAppointment?.reason}</p>
                <p><strong>Ημερομηνία:</strong> {new Date(selectedAppointment?.date).toLocaleDateString("el-GR")}</p>
            </div>
            <div className="flex justify-center gap-6">
                <button onClick={() => setStep("search")} className="px-8 py-3 bg-[#9ca3af] text-white font-bold rounded-xl hover:bg-[#888f9b]">
                    Όχι, Επιστροφή
                </button>
                <button onClick={handleCancelAppointment} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md">
                    Ναι, Ακύρωση
                </button>
            </div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export default function ClientAppointments({ step, setStep }: Props) {
    const [user, setUser] = useState<any>(null);
    const [pets, setPets] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [vets, setVets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [selectedVet, setSelectedVet] = useState<any>(null);
    
    // Search Filters
    const [searchFilters, setSearchFilters] = useState({
        date: "",
        time: "09:00",
        location: "",
        specialty: ""
    });

    // Booking Form State
    const [bookingData, setBookingData] = useState({
        petId: "",
        reason: "",
        date: new Date(),
        time: "09:00"
    });

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem("pawrtal_user");
                if (!storedUser) {
                    setLoading(false);
                    return;
                }
                const currentUser = JSON.parse(storedUser);
                
                // 1. User
                const userRes = await fetch(`http://localhost:3001/users/${currentUser.id}`);
                const userData = await userRes.json();
                setUser(userData);

                // 2. Pets
                const petsRes = await fetch(`http://localhost:3001/pets?ownerId=${currentUser.id}`);
                const petsData = await petsRes.json();
                setPets(petsData);

                // 3. Appointments
                const appRes = await fetch(`http://localhost:3001/appointments?ownerId=${currentUser.id}`);
                const appData = await appRes.json();
                appData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setAppointments(appData);

                // 4. Vets
                const vetsRes = await fetch(`http://localhost:3001/users?role=vet`);
                const vetsData = await vetsRes.json();
                setVets(vetsData);

            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [step]); 

    // --- HANDLERS ---
    const handleSearch = () => {
        if (searchFilters.date) {
            setBookingData(prev => ({ ...prev, date: new Date(searchFilters.date) }));
        }
        if (searchFilters.time) {
            setBookingData(prev => ({ ...prev, time: searchFilters.time }));
        }
        setStep("vet-list");
    };

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return;
        try {
            await fetch(`http://localhost:3001/appointments/${selectedAppointment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "canceled" })
            });
            setStep("search");
        } catch (error) {
            console.error("Error canceling:", error);
        }
    };

    const handleCreateAppointment = async () => {
        if (!user || !selectedVet || !bookingData.petId) {
            alert("Παρακαλώ συμπληρώστε όλα τα πεδία");
            return;
        }

        const confirmMessage = `Είστε σίγουροι ότι θέλετε να κλείσετε ραντεβού με τον/την ${selectedVet.fullName || selectedVet.name} για τις ${new Date(bookingData.date).toLocaleDateString("el-GR")} στις ${bookingData.time};`;
        if (!window.confirm(confirmMessage)) return;

        const selectedPet = pets.find(p => p.id === bookingData.petId);
        const appointmentDate = new Date(bookingData.date);
        const [hours, minutes] = bookingData.time.split(':');
        appointmentDate.setHours(parseInt(hours), parseInt(minutes));

        const newAppointment = {
            pet: selectedPet?.species || "pet",
            petId: bookingData.petId,
            petName: selectedPet?.name,
            vetId: selectedVet.id,
            vetName: selectedVet.fullName || selectedVet.name,
            ownerId: user.id,
            reason: bookingData.reason,
            date: appointmentDate.toISOString(),
            status: "new"
        };

        try {
            await fetch("http://localhost:3001/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAppointment)
            });
            setStep("success");
        } catch (error) {
            console.error("Error creating appointment:", error);
        }
    };

    const handleUpdateAppointment = async (id: string, updatedData: any) => {
        try {
            await fetch(`http://localhost:3001/appointments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });
            alert("Το ραντεβού ενημερώθηκε επιτυχώς!");
            setStep("search");
        } catch (error) {
            console.error("Error updating:", error);
            alert("Σφάλμα κατά την ενημέρωση.");
        }
    };

    if (loading) return <div className="p-10 text-center">Φόρτωση...</div>;
    if (!user) return <div className="p-10 text-center text-red-600">Παρακαλώ συνδεθείτε.</div>;

    return (
        <div className="w-full flex justify-center pb-24"> 
            {step === "search" && 
                <SearchAndHistory 
                    searchFilters={searchFilters} 
                    setSearchFilters={setSearchFilters}
                    handleSearch={handleSearch}
                    setStep={setStep}
                    appointments={appointments}
                    pets={pets}
                    setSelectedAppointment={setSelectedAppointment}
                />
            }
            {step === "vet-list" && 
                <VetList 
                    vets={vets}
                    searchFilters={searchFilters}
                    setSearchFilters={setSearchFilters}
                    setStep={setStep}
                    setSelectedVet={setSelectedVet}
                />
            }
            {step === "vet-profile" && 
                <VetProfile 
                    selectedVet={selectedVet}
                    setStep={setStep}
                />
            }
            {step === "booking" && 
                <BookingForm 
                    selectedVet={selectedVet}
                    pets={pets}
                    bookingData={bookingData}
                    setBookingData={setBookingData}
                    handleCreateAppointment={handleCreateAppointment}
                />
            }
            {step === "success" && <SuccessPage setStep={setStep} />}
            {step === "cancel-confirmation" && 
                <CancelConfirmation 
                    selectedAppointment={selectedAppointment}
                    handleCancelAppointment={handleCancelAppointment}
                    setStep={setStep}
                />
            }
            {step === "view-details" && 
                <AppointmentDetails 
                    selectedAppointment={selectedAppointment}
                    setStep={setStep}
                />
            }
            {step === "edit-booking" && 
                <EditAppointmentForm 
                    selectedAppointment={selectedAppointment}
                    setStep={setStep}
                    handleUpdateAppointment={handleUpdateAppointment}
                />
            }
        </div>
    );
}