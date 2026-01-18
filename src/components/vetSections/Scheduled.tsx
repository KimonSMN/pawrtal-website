import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import { Appointments, User } from "../models/Info";
import Empty from "../../assets/empty.png";
import Half from "../../assets/half.png";
import Full from "../../assets/full.svg";

/**
 * @description Card for the scheduled meetings
 */
function Meeting({ info }: { info: Appointments }) {
    const [owner, setOwner] = useState<User | null>(null);

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
        <div className="bg-[#f9f9f9] rounded-2xl p-4 w-auto shadow-md flex flex-col gap-4">
            <div>
                <span className="font-semibold text-sm text-gray-600 border-b-2">Ημερομηνία</span>
                <div>
                    {info.date.toLocaleString("el-GR", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </div>
            </div>
            <div>
                <span className="font-semibold text-sm text-gray-500">Επισκέπτης</span>
                <div>{owner?.name}</div>
            </div>

            <div className="flex flex-row justify-evenly items-center">
                <span className="font-semibold text-sm text-gray-500 text-nowrap">
                    {info.pet} :
                </span>
                <div>{info.petId}</div>
            </div>

            <div>
                <span className="font-semibold text-sm text-gray-500">Πράξη</span>
                <div>{info.reason}</div>
            </div>
        </div>
    );
}

function Scheduled() {
    const vet = JSON.parse(localStorage.getItem("user")!);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [appointments, setAppointments] = useState<Appointments[]>([]);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/appointments?vetId=${vet.id}&status=approved`,
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

    const visitsForDay = appointments.filter((appointments) => {
        const visitDate = new Date(appointments.date);
        return visitDate.toDateString() === selectedDate?.toDateString();
    });

    const getVisitCountForDate = (date: Date) => {
        return appointments.filter((v) => new Date(v.date).toDateString() === date.toDateString())
            .length;
    };

    const getStatusDot = (date: Date) => {
        const count = getVisitCountForDate(date);

        if (count === 0) return <img src={Empty} alt="free" className="w-6 h-6" />; // free
        if (count >= 4) return <img src={Full} alt="free" className="w-6 h-6" />; // busy
        return <img src={Half} alt="free" className="w-6 h-6" />; // medium
    };

    return (
        <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex flex-col items-center">
                <h3 className="font-semibold">Κλίμακα</h3>
                <span className="text-xs text-left text-gray-500 ">Μεγάλη Διαθεσιμότητα</span>
                <img src={Empty} alt="free" className="w-10 h-10" />
                <span className="text-xs text-left text-gray-500 ">Μερική Διαθεσιμότητα</span>
                <img src={Half} alt="free" className="w-10 h-10" />
                <span className="text-xs text-left text-gray-500 ">Περιορισμενη Διαθεσιμότητα</span>
                <img src={Full} alt="free" className="w-10 h-10" />
            </div>
            {/* Calendar */}
            <Calendar
                className="h-fit"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date as Date)}
                tileContent={({ date, view }) =>
                    view === "month" ? (
                        <div className="flex justify-center mt-1 text-sm">{getStatusDot(date)}</div>
                    ) : null
                }
            />

            {/* Visits for selected day */}
            <div
                className="
                    flex flex-col gap-4 max-w-xl p-4
                    sm:max-h-[500px] sm:overflow-y-auto
                "
            >
                {visitsForDay.length === 0 && (
                    <p className="text-gray-500">Δεν υπάρχουν επισκέψεις</p>
                )}

                {visitsForDay.map((visit) => (
                    <Meeting key={visit.id} info={visit} />
                ))}
            </div>
        </div>
    );
}
export default Scheduled;
