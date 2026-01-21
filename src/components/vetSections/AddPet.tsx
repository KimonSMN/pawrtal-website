import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page.module.css";
import { Record } from "../models/Info";
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
        id: "",
        ownerId: "",
        name: "",
        species: "",
        breed: "",
        age: 0,
        gender: "",
        microchip: "",
        color: "",
        coat: "",
        birthDate: "",
        lastSeenDate: "",
        location: "",
        description: "",
        photo: "",
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
            ownerId: formData.ownerId,
            vetId: vet.id,
            name: formData.name,
            species: vet.species,
            breed: formData.breed,
            age: Number(formData.age),
            gender: formData.gender,
            microchip: formData.microchip,
            color: formData.color,
            coat: formData.coat,
            birthDate: formData.birthDate,
            lastSeenDate: formData.lastSeenDate,
            location: formData.location,
            description: formData.description,
            createdAt: formData.createdAt,
        };

        const response = await fetch("http://localhost:3001/pets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecord),
        });

        navigate("/vet", { state: { view: "records" } });

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
            <h1 className=" text-[#303030] m-auto mb-8 text-xl sm:text-3xl ">
                Φόρμα Καταχώρησης Kατοικίδιου
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="max-w-sm">
                    <p className=" text-[#505050] m-auto my-4 max-w-sm text-medium px-4 sm:max-w-xl sm:text-xl ">
                        Μπορειτε να δηλωσετε στο συστημα κατοικίδια που δεν εχουν καταχωρηθει
                        προηγουμένως, συμπληρώνοντας τα παρακατω στοιχεία.
                    </p>

                    {/* Arrow */}
                    <div className="w-full text-left mx-4 px-4">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="text-lg text-[#003066] p-2 flex flex-row items-center gap-2 rounded justify-center hover:bg-[#e2e2e2]"
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
                                Με την <span className="text-[#006fd6]">προσωρινή αποθήκευση</span>,
                                τα στοιχεία που συμπληρώθηκαν θα αποθηκεύτουν προσωρινά στην μνημη
                                και θα διαγραφούν με την αποσύνδεση σας.
                            </p>
                            <p className=" text-[#505050] m-auto my-4 max-w-sm text-sm px-4 sm:max-w-xl sm:text-lg ">
                                Για την καταχώρηση ενός κατοικιδίου στο σύστημα χρειάζεται να
                                γνωρίζετε τον{" "}
                                <span className="text-[#006fd6]">
                                    αναγνωριστικο αριθμό (Microchip)
                                </span>
                                .
                            </p>

                            <div className="bg-gray-100 mt-2 mx-2 p-3 rounded-xl text-sm text-gray-700 text-left max-w-lg">
                                !! Επιπλεον το αναγνωριστικο του Ιδιοκτήτη στην συγκεκριμενη
                                εφαρμογη μπορει να ανακτηθει στην σελιδα προφιλ.
                            </div>
                        </>
                    )}
                </div>
                <div className="bg-[#e5e5e5] w-xs rounded-2xl p-auto py-2 m-auto border-none shadow shadow-gray-500 sm:w-lg">
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
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="name"
                                        type="text"
                                        placeholder="Ονομα"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Είδος κατοικίδιου
                                    <select
                                        id="species"
                                        name="species"
                                        value={formData.species}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        disabled={mode === "preview"}
                                    >
                                        <option value="">Εμφάνιση επιλογών --</option>

                                        <optgroup label="Συνηθισμένα">
                                            <option value="dog">Σκύλος</option>
                                            <option value="cat">Γάτα</option>
                                            <option value="rabbit">Κουνέλι</option>
                                            <option value="hamster">Χάμστερ</option>
                                            <option value="guinea_pig">Ινδικό χοιρίδιο</option>
                                        </optgroup>

                                        <optgroup label="Πτηνά">
                                            <option value="parrot">Παπαγάλος</option>
                                            <option value="canary">Καναρίνι</option>
                                            <option value="finch">Σπίνος</option>
                                        </optgroup>

                                        <optgroup label="Ερπετά">
                                            <option value="turtle">Χελώνα</option>
                                            <option value="lizard">Σαύρα</option>
                                            <option value="gecko">Γκέκο</option>
                                        </optgroup>

                                        <optgroup label="Ψάρια">
                                            <option value="fish_freshwater">
                                                Ψάρι γλυκού νερού
                                            </option>
                                            <option value="fish_saltwater">
                                                Ψάρι θαλασσινού νερού
                                            </option>
                                        </optgroup>

                                        <optgroup label="Άλλα">
                                            <option value="other">Άλλο</option>
                                        </optgroup>
                                    </select>
                                </label>

                                <label className="flex flex-col">
                                    ID Ιδιοκτήτη
                                    <input
                                        value={formData.ownerId}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="ownerId"
                                        type="text"
                                        placeholder="πχ 2794013"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Φύλο Κατοικίδιου
                                    <select
                                        value={formData.gender}
                                        className={styles.profile_tag}
                                        onChange={handleChange}
                                        name="mode"
                                        id="gender"
                                        disabled={mode === "preview"}
                                    >
                                        <option value={""}>Επιλογή Φύλου --</option>
                                        <option value={"Θηλυκό"}>Θηλυκό</option>
                                        <option value={"Αρσενικό"}>Αρσενικό</option>
                                    </select>
                                </label>
                                <label className="flex flex-col">
                                    Αριθμός μικροτσίπ
                                    <input
                                        value={formData.microchip}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="microchip"
                                        type="text"
                                        placeholder="πχ. 123456789"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Ημερομηνία Γέννησης
                                    <input
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="birthDate"
                                        type="date"
                                        disabled={mode === "preview"}
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
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Ράτσα
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
                                        value={formData.coat}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="coat"
                                        type="text"
                                        placeholder="πχ. κοντό"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Χρωμα Τριχώματος
                                    <input
                                        value={formData.color}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="color"
                                        type="text"
                                        placeholder="πχ. Μαυρο"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Τοποθεσία
                                    <input
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="location"
                                        type="text"
                                        placeholder="πχ. Αθήνα"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Μικρή Περιγραφή
                                    <input
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={styles.profile_tag}
                                        id="description"
                                        type="text"
                                        placeholder="πχ. Μεγαλο σκυλί, φιλικό"
                                        disabled={mode === "preview"}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center">
                            {mode === "preview" && (
                                <button
                                    onClick={() => setMode("edit")}
                                    className="bg-[#ffffff] text-[#414141] m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#efefef] hover:shadow-lg hover:shadow-gray-300"
                                >
                                    Επιστροφή σε επεξεργασία
                                </button>
                            )}
                            {mode !== "preview" && (
                                <button
                                    onClick={() => {
                                        localStorage.setItem(
                                            "record-draft",
                                            JSON.stringify(formData),
                                        );
                                        setMode("preview");
                                        alert("Η καταχώρηση αποθηκεύτηκε προσωρινά 💾");
                                    }}
                                    className="bg-[#ffffff] text-[#414141] m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#e9e9e9] hover:shadow-lg hover:shadow-gray-300"
                                >
                                    Προσωρινή Αποθήκευση
                                </button>
                            )}

                            <button
                                onClick={async () => {
                                    await handleSubmit();
                                    localStorage.removeItem("record-draft");
                                    setMode("edit");
                                    navigate("/vet?view=records");
                                }}
                                className="bg-[#252525] text-white m-2 px-6 py-4 rounded-2xl shadow-2xs hover:duration-500 hover:bg-[#434343] hover:shadow-lg hover:shadow-gray-300"
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
