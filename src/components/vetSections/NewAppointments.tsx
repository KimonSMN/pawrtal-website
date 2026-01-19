import { useState, useEffect } from "react";
import { Appointments, User, MeetingStatus } from "../models/Info";
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
            body: JSON.stringify({ status: decision }),
        });
    }, [decision, info.id]);

    return (
        <div className="bg-[#e1e1e1] rounded-2xl p-4 max-w-lg shadow-md flex flex-col gap-4 text-nowrap">
            <div className="flex flex-col items-center w-full gap-1">
                <span className="font-semibold text-sm text-gray-600 border-b-2">Ημερομηνία</span>
                <div>
                    {info.date.toLocaleString("el-GR", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </div>
                <span className="font-semibold text-sm text-gray-500">Επισκέπτης</span>
                <div>{owner?.name}</div>
                <span className="font-semibold text-sm text-gray-500">Πράξη</span>
                <div>{info.reason}</div>
            </div>
            <div className="flex flex-row items-center w-full gap-1">
                <button
                    className="flex flex-row items-center gap-1  p-2 rounded-2xl border bg-[#ffffff] hover:bg-[#eeeeee]"
                    onClick={() => setDecision(MeetingStatus.Accepted)}
                >
                    <img src={Accept} alt="free" className="w-6 h-6" />
                    Αποδοχη
                </button>
                <button
                    className="flex flex-row items-center justify-evenly gap-1 p-2 rounded-2xl border bg-[#b4b4b4]  hover:bg-[#a1a1a1]"
                    onClick={() => setDecision(MeetingStatus.Cancelled)}
                >
                    <img src={Decline} alt="free" className="w-4 h-4" />
                    Απόρριψη
                </button>
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
        const fetchVisits = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/appointments?vetId=${vet.id}&status=new`,
                );
                const data = await response.json();
                const mapped = data.map(Appointments.fromJSON);
                setAppointments(mapped);
            } catch (error) {
                console.error("Fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVisits();
    }, []);

    return (
        <div
            className="
            flex flex-col items-center gap-8  overflow-x-auto p-6
            sm:flex-row sm:w-3xl sm:mb-16 sm:max-h-[500px] sm:overflow-y-auto
        "
        >
            {appointments.map((info) => (
                <VisitCard key={info.id} info={info} />
            ))}
        </div>
    );
}
export default NewAppointments;
