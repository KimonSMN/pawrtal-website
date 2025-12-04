import React from "react";

export default function Hero() {
    return (
        <section className="pt-24 px-4 text-center max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-3">Βρες ή δήλωσε εύκολα τα κατοικίδιά σου.</h1>

            <p className="text-gray-700 mb-6">
                Η πλατφόρμα μας βοηθάει πολίτες και κτηνιάτρους να εντοπίζουν, ενημερώνουν και
                διαχειρίζονται πληροφορίες για κατοικίδια με ασφάλεια και ταχύτητα.
            </p>

            <p className="font-medium mb-6">Επίλεξε τον ρόλο σου για να ξεκινήσεις.</p>

            <div className="flex justify-center gap-4">
                <button className="px-6 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300">
                    Είμαι Ιδιοκτήτης
                </button>

                <button className="px-6 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300">
                    Είμαι Κτηνίατρος
                </button>
            </div>
        </section>
    );
}
