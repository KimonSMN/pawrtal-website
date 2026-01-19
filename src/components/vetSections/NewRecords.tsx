import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Record } from "../models/Info";
import DownArrow from "../../assets/down_arrow.png";
import RightArrow from "../../assets/right_arrow.png";

function NewRecords() {
    const vet = JSON.parse(localStorage.getItem("pawrtal_user")!);
    const [open, setOpen] = useState(false);

    // record stage
    type Mode = "edit" | "draft" | "preview";
    const [mode, setMode] = useState<Mode>("edit");

    const [formData, setFormData] = useState({
        petName: "",
        petId: "",
        species: "",
        vetId: "",
        ownerName: "",
        ownerEmail: "",
        condition: "",
        age: 0,
        gender: "",
        breed: "",
        ownerStatus: "",
        hair: "",
        hairColor: "",
        animalSize: "",
        createdAt: new Date(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        const newRecord = {
            petName: formData.petName,
            petId: formData.petId,
            species: formData.species,
            vetId: vet.id,
            ownerName: formData.ownerName,
            ownerEmail: formData.ownerEmail,
            condition: formData.condition,
            age: Number(formData.age),
            gender: formData.gender,
            breed: formData.breed,
            ownerStatus: formData.ownerStatus,
            hair: formData.hair,
            hairColor: formData.hairColor,
            animalSize: formData.animalSize,
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

        alert("Τα στοιχεία καταχωρήθηκαν ✔");
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
            <h1 className=" text-[#303030] m-auto my-4 text-3xl ">Νεα καταχώρηση</h1>
            <div className="bg-[#e9e9e990] w-xs rounded-2xl p-auto py-2 m-auto sm:w-lg">
                <div className="flex-1 flex flex-col items-center">
                    {/* Arrow */}
                    <div className="w-full text-left mx-4 px-4">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="text-lg p-2 flex flex-row items-center gap-1 rounded justify-center hover:bg-[#cccccc]"
                        >
                            Χρησιμες Πληροφοριες
                            {open ? (
                                <img src={DownArrow} alt="free" className="w-4 h-4" />
                            ) : (
                                <img src={RightArrow} alt="free" className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {/* Dropdown */}
                    {open && (
                        <div
                            className="
                        bg-gray-100 mt-2 ml-8 p-3 rounded-xl
                        text-sm text-gray-700 text-left max-w-lg
                    "
                        >
                            <p>
                                Για να καταχωρηθει το κατοικιδιο στο σύστημα χρειάζεται να αποκτησει
                                τον αναγνωριστικο αριθμό (Microchip). <br />
                                Επιπλεον το αναγνωριστικο του Ιδιοκτήτη στην συγκεκριμενη εφαρμογη.
                                (Βρισκεται στο προφιλ του)
                            </p>
                        </div>
                    )}
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
                                    className={styles.profile_tag}
                                    id="petName"
                                    type="text"
                                    placeholder="Ονομα"
                                    disabled={mode === "preview"}
                                />
                            </label>
                            <label className="flex flex-col">
                                Ειδος κατοικίδιου
                                <select
                                    value={formData.species}
                                    className={styles.profile_tag}
                                    onChange={handleChange}
                                    name="mode"
                                    id="species"
                                    disabled={mode === "preview"}
                                >
                                    <option value={""}>Εμφάνιση Επιλογών --</option>
                                    <option value={"Σκύλος"}>Σκύλος</option>
                                    <option value={"Γάτα"}>Γάτα</option>
                                    <option value={""}>Άλλο</option>
                                </select>
                            </label>

                            <label className="flex flex-col">
                                Ονοματεπωνυμο Ιδιοκτήτη
                                <input
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    className={styles.profile_tag}
                                    id="ownerName"
                                    type="text"
                                    placeholder="Ονοματεπωνυμο"
                                    disabled={mode === "preview"}
                                />
                            </label>
                            <label className="flex flex-col">
                                Κατασταση Κατοικίδιου
                                <select
                                    value={formData.condition}
                                    className={styles.profile_tag}
                                    onChange={handleChange}
                                    name="mode"
                                    id="condition"
                                    disabled={mode === "preview"}
                                >
                                    <option value={""}>Επιλογή Κατάστασης --</option>
                                    <option value={"apwleia"}>Απωλεια</option>
                                    <option value={"euresi"}>Ευρεση</option>
                                    <option value={"keno"}>Κενο</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                Αριθμός μικροτσίπ
                                <input
                                    value={formData.petId}
                                    onChange={handleChange}
                                    className={styles.profile_tag}
                                    id="petId"
                                    type="text"
                                    placeholder="πχ. 123456789"
                                    disabled={mode === "preview"}
                                />
                            </label>
                            <label className="flex flex-col">
                                Μικρό ζώο &lt;10kg
                                <select
                                    value={formData.animalSize}
                                    className={styles.profile_tag}
                                    onChange={handleChange}
                                    name="mode"
                                    id="animalSize"
                                    disabled={mode === "preview"}
                                >
                                    <option value={""}>Εμφάνιση Επιλογών --</option>
                                    <option value={"nai"}>Ναι</option>
                                    <option value={"oxi"}>Όχι</option>
                                    <option value={"keno"}>Κενο</option>
                                </select>
                            </label>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-left">
                            <label className="flex flex-col">
                                Ηλικία
                                <input
                                    value={formData.age}
                                    className={styles.profile_tag}
                                    onChange={handleChange}
                                    id="age"
                                    type="number"
                                    min="0"
                                    placeholder="πχ. 7"
                                    disabled={mode === "preview"}
                                />
                            </label>
                            <label className="flex flex-col">
                                Φυλή
                                <input
                                    value={formData.breed}
                                    onChange={handleChange}
                                    className={styles.profile_tag}
                                    id="breed"
                                    type="text"
                                    placeholder="πχ. Λαμπραντόρ"
                                    disabled={mode === "preview"}
                                />
                            </label>
                            <label className="flex flex-col">
                                Τρίχωμα
                                <input
                                    value={formData.hair}
                                    onChange={handleChange}
                                    className={styles.profile_tag}
                                    id="hair"
                                    type="text"
                                    placeholder="πχ. κοντό"
                                    disabled={mode === "preview"}
                                />
                            </label>
                            <label className="flex flex-col">
                                Χρωμα Τριχώματος
                                <input
                                    value={formData.hairColor}
                                    onChange={handleChange}
                                    className={styles.profile_tag}
                                    id="hairColor"
                                    type="text"
                                    placeholder="πχ. μαυρο"
                                    disabled={mode === "preview"}
                                />
                            </label>
                            <label className="flex flex-col">
                                Φύλο
                                <select
                                    value={formData.gender}
                                    className={styles.profile_tag}
                                    onChange={handleChange}
                                    id="gender"
                                    disabled={mode === "preview"}
                                >
                                    <option value={""}>Επιλογή Φυλου --</option>
                                    <option value={"female"}>Θυλικό</option>
                                    <option value={"male"}>Αρσενικό</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                Κατασταση Ιδιοκτήτη
                                <select
                                    value={formData.ownerStatus}
                                    className={styles.profile_tag}
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
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center">
                        {mode !== "preview" && (
                            <button
                                onClick={() => setMode("preview")}
                                className="bg-[#252525] text-white m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#808080] hover:shadow-lg hover:shadow-gray-400"
                            >
                                Προεπισκόπηση
                            </button>
                        )}

                        {mode !== "preview" && (
                            <button
                                onClick={() => {
                                    localStorage.setItem("record-draft", JSON.stringify(formData));
                                    setMode("draft");
                                    alert("Η καταχώρηση αποθηκεύτηκε προσωρινά 💾");
                                }}
                                className="bg-[#ffffff] text-[#414141] m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#e9e9e9] hover:shadow-lg hover:shadow-gray-300"
                            >
                                Προσωρινή Αποθήκευση
                            </button>
                        )}

                        {mode === "preview" && (
                            <button
                                onClick={async () => {
                                    await handleSubmit();
                                    localStorage.removeItem("record-draft");
                                    setMode("edit");
                                }}
                                className="bg-[#252525] text-white m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#434343] hover:shadow-lg hover:shadow-gray-300"
                            >
                                Οριστική Υποβολή
                            </button>
                        )}
                        {mode === "preview" && (
                            <button
                                onClick={() => setMode("edit")}
                                className="bg-[#ffffff] text-[#414141] m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#efefef] hover:shadow-lg hover:shadow-gray-300"
                            >
                                Επιστροφή σε επεξεργασία
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default NewRecords;
