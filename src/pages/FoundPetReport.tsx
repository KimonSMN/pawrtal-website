import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export default function FoundPetReport() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [foundDate, setFoundDate] = useState(null);

    return (
        <div className="mx-auto max-w-xl px-4 py-10">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer"
            >
                <ArrowLeft size={16} />
            </button>

            {/* Form Card */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-6 space-y-6 shadow-sm">
                {/* Header */}
                <div>
                    <h1 className="text-lg font-semibold text-zinc-900">
                        Αναφορά εύρεσης κατοικιδίου: Pyke
                    </h1>
                    <p className="text-sm text-zinc-600 mt-1">
                        Παρακαλώ δώστε λεπτομέρειες σχετικά με το πού και πότε βρήκατε αυτό το
                        κατοικίδιο.
                    </p>
                </div>

                {/* Location */}
                <div>
                    <label className="text-sm font-medium text-zinc-800">
                        Τοποθεσία που βρέθηκε *
                    </label>
                    <input
                        type="text"
                        placeholder="π.χ. Ατσίδων 43, Χολαργός, Αθήνα"
                        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                </div>

                {/* Date */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-zinc-800">
                        Ημερομηνία που βρέθηκε *
                    </label>

                    <DatePicker
                        selected={foundDate}
                        onChange={(date) => setFoundDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Επιλέξτε ημερομηνία"
                        maxDate={new Date()}
                        className="
                            mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-zinc-300
                        "
                        calendarClassName="rounded-lg border border-zinc-200"
                    />
                </div>

                {/* Photo */}
                <div>
                    <label className="text-sm font-medium text-zinc-800">
                        Φωτογραφία (προαιρετικό)
                    </label>
                    <input
                        type="file"
                        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                    />
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-zinc-800">Όνομα *</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-zinc-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-800">Επίθετο *</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-zinc-300"
                        />
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <label className="text-sm font-medium text-zinc-800">Email ή Τηλέφωνο *</label>
                    <input
                        type="text"
                        placeholder="π.χ. email@email.com ή +30 69xxxxxxx"
                        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                </div>

                {/* Extra info */}
                <div>
                    <label className="text-sm font-medium text-zinc-800">
                        Επιπλέον πληροφορίες
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Οποιαδήποτε πρόσθετη πληροφορία μπορεί να βοηθήσει..."
                        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                </div>

                {/* Submit */}
                <button
                    className="w-full rounded-md bg-zinc-800 py-2.5 text-sm font-medium text-white
                               hover:bg-zinc-700 transition"
                >
                    Υποβολή Αναφοράς
                </button>
            </div>
        </div>
    );
}
