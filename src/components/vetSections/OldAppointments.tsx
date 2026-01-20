import { useState, useEffect } from "react";
import { Appointments, User, PROCEDURE_OPTIONS } from "../models/Info";

/**
 * @brief
 * Component to add old visits in the history page
 * @param person
 * Pet owner
 * @param procedure
 * The reason of the meeting
 * @param date
 * date of the appointment
 * @param health_record
 * rating of the appointment
 */
function Visit({ info }: { info: Appointments }) {
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
        <div
            className="
                bg-[#f9f9f9] p-4 rounded-2xl shadow-xl
                text-[#333]
                w-full
                grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-8
            "
        >
            <div className="flex-1 pr-12">{owner?.fullName}</div>
            <div className="flex-1 ">{PROCEDURE_OPTIONS[info.reason] ?? info.reason}</div>
            <div className="flex-1 ">
                {info.date.toLocaleString("el-GR", {
                    dateStyle: "short",
                    timeStyle: "short",
                })}
            </div>
            <div className="flex-1">{info.petName}</div>
        </div>
    );
}

/**
 * @brief
 * Component to add old visits in the history page with css for smaller-screen/mobile view
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
        <div className="bg-[#f9f9f9] rounded-2xl p-4 shadow-md flex flex-col gap-4">
            <div>
                <span className="font-semibold text-sm text-gray-500">Επισκέπτης</span>
                <div>{owner?.fullName}</div>
            </div>

            <div>
                <span className="font-semibold text-sm text-gray-500">Πράξη</span>
                <div>{PROCEDURE_OPTIONS[info.reason] ?? info.reason}</div>
            </div>
            <div>
                <span className="font-semibold text-sm text-gray-500">Κατοίκιδιο</span>
                <div className="flex-1">{info.petName}</div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <span className="font-semibold text-sm text-gray-500">Ημερομηνία</span>
                    <div>
                        {info.date.toLocaleString("el-GR", {
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OldAppointments() {
    const savedUser = localStorage.getItem("pawrtal_user");
    const vet = savedUser ? JSON.parse(savedUser) : null;
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointments[]>([]);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/appointments?vetId=${vet.id}&status=completed&status=cancelled`,
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

    if (loading) return <p>loading ...</p>;

    return (
        <div
            className="
            flex-1 flex flex-col items-center p-8 gap-5 w-[calc(100%+2rem)]
            sm:flex-row sm:mb-16 
        "
        >
            <div
                className=" flex w-full flex-1 flex-col items-center p-8 gap-5 max-h-125 overflow-y-auto
                [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
                hidden sm:grid 
            "
            >
                <div
                    className="
                        grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-8
                        w-full text-[#333] border-b-2 border-b-black font-semibold pb-2
                    "
                >
                    <div className="flex-1 pr-12">Ονομα Επισκεπτη</div>
                    <div className="flex-1 ">Ιατρικη Πραξη</div>
                    <div className="flex-1">Ημερομηνία</div>
                    <div className="flex-1">Όνομα Κατ/διου</div>
                </div>
                {appointments.map((info) => (
                    <Visit key={info.id} info={info} />
                ))}
            </div>
            <div
                className="
                sm:hidden flex flex-col items-center pr-5 pb-5 gap-4 max-h-88 overflow-y-auto
                [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
                "
            >
                {appointments.map((info) => (
                    <VisitCard key={info.id} info={info} />
                ))}
            </div>
        </div>
    );
}
