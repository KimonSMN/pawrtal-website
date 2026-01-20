import { useState, useEffect } from "react";
import { User, Pets, Record } from "../models/Info";

function Input({ info, onPreview }: { info: Record; onPreview: (record: Record) => void }) {
    const [pet, setPet] = useState<Pets | null>(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/records?microchip=${info.microchip}`,
                );
                const data = await response.json();

                if (data.length > 0) {
                    setPet(Pets.fromJSON(data[0]));
                }
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };

        fetchPet();
    }, [info.microchip]);

    return (
        <div className="w-full">
            {/* Main row */}
            <div className="flex flex-row justify-between items-center gap-2 w-full text-[#333] border-b-2 border-b-gray-300">
                <div className="flex-2">{pet?.species}</div>
                <div className="flex-2">{info.ownerName}</div>
                <div className="flex-2">{info.microchip}</div>
                <div className="flex-1">
                    {info.createdAt.toLocaleString("el-GR", {
                        dateStyle: "short",
                    })}
                </div>
                <div className="flex-1 text-right">
                    <button
                        onClick={() => onPreview(info)}
                        className="font-bold text-gray-600 hover:underline"
                    >
                        Προβολή
                    </button>
                </div>
            </div>
        </div>
    );
}

function RecordPreview({ record, onBack }: { record: Record; onBack: () => void }) {
    const [owner, setOwner] = useState<User | null>(null);
    const [pet, setPet] = useState<Pets | null>(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/records?microchip=${record.microchip}`,
                );
                const data = await response.json();

                if (data.length > 0) {
                    setPet(Pets.fromJSON(data[0]));
                }
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };

        fetchPet();
    }, [record.microchip]);

    useEffect(() => {
        if (!pet) return;

        const fetchOwner = async () => {
            try {
                const response = await fetch(`http://localhost:3001/users?id=${pet.ownerId}`);
                const data = await response.json();

                if (data.length > 0) {
                    setOwner(User.fromJSON(data[0]));
                }
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };

        fetchOwner();
    }, [pet]);

    return (
        <div className="bg-[#f9f9f9] rounded-2xl p-6 shadow-lg w-full max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Στοιχεία Κατοικιδίου</h2>

            <div className="space-y-3 text-sm text-gray-700">
                <p>
                    <b>Ονομα:</b> {pet.name}
                </p>
                <p>
                    <b>Είδος:</b> {pet.species}
                </p>
                <p>
                    <b>Ιδιοκτήτης:</b> {owner?.fullName}
                </p>
                <p>
                    <b>Microchip:</b> {pet.microchip}
                </p>
                <p>
                    <b>Φύλο:</b> {pet.gender}
                </p>
                <p>
                    <b>Τρίχωμα:</b> {pet.coat}
                </p>
                <p>
                    <b>Χρώμα:</b> {pet.color}
                </p>
                <p>
                    <b>Φυλή:</b> {pet.breed}
                </p>
                <p>
                    <b>Ηλιακία:</b> {pet.age}
                </p>
                <p>
                    <b>Ημερομηνία:</b> {pet.createdAt.toLocaleDateString("el-GR")}
                </p>
            </div>

            <button
                onClick={onBack}
                className="mt-6 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
                ← Πίσω στο Ιστορικό
            </button>
        </div>
    );
}

function OldRecords() {
    const [records, setRecords] = useState<Record[]>([]);
    const [loading, setLoading] = useState(true);
    const vet = JSON.parse(localStorage.getItem("pawrtal_user")!);
    const formatDate = (date: string) => new Date(date).toLocaleDateString("el-GR");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    type Reason =
        | "all"
        | "checkup"
        | "vaccination"
        | "deworming"
        | "microchip"
        | "neutering"
        | "blood_tests"
        | "urine_tests"
        | "imaging"
        | "sick"
        | "injury"
        | "chronic_condition"
        | "pregnancy"
        | "emergency"
        | "other";
    const [reasonFilter, setReasonFilter] = useState<Reason>("all");

    const [searchMicrochip, setSearchMicrochip] = useState("");
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch(`http://localhost:3001/records?vetId=${vet.id}`);
                const data = await response.json();
                const mapped = data.map(Record.fromJSON);
                setRecords(mapped);
            } catch (error) {
                console.error("Fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const filteredRecords = records
        .filter((record) => {
            if (reasonFilter === "all") return true;
            return record.reason === reasonFilter;
        })
        .filter((record) => record.microchip.toLowerCase().includes(searchMicrochip.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    if (loading) return <p>loading ...</p>;

    return (
        <div className="w-full px-8">
            {selectedRecord ? (
                <RecordPreview record={selectedRecord} onBack={() => setSelectedRecord(null)} />
            ) : (
                <>
                    {records.length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                            Δεν υπάρχουν καταγραφες περιστατικών
                        </p>
                    )}
                    <div className="flex flex-col items-center  bg-[#f9f9f9]  rounded-xl p-8 gap-5 max-w-sm mx-auto sm:max-w-xl  ">
                        <h1 className=" text-[#303030] m-auto text-3xl ">Ιστορικό</h1>

                        <div className="flex flex-wrap gap-4 items-center mb-6 w-full">
                            {/* Reason filter */}
                            <select
                                value={reasonFilter}
                                onChange={(e) => setReasonFilter(e.target.value as any)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="all">Όλα</option>

                                <optgroup label="Προληπτικός έλεγχος">
                                    <option value="checkup">Γενικός έλεγχος</option>
                                    <option value="vaccination">Εμβολιασμός</option>
                                    <option value="deworming">Αποπαρασίτωση</option>
                                    <option value="microchip">Τοποθέτηση microchip</option>
                                    <option value="neutering">Στείρωση</option>
                                </optgroup>

                                <optgroup label="Εξετάσεις">
                                    <option value="blood_tests">Αιματολογικές εξετάσεις</option>
                                    <option value="urine_tests">Εξετάσεις ούρων</option>
                                    <option value="imaging">Ακτινογραφία / Υπέρηχος</option>
                                </optgroup>

                                <optgroup label="Άλλο">
                                    <option value="sick">Ασθένεια / Συμπτώματα ίωσης</option>
                                    <option value="injury">Τραυματισμός</option>
                                    <option value="chronic_condition">Χρόνια πάθηση</option>
                                    <option value="pregnancy">Κύηση</option>
                                    <option value="emergency">Έκτακτο</option>
                                    <option value="other">Άλλος λόγος</option>
                                </optgroup>
                            </select>

                            {/* Sort */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as any)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="newest">Νεότερα πρώτα</option>
                                <option value="oldest">Παλαιότερα πρώτα</option>
                            </select>

                            {/* Microchip search */}
                            <input
                                type="text"
                                placeholder="Αναζήτηση Microchip"
                                value={searchMicrochip}
                                onChange={(e) => setSearchMicrochip(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px]"
                            />
                        </div>

                        {/** Header Row */}
                        <div className="flex flex-row justify-between items-center gap-2 w-full text-[#333] border-b-3 border-b-black">
                            <div className="flex-2 ">Κατοικίδιο</div>
                            <div className="flex-2 ">Ιδιοκτήτης</div>
                            <div className="flex-2">Microchip</div>
                            <div className="flex-1">Ημ/νία</div>
                            <div className="flex-1">Προβολη</div>
                        </div>
                        <div className="flex flex-col gap-4 max-h-90  w-full overflow-y-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full">
                            {filteredRecords.map((record) => (
                                <Input
                                    key={record.petId}
                                    info={record}
                                    onPreview={setSelectedRecord}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default OldRecords;
