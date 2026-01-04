import { useState } from "react";
import styles from "./page.module.css";
import NewRecords from "./NewRecords";
import History from "./History";

function Records() {
    // Api request to get users data
    const [mode, setMode] = useState<"new_records" | "history">("new_records");

    return (
        <div className="flex flex-col items-center justify-center gap-4 bg-[#e5e5e5] rounded-2xl p-4 mb-12 ">
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
                flex-1 bg-transparent p-8
            "
            >
                <div className="flex flex-col items-center">
                    {/* Load component */}
                    {mode === "new_records" ? <NewRecords /> : <History />}
                </div>
            </div>
        </div>
    );
}

export default Records;
