import { useState, useEffect } from "react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { User, Pets, Record, PROCEDURE_OPTIONS } from "../models/Info";

function Input({
    microchip,
    recordId,
    onPreview,
}: {
    microchip: string;
    recordId?: string;
    onPreview: (record: string) => void;
}) {
    const [pet, setPet] = useState<Pets | null>(null);
    const [record, setRecord] = useState<Record | null>(null);
    const type: "record" | "pet" = recordId ? "record" : "pet";

    // get pet with microchip
    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`http://localhost:3001/pets?microchip=${microchip}`);
                const data = await res.json();
                if (data.length > 0) {
                    setPet(Pets.fromJSON(data[0]));
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchPet();
    }, [microchip]);

    // get record with record id
    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const res = await fetch(`http://localhost:3001/records?id=${recordId}`);
                const data = await res.json();
                if (data.length > 0) {
                    setRecord(Record.fromJSON(data[0]));
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchRecord();
    }, [recordId]);

    if (!record && !pet) return null;
    return (
        <div className="w-full">
            {record ? (
                <div className="flex flex-row justify-between items-center gap-2 w-full text-[#333] border-b-2 border-b-gray-300">
                    <div className="flex-2">{pet?.species ?? "—"}</div>
                    <div className="flex-2">{record.petName}</div>
                    <div className="flex-2">{record.microchip}</div>
                    <div className="flex-1">{record.createdAt.toLocaleDateString("el-GR")}</div>
                    <div className="flex-1 text-right">
                        <button
                            onClick={() => onPreview(microchip)}
                            className="font-bold text-gray-600 hover:underline cursor-pointer"
                        >
                            Προβολή
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row justify-between items-center gap-2 w-full text-[#333] border-b-2 border-b-gray-300">
                    <div className="flex-2">{pet?.species ?? "—"}</div>
                    <div className="flex-2">{pet?.name}</div>
                    <div className="flex-2">{pet?.microchip}</div>
                    <div className="flex-1">{pet?.createdAt.toLocaleDateString("el-GR")}</div>
                    <div className="flex-1 text-right">
                        <button
                            onClick={() => onPreview(microchip)}
                            className="font-bold text-gray-600 hover:underline cursor-pointer"
                        >
                            Προβολή
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function RecordPreview({ microchip, onBack }: { microchip: string; onBack: () => void }) {
    const [owner, setOwner] = useState<User | null>(null);
    const [pet, setPet] = useState<Pets | null>(null);
    const [records, setRecords] = useState<Record[]>([]);
    const [loading, setLoading] = useState(true);

    // get pet with microchip
    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`http://localhost:3001/pets?microchip=${microchip}`);
                const data = await res.json();
                if (data.length > 0) {
                    setPet(Pets.fromJSON(data[0]));
                } else {
                    setPet(null);
                }
            } catch (e) {
                console.error(e);
                setPet(null);
            }
        };

        fetchPet();
    }, [microchip]);

    // get pet owner if pet exists
    useEffect(() => {
        if (!pet) return;

        const fetchOwner = async () => {
            try {
                const res = await fetch(`http://localhost:3001/users?id=${pet.ownerId}`);
                const data = await res.json();
                if (data.length > 0) {
                    setOwner(User.fromJSON(data[0]));
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchOwner();
    }, [pet]);

    // fetch records of pet with pet id= microchip
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch(`http://localhost:3001/records?microchip=${microchip}`);
                const data = await res.json();
                setRecords(data.map(Record.fromJSON));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [microchip]);

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `HealthRecord_${microchip}`,
    });

    if (loading) {
        return <p className="text-center mt-6">Φόρτωση...</p>;
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-2xl mx-auto border">
            <div className="flex gap-3 mb-6 w-full justify-between text-lg">
                <button
                    onClick={onBack}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer border"
                >
                    ← Πίσω
                </button>
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-lg text-white bg-[#006fdd] hover:bg-[#0056ab] transition cursor-pointer border border-black"
                >
                    Εκτύπωση
                </button>
            </div>
            <div ref={printRef}>
                <h2 className="text-2xl font-semibold mb-4">Βιβλιάριο Υγείας</h2>

                {pet ? (
                    <div className="mb-6 space-y-2 text-sm text-gray-700">
                        <p>
                            <b>Όνομα:</b> {pet.name}
                        </p>
                        <p>
                            <b>Είδος:</b> {pet.species}
                        </p>
                        <p>
                            <b>Ιδιοκτήτης:</b> {owner?.fullName ?? "—"}
                        </p>
                        <p>
                            <b>Microchip:</b> {pet.microchip}
                        </p>
                        <p>
                            <b>Φύλο:</b> {pet.gender}
                        </p>
                        <p>
                            <b>Φυλή:</b> {pet.breed}
                        </p>
                        <p>
                            <b>Χρώμα:</b> {pet.color}
                        </p>
                        <p>
                            <b>Ηλικία:</b> {pet.age}
                        </p>
                    </div>
                ) : (
                    <div className="mb-6 text-sm text-red-500 font-semibold">
                        Το κατοικίδιο δεν είναι καταχωρημένο στο σύστημα.
                        {records.map((rec) => (
                            <div key={rec.id} className="border rounded-lg p-3 bg-gray-50">
                                <p>
                                    <b>Ημερομηνία:</b>{" "}
                                    {new Date(rec.createdAt).toLocaleDateString("el-GR")}
                                </p>
                                <p>
                                    <b>Λόγος:</b> {PROCEDURE_OPTIONS[rec.reason]}
                                </p>
                                <p>
                                    <b>Κτηνίατρος:</b> {rec.vetName ?? "—"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <h3 className="text-lg font-semibold mb-2">Ιστορικό Επισκέψεων</h3>

                <div className="space-y-3 text-sm">
                    {records.map((rec) => (
                        <div key={rec.id} className="border rounded-lg p-3 bg-gray-50">
                            <p>
                                <b>Ημερομηνία:</b>{" "}
                                {new Date(rec.createdAt).toLocaleDateString("el-GR")}
                            </p>
                            <p>
                                <b>Λόγος:</b> {PROCEDURE_OPTIONS[rec.reason]}
                            </p>
                            <p>
                                <b>Κτηνίατρος:</b> {rec.vetName ?? "—"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function OldRecords() {
    const vet = JSON.parse(localStorage.getItem("pawrtal_user")!);
    const [records, setRecords] = useState<Record[]>([]);
    const [pets, setPets] = useState<Pets[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<"vet_records" | "all_pets">("vet_records");
    const formatDate = (date: string) => new Date(date).toLocaleDateString("el-GR");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [reasonFilter, setReasonFilter] = useState<Reason>("all");
    const [searchMicrochip, setSearchMicrochip] = useState("");
    const [selectedMicrochip, setSelectedMicrochip] = useState(String);

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

    // fetch all records
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

    // fetch all pets
    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await fetch(`http://localhost:3001/pets`);
                const data = await response.json();
                const mapped = data.map(Pets.fromJSON);
                setPets(mapped);
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };

        fetchPet();
    }, []);

    /// filter pet list according to microchop in the search
    const filteredPets = pets.filter((pet) =>
        pet.microchip.toLowerCase().includes(searchMicrochip.toLowerCase()),
    );
    /// filter records list according to reasonFilter, microchip , createdAt in the search
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
            {selectedMicrochip ? (
                <RecordPreview
                    microchip={selectedMicrochip}
                    onBack={() => setSelectedMicrochip("")}
                />
            ) : (
                <>
                    <div className="flex flex-col items-center  bg-[#ffffff]  rounded-xl p-8 gap-5 max-w-sm mx-auto sm:max-w-3xl  border">
                        <h1 className=" text-[#303030] m-auto text-3xl ">Ιστορικό</h1>

                        <select
                            value={search}
                            onChange={(e) => setSearch(e.target.value as any)}
                            className="border rounded-lg px-3 py-2 text-sm cursor-pointer"
                        >
                            <option value="vet_records">Ιστορικό Κτηνίατρου</option>
                            <option value="all_pets">Καταχωρημένα Κατοικίδια</option>
                        </select>

                        <div className="flex flex-wrap gap-4 items-center mb-6 w-full">
                            {search === "vet_records" && (
                                <>
                                    {/* Reason filter */}
                                    <select
                                        value={reasonFilter}
                                        onChange={(e) => setReasonFilter(e.target.value as any)}
                                        className="border rounded-lg px-3 py-2 text-sm cursor-pointer"
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
                                            <option value="blood_tests">
                                                Αιματολογικές εξετάσεις
                                            </option>
                                            <option value="urine_tests">Εξετάσεις ούρων</option>
                                            <option value="imaging">Ακτινογραφία / Υπέρηχος</option>
                                        </optgroup>

                                        <optgroup label="Άλλο">
                                            <option value="sick">
                                                Ασθένεια / Συμπτώματα ίωσης
                                            </option>
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
                                        className="border rounded-lg px-3 py-2 text-sm cursor-pointer"
                                    >
                                        <option value="newest">Νεότερα πρώτα</option>
                                        <option value="oldest">Παλαιότερα πρώτα</option>
                                    </select>
                                </>
                            )}
                            {/* Microchip search */}
                            <input
                                type="text"
                                placeholder="Αναζήτηση Microchip"
                                value={searchMicrochip}
                                onChange={(e) => setSearchMicrochip(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-45"
                            />
                        </div>

                        {/** Header Row */}
                        <div className="flex flex-row px-6 justify-between items-center gap-2 w-full text-[#333] border-b-3 border-b-black">
                            <div className="flex-2 ">Κατοικίδιο</div>
                            <div className="flex-2 ">Όνομα</div>
                            <div className="flex-2">Microchip</div>
                            <div className="flex-1">Ημ/νία</div>
                            <div className="flex-1">Προβολη</div>
                        </div>
                        <div className="flex flex-col gap-4 px-8 max-h-90 w-full overflow-y-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full">
                            {search === "vet_records" ? (
                                <>
                                    {filteredRecords.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">
                                            Δεν υπάρχουν καταγραφες περιστατικών
                                        </p>
                                    )}
                                    {filteredRecords.map((record) => (
                                        <Input
                                            microchip={record.microchip}
                                            recordId={record.id}
                                            onPreview={setSelectedMicrochip}
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {filteredPets.map((pet) => (
                                        <Input
                                            microchip={pet.microchip}
                                            recordId={undefined}
                                            onPreview={setSelectedMicrochip}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default OldRecords;
