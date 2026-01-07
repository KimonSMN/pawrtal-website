import { useState } from "react";
import NewAppointments from "../vetSections/NewAppointments";
import Scheduled from "../vetSections/Scheduled";
import OldAppointments from "../vetSections/OldAppointments";

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
        <div className="bg-[#f9f9f9] rounded-2xl p-4 w-auto shadow-md flex flex-col gap-4">
            <div>
                <span className="font-semibold text-sm text-gray-600 border-b-2">Ημερομηνία</span>
                <div>{date}</div>
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

function Appointments() {
    // Api request to get users data
    //
    type VisitType = "old" | "new" | "scheduled";
    const [visits, setVisits] = useState<VisitType>("new");

    return (
        <div className="flex flex-col items-center gap-2">
            <select
                className="text-left w-2xs  p-4 border-b-1"
                onChange={(e) => {
                    setVisits(e.target.value as VisitType);
                }}
            >
                <option value={"new"}>Ανερχομενα Ραντεβου</option>
                <option value={"scheduled"}>Προγραμματισμενα Ραντεβου</option>
                <option value={"old"}>Ιστορικο Ραντεβου</option>
            </select>

            <div>
                {visits === "new" ? (
                    <NewAppointments />
                ) : visits === "old" ? (
                    <OldAppointments />
                ) : (
                    <Scheduled />
                )}
            </div>
        </div>
    );
}

export default Appointments;
