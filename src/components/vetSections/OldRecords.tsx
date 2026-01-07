import { Record } from "../models/Info";

type OldRecordsProps = {
    records: Record[];
};

function OldRecords({ records }: OldRecordsProps) {
    return (
        <div className="mt-5 w-full">
            <h2 className="text-lg font-bold mb-4">Ιστορικό Καταχωρήσεων</h2>

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
                        <b>Ημ/νία:</b> {record.createdAt.toLocaleDateString("el-GR")}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OldRecords;
