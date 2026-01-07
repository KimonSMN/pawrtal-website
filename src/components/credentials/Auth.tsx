import { useState } from "react";
import styles from "./page.module.css";
import Login from "./Login";
import SignUp from "./Signup";

function Auth() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    return (
        <div
            className="
            flex flex-col items-start justify-center-safe gap-4 bg-e5e5e5 p-4 m-auto mt-16 mb-16 max-w-3xl bg-[#e5e5e5] rounded-xl
            sm:flex-row sm:gap-2
        "
        >
            <div className=" flex-1 max-w-2xs text-[#333]">
                <h1 className="font-semibold">Καλώς ήρθατε</h1>
                <p className="text-start m-4">
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

                <div className="flex flex-col items-center">
                    {/* Login or Sign up component */}
                    {mode === "login" ? <Login /> : <SignUp />}
                </div>
            </div>
        </div>
    );
}

export default Auth;
