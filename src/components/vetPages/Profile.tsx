import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page.module.css";
import { useAuth } from "../auth/AuthProvider";
import { User, Reviews } from "../models/Info";
import Dots from "../../assets/dots.png";
import DownArrow from "../../assets/down_arrow.png";
import RightArrow from "../../assets/right_arrow.png";

function Review({ info }: { info: Reviews }) {
    const [owner, setOwner] = useState<User | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!info.ownerId) return;

        fetch(`http://localhost:3001/users/${info.ownerId}`)
            .then((res) => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then((data) => {
                const userInstance = new User(data);
                setOwner(userInstance);
            })
            .catch(console.error);
    }, [info.ownerId]);
    return (
        <div className="w-full">
            {/* Main row */}
            <div
                className="
                    bg-[#e5e5e5] p-4 rounded-2xl
                    flex flex-row items-center gap-4
                "
            >
                <div className="flex-1">{owner?.fullName}</div>

                <div className="w-16 text-center text-[#007bd8] font-semibold">
                    {info.rating} / 5
                </div>

                <div className="w-24 text-sm text-gray-600">
                    {info.createdAt.toLocaleString("el-GR", {
                        dateStyle: "short",
                    })}
                </div>
                {/* Arrow */}
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="text-lg p-2 flex rounded justify-center hover:bg-[#cccccc]"
                >
                    {open ? (
                        <img src={DownArrow} alt="free" className="w-4 h-4" />
                    ) : (
                        <img src={RightArrow} alt="free" className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    className="
                        bg-gray-100 mt-2 mx-auto p-3 rounded-xl
                        text-sm text-gray-700
                    "
                >
                    {info.text || "Δεν υπάρχει σχόλιο"}
                </div>
            )}
        </div>
    );
}

function Profile() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("pawrtal_user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    const [user, setUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Reviews[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/reviews?vetId=${userId}`);
                const data = await response.json();
                const mapped = data.map(Reviews.fromJSON);
                setReviews(mapped);
            } catch (error) {
                console.error("Fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

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
                    fullname: editUser.fullName,
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
            localStorage.setItem("pawrtal_user", JSON.stringify(updated));

            alert("Τα στοιχεία ενημερώθηκαν ✔");
        } catch (err) {
            alert("Σφάλμα αποθήκευσης");
        }
    };

    const handleCancel = () => {
        const confirmLogout = window.confirm("Είστε σίγουροι ότι θέλετε να ακυρώσετε τις αλλαγές;");

        if (!confirmLogout) return;
        setEditUser(user);
        setIsEditing(false);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε;");

        if (!confirmLogout) return;
        logout();
        navigate("/");
    };

    const averageRating =
        reviews.length === 0
            ? 0
            : (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <>
            <h1 className="text-[#303030] w-full mb-8 px-4 text-center text-3xl ">
                Καλως ήρθες στον λογαριασμο σου.
            </h1>
            <div className="flex flex-col items-baseline justify-center w-full lg:flex-row lg:gap-12 lg:items-center">
                <div className="flex flex-col items-center  ml-4">
                    {/* Welcome message and profile pic */}

                    <div className="h-fit w-fit max-w-40 mb-2 items-start">
                        <img
                            className="w-full h-full object-cover rounded-b-full"
                            src={user?.photo ?? "/images/no_pic.jpg"}
                            alt="profile-pic"
                        />
                    </div>
                    {/* Account data container */}
                    <h1 className="text-[#266fa7] w-full m-auto text-left text-3xl mb-6 ">
                        Στοιχεια Χρήστη
                    </h1>
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
                                    value={editUser?.fullName ?? ""}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        setEditUser((prev) =>
                                            prev
                                                ? new User({ ...prev, fullName: e.target.value })
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
                                    AΦΜ
                                </span>
                                <input
                                    className="border-0 p-2 rounded focus:outline-none text-left"
                                    type="text"
                                    value={editUser?.afm ?? ""}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        setEditUser((prev) =>
                                            prev
                                                ? new User({ ...prev, afm: e.target.value })
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
                                                ? new User({
                                                      ...prev,
                                                      phone_number: e.target.value,
                                                  })
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
                                            prev
                                                ? new User({ ...prev, city: e.target.value })
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
                        </div>
                    </div>
                    {/* telos container */}

                    <div className="flex flex-row items-start mx-auto mb-4 gap-1 w-full sm:gap-1 sm:m-2 sm:mb-8">
                        <div className=" flex flex-row min-w-[280px]">
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
                                        className="m-2 p-4 bg-[#c5e1ff] font-bold text-[#3c3c3cb6] border  border-[#cdcdcd] rounded-2xl hover:bg-[#b1cae5] hover:transition-transform"
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
                            className="m-2 p-4 text-[#ffffff] font-semibold bg-[#df0000a7] rounded-2xl hover:bg-[#515151] hover:transition-transform hover:text-[#ff9898]"
                            onClick={handleLogout}
                        >
                            Αποσύνδεση
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center sm:mt-10">
                    <div className="flex flex-col items-center p-8 gap-5 w-full">
                        {averageRating !== 0 && (
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="text-lg text-[#005495] font-medium">
                                    Μέση βαθμολογία: {averageRating} / 5
                                </div>

                                <div className="text-sm text-gray-500">
                                    ({reviews.length} αξιολογήσεις)
                                </div>
                            </div>
                        )}
                        <h1 className=" text-[#266fa7] w-full m-auto mb-8 text-left text-3xl ">
                            Αξιολογήσεις Χρήστη
                        </h1>
                        <div className="flex flex-row justify-between items-center gap-4 w-full text-[#333] border-b-2 border-b-[#007bd8]">
                            <div className="flex-3 ">Χρήστης</div>
                            <div className="flex-2 ">Αστέρια</div>
                            <div className="flex-1">Ημερομηνία</div>
                            <div className="flex-1 pr-4 ">
                                <img src={Dots} alt="free" className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex flex-col pr-4 gap-4 max-h-90 overflow-y-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full">
                            {reviews.map((info) => (
                                <Review key={info.id} info={info} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
