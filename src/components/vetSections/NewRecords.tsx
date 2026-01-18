import { useState } from "react";
import styles from "./page.module.css";
import { Record } from "../models/Info";
import DownArrow from "../../assets/down_arrow.png";
import RightArrow from "../../assets/right_arrow.png";

type NewRecordsProps = {
    records: Record[];
    setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
};

function NewRecords({ records, setRecords }: NewRecordsProps) {
    const vet = JSON.parse(localStorage.getItem("user")!);
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        petId: "",
        species: "",
        vetId: "",
        ownerName: "",
        ownerEmail: "",
        condition: "",
        age: 0,
        gender: "",
        ownerStatus: "",
        createdAt: new Date(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        const newRecord = {
            petId: formData.petId,
            species: formData.species,
            vetId: vet.id,
            ownerName: formData.ownerName,
            ownerEmail: formData.ownerEmail,
            condition: formData.condition,
            age: Number(formData.age),
            gender: formData.gender,
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

        // ενημέρωση UI από το backend (σωστό pattern)
        setRecords((prev) => [...prev, savedRecord]);

        console.log("New record saved:", savedRecord);
    };

    return (
        <div className="flex-1 flex flex-col items-center">
            {/* Arrow */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="text-lg p-2 flex flex-row items-center gap-1 rounded justify-center  hover:bg-[#cccccc]"
            >
                Χρησιμες Πληροφοριες
                {open ? (
                    <img src={DownArrow} alt="free" className="w-4 h-4" />
                ) : (
                    <img src={RightArrow} alt="free" className="w-4 h-4" />
                )}
            </button>
            {/* Dropdown */}
            {open && (
                <div
                    className="
                        bg-gray-100 mt-2 ml-8 p-3 rounded-xl
                        text-sm text-gray-700 text-left
                    "
                >
                    <p>
                        Για να καταχωρηθει το κατοικιδιο στο σύστημα χρειάζεται να αποκτησει τον
                        αναγνωριστικο αριθμό (Microchip). <br />
                        Επιπλεον το αναγνωριστικο του Ιδιοκτήτη στην συγκεκριμενη εφαρμογη.
                        (Βρισκεται στο προφιλ του)
                    </p>
                </div>
            )}
            <div
                className="
                flex-1 flex flex-col items-start p-8 gap-5 w-[calc(100%+2rem)]
                sm:flex-row  
                "
            >
                <div className="flex-1 flex flex-col items-center justify-center text-left">
                    <label className="flex flex-col">
                        Ειδος κατοικίδιου
                        <input
                            value={formData.species}
                            onChange={handleChange}
                            className={styles.profile_tag}
                            id="species"
                            type="text"
                            placeholder="πχ. Σκυλος"
                        />
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
                        >
                            <option value={""}>Select Condition --</option>
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
                        />
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
                        />
                    </label>
                    <label className="flex flex-col">
                        Φύλο
                        <select
                            value={formData.gender}
                            className={styles.profile_tag}
                            onChange={handleChange}
                            id="gender"
                        >
                            <option value={""}>Select Gender --</option>
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
                        >
                            <option value={""}>Select Action --</option>
                            <option value={"metavivasi"}>Μεταβίβαση</option>
                            <option value={"uiothsia"}>Yιοθεσία</option>
                            <option value={"anadoxh"}>αναδοχή</option>
                        </select>
                    </label>
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="bg-[#f9f9f9] text-black m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#efefef] hover:shadow-lg hover:shadow-gray-300"
            >
                Καταχώρηση
            </button>
        </div>
    );
}
export default NewRecords;
