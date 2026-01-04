import styles from "./page.module.css";

function NewRecords() {
    return (
        <div
            className="
            flex-1 flex flex-col items-start p-8 gap-5 w-[calc(100%+2rem)]
            sm:flex-row sm:mb-16 
        "
        >
            <div className="flex-1 flex flex-col items-center justify-center text-left">
                <label className="flex flex-col">
                    Ειδος κατοικίδιου
                    <input
                        className={styles.profile_tag}
                        id="species"
                        type="text"
                        placeholder="πχ. Σκυλος"
                    />
                </label>

                <label className="flex flex-col">
                    Ονοματεπωνυμο Ιδιοκτήτη
                    <input
                        className={styles.profile_tag}
                        id="text"
                        type="text"
                        placeholder="Ονοματεπωνυμο"
                    />
                </label>
                <label className="flex flex-col">
                    Κατασταση Κατοικίδιου
                    <select className={styles.profile_tag} name="mode" id="owner">
                        <option value={""}>Select Condition --</option>
                        <option value={"apwleia"}>Απωλεια</option>
                        <option value={"euresi"}>Ευρεση</option>
                        <option value={"keno"}>Κενο</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    Αριθμός μικροτσίπ
                    <input
                        className={styles.profile_tag}
                        id="pet-id"
                        type="text"
                        placeholder="πχ. 123456789"
                    />
                </label>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-left">
                <label className="flex flex-col">
                    Ηλικία
                    <input
                        className={styles.profile_tag}
                        id="education"
                        type="number"
                        min="0"
                        placeholder="πχ. 7"
                    />
                </label>
                <label className="flex flex-col">
                    Φύλο
                    <select className={styles.profile_tag} id="gender">
                        <option value={""}>Select Gender --</option>
                        <option value={"female"}>Θυλικό</option>
                        <option value={"male"}>Αρσενικό</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    Κατασταση Ιδιοκτήτη
                    <select className={styles.profile_tag} name="mode" id="owner">
                        <option value={""}>Select Action --</option>
                        <option value={"metavivasi"}>Μεταβίβαση</option>
                        <option value={"uiothsia"}>Yιοθεσία</option>
                        <option value={"anadoxh"}>αναδοχή</option>
                    </select>
                </label>
            </div>
        </div>
    );
}
export default NewRecords;
