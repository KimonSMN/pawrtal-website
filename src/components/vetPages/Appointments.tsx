import { useState } from "react";
import NewAppointments from "../vetSections/NewAppointments";
import Scheduled from "../vetSections/Scheduled";
import OldAppointments from "../vetSections/OldAppointments";

function Appointments() {
    // Api request to get users data
    //
    type VisitType = "old" | "scheduled";
    const [visits, setVisits] = useState<VisitType>("scheduled");

    return (
        <div className="flex flex-col items-center gap-2 mb-8">
            <h1 className="text-left text-2xl w-full p-4 border-b">Νέα Αιτηματα Επίσκέψεων</h1>
            <NewAppointments />
            <select
                className="text-left text-xl w-full  p-4 border-b hover:bg-[#e5e5e5]"
                onChange={(e) => {
                    setVisits(e.target.value as VisitType);
                }}
            >
                <option value={"scheduled"}>Προγραμματισμενα Ραντεβου</option>
                <option value={"old"}>Ιστορικο Ραντεβου</option>
            </select>

            <div>{visits === "old" ? <OldAppointments /> : <Scheduled />}</div>
        </div>
    );
}

export default Appointments;
