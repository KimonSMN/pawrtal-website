import React from "react";
import styles from "./page.module.css";
import profile from "../../assets/image.png";

function Review({ person, date, review }) {
    return (
        <div
            className="flex-1 bg-[#e5e5e5] m-auto p-4 min-w-auto rounded-2xl
            flex flex-row justify-between items-center gap-4 max-w-full
        "
        >
            <div className="flex-4 pr-12">{person}</div>
            <div className="flex-1 ">{review}</div>
            <div className="flex-1">{date}</div>
        </div>
    );
}

function Profile() {
    let person = "natalia Krikelli";
    let date = "12/05/2025";
    let review = "4/5";

    return (
        <div className="flex flex-col items-baseline justify-center lg:flex-row">
            <div className="flex flex-col items-center">
                <h1 className="text-[#303030] w-full mb-4 text-left font-semibold text-2xl">
                    Στοιχεια Χρήστη
                </h1>
                <div className="h-fit w-fit max-w-40 mb-2 items-start">
                    <img
                        className="w-full h-full object-cover rounded-b-full"
                        src={profile}
                        alt="profile-pic"
                    />
                </div>
                {/* arxh container */}
                <div className="flex-1 flex flex-col items-center p-8 gap-4 bg-[#e5e5e5] rounded-2xl sm:flex-row sm:mb-16">
                    <div className="flex-1 flex flex-col align-center justify-center text-left">
                        <label className="flex flex-col">
                            Ονοματεπωνυμο
                            <input
                                className={styles.profile_tag}
                                id="name"
                                type="text"
                                placeholder="Ονοματεπωνυμο"
                            />
                        </label>
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
                {/* telos container */}
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center p-8 gap-5">
                    <h1 className=" text-[#303030] w-full m-auto text-left font-semibold text-2xl">
                        Αξιολογησεις
                    </h1>
                    <div className="flex-1 flex flex-row justify-between items-center gap-4 max-w-full text-[#333] border-b-2 border-b-black">
                        <div className="flex-4 pr-12">Ονομα Χρήστη</div>
                        <div className="flex-1 ">Βαθμολογία</div>
                        <div className="flex-1">Ημερομηνία</div>
                    </div>
                    <Review person="natalia Krikelli" date="12/05/2025" review="4/5" />
                </div>
            </div>
        </div>
    );
}

export default Profile;
