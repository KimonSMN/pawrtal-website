import { useState } from "react";
import styles from "./page.module.css";
import NewRecords from "../vetSections/NewRecords";
import OldRecords from "../vetSections/OldRecords";

function Records() {
    // Api request to get users data
    const [mode, setMode] = useState<"new_records" | "history">("new_records");
    const [records, setRecords] = useState<Record[]>([]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 bg-[#e5e5e5] rounded-2xl p-4 mb-12 w-full font-normal sm:w-xl sm:font-medium">
            <div className={styles.vet_bar}>
                <div className={styles.vet_bar_toggle}>
                    <div className={`${styles.records_slider} ${styles[mode]}`} />
                    <button
                        className={mode === "new_records" ? styles.active : ""}
                        onClick={() => setMode("new_records")}
                    >
                        Νεα καταγραφή
                    </button>
                    <button
                        className={mode === "history" ? styles.active : ""}
                        onClick={() => setMode("history")}
                    >
                        Ιστορικό
                    </button>
                </div>
            </div>

            <div
                className="
                flex-1 bg-transparent p-4
            "
            >
                <div className="flex flex-col items-center">
                    {/* Load component */}
                    {mode === "new_records" ? (
                        <NewRecords records={records} setRecords={setRecords} />
                    ) : (
                        <OldRecords records={records} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Records;
