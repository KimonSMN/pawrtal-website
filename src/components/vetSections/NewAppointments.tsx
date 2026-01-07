import { useState } from "react";
import { Info, MeetingStatus } from "../models/Info";

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
function VisitCard({ person, procedure, date, pet, pet_id }) {
    return (
        <div className="bg-[#f9f9f9] rounded-2xl p-4 w-auto shadow-md flex flex-col gap-4 text-nowrap">
            <div>
                <span className="font-semibold text-sm text-gray-600 border-b-2">Ημερομηνία</span>
                <div>
                    {date.toLocaleString("el-GR", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </div>
            </div>
            <div>
                <span className="font-semibold text-sm text-gray-500">Επισκέπτης</span>
                <div>{person}</div>
            </div>

            <div>
                <span className="font-semibold text-sm text-gray-500">Πράξη</span>
                <div>{procedure}</div>
            </div>
            <div className="flex flex-row justify-between items-center gap-1">
                <span className="font-semibold text-sm text-gray-500 text-nowrap">{pet} : </span>
                <div> ID-{pet_id}</div>
            </div>
            <div className="flex flex-row justify-between items-center gap-1">
                <button className="bg-[#ffffff] p-3 m-2 rounded-2xl shadow-2xs">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                </button>
                <button className="bg-[#e5e5e5] p-3 m-2 rounded-2xl shadow-2xs">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function NewAppointments() {
    const [appointment, setAppointment] = useState<Info[]>([
        new Info(
            "Κυμωνας Σμυρλιανος",
            "Εμβολιο",
            new Date("2025-11-13T11:30"),
            "Σκύλος",
            "123456789",
            MeetingStatus.New,
        ),
        new Info(
            "Χρήστος Ανδρουλάκης",
            "Στηρωση",
            new Date("2025-11-16T09:00"),
            "Γάτα",
            "123456789",
            MeetingStatus.New,
        ),
        new Info(
            "Δήμητρα Παυλίδη",
            "Check-up",
            new Date("2025-11-16T09:00"),
            "Σκύλος",
            "123456789",
            MeetingStatus.New,
        ),
    ]);

    return (
        <div
            className="
            flex flex-col items-center gap-8 max-w-xl overflow-x-auto p-6
            sm:flex-row sm:w-auto sm:mb-16 sm:max-h-[500px] sm:overflow-y-auto
        "
        >
            {appointment.map((info, index) => (
                <VisitCard
                    key={index}
                    person={info.name}
                    procedure={info.procedure}
                    date={info.date}
                    pet={info.pet}
                    pet_id={info.pet_id}
                />
            ))}
        </div>
    );
}
export default NewAppointments;
