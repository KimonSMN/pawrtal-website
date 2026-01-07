import { useState } from "react";
import { Info, MeetingStatus } from "../models/Info";

/**
 * @description Card for the scheduled meetings
 */
function Meeting({ person, procedure, date, pet, pet_id }) {
    return (
        <div className="bg-[#f9f9f9] rounded-2xl p-4 w-auto shadow-md flex flex-col gap-4">
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

            <div className="flex flex-row justify-between items-center gap-1">
                <span className="font-semibold text-sm text-gray-500 text-nowrap">{pet} : </span>
                <div> ID-{pet_id}</div>
            </div>

            <div>
                <span className="font-semibold text-sm text-gray-500">Πράξη</span>
                <div>{procedure}</div>
            </div>
        </div>
    );
}

function Scheduled() {
    const [visits, setVisits] = useState<Info[]>([
        new Info(
            "Σοφία Παππά",
            "check up",
            new Date("2025-11-29T14:30"),
            "Γατα",
            "123456789",
            MeetingStatus.Accepted,
        ),
        new Info(
            "Aντώνης Ρωδακίος",
            "check up",
            new Date("2025-11-29T18:30"),
            "Γατα",
            "123456789",
            MeetingStatus.Accepted,
        ),
        new Info(
            "Βασίλης Ζωγράφου",
            "check up",
            new Date("2025-12-02T09:30"),
            "Σκύλος",
            "123456789",
            MeetingStatus.Accepted,
        ),
        new Info(
            "Μαρία Γεωργίου",
            "check up",
            new Date("2025-12-02T10:30"),
            "Σκύλος",
            "123456789",
            MeetingStatus.Accepted,
        ),
    ]);

    return (
        <div
            className="
            flex flex-col items-center gap-8 max-w-xl overflow-x-auto p-6
            sm:flex-row sm:w-auto sm:mb-16 sm:max-h-[500px] sm:overflow-y-auto
        "
        >
            {visits.map((visit, index) => (
                <Meeting
                    key={index}
                    person={visit.name}
                    procedure={visit.procedure}
                    date={visit.date}
                    pet={visit.pet}
                    pet_id={visit.pet_id}
                />
            ))}
        </div>
    );
}
export default Scheduled;
