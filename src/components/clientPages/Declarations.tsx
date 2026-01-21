import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Προσθήκη Link για την ανακατεύθυνση
// Εικόνες
import lostPetImg from "../../assets/lost_a_pet.jpg";
import foundPetImg from "../../assets/dog_1.jpg";

export type DeclarationStep = "list" | "lost-form" | "found-form" | "preview";

interface DeclarationsProps {
    step: DeclarationStep;
    setStep: (step: DeclarationStep) => void;
}

// --- SUB-COMPONENTS ---

const Dashboard = ({ handleNewDeclaration, declarations, handleEdit, handleView }: any) => (
    <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            <div
                onClick={() => handleNewDeclaration("lost")}
                className="flex-1 bg-white rounded-3xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all group max-w-md mx-auto w-full border border-gray-200"
            >
                <div className="h-48 overflow-hidden">
                    <img
                        src={lostPetImg}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Lost"
                    />
                </div>
                <div className="p-6 text-center font-bold text-xl text-[#303030]">
                    Δήλωση Απώλειας
                </div>
            </div>

            <div
                onClick={() => handleNewDeclaration("found")}
                className="flex-1 bg-white rounded-3xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all group max-w-md mx-auto w-full border border-gray-200"
            >
                <div className="h-48 overflow-hidden">
                    <img
                        src={foundPetImg}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Found"
                    />
                </div>
                <div className="p-6 text-center font-bold text-xl text-[#303030]">
                    Δήλωση Εύρεσης
                </div>
            </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-8 text-[#303030] text-center sm:text-left">
                Ιστορικό Δηλώσεων
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr className="text-gray-600 border-b border-gray-300">
                            <th className="pb-4 pl-4 text-left w-[25%]">Τύπος</th>
                            <th className="pb-4 text-center w-[15%]">Κατοικίδιο</th>
                            <th className="pb-4 text-center w-[20%]">Ημερομηνία</th>
                            <th className="pb-4 text-center w-[25%]">Κατάσταση</th>
                            <th className="pb-4 pr-4 text-right w-[15%]">Ενέργειες</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {declarations.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    Δεν βρέθηκαν δηλώσεις στο ιστορικό.
                                </td>
                            </tr>
                        ) : (
                            declarations.map((item: any, idx: number) => {
                                const isFinal = item.status === "submitted";
                                const typeLabel =
                                    item.type === "lost" ? "Δήλωση Απώλειας" : "Δήλωση Εύρεσης";
                                const statusLabel =
                                    item.status === "saved"
                                        ? "Προσωρινή Αποθήκευση"
                                        : "Οριστική Υποβολή";
                                const statusColor =
                                    item.status === "saved"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800";

                                return (
                                    <tr
                                        key={item.id || idx}
                                        className="bg-[#f9f9f9] border-b-8 border-white last:border-0 rounded-xl"
                                    >
                                        <td className="py-5 pl-4 rounded-l-xl font-medium text-gray-700 text-left">
                                            {typeLabel}
                                        </td>
                                        <td className="py-5 text-gray-600 text-center">
                                            {item.petName || "-"}
                                        </td>
                                        <td className="py-5 text-gray-600 text-center">
                                            {item.date}
                                        </td>
                                        <td className="py-5 text-center">
                                            <span
                                                className={`px-4 py-2 rounded-full text-xs font-bold ${statusColor}`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td className="py-5 pr-4 rounded-r-xl text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    disabled={isFinal}
                                                    onClick={() => handleEdit(item)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isFinal
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 cursor-pointer"
                                                    }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleView(item)}
                                                    className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 text-blue-700 transition-colors cursor-pointer"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                        />
                                                    </svg>
                                                </button>
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

const DeclarationForm = ({
    type,
    formData,
    handleInputChange,
    handlePetSelection,
    handleImageUpload,
    pets,
    user,
    handleSave,
    errors,
    imagePreview,
}: any) => {
    // Φιλτράρισμα λίστας για το dropdown
    const availablePets = type === "found" ? pets.filter((p: any) => p.status === "lost") : pets;

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-lg max-w-5xl mx-auto w-full border border-gray-200">
            <h1 className="text-3xl font-bold mb-3 text-[#303030] text-left">
                {formData.id
                    ? "Επεξεργασία Δήλωσης"
                    : type === "lost"
                      ? "Δήλωση απώλειας κατοικιδίου"
                      : "Δήλωση εύρεσης κατοικιδίου"}
            </h1>
            <p className="text-gray-600 mb-10 text-sm text-left">
                Τα πεδία με * είναι υποχρεωτικά για την οριστική υποβολή.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                        {type === "found"
                            ? "Βρέθηκε το δικό σας; (Επιλογή)"
                            : "Όνομα Κατοικιδίου (Επιλογή)"}
                    </label>

                    {/* Μήνυμα αν δεν υπάρχουν χαμένα ζώα στη Δήλωση Εύρεσης */}
                    {type === "found" && availablePets.length === 0 && (
                        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 w-full">
                            Δεν έχετε δηλώσει απώλεια κατοικιδίου. <br />
                            Αν βρήκατε κάποιο άλλο ζώο,{" "}
                            <Link to="/" className="underline font-bold hover:text-blue-900">
                                ελέγξτε τις αγγελίες στην Αρχική
                            </Link>
                            .
                        </div>
                    )}

                    <select
                        className="w-full bg-[#f9f9f9] border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                        onChange={(e) => handlePetSelection(e.target.value)}
                        value={pets.find((p: any) => p.name === formData.petName)?.id || ""}
                    >
                        <option value="" disabled>
                            Επιλέξτε...
                        </option>

                        {/* Εμφάνιση επιλογών ΜΟΝΟ αν υπάρχουν διαθέσιμα ζώα */}
                        {availablePets.length > 0
                            ? availablePets.map((p: any) => (
                                  <option key={p.id} value={p.id}>
                                      {p.name}
                                  </option>
                              ))
                            : /* Αν είναι 'lost' και δεν έχει καθόλου ζώα */
                              type === "lost" && (
                                  <option value="" disabled>
                                      Δεν βρέθηκαν κατοικίδια
                                  </option>
                              )}

                        {/* Επιλογή για εύρεση ξένου ζώου - Πάντα διαθέσιμη στο Found */}
                        {type === "found" && <option value="unknown">Βρήκα ξένο ζώο</option>}
                    </select>
                </div>

                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Είδος *</label>
                    <select
                        value={formData.species}
                        onChange={(e) => handleInputChange("species", e.target.value)}
                        className={`w-full bg-[#f9f9f9] border rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 cursor-pointer ${errors.species ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"}`}
                    >
                        <option value="" disabled>
                            Επιλέξτε
                        </option>
                        <option>Σκύλος</option>
                        <option>Γάτα</option>
                    </select>
                    {errors.species && (
                        <span className="text-red-500 text-xs ml-1 mt-1">{errors.species}</span>
                    )}
                </div>
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">Φύλο *</label>
                    <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className={`w-full bg-[#f9f9f9] border rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 cursor-pointer ${errors.gender ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"}`}
                    >
                        <option value="" disabled>
                            Επιλέξτε
                        </option>
                        <option>Αρσενικό</option>
                        <option>Θηλυκό</option>
                    </select>
                    {errors.gender && (
                        <span className="text-red-500 text-xs ml-1 mt-1">{errors.gender}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="flex flex-col items-start max-w-md w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                        Κωδικός Μικροτσίπ
                    </label>
                    <input
                        type="text"
                        placeholder="123456789"
                        value={formData.microchip}
                        onChange={(e) => handleInputChange("microchip", e.target.value)}
                        className="w-full bg-[#f9f9f9] border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="flex flex-col items-start max-w-xl w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                        Τοποθεσία που {type === "lost" ? "χάθηκε" : "βρέθηκε"} *
                    </label>
                    <input
                        type="text"
                        placeholder="π.χ. Αετιδέων 43, Χολαργός, Αθήνα"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className={`w-full bg-[#f9f9f9] border rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 ${errors.location ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"}`}
                    />
                    {errors.location && (
                        <span className="text-red-500 text-xs ml-1 mt-1">{errors.location}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="flex flex-col items-start max-w-xs w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                        Ημερομηνία *
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className={`w-full bg-[#f9f9f9] border rounded-xl p-3.5 text-sm text-gray-500 focus:outline-none focus:ring-2 cursor-pointer ${errors.date ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-gray-400"}`}
                    />
                    {errors.date && (
                        <span className="text-red-500 text-xs ml-1 mt-1">{errors.date}</span>
                    )}
                </div>
            </div>

            <div className="mb-10 w-full">
                <label className="text-xs font-bold mb-2 ml-1 text-gray-600 block text-left">
                    Ανεβάστε φωτογραφία του κατοικιδίου (Προαιρετικό)
                </label>
                <div className="flex items-center gap-4">
                    {/* File Input */}
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full bg-[#f9f9f9] border border-dashed border-gray-400 rounded-xl p-12 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100 transition-colors cursor-pointer">
                            {imagePreview
                                ? "Αλλαγή φωτογραφίας"
                                : "Επιλέξτε αρχεία ή σύρετε τα εδώ"}
                        </div>
                    </div>

                    {/* Small Preview next to upload box if image exists */}
                    {imagePreview && (
                        <div className="h-32 w-32 shrink-0 rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>

            <hr className="border-gray-300 mb-8" />

            {/* Στοιχεία Χρήστη */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                        Το Όνομα σας
                    </label>
                    <div className="w-full bg-[#f9f9f9] border border-gray-300 rounded-xl p-3.5 text-sm text-gray-700 text-left">
                        {user ? (user.fullName || user.name || "").split(" ")[0] : "..."}
                    </div>
                </div>
                <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                        Το Επίθετο σας
                    </label>
                    <div className="w-full bg-[#f9f9f9] border border-gray-300 rounded-xl p-3.5 text-sm text-gray-700 text-left">
                        {user ? (user.fullName || user.name || "").split(" ")[1] || "-" : "..."}
                    </div>
                </div>
            </div>

            <div className="mb-8 w-full flex flex-col items-start">
                <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                    Το Email / Τηλέφωνο σας
                </label>
                <div className="w-full bg-[#f9f9f9] border border-gray-300 rounded-xl p-3.5 text-sm text-gray-700 text-left">
                    {user ? `${user.email} / ${user.phone_number}` : "..."}
                </div>
            </div>

            <div className="mb-12 w-full flex flex-col items-start">
                <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                    Επιπλέον Πληροφορίες
                </label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Οποιαδήποτε πρόσθετη πληροφορία που μπορεί να βοηθήσει..."
                ></textarea>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
                <button
                    onClick={() => handleSave("submitted")}
                    className="px-8 py-3 bg-[#5c5c5c] text-white font-bold rounded-xl hover:bg-[#4a4a4a] transition-colors shadow-md cursor-pointer"
                >
                    {formData.id ? "Αποθήκευση Αλλαγών" : "Οριστική Υποβολή"}
                </button>
                <button
                    onClick={() => handleSave("saved")}
                    className="px-8 py-3 bg-[#9ca3af] text-white font-bold rounded-xl hover:bg-[#888f9b] transition-colors shadow-md cursor-pointer"
                >
                    Προσωρινή Αποθήκευση
                </button>
            </div>
        </div>
    );
};

const Preview = ({ previewData, user, setStep, imagePreview }: any) => (
    <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-lg max-w-5xl mx-auto w-full border border-gray-200">
        <h1 className="text-2xl font-bold mb-10 text-[#303030] text-center">
            Προεπισκόπηση Δήλωσης {previewData?.type === "lost" ? "Απώλειας" : "Εύρεσης"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
                <label className="text-xs font-bold mb-2 text-gray-600">Όνομα Κατοικιδίου</label>
                <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm text-center">
                    {previewData?.petName || "-"}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <label className="text-xs font-bold mb-2 text-gray-600">Είδος</label>
                <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm text-center">
                    {previewData?.species || "Σκύλος"}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <label className="text-xs font-bold mb-2 text-gray-600">Φύλο</label>
                <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm text-center">
                    {previewData?.gender || "Αρσενικό"}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 mb-8">
            <div className="flex flex-col items-center md:items-start max-w-xs mx-auto md:mx-0">
                <label className="text-xs font-bold mb-2 ml-1 text-gray-600">
                    Κωδικός Μικροτσίπ
                </label>
                <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm text-center">
                    {previewData?.microchip || "-"}
                </div>
            </div>
        </div>

        <div className="mb-8 flex flex-col items-center">
            <label className="text-xs font-bold mb-2 text-gray-600">Τοποθεσία</label>
            <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm w-full md:w-2/3 text-center">
                {previewData?.location || "-"}
            </div>
        </div>

        <div className="mb-8 flex flex-col items-center">
            <label className="text-xs font-bold mb-2 text-gray-600">Ημερομηνία</label>
            <div className="bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm w-48 text-center">
                {previewData?.date || "-"}
            </div>
        </div>

        <div className="mb-10 flex flex-col items-center">
            <label className="text-xs font-bold mb-2 text-gray-600">
                Φωτογραφία του κατοικιδίου
            </label>
            <div className="h-64 w-full md:w-2/3 rounded-xl overflow-hidden bg-gray-300 shadow-inner flex items-center justify-center bg-gray-200">
                {/* LOGIC FOR IMAGE PREVIEW */}
                {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                    <div className="text-gray-500">Δεν υπάρχει φωτογραφία</div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center">
                <label className="text-xs font-bold mb-2 text-gray-600">Το Όνομα σας</label>
                <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm text-center">
                    {(user?.fullName || user?.name || "").split(" ")[0]}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <label className="text-xs font-bold mb-2 text-gray-600">Το Επίθετο σας</label>
                <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm text-center">
                    {(user?.fullName || user?.name || "").split(" ")[1]}
                </div>
            </div>
        </div>

        <div className="mb-8 flex flex-col items-center">
            <label className="text-xs font-bold mb-2 text-gray-600">Το Email / Τηλέφωνο σας</label>
            <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm text-center">
                {user ? `${user.email} / ${user.phone_number}` : "-"}
            </div>
        </div>

        <div className="mb-12 flex flex-col items-center">
            <label className="text-xs font-bold mb-2 text-gray-600">Επιπλέον Πληροφορίες</label>
            <div className="w-full bg-[#f9f9f9] border border-gray-400 rounded-xl p-3.5 text-sm h-24 text-center flex items-center justify-center px-4">
                {previewData?.description || "Καμία περιγραφή."}
            </div>
        </div>

        <div className="flex justify-center">
            <button
                onClick={() => setStep("list")}
                className="px-8 py-3 bg-[#7a7a7a] text-white font-bold rounded-xl hover:bg-[#666] transition-colors shadow-md cursor-pointer"
            >
                Επιστροφή στο Ιστορικό Δηλώσεων
            </button>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export default function Declarations({ step, setStep }: DeclarationsProps) {
    const [declarations, setDeclarations] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({}); // Validation errors

    // IMAGE STATE
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<any>({
        petName: "",
        type: "lost",
        species: "Σκύλος",
        gender: "Αρσενικό",
        location: "",
        date: "",
        microchip: "",
        description: "",
    });

    const [previewData, setPreviewData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem("pawrtal_user");
                if (!storedUser) {
                    setLoading(false);
                    return;
                }
                const currentUser = JSON.parse(storedUser);
                const userId = currentUser.id;

                const userRes = await fetch(`http://localhost:3001/users/${userId}`);
                const userData = await userRes.json();
                setUser(userData);

                const petsRes = await fetch(`http://localhost:3001/pets?ownerId=${userId}`);
                const petsData = await petsRes.json();
                setPets(petsData);

                const decRes = await fetch(`http://localhost:3001/declarations?userId=${userId}`);
                let decData = await decRes.json();

                if (Array.isArray(decData)) {
                    decData.sort(
                        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
                    );
                }

                setDeclarations(decData);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [step]);

    // HANDLERS
    const handleNewDeclaration = (type: "lost" | "found") => {
        setFormData({
            petName: "",
            type: type,
            species: "Σκύλος",
            gender: "Αρσενικό",
            location: "",
            date: new Date().toISOString().split("T")[0],
            microchip: "",
            description: "",
        });
        setErrors({});

        // Reset Logic για την πρώτη φόρτωση
        // Αν είναι 'lost', προ-επιλέγουμε το πρώτο κατοικίδιο της λίστας
        if (type === "lost" && pets.length > 0) {
            const firstPet = pets[0];
            setImagePreview(firstPet.photo || null);
            setFormData((prev: any) => ({
                ...prev,
                petName: firstPet.name,
                microchip: firstPet.microchip || "",
            }));
        }
        // Αν είναι 'found', ΔΕΝ προ-επιλέγουμε τίποτα (γιατί μπορεί να βρήκε ξένο ζώο)
        else {
            setImagePreview(null);
        }

        setStep(type === "lost" ? "lost-form" : "found-form");
    };

    const handleEdit = (declaration: any) => {
        setFormData(declaration);
        setErrors({});
        // Logic to try and find the photo if it exists on a pet
        if (declaration.petName) {
            const matchedPet = pets.find((p) => p.name === declaration.petName);
            setImagePreview(matchedPet?.photo || null);
        } else {
            setImagePreview(null);
        }
        setStep(declaration.type === "lost" ? "lost-form" : "found-form");
    };

    const handleView = (declaration: any) => {
        setPreviewData(declaration);
        if (declaration.petName) {
            const matchedPet = pets.find((p) => p.name === declaration.petName);
            setImagePreview(matchedPet?.photo || null);
        } else {
            setImagePreview(null);
        }
        setStep("preview");
    };

    const handlePetSelection = (petId: string) => {
        if (petId === "unknown") {
            setFormData((prev: any) => ({
                ...prev,
                petName: "",
                microchip: "",
                species: "Σκύλος", // Reset to default
                gender: "Αρσενικό",
            }));
            setImagePreview(null);
            return;
        }

        const selectedPet = pets.find((p) => p.id === petId);
        if (selectedPet) {
            const mappedSpecies = selectedPet.species === "cat" ? "Γάτα" : "Σκύλος";
            const mappedGender =
                selectedPet.gender === "female" || selectedPet.gender === "Θηλυκό"
                    ? "Θηλυκό"
                    : "Αρσενικό";

            // Set Image
            setImagePreview(selectedPet.photo || null);

            setFormData((prev: any) => ({
                ...prev,
                petName: selectedPet.name,
                species: mappedSpecies,
                gender: mappedGender,
                microchip: selectedPet.microchip || "",
            }));
        }
    };

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            // Create a local URL for preview
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    // Validation Logic
    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.species) newErrors.species = "Το είδος είναι υποχρεωτικό";
        if (!formData.gender) newErrors.gender = "Το φύλο είναι υποχρεωτικό";
        if (!formData.location) newErrors.location = "Η τοποθεσία είναι υποχρεωτική";
        if (!formData.date) newErrors.date = "Η ημερομηνία είναι υποχρεωτική";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Universal Save Handler
    const handleSave = async (status: "submitted" | "saved") => {
        if (!user) return;

        const confirmMessage =
            status === "submitted"
                ? "Είστε σίγουροι ότι θέλετε να προχωρήσετε σε οριστική υποβολή;"
                : "Θέλετε να αποθηκεύσετε την δήλωση προσωρινά;";

        if (!window.confirm(confirmMessage)) return;

        if (status === "submitted") {
            const isValid = validateForm();
            if (!isValid) {
                alert("Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία.");
                return;
            }
        }

        const declarationToSave = {
            ...formData,
            userId: user.id,
            status: status,
        };

        const method = formData.id ? "PUT" : "POST";
        const url = formData.id
            ? `http://localhost:3001/declarations/${formData.id}`
            : "http://localhost:3001/declarations";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(declarationToSave),
            });

            if (!res.ok) {
                throw new Error(`Server Error: ${res.statusText}`);
            }

            const savedData = await res.json();

            // 1. Logic for LOST -> FOUND
            if (status === "submitted" && formData.type === "found" && formData.petName) {
                const matchedPet = pets.find((p) => p.name === formData.petName);
                if (matchedPet && matchedPet.status === "lost") {
                    await fetch(`http://localhost:3001/pets/${matchedPet.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "found" }), // Or 'normal'
                    });
                }
            }

            // 2. Logic for NORMAL -> LOST
            if (status === "submitted" && formData.type === "lost" && formData.petName) {
                const matchedPet = pets.find((p) => p.name === formData.petName);
                if (matchedPet) {
                    await fetch(`http://localhost:3001/pets/${matchedPet.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "lost" }),
                    });
                }
            }

            if (status === "submitted") {
                setPreviewData(savedData);
                setStep("preview");
            } else {
                alert("Η δήλωση αποθηκεύτηκε επιτυχώς!");
                setStep("list");
            }
        } catch (error) {
            console.error("Failed to save:", error);
            alert(
                "Υπήρξε πρόβλημα κατά την αποθήκευση. Βεβαιωθείτε ότι το json-server τρέχει και το endpoint 'declarations' υπάρχει.",
            );
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: null }));
        }
    };

    if (loading) return <div className="p-10 text-center">Φόρτωση...</div>;
    if (!user) return <div className="p-10 text-center text-red-600">Παρακαλώ συνδεθείτε.</div>;

    return (
        <div className="w-full pb-24">
            {step === "list" && (
                <Dashboard
                    setStep={setStep}
                    handleNewDeclaration={handleNewDeclaration}
                    declarations={declarations}
                    handleEdit={handleEdit}
                    handleView={handleView}
                />
            )}
            {(step === "lost-form" || step === "found-form") && (
                <DeclarationForm
                    type={step === "lost-form" ? "lost" : "found"}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handlePetSelection={handlePetSelection}
                    handleImageUpload={handleImageUpload}
                    pets={pets}
                    user={user}
                    handleSave={handleSave}
                    setStep={setStep}
                    errors={errors}
                    imagePreview={imagePreview}
                />
            )}
            {step === "preview" && (
                <Preview
                    previewData={previewData}
                    user={user}
                    setStep={setStep}
                    imagePreview={imagePreview}
                />
            )}
        </div>
    );
}
