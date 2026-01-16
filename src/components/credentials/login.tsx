import { useState } from "react";
import styles from "./page.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

/**
 * @brief Login function sets email and password  with useState
 *
 *  -> requests list of users with email: email and password: password
 *
 *  -> get users info from the returned list
 *
 *  -> sends users info for authentication
 */
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Search for existing user if success call login to store user
        try {
            // request user with email and password returns list of users with those credentials
            const res = await fetch(
                `http://localhost:3001/users?email=${email}&password=${password}`,
            );

            const users = await res.json();

            // if users[] length = 0 no user found with those credentials
            if (users.length === 0) {
                alert("Λάθος στοιχεία");
                return;
            }

            const user = users[0];
            // Send user for authentication / store info in local storage.
            login(user);
            navigate("/vet/home");
        } catch {
            alert("Server not reachable");
        }
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
