import { useState } from "react";
import styles from "./page.module.css";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    // User Login credentials
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        // formdata object to store users login attributes
        const formData = new FormData();

        formData.append("email", email);
        formData.append("password", password);
        navigate("/vet/home");
    };

    return (
        <div className={styles.login}>
            <div className={styles.credentials}>
                <form onSubmit={handleSubmit} className={styles.cred_form}>
                    {/* Login credentials */}
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
                    <button className={styles.submit} type="submit">
                        Σύνδεση
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
