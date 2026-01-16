import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page.module.css";
import { useAuth } from "../../auth/AuthContext";
import { User } from "../models/Info";

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
    const { logout } = useAuth();
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    const [user, setUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost:3001/users/${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then((data) => {
                const userInstance = new User(data);
                setUser(userInstance);
                setEditUser(userInstance);
            })
            .catch(console.error);
    }, [userId]);

    const handleSave = async () => {
        if (!editUser) return;

        try {
            const res = await fetch(`http://localhost:3001/users/${editUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editUser.name,
                    email: editUser.email,
                    phone_number: editUser.phone_number,
                    address: editUser.address,
                    city: editUser.city,
                    afm: editUser.afm,
                }),
            });

            const updated = await res.json();

            const updatedUser = new User(updated);

            setUser(updatedUser);
            setEditUser(updatedUser);
            setIsEditing(false);

            // 🔥 update localStorage
            localStorage.setItem("user", JSON.stringify(updated));

            alert("Τα στοιχεία ενημερώθηκαν ✔");
        } catch (err) {
            alert("Σφάλμα αποθήκευσης");
        }
    };

    const handleCancel = () => {
        setEditUser(user);
        setIsEditing(false);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε;");

        if (!confirmLogout) return;
        logout();
        navigate("/");
    };

    return (
        <div className="flex flex-col items-baseline justify-center lg:flex-row ">
            <div className="flex flex-col items-center">
                <h1 className="text-[#303030] w-full mb-4 text-left font-semibold text-2xl">
                    Καλως ήρθες {user?.name} ,
                </h1>
                <div className="flex flex-row items-baseline-last mb-4">
                    <div className="h-fit w-fit max-w-40 mb-2 items-start">
                        <img
                            className="w-full h-full object-cover rounded-b-full"
                            src={user?.photo ?? "/images/no_pic.jpg"}
                            alt="profile-pic"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl">{user?.name}</h2>
                        <span className="text-sm text-gray-500 mb-1">{user?.email}</span>
                    </div>
                </div>
                <h1 className="text-[#303030] w-full mb-6 text-left font-medium text-2xl">
                    Ο Λογαριασμός μου
                </h1>
                {/* arxh container */}
                <div className="flex-1 flex flex-col items-center sm:flex-row sm:mb-2">
                    <div className="flex flex-col align-center justify-center gap-2 px-0 sm:gap-4">
                        <div
                            className="
                            flex flex-row items-center justify-around text-sm gap-1 border border-[#c8c8c8a5]  
                            sm:gap-4 sm:justify-between sm:pl-4"
                        >
                            <span className="text-sm text-nowrap text-gray-500 max-w-30 text-left">
                                Ονοματεπώνυμο
                            </span>
                            <input
                                className="border-0 p-2 rounded focus:outline-none text-left"
                                type="text"
                                value={editUser?.name ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setEditUser((prev) =>
                                        prev ? new User({ ...prev, name: e.target.value }) : prev,
                                    )
                                }
                            />
                        </div>
                        <div
                            className="
                            flex flex-row items-center justify-around text-sm gap-1 border border-[#c8c8c8a5]  
                            sm:gap-4 sm:justify-between sm:pl-4"
                        >
                            <span className="text-sm text-nowrap text-gray-500 max-w-30 text-left">
                                Email
                            </span>
                            <input
                                className="border-0 p-2 rounded focus:outline-none text-left"
                                type="text"
                                value={editUser?.email ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setEditUser((prev) =>
                                        prev ? new User({ ...prev, email: e.target.value }) : prev,
                                    )
                                }
                            />
                        </div>
                        <div
                            className="
                            flex flex-row items-center justify-around text-sm gap-1 border border-[#c8c8c8a5]  
                            sm:gap-4 sm:justify-between sm:pl-4"
                        >
                            <span className="text-sm text-nowrap text-gray-500 max-w-30">AΦΜ</span>
                            <input
                                className="border-0 p-2 rounded focus:outline-none text-left"
                                type="text"
                                value={editUser?.afm ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setEditUser((prev) =>
                                        prev ? new User({ ...prev, afm: e.target.value }) : prev,
                                    )
                                }
                            />
                        </div>
                        <div
                            className="
                            flex flex-row items-center justify-around text-sm gap-1 border border-[#c8c8c8a5]  
                            sm:gap-4 sm:justify-between sm:pl-4"
                        >
                            <span className="text-sm text-nowrap text-gray-500 max-w-30">
                                Τηλέφωνο
                            </span>
                            <input
                                className="border-0 p-2 rounded focus:outline-none text-left"
                                type="text"
                                value={editUser?.phone_number ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setEditUser((prev) =>
                                        prev
                                            ? new User({ ...prev, phone_number: e.target.value })
                                            : prev,
                                    )
                                }
                            />
                        </div>
                        <div
                            className="
                            flex flex-row items-center justify-around text-sm gap-1 border border-[#c8c8c8a5]  
                            sm:gap-4 sm:justify-between sm:pl-4"
                        >
                            <span className="text-sm text-nowrap text-gray-500 max-w-30">
                                Περιοχη
                            </span>
                            <input
                                className="border-0 p-2 rounded focus:outline-none text-left"
                                type="text"
                                value={editUser?.city ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setEditUser((prev) =>
                                        prev ? new User({ ...prev, city: e.target.value }) : prev,
                                    )
                                }
                            />
                        </div>
                        <div
                            className="
                            flex flex-row items-center justify-around text-sm gap-1 border border-[#c8c8c8a5]  
                            sm:gap-4 sm:justify-between sm:pl-4"
                        >
                            <span className="text-sm text-nowrap text-gray-500 max-w-30">
                                Διευθυση
                            </span>
                            <input
                                className="border-0 p-2 rounded focus:outline-none text-left"
                                type="text"
                                value={editUser?.address ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setEditUser((prev) =>
                                        prev
                                            ? new User({ ...prev, address: e.target.value })
                                            : prev,
                                    )
                                }
                            />
                        </div>
                        <div
                            className="
                            flex flex-row items-center justify-around text-sm gap-1p border border-[#c8c8c8a5]  
                            sm:gap-4 "
                        >
                            <span className="text-sm text-wrap text-gray-500 max-w-30">
                                Ανεβασε το Βιογραφικό σου
                            </span>
                            <input
                                className="border-0 p-2 rounded focus:outline-none text-left"
                                type="file"
                                id="file-input"
                                multiple
                                accept="image/*,.pdf"
                            />
                        </div>
                    </div>
                </div>
                {/* telos container */}

                <div className="m-1 flex flex-row items-baseline mb-4 gap-1 sm:gap-2 sm:m-2 sm:mb-8">
                    <div className=" flex flex-row gap-2">
                        {!isEditing ? (
                            <button
                                className="m-2 p-4 bg-[#e5e5e5] font-semibold rounded-2xl hover:bg-[#d1d1d1] hover:transition-transform"
                                onClick={() => setIsEditing(true)}
                            >
                                Επεξεργασία Στοιχειων
                            </button>
                        ) : (
                            <>
                                <button
                                    className="m-2 p-4 bg-[#fbfbfb] font-bold text-[#3c3c3cb6] border  border-[#cdcdcd] rounded-2xl hover:bg-[#ededed] hover:transition-transform"
                                    onClick={handleSave}
                                >
                                    Αποθήκευση
                                </button>
                                <button
                                    className="m-2 p-4 bg-[#aaaaaa] font-semibold text-[#ffffff] border border-[#909090b0] rounded-2xl hover:bg-[#d1d1d1] hover:transition-transform"
                                    onClick={handleCancel}
                                >
                                    Ακύρωση
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className="m-2 p-4 text-[#ffffff] font-semibold bg-[#727272] rounded-2xl hover:bg-[#515151] hover:transition-transform hover:text-[#ff9898]"
                        onClick={handleLogout}
                    >
                        Αποσύνδεση
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center p-8 gap-5">
                    <h1 className=" text-[#303030] w-full m-auto text-left font-semibold text-2xl">
                        Οι Αξιολογησεις μου
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
