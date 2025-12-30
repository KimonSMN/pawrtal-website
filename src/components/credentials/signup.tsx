import { useState } from "react";
import styles from "./page.module.css";

function SignUp() {
    // User sign up credentials
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [phone_number, setPhone_number] = useState("");

    const handleSubmit = async () => {
        // Check if the passwords match
        if (password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }

        const formData = new FormData();

        formData.append("email", email);
        formData.append("password", password);
        formData.append("first_name", name);
        formData.append("phone_number", phone_number);

        // user sign up
        // New user api request to add new user
        // the vet profile component appears if user is eligible
        navigate("/vet/home");
    };

    return (
        <div className={styles.sign_up}>
            <div className={styles.credentials}>
                <form onSubmit={handleSubmit} className={styles.cred_form}>
                    {/* Register credentials */}
                    <label>Ονοματεπώνυμο</label>
                    <input
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@email.com"
                        required
                    />
                    <label>Κωδικός</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••"
                        required
                    />
                    <label>Επιβεβαίωση Κωδικού</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                    <label>Τηλέφωνο</label>
                    <input
                        type="tel"
                        value={phone_number}
                        onChange={(e) => setPhone_number(e.target.value)}
                        placeholder="Phone Number"
                    />
                    <button className={styles.submit} type="submit">
                        Εγγραφή
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
