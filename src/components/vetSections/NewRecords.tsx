import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Record } from "../models/Info";
import styles from "./page.module.css";
import DownArrow from "../../assets/down_arrow.png";
import RightArrow from "../../assets/right_arrow.png";

function NewRecords() {
    const navigate = useNavigate();
    const vet = JSON.parse(localStorage.getItem("pawrtal_user")!);
    const [open, setOpen] = useState(false);

    // record stage
    type Mode = "edit" | "draft" | "preview";
    const [mode, setMode] = useState<Mode>("edit");

    const [formData, setFormData] = useState({
        vetId: "",
        petName: "",
        microchip: "",
        ownerName: "",
        reason: "",
        ownerStatus: "",
        createdAt: new Date(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        const confirmLogout = window.confirm(
            "Είστε σίγουροι ότι θέλετε να κανετε οριστική υποβολή;",
        );
        if (!confirmLogout) return;

        const newRecord = {
            petName: formData.petName,
            microchip: formData.microchip,
            vetId: vet.id,
            ownerName: formData.ownerName,
            reason: formData.reason,
            ownerStatus: formData.ownerStatus,
            createdAt: formData.createdAt,
        };

        const response = await fetch("http://localhost:3001/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecord),
        });

        const savedRecord = await response.json();
        navigate("/vet", { state: { view: "records" } });
    };

    useEffect(() => {
        const draft = localStorage.getItem("record-draft");
        if (draft) {
            setFormData(JSON.parse(draft));
            setMode("draft");
        }
    }, []);

    return (
        <>
            <h1 className=" text-[#303030] m-auto my-6 text-3xl ">Καταγραφή Επίσκεψης</h1>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="max-w-sm">
                    <p className=" text-[#505050] m-auto my-4 max-w-sm text-medium px-4 sm:max-w-xl sm:text-xl ">
                        Μπορείτε να δηλώσετε στο σύστημα πληροφοριες σχετικά με Επισκεψη.
                    </p>

                    {/* Arrow */}
                    <div className="w-full text-left mx-4 px-4">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="text-lg text-[#003066] p-2 flex flex-row items-center gap-2 rounded justify-center hover:bg-[#e2e2e2] cursor-pointer border"
                        >
                            Χρησιμες Πληροφοριες
                            {open ? (
                                <img src={DownArrow} alt="free" className="w-4 h-4 pt-0.5" />
                            ) : (
                                <img src={RightArrow} alt="free" className="w-4 h-4 pt-0.5" />
                            )}
                        </button>
                    </div>

                    {/* Dropdown */}
                    {open && (
                        <>
                            <p className=" text-[#505050] m-auto my-4 max-w-sm text-medium px-4 sm:max-w-xl sm:text-xl ">
                                Με βαση το{" "}
                                <span className="text-[#006fd6]">
                                    αναγνωριστικο αριθμό (Microchip)
                                </span>
                                , του κατοικιδίου δηλώνετε στο ψηφιακό βιβλιάριο υγείας ή
                                συγκεκριμένη επίσκεψη.
                            </p>

                            <p className=" text-[#505050] m-auto my-4 max-w-sm text-medium px-4 sm:max-w-xl sm:text-xl ">
                                Με την <span className="text-[#006fd6]">προσωρινή αποθήκευση</span>,
                                τα στοιχεία που συμπληρώθηκαν θα αποθηκεύτουν προσωρινά στην μνημη
                                και θα διαγραφούν με την αποσύνδεση σας.
                            </p>
                        </>
                    )}
                </div>
                <div className="bg-[#ffffff] border w-xs rounded-2xl p-auto py-2 m-auto sm:w-lg">
                    <div className="flex-1 flex flex-col items-center">
                        <div
                            className="
                        flex flex-col items-center p-2 gap-2 w-2xs
                        sm:flex-row sm:items-start sm:w-full sm:p-8 sm:gap-5
                    "
                        >
                            <div className="flex-1 flex flex-col items-center justify-center text-left">
                                <label className="flex flex-col">
                                    Ονομα Κατοικίδιου
                                    <input
                                        value={formData.petName}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        id="petName"
                                        type="text"
                                        placeholder="Ονομα"
                                        disabled={mode === "preview"}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    Ονοματεπωνυμο Ιδιοκτήτη
                                    <input
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        id="ownerName"
                                        type="text"
                                        placeholder="Ονοματεπωνυμο"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Αριθμός μικροτσίπ
                                    <input
                                        value={formData.microchip}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        id="microchip"
                                        type="text"
                                        placeholder="πχ. 123456789"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center text-left">
                                <label className="flex flex-col">
                                    Κατασταση Ιδιοκτήτη
                                    <select
                                        value={formData.ownerStatus}
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm"
                                        onChange={handleChange}
                                        name="mode"
                                        id="ownerStatus"
                                        disabled={mode === "preview"}
                                    >
                                        <option value={""}>Επιλογή Ενέργειας --</option>
                                        <option value={"metavivasi"}>Μεταβίβαση</option>
                                        <option value={"uiothsia"}>Yιοθεσία</option>
                                        <option value={"anadoxh"}>Αναδοχή</option>
                                    </select>
                                </label>
                                <label className="flex flex-col">
                                    Ιατρική Πράξη
                                    <select
                                        value={formData.reason}
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm"
                                        onChange={handleChange}
                                        name="mode"
                                        id="reason"
                                        disabled={mode === "preview"}
                                    >
                                        <option value="">Εμφάνιση επιλογών --</option>
                                        <optgroup label="Προληπτικός έλεγχος">
                                            <option value="checkup">Γενικός έλεγχος</option>
                                            <option value="vaccination">Εμβολιασμός</option>
                                            <option value="deworming">Αποπαρασίτωση</option>
                                            <option value="microchip">Τοποθέτηση microchip</option>
                                            <option value="neutering">Στείρωση</option>
                                        </optgroup>
                                        <optgroup label="Εξετάσεις">
                                            <option value="blood_tests">
                                                Αιματολογικές εξετάσεις
                                            </option>
                                            <option value="urine_tests">Εξετάσεις ούρων</option>
                                            <option value="imaging">Ακτινογραφία / Υπέρηχος</option>
                                        </optgroup>
                                        <optgroup label="Αλλο">
                                            <option value="sick">Ασθένεια/Συμπτώματα Ιωσης</option>
                                            <option value="injury">Τραυματισμός</option>
                                            <option value="chronic_condition">Χρόνια πάθηση</option>
                                            <option value="pregnancy">Κύηση</option>
                                            <option value="emergency">Έκτακτο</option>
                                            <option value="other">Άλλος λόγος</option>
                                        </optgroup>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center">
                            {mode === "preview" && (
                                <button
                                    onClick={() => setMode("edit")}
                                    className="bg-[#ffffff] text-[#414141] m-2 px-6 py-4 rounded-2xl shadow-2xs border cursor-pointer hover:duration-500 hover:bg-[#efefef] hover:shadow-lg hover:shadow-gray-300"
                                >
                                    Επεξεργασία
                                </button>
                            )}
                            {mode !== "preview" && (
                                <button
                                    onClick={() => {
                                        localStorage.setItem(
                                            "record-draft",
                                            JSON.stringify(formData),
                                        );
                                        setMode("preview"); // κλειδώνουμε τα πεδία
                                        alert("Η καταχώρηση αποθηκεύτηκε προσωρινά 💾");
                                    }}
                                    className="bg-[#ffffff70] text-[#000000] m-2 px-6 py-4 rounded-2xl shadow-2xs border cursor-pointer hover:duration-500 hover:bg-[#e9e9e9] hover:shadow-lg hover:shadow-gray-300"
                                >
                                    Προσωρινή Αποθήκευση
                                </button>
                            )}
                            <button
                                onClick={async () => {
                                    await handleSubmit();
                                    navigate("/vet?view=records");
                                    localStorage.removeItem("record-draft");
                                }}
                                className="bg-[#252525] text-white m-2 px-6 py-4 rounded-2xl shadow-2xs cursor-pointer hover:duration-500 hover:bg-[#434343] hover:shadow-lg hover:shadow-gray-300"
                            >
                                Οριστική Υποβολή
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default NewRecords;
