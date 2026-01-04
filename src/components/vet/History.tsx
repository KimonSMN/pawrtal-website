/**
 *
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
function Visit({ person, procedure, date, health_record }) {
    return (
        <div
            className="
                bg-[#f9f9f9] p-4 rounded-2xl shadow-xl
                text-[#333]
                w-full
                grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-8
            "
        >
            <div className="flex-1 pr-12">{person}</div>
            <div className="flex-1 ">{procedure}</div>
            <div className="flex-1 ">{date}</div>
            <div className="flex-1">{health_record}</div>
        </div>
    );
}

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
function VisitCard({ person, procedure, date, health_record }) {
    return (
        <div className="bg-[#f9f9f9] rounded-2xl p-4 shadow-md flex flex-col gap-4">
            <div>
                <span className="font-semibold text-sm text-gray-500">Επισκέπτης</span>
                <div>{person}</div>
            </div>

            <div>
                <span className="font-semibold text-sm text-gray-500">Πράξη</span>
                <div>{procedure}</div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <span className="font-semibold text-sm text-gray-500">Ημερομηνία</span>
                    <div>{date}</div>
                </div>

                <div className="text-xl">{health_record}</div>
            </div>
        </div>
    );
}

export default function History() {
    // Name Variable for the pet owners
    let person1 = "Μαρια Γεωργιου";
    let person2 = "Αντώνης Ρικου";
    let person3 = "Κώστας Κινετης";
    return (
        <div
            className="
            flex-1 flex flex-col items-center p-8 gap-5 w-[calc(100%+2rem)]
            sm:flex-row sm:mb-16 
        "
        >
            <div
                className=" flex w-full flex-1 flex-col items-center p-8 gap-5 max-h-[500px] overflow-y-auto
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
                    <div className="flex-1">Βιβλιάριο</div>
                </div>
                <Visit person={person1} procedure="Εμβολιο" date="15/11/2025" health_record="↓" />
                <Visit person={person2} procedure="check-up" date="13/11/2025" health_record="↓" />
                <Visit person={person3} procedure="στείρωση" date="27/10/2025" health_record="↓" />
            </div>
            <div
                className="
                sm:hidden flex flex-col items-center pl-5 pr-5 pb-5 gap-4 max-h-[350px] overflow-y-auto
                [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full
                "
            >
                <VisitCard
                    person={person1}
                    procedure="Εμβολιο"
                    date="15/11/2025"
                    health_record="↓"
                />
                <VisitCard
                    person={person2}
                    procedure="check-up"
                    date="13/11/2025"
                    health_record="↓"
                />
                <VisitCard
                    person={person3}
                    procedure="στείρωση"
                    date="27/10/2025"
                    health_record="↓"
                />
            </div>
        </div>
    );
}
