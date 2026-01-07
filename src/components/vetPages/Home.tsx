import { useState } from "react";
import styles from "./page.module.css";
import Profile from "./Profile";
import Appointments from "./Appointments";
import Records from "./Records";

function Home() {
    const [mode, setMode] = useState<"profile" | "appointments" | "records">("profile");

    return (
        <div className="flex flex-col justify-center  m-auto mt-10">
            <div className={styles.vet_bar}>
                <div className={styles.vet_bar_toggle}>
                    <div className={`${styles.slider} ${styles[mode]}`} />
                    <button
                        className={mode === "profile" ? styles.active : ""}
                        onClick={() => setMode("profile")}
                    >
                        To profile μου
                    </button>
                    <button
                        className={mode === "appointments" ? styles.active : ""}
                        onClick={() => setMode("appointments")}
                    >
                        Τα ραντεβού μου
                    </button>
                    <button
                        className={mode === "records" ? styles.active : ""}
                        onClick={() => setMode("records")}
                    >
                        Καταγραφες
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
                    {mode === "profile" ? (
                        <Profile />
                    ) : mode === "appointments" ? (
                        <Appointments />
                    ) : (
                        <Records />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
