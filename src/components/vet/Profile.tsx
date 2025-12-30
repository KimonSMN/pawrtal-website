import React from "react";
import styles from "./page.module.css";

function Profile() {
    let person = "natalia Krikelli";
    let date = "12/05/2025";
    let review = "4/5";

    return (
        <div className="flex flex-col items-center justify-center gap-10">
            <h1 className="flex-1 text-[#303030] m-auto text-left font-semibold text-2xl">
                Στοιχεια Χρήστη
            </h1>
            <div
                className="
                flex-1 flex flex-col items-center p-8 gap-5 bg-[#e5e5e5] rounded-2xl
                sm:flex-row sm:mb-16 
            "
            >
                <div className="flex-1 flex flex-col align-center justify-center text-left">
                    <div className="flex flex-row items-center gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-12"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                        <label className="flex flex-col">
                            Ονοματεπωνυμο
                            <input
                                className={styles.profile_tag}
                                id="name"
                                type="text"
                                placeholder="Ονοματεπωνυμο"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col">
                        Email
                        <input
                            className={styles.profile_tag}
                            id="email"
                            type="text"
                            placeholder="email"
                        />
                    </label>
                    <label className="flex flex-col">
                        Τηλεφωνο
                        <input
                            className={styles.profile_tag}
                            id="telephone"
                            type="text"
                            placeholder="Τηλεφωνο"
                        />
                    </label>
                    <label className="flex flex-col">
                        ΑΦΜ
                        <input
                            className={styles.profile_tag}
                            id="afm"
                            type="text"
                            placeholder="ΑΦΜ"
                        />
                    </label>
                </div>
                <div className="flex-1 flex flex-col align-center justify-center text-left">
                    <label className="flex flex-col">
                        Εκπαιδευση
                        <input
                            className={styles.profile_tag}
                            id="education"
                            type="text"
                            placeholder="πχ. Μεταπτυχιακο"
                        />
                    </label>
                    <label className="flex flex-col">
                        Περιοχη
                        <input
                            className={styles.profile_tag}
                            id="location"
                            type="text"
                            placeholder="πχ. Αθηνα"
                        />
                    </label>
                    <label className="flex flex-col">
                        Διευθυση
                        <input
                            className={styles.profile_tag}
                            id="address"
                            type="text"
                            placeholder="πχ. Διευθυνση Γραφείου"
                        />
                    </label>
                    <label className="flex flex-col" id="drop-zone">
                        Ανεβασε το Βιογραφικό σου.
                        <input
                            className={styles.profile_tag}
                            type="file"
                            id="file-input"
                            multiple
                            accept="image/*,.pdf"
                        />
                    </label>
                </div>
            </div>
            <div
                className="
                flex-1 flex flex-col items-center p-8 gap-5 
            "
            >
                <h1 className="flex-1 text-[#303030] w-full m-auto text-left font-semibold text-2xl">
                    Αξιολογησεις
                </h1>
                <div className="flex-1 flex flex-row justify-between items-center gap-4 max-w-full text-[#333] border-b-2 border-b-black">
                    <div className="flex-4 pr-12">Ονομα Χρήστη</div>
                    <div className="flex-1 ">Βαθμολογία</div>
                    <div className="flex-1">Ημερομηνία</div>
                </div>
                <div
                    className="flex-1 bg-[#e5e5e5] m-auto p-4 min-w-auto rounded-2xl
                    flex flex-row justify-between items-center gap-4 max-w-full
                "
                >
                    <div className="flex-4 pr-12">{person}</div>
                    <div className="flex-1 ">{date}</div>
                    <div className="flex-1">{review}</div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
