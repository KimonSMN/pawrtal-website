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
        <div className="mt-5 w-full">
            <h2 className="text-lg font-bold mb-4">Καταχωρήσεις Κατοικίδι στο Σύστημα</h2>

            {records.length === 0 && (
                <p className="text-sm text-gray-500">Δεν υπάρχουν καταχωρήσεις</p>
            )}

            {records.map((record, index) => (
                <div key={index} className="bg-[#f9f9f9] rounded-2xl p-4 mb-3 text-sm shadow-sm">
                    <div>
                        <b>Κατοικίδιο:</b> {record.species}
                    </div>
                    <div>
                        <b>Ιδιοκτήτης:</b> {record.ownerName}
                    </div>
                    <div>
                        <b>Microchip:</b> {record.petId}
                    </div>
                    <div>
                        <b>Ημ/νία:</b>
                        {formatDate(record.createdAt)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OldRecords;
