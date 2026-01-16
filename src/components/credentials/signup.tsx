import { useState } from "react";
import styles from "./page.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

/**
 * @brief SignUp function sets users info in a formadata type
 *
 *  -> constructs a new user
 *
 *  -> adds users info to the db.json under the users list
 *
 *  -> sends users info for authentication
 */
function SignUp() {
    const navigate = useNavigate();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const { login } = useAuth();

    // User sign up credentials
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone_number: "",
        role: "vet",
        address: "",
        city: "",
        afm: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the passwords match
        if (formData.password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }

        // transform photo to string-url for storing in db
        const photoUrl = photoFile ? `/images/${photoFile.name}` : "/images/no_pic.jpg";

        // user sign up
        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            role: formData.role,
            address: formData.address,
            city: formData.city,
            afm: formData.afm,
            photo: photoUrl,
            createdAt: new Date().toISOString(),
        };

        try {
            // New user api request to add new user
            const response = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            const savedUser = await response.json();
            console.log("New user saved:", savedUser);
            //calling login to save users info -> then navigate to home page
            login(savedUser);
            navigate("/vet/home");
        } catch (err) {
            console.error("Fetch failed:", err);
            alert("Server not reachable");
        }
    };

    return (
        <div className={styles.sign_up}>
            <div className={styles.credentials}>
                <form onSubmit={handleSubmit} className={styles.cred_form}>
                    {/* Register credentials */}
                    <label>Ονοματεπώνυμο</label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                    <label>Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@email.com"
                        required
                    />
                    <label>Κωδικός</label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
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
                        id="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Phone Number"
                    />
                    <label>Διεύθυνση Γραφείου</label>
                    <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                    />
                    <label>Περιοχη</label>
                    <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="πχ. Αθήνα"
                    />
                    <label>Διεύθυνση Γραφείου</label>
                    <input
                        id="afm"
                        type="tel"
                        value={formData.afm}
                        onChange={handleChange}
                        placeholder="Αριθμός Φορολογικού Μητρώου"
                    />
                    <label>Φωτογραφια Profie</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
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
