import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../components/auth/AuthProvider";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const API = "http://localhost:3001";

type Pet = {
    id: string;
    ownerId?: string;
    name?: string;
    species?: string;
    breed?: string;
    age?: number;
    lastSeenDate?: string;
    location?: string;
    description?: string;
    photo?: string;
    status?: "lost" | "found";
};

type DbUser = {
    id: string;
    fullName?: string;
    email?: string;
    phone_number?: string;
    city?: string;
};

type FoundReport = {
    id: string;
    petId: string;
    ownerId: string;
    reporterUserId?: string;

    foundLocation: string;
    foundDate: string; // ISO date

    reporterFirstName: string;
    reporterLastName: string;
    reporterContact: string;
    extraInfo?: string;

    photoName?: string;

    status: "submitted";
    isRead: boolean;
    createdAt: string;
};

async function asJson<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return (await res.json()) as T;
}

function normalize(v: unknown) {
    return (v ?? "").toString().trim();
}

function genId() {
    return Math.random().toString(16).slice(2, 10);
}

function toPublicSrc(photo: unknown) {
    const v = normalize(photo);
    if (!v) return "";
    if (v.startsWith("public/")) return `/${v.slice("public/".length)}`;
    return v;
}

function splitName(fullName: string) {
    const parts = normalize(fullName).split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { firstName: "", lastName: "" };
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export default function FoundPetReport() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    // Logged-in full user record from DB (for prefill)
    const [me, setMe] = useState<DbUser | null>(null);

    // page data
    const [petLoading, setPetLoading] = useState(true);
    const [petError, setPetError] = useState<string | null>(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const [owner, setOwner] = useState<DbUser | null>(null);

    // form state
    const [busy, setBusy] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [foundLocation, setFoundLocation] = useState("");
    const [foundDate, setFoundDate] = useState<Date | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [extraInfo, setExtraInfo] = useState("");

    // photo (Option A: preview only, store file name)
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    useEffect(() => {
        return () => {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [photoPreview]);

    function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoFile(file);
        setPhotoPreview(file ? URL.createObjectURL(file) : "");
    }

    // 1) Fetch the logged-in user's full DB record (fullName/phone/city/email)
    useEffect(() => {
        let cancelled = false;

        async function loadMe() {
            if (!user?.id) {
                setMe(null);
                return;
            }

            try {
                const data = await asJson<DbUser>(
                    await fetch(`${API}/users/${encodeURIComponent(user.id)}`),
                );
                if (!cancelled) setMe(data);
            } catch {
                // fallback to whatever auth has
                if (!cancelled) setMe({ id: user.id, email: user.email });
            }
        }

        loadMe();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    // 2) Prefill form fields using DB user info
    // Only if the fields are still empty (doesn't overwrite user typing).
    useEffect(() => {
        if (!user?.id) return;

        const fullName = normalize(me?.fullName) || normalize((user as any)?.name);
        const email = normalize(me?.email) || normalize((user as any)?.email);
        const phone = normalize(me?.phone_number);
        const city = normalize(me?.city);

        const { firstName: fn, lastName: ln } = splitName(fullName);

        setFirstName((prev) => (normalize(prev) ? prev : fn));
        setLastName((prev) => (normalize(prev) ? prev : ln));

        // your form uses a single field for contact
        setContact((prev) => (normalize(prev) ? prev : phone || email));

        // OPTIONAL: prefill found location with city if empty.
        // If you DON'T want this, delete the next line.
        setFoundLocation((prev) => (normalize(prev) ? prev : city));
    }, [me, user]);

    // Load pet + owner
    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!id) return;
            setPetLoading(true);
            setPetError(null);
            setPet(null);
            setOwner(null);

            try {
                const petData = await asJson<Pet>(
                    await fetch(`${API}/lostpets/${encodeURIComponent(id)}`),
                );

                if (cancelled) return;
                setPet(petData);

                const ownerId = normalize(petData.ownerId);
                if (ownerId) {
                    try {
                        const ownerData = await asJson<DbUser>(
                            await fetch(`${API}/users/${encodeURIComponent(ownerId)}`),
                        );
                        if (!cancelled) setOwner(ownerData);
                    } catch {
                        if (!cancelled) setOwner(null);
                    }
                }
            } catch (e: any) {
                if (!cancelled) setPetError(e?.message ?? "Αποτυχία φόρτωσης κατοικιδίου.");
            } finally {
                if (!cancelled) setPetLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const petTitle = useMemo(() => normalize(pet?.name) || "Κατοικίδιο", [pet?.name]);

    const petSubtitle = useMemo(() => {
        const parts = [normalize(pet?.species), normalize(pet?.breed)].filter(Boolean);
        return parts.join(" • ");
    }, [pet?.species, pet?.breed]);

    const petImage = useMemo(() => {
        const src = toPublicSrc(pet?.photo);
        return src || "/images/dog_1.jpg";
    }, [pet?.photo]);

    const canSubmit = useMemo(() => {
        return (
            normalize(foundLocation).length > 0 &&
            !!foundDate &&
            normalize(firstName).length > 0 &&
            normalize(lastName).length > 0 &&
            normalize(contact).length > 0 &&
            normalize(pet?.id).length > 0 &&
            normalize(pet?.ownerId).length > 0
        );
    }, [foundLocation, foundDate, firstName, lastName, contact, pet?.id, pet?.ownerId]);

    async function handleSubmit() {
        setFormError(null);
        setSuccessMsg(null);

        if (!pet?.id || !pet?.ownerId) {
            setFormError("Λείπουν στοιχεία κατοικιδίου/ιδιοκτήτη.");
            return;
        }

        if (!canSubmit) {
            setFormError("Συμπλήρωσε όλα τα υποχρεωτικά πεδία (*).");
            return;
        }

        setBusy(true);
        try {
            const payload: FoundReport = {
                id: genId(),
                petId: pet.id,
                ownerId: pet.ownerId,
                reporterUserId: user?.id,

                foundLocation: normalize(foundLocation),
                foundDate: foundDate!.toISOString(),

                reporterFirstName: normalize(firstName),
                reporterLastName: normalize(lastName),
                reporterContact: normalize(contact),
                extraInfo: normalize(extraInfo) || undefined,

                photoName: photoFile?.name,

                status: "submitted",
                isRead: false,
                createdAt: new Date().toISOString(),
            };

            const res = await fetch(`${API}/foundReports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            await asJson(res);

            // Optional: mark pet as found
            try {
                await fetch(`${API}/pets/${encodeURIComponent(pet.id)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "found" }),
                });
            } catch {
                // ignore
            }

            setSuccessMsg(
                `Η αναφορά στάλθηκε στον ιδιοκτήτη${owner?.email ? ` (${owner.email})` : ""}.`,
            );

            // reset form (keep prefilled identity fields)
            setFoundLocation(normalize(me?.city) || "");
            setFoundDate(null);
            setExtraInfo("");

            setPhotoFile(null);
            if (photoPreview) URL.revokeObjectURL(photoPreview);
            setPhotoPreview("");
        } catch (e: any) {
            setFormError(e?.message ?? "Αποτυχία υποβολής αναφοράς.");
        } finally {
            setBusy(false);
        }
    }

    if (!id) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700">
                    Λείπει το id από το URL.
                </div>
            </div>
        );
    }

    if (petLoading) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                    Φόρτωση…
                </div>
            </div>
        );
    }

    if (petError) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700">
                    {petError}
                    <div className="mt-2 text-xs text-red-700/80">
                        Έλεγξε ότι τρέχει το JSON Server στο <b>{API}</b> και υπάρχει pet με id{" "}
                        <b>{id}</b>.
                    </div>
                </div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                    Δεν βρέθηκε κατοικίδιο.
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-5 pt-20">
                    {/* Pet card */}
                    <div className="md:col-span-2">
                        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                            <div className="h-56 w-full bg-zinc-200">
                                <img
                                    src={petImage}
                                    alt={petTitle}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            "/images/dog_1.jpg";
                                    }}
                                />
                            </div>

                            <div className="p-5">
                                <div className="text-lg font-semibold text-zinc-900">
                                    {petTitle}
                                </div>
                                {petSubtitle ? (
                                    <div className="mt-1 text-sm text-zinc-600">{petSubtitle}</div>
                                ) : null}

                                {normalize(pet.location) ? (
                                    <div className="mt-3 text-sm text-zinc-600">
                                        <b>Τελευταία τοποθεσία:</b> {normalize(pet.location)}
                                    </div>
                                ) : null}

                                {normalize(pet.description) ? (
                                    <div className="mt-3 text-sm text-zinc-600 line-clamp-4">
                                        {normalize(pet.description)}
                                    </div>
                                ) : null}

                                <div className="mt-4 text-xs text-zinc-500">
                                    Θα σταλεί στον ιδιοκτήτη:{" "}
                                    <span className="font-medium">
                                        {normalize(owner?.fullName) || "—"}
                                    </span>
                                    {normalize(owner?.email) ? (
                                        <>
                                            {" "}
                                            (
                                            <span className="font-medium">
                                                {normalize(owner?.email)}
                                            </span>
                                            )
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="md:col-span-3">
                        <div className="rounded-2xl border border-black/10 bg-white/85 p-6 shadow-sm backdrop-blur">
                            <div className="flex items-start justify-between gap-4 ">
                                <div>
                                    <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
                                        Αναφορά εύρεσης κατοικιδίου: {petTitle}
                                    </h1>
                                    <p className="mt-1 text-sm text-zinc-600">
                                        Δώστε λεπτομέρειες σχετικά με το πού και πότε βρήκατε αυτό
                                        το κατοικίδιο.
                                    </p>
                                </div>

                                {/* Discard / Close */}
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
                                    aria-label="Ακύρωση αναφοράς"
                                    disabled={busy}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                <LabeledInput
                                    label="Τοποθεσία που βρέθηκε *"
                                    placeholder="π.χ. Ατσίδων 43, Χολαργός, Αθήνα"
                                    autoComplete="street-address"
                                    value={foundLocation}
                                    onChange={(e) => setFoundLocation(e.target.value)}
                                    disabled={busy}
                                />

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
                                            busy ? "opacity-60" : "",
                                        ].join(" ")}
                                        calendarClassName="rounded-xl border border-black/10 shadow-sm"
                                        disabled={busy}
                                    />
                                </div>

                                <div className="block">
                                    <span className="mb-1 block text-xs font-medium text-zinc-700">
                                        Φωτογραφία (προαιρετικό)
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onPickPhoto}
                                        disabled={busy}
                                        className={[
                                            "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-zinc-900",
                                            "file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2",
                                            "file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-200",
                                            busy ? "opacity-60" : "",
                                        ].join(" ")}
                                    />

                                    {photoPreview ? (
                                        <div className="mt-3 overflow-hidden rounded-xl border border-black/10">
                                            <img
                                                src={photoPreview}
                                                alt="preview"
                                                className="h-40 w-full object-cover"
                                            />
                                        </div>
                                    ) : null}

                                    <div className="mt-2 text-[11px] text-zinc-500">
                                        Η φωτογραφία αποθηκεύεται μόνο ως όνομα αρχείου στο report.
                                        Για πραγματικό upload χρειάζεται backend.
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <LabeledInput
                                        label="Όνομα *"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={busy}
                                    />
                                    <LabeledInput
                                        label="Επίθετο *"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={busy}
                                    />
                                </div>

                                <LabeledInput
                                    label="Email ή Τηλέφωνο *"
                                    placeholder="π.χ. email@email.com ή +30 69xxxxxxx"
                                    autoComplete="email"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    disabled={busy}
                                />

                                <LabeledTextarea
                                    label="Επιπλέον πληροφορίες"
                                    placeholder="Οποιαδήποτε πρόσθετη πληροφορία μπορεί να βοηθήσει..."
                                    rows={3}
                                    value={extraInfo}
                                    onChange={(e) => setExtraInfo(e.target.value)}
                                    disabled={busy}
                                />

                                {formError ? (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700">
                                        {formError}
                                    </div>
                                ) : null}

                                {successMsg ? (
                                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800">
                                        {successMsg}
                                    </div>
                                ) : null}

                                <button
                                    className={[
                                        "mt-2 w-full rounded-xl bg-black py-3 text-sm font-medium text-white",
                                        "transition-colors hover:bg-zinc-900 disabled:opacity-60 cursor-pointer",
                                    ].join(" ")}
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={busy || !canSubmit}
                                >
                                    {busy ? "Υποβολή..." : "Υποβολή Αναφοράς"}
                                </button>

                                <p className="text-center text-xs text-zinc-500">
                                    Τα πεδία με * είναι υποχρεωτικά.
                                </p>

                                <div className="text-center text-[11px] text-zinc-400">
                                    petId:{" "}
                                    <span className="font-medium text-zinc-500">{pet.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

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
                    "placeholder:text-zinc-500 disabled:opacity-60",
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
                    "placeholder:text-zinc-500 disabled:opacity-60",
                    className,
                ].join(" ")}
            />
        </label>
    );
}
