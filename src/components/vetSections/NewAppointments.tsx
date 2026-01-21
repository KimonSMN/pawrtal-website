import { useState, useEffect } from "react";
import { Appointments, User, MeetingStatus, PROCEDURE_OPTIONS } from "../models/Info";
import Decline from "../../assets/decline.png";
import Accept from "../../assets/accept.png";

/**
 * @brief
 * Same as the Visit function but different css for smaller screen/mobile view
 * @param person
 * Pet owner
 * @param procedure
 * The reason of the meeting
 * @param date
 * date of the appointment
 * @param health_record
 * rating of the appointment
 */
function VisitCard({ info }: { info: Appointments }) {
    const [owner, setOwner] = useState<User | null>(null);
    const [decision, setDecision] = useState<MeetingStatus | null>(null);
    const [notify, setNotify] = useState(false);

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

    useEffect(() => {
        if (!decision) return;

        if (decision === MeetingStatus.Accepted) {
            const confirmLogout = window.confirm(
                "Είστε σίγουροι ότι θέλετε να αποδεχτείτε το ραντεβού;",
            );
            if (!confirmLogout) return;
        } else {
            const confirmLogout = window.confirm(
                "Είστε σίγουροι ότι θέλετε να απορρίψετε το ραντεβού;",
            );
            if (!confirmLogout) return;
        }

        fetch(`http://localhost:3001/appointments/${info.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: decision, notify: "user" }),
        });
    }, [decision, info.id]);

    useEffect(() => {
        if (!notify) return;

        fetch(`http://localhost:3001/appointments/${info.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ notify: "none" }),
        });
    }, [notify]);

    return (
        <div className="bg-[#e1e1e188] rounded-2xl p-4 max-w-lg shadow-md flex flex-col gap-4 text-nowrap">
            <div className="flex flex-col items-center w-full gap-1">
                {info.status === MeetingStatus.New ? (
                    <p className="text-[#005892] max-w-xs text-wrap text-center">Νεο Ραντεβου</p>
                ) : (
                    <p className="text-[#005892] max-w-xs text-wrap text-center">
                        Η επίσκεψη{" "}
                        {info.status === MeetingStatus.Canceled ? <> ακυρώθηκε</> : <>αλλαξε</>} απο
                        <br /> {owner?.fullName}{" "}
                    </p>
                )}
                <span className="font-semibold text-sm text-gray-600 border-b-2">Ημερομηνία</span>
                <div>
                    {info.date.toLocaleString("el-GR", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </div>
                <span className="font-semibold text-sm text-gray-500">Επισκέπτης</span>
                <div>{owner?.fullName}</div>
                <span className="font-semibold text-sm text-gray-500">Πράξη</span>
                <div>{PROCEDURE_OPTIONS[info.reason] ?? info.reason}</div>
            </div>
            <div className="flex flex-row items-center w-full gap-2">
                {info.status !== MeetingStatus.Canceled ? (
                    <>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl border 
                        bg-white hover:bg-[#eeeeee] whitespace-nowrap min-w-30"
                            onClick={() => setDecision(MeetingStatus.Accepted)}
                        >
                            <img src={Accept} alt="accept" className="w-6 h-6" />
                            <span>Αποδοχή</span>
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl border 
                        bg-[#b4b4b4] hover:bg-[#a1a1a1] whitespace-nowrap min-w-30"
                            onClick={() => setDecision(MeetingStatus.Canceled)}
                        >
                            <img src={Decline} alt="decline" className="w-4 h-4" />
                            <span>Απόρριψη</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl border 
                        bg-[#b4b4b4] hover:bg-[#a1a1a1] whitespace-nowrap min-w-30"
                            onClick={() => setNotify(true)}
                        >
                            <span>Διαγραφή Ειδοποίησης</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function NewAppointments() {
    const storedUser = localStorage.getItem("pawrtal_user");
    const vet = storedUser ? JSON.parse(storedUser) : null;
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointments[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timer;

        const fetchVisits = async () => {
            try {
                const response = await fetch(`http://localhost:3001/appointments?vetId=${vet.id}`);
                const data = await response.json();
                const filtered = data.filter(
                    (visit: any) => visit.status === MeetingStatus.New || visit.notify === "vet",
                );
                const mapped = filtered.map(Appointments.fromJSON);
                setAppointments(mapped);
            } catch (error) {
                console.error("Fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVisits();
        interval = setInterval(fetchVisits, 10000); // κάθε 10 δευτερόλεπτα

        return () => clearInterval(interval); // καθαρισμός interval
    }, []);
    if (loading) return <p>loading...</p>;
    return (
        <div
            className="
            flex flex-col items-center gap-8  overflow-x-auto p-6
            sm:flex-row sm:w-3xl sm:mb-16 sm:max-h-125 sm:overflow-y-auto
        "
        >
            {appointments.length === 0 && <p>Δεν υπάρχουν νέα αιτήματα επισκεψεων</p>}
            {appointments.map((info) => (
                <VisitCard key={info.id} info={info} />
            ))}
        </div>
    );
}
export default NewAppointments;
