// src/pages/OpenPet.tsx
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Calendar, User, Mail } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const API = "http://localhost:3001";

type Pet = {
    id: string;
    ownerId?: string;
    name?: string;
    species?: string;
    breed?: string;
    age?: number;
    lastSeenDate?: string; // "YYYY-MM-DD"
    location?: string;
    description?: string;
    photo?: string; // "/images/..." OR "public/images/..."
    createdAt?: string;
};

type DbUser = {
    id: string;
    fullName?: string;
    email?: string;
    phone_number?: string;
    role?: string;
};

async function asJson<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return (await res.json()) as T;
}

function normalize(s: unknown) {
    return (s ?? "").toString().trim();
}

function photoToPublicSrc(photo: unknown) {
    const v = normalize(photo);
    if (!v) return "";
    // convert "public/images/x.jpg" => "/images/x.jpg"
    if (v.startsWith("public/")) return `/${v.slice("public/".length)}`;
    return v; // already "/images/..." or external url
}

function formatDateYMD(ymd: string) {
    // expects "YYYY-MM-DD"
    const parts = ymd.split("-");
    if (parts.length !== 3) return ymd;
    const [yyyy, mm, dd] = parts;
    if (!yyyy || !mm || !dd) return ymd;
    return `${dd}/${mm}/${yyyy}`;
}

export default function OpenPet() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [pet, setPet] = useState<Pet | null>(null);
    const [owner, setOwner] = useState<DbUser | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!id) return;
            setLoading(true);
            setError(null);
            setPet(null);
            setOwner(null);

            try {
                const petData = await asJson<Pet>(
                    await fetch(`${API}/pets/${encodeURIComponent(id)}`),
                );
                if (cancelled) return;

                setPet(petData);

                const ownerId = normalize(petData.ownerId);
                if (ownerId) {
                    // Try to fetch owner details
                    try {
                        const ownerData = await asJson<DbUser>(
                            await fetch(`${API}/users/${encodeURIComponent(ownerId)}`),
                        );
                        if (!cancelled) setOwner(ownerData);
                    } catch {
                        // Owner missing is not fatal
                        if (!cancelled) setOwner(null);
                    }
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Αποτυχία φόρτωσης κατοικιδίου.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const imageSrc = useMemo(() => {
        const src = photoToPublicSrc(pet?.photo);
        return src || "/images/dog_1.jpg"; // fallback (place dog_1.jpg in public/images)
    }, [pet?.photo]);

    if (!id) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700">
                    Λείπει το id από το URL.
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                >
                    <ArrowLeft size={16} />
                    Πίσω
                </button>

                <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                    Φόρτωση…
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                >
                    <ArrowLeft size={16} />
                    Πίσω
                </button>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700">
                    {error}
                    <div className="mt-2 text-xs text-red-700/80">
                        Έλεγξε ότι τρέχει το JSON Server στο <b>{API}</b> και ότι υπάρχει το pet με
                        id <b>{id}</b>.
                    </div>
                </div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                >
                    <ArrowLeft size={16} />
                    Πίσω
                </button>

                <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                    Δεν βρέθηκε κατοικίδιο.
                </div>
            </div>
        );
    }

    const title = normalize(pet.name) || "Άγνωστο";
    const subtitleParts = [normalize(pet.species), normalize(pet.breed)].filter(Boolean);
    const subtitle = subtitleParts.join(" • ");

    const lastSeen = normalize(pet.lastSeenDate);
    const location = normalize(pet.location);
    const description = normalize(pet.description);

    const ownerName = normalize(owner?.fullName) || "—";
    const ownerEmail = normalize(owner?.email) || "—";

    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-6xl px-6 py-10">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                >
                    <ArrowLeft size={16} />
                    Πίσω
                </button>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl bg-zinc-200 h-[450px]">
                        <img
                            src={imageSrc}
                            alt={title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                // fallback if broken
                                (e.currentTarget as HTMLImageElement).src = "/images/dog_1.jpg";
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-semibold">{title}</h1>
                            {subtitle ? <p className="text-zinc-500">{subtitle}</p> : null}
                        </div>

                        <div>
                            <h3 className="mb-2 font-medium">Περιγραφή</h3>
                            <p className="text-sm text-zinc-600">
                                {description || "Δεν έχει δοθεί περιγραφή."}
                            </p>
                        </div>

                        <div className="space-y-2 text-sm text-zinc-600">
                            {location ? (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    {location}
                                </div>
                            ) : null}

                            {lastSeen ? (
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    Εξαφάνιση: {formatDateYMD(lastSeen)}
                                </div>
                            ) : null}
                        </div>

                        <hr />

                        <div>
                            <h3 className="mb-3 font-medium">Επικοινωνήστε με τον ιδιοκτήτη</h3>
                            <div className="space-y-2 text-sm text-zinc-600">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    {ownerName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    {ownerEmail !== "—" ? (
                                        <a
                                            className="hover:text-zinc-900 underline"
                                            href={`mailto:${ownerEmail}`}
                                        >
                                            {ownerEmail}
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </div>
                            </div>

                            {!owner && (
                                <div className="mt-3 text-xs text-zinc-500">
                                    Δεν βρέθηκαν στοιχεία ιδιοκτήτη (ownerId) στο /users.
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate(`/pets/${id}/found`)}
                            className="mt-4 w-full rounded-lg bg-zinc-800 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition"
                        >
                            Βρήκα αυτό το κατοικίδιο
                        </button>

                        <Link
                            to="/"
                            className="text-center text-sm text-zinc-500 hover:text-zinc-800"
                        >
                            Επιστροφή στη λίστα
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
