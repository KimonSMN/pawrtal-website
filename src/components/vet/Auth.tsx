import { useState } from "react";
import styles from "./page.module.css";
import Login from "../credentials/login";
import SignUp from "../credentials/signup";

function Auth() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    return (
        <div className={styles.vet_page}>
            <div className={styles.vet_container}>
                <div className={styles.vet_info}>
                    <h1>Καλώς ήρθατε</h1>
                    <p>
                        Εάν δεν έχεις λογαριασμό, <br />
                        κάνε εγγραφή
                    </p>
                </div>

                <div className={styles.auth_card}>
                    <div className={styles.toggle}>
                        <button
                            className={mode === "login" ? styles.active : ""}
                            onClick={() => setMode("login")}
                        >
                            Σύνδεση
                        </button>
                        <button
                            className={mode === "signup" ? styles.active : ""}
                            onClick={() => setMode("signup")}
                        >
                            Εγγραφή
                        </button>
                    </div>

                    <div className={styles.credentials}>
                        {/* Login or Sign up component */}
                        {mode === "login" ? <Login /> : <SignUp />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
