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
    const { login } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const passwordsMatch =
        password.length > 0 && passwordConfirm.length > 0 && password === passwordConfirm;

    const passwordsMismatch =
        password.length > 0 && passwordConfirm.length > 0 && password !== passwordConfirm;

    // User sign up credentials
    const [formData, setFormData] = useState({
        name: "",
        email: "",
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
        if (!passwordsMatch) {
            alert("Passwords do not match");
            return;
        }

        // transform photo to string-url for storing in db
        const photoUrl = photoFile ? `/images/${photoFile.name}` : "/images/no_pic.jpg";

        // user sign up
        const newUser = {
            name: formData.name,
            email: formData.email,
            password: password,
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
                        placeholder="Ονοματεπώνυμο"
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
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Κωδικός"
                            className="w-full pr-10 p-2 border rounded focus:outline-none"
                            required
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword((p) => !p)}
                        >
                            👁
                        </button>
                    </div>
                    <label>Επιβεβαίωση Κωδικού</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Επιβεβαίωση κωδικού"
                            className="w-full pr-10 p-2 border rounded focus:outline-none"
                            required
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowConfirm((p) => !p)}
                        >
                            👁
                        </button>
                    </div>
                    {passwordsMatch && (
                        <p className="text-green-600 text-sm mt-1">✔ Οι κωδικοί ταιριάζουν</p>
                    )}

                    {passwordsMismatch && (
                        <p className="text-red-500 text-sm mt-1">✖ Οι κωδικοί δεν ταιριάζουν</p>
                    )}

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
                    <label>Αριθμός Φορολογικού Μητρώου</label>
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
