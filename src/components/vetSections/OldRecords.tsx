import { useState, useEffect } from "react";

function OldRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const vet = JSON.parse(localStorage.getItem("user")!);
    const formatDate = (date: string) => new Date(date).toLocaleDateString("el-GR");

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch(`http://localhost:3001/records?vetId=${vet.id}`);
                const data = await response.json();
                setRecords(data);
            } catch (error) {
                console.error("Fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    if (loading) return <p>loading ...</p>;

    return (
        <div className="mt-6 w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Καταχωρήσεις Κατοικιδίων στο Σύστημα
            </h2>

            {records.length === 0 && (
                <p className="text-sm text-gray-500 italic">Δεν υπάρχουν καταχωρήσεις</p>
            )}

            <div className="flex flex-col gap-3">
                {records.map((record, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-4 shadow-sm border
                                hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="grid grid-cols-2 gap-y-2 text-medium text-gray-700">
                            <div className="font-medium text-gray-500">Κατοικίδιο</div>
                            <div>{record.species}</div>

                            <div className="font-medium text-gray-500">Ιδιοκτήτης</div>
                            <div>{record.ownerName}</div>

                            <div className="font-medium text-gray-500">Microchip</div>
                            <div className="font-mono">{record.petId}</div>

                            <div className="font-medium text-gray-500">Ημ/νία</div>
                            <div>{formatDate(record.createdAt)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OldRecords;
