import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export default function FoundPetReport() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [foundDate, setFoundDate] = useState<Date | null>(null);

    return (
        <div className="mx-auto max-w-xl px-4 py-10">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className={[
                    "mb-6 inline-flex items-center gap-2",
                    "text-sm text-zinc-600 hover:text-zinc-900",
                ].join(" ")}
                type="button"
            >
                <ArrowLeft size={16} />
                <span>Πίσω</span>
            </button>

            {/* Form Card (Auth theme) */}
            <div className="rounded-2xl border border-black/10 bg-white/85 p-6 shadow-sm backdrop-blur">
                {/* Header */}
                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
                        Αναφορά εύρεσης κατοικιδίου: Pyke
                    </h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        Παρακαλώ δώστε λεπτομέρειες σχετικά με το πού και πότε βρήκατε αυτό το
                        κατοικίδιο.
                    </p>
                </div>

                <div className="mt-6 space-y-4">
                    {/* Location */}
                    <LabeledInput
                        label="Τοποθεσία που βρέθηκε *"
                        placeholder="π.χ. Ατσίδων 43, Χολαργός, Αθήνα"
                        autoComplete="street-address"
                    />

                    {/* Date */}
                    <div className="block">
                        <span className="mb-1 block text-xs font-medium text-zinc-700">
                            Ημερομηνία που βρέθηκε *
                        </span>

                        <DatePicker
                            selected={foundDate}
                            onChange={(date) => setFoundDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Επιλέξτε ημερομηνία"
                            maxDate={new Date()}
                            className={[
                                "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-zinc-900",
                                "outline-none transition-[box-shadow,border-color]",
                                "focus:ring-2 focus:ring-black/10 focus:border-black/25",
                            ].join(" ")}
                            calendarClassName="rounded-xl border border-black/10 shadow-sm"
                        />
                    </div>

                    {/* Photo */}
                    <div className="block">
                        <span className="mb-1 block text-xs font-medium text-zinc-700">
                            Φωτογραφία (προαιρετικό)
                        </span>
                        <input
                            type="file"
                            className={[
                                "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-zinc-900",
                                "file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2",
                                "file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-200",
                            ].join(" ")}
                        />
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <LabeledInput label="Όνομα *" />
                        <LabeledInput label="Επίθετο *" />
                    </div>

                    {/* Contact */}
                    <LabeledInput
                        label="Email ή Τηλέφωνο *"
                        placeholder="π.χ. email@email.com ή +30 69xxxxxxx"
                        autoComplete="email"
                    />

                    {/* Extra info */}
                    <LabeledTextarea
                        label="Επιπλέον πληροφορίες"
                        placeholder="Οποιαδήποτε πρόσθετη πληροφορία μπορεί να βοηθήσει..."
                        rows={3}
                    />

                    {/* Submit */}
                    <button
                        className={[
                            "mt-2 w-full rounded-xl bg-black py-3 text-sm font-medium text-white",
                            "transition-colors hover:bg-zinc-900",
                        ].join(" ")}
                        type="button"
                    >
                        Υποβολή Αναφοράς
                    </button>

                    {/* Small helper line (optional) */}
                    <p className="text-center text-xs text-zinc-500">
                        Τα πεδία με * είναι υποχρεωτικά.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ------- Shared inputs (match Auth) ------- */

function LabeledInput({
    label,
    className = "",
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700">{label}</span>
            <input
                {...props}
                className={[
                    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-zinc-900",
                    "outline-none transition-[box-shadow,border-color]",
                    "focus:ring-2 focus:ring-black/10 focus:border-black/25",
                    "placeholder:text-zinc-500",
                    className,
                ].join(" ")}
            />
        </label>
    );
}

function LabeledTextarea({
    label,
    className = "",
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700">{label}</span>
            <textarea
                {...props}
                className={[
                    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-zinc-900",
                    "outline-none transition-[box-shadow,border-color]",
                    "focus:ring-2 focus:ring-black/10 focus:border-black/25",
                    "placeholder:text-zinc-500",
                    className,
                ].join(" ")}
            />
        </label>
    );
}
