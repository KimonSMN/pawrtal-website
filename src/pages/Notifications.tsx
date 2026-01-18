// src/pages/Notifications.tsx
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Mail, MapPin, Calendar, Dog, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import Navbar from "../components/layout/Navbar";

const API = "http://localhost:3001";

type FoundReport = {
    id: string;
    petId: string;
    ownerId: string;
    reporterUserId?: string;

    foundLocation: string;
    foundDate: string; // ISO
    reporterFirstName: string;
    reporterLastName: string;
    reporterContact: string;
    extraInfo?: string;

    photoName?: string; // MVP only
    isRead: boolean;

    createdAt: string; // ISO
};

type Pet = {
    id: string;
    name?: string;
    species?: string;
    breed?: string;
    photo?: string;
};

async function asJson<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return (await res.json()) as T;
}

function normalize(v: unknown) {
    return (v ?? "").toString().trim();
}

function toPublicSrc(photo: unknown) {
    const v = normalize(photo);
    if (!v) return "";
    if (v.startsWith("public/")) return `/${v.slice("public/".length)}`;
    return v;
}

function fmtDateTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("el-GR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtDateOnly(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("el-GR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export default function Notifications() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const userId = user?.id;

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [reports, setReports] = useState<FoundReport[]>([]);
    const [petsById, setPetsById] = useState<Record<string, Pet>>({});

    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "read">("unread");

    // Guard
    useEffect(() => {
        if (!isAuthenticated) navigate("/auth", { replace: true });
    }, [isAuthenticated, navigate]);

    async function load() {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await asJson<FoundReport[]>(
                await fetch(
                    `${API}/foundReports?ownerId=${encodeURIComponent(
                        userId,
                    )}&_sort=createdAt&_order=desc`,
                ),
            );

            const arr = Array.isArray(data) ? data : [];
            setReports(arr);

            const uniquePetIds = Array.from(
                new Set(arr.map((r) => normalize(r.petId)).filter(Boolean)),
            );

            if (uniquePetIds.length === 0) {
                setPetsById({});
                return;
            }

            const pets = await Promise.all(
                uniquePetIds.map(async (pid) => {
                    try {
                        const p = await asJson<Pet>(
                            await fetch(`${API}/pets/${encodeURIComponent(pid)}`),
                        );
                        return p;
                    } catch {
                        return null;
                    }
                }),
            );

            const map: Record<string, Pet> = {};
            pets.filter(Boolean).forEach((p: any) => {
                map[p.id] = p;
            });

            setPetsById(map);
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία φόρτωσης ειδοποιήσεων.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const unreadCount = useMemo(() => reports.filter((r) => r.isRead === false).length, [reports]);
    const readCount = useMemo(() => reports.filter((r) => r.isRead === true).length, [reports]);

    const q = useMemo(() => normalize(query).toLowerCase(), [query]);

    const filtered = useMemo(() => {
        return reports
            .filter((r) => {
                if (filter === "unread") return r.isRead === false;
                if (filter === "read") return r.isRead === true;
                return true;
            })
            .filter((r) => {
                if (!q) return true;
                const pet = petsById[r.petId];
                const hay = [
                    r.reporterFirstName,
                    r.reporterLastName,
                    r.reporterContact,
                    r.foundLocation,
                    r.extraInfo,
                    pet?.name,
                    pet?.breed,
                    pet?.species,
                    r.petId,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                return hay.includes(q);
            });
    }, [reports, petsById, filter, q]);

    async function markOneRead(reportId: string, isRead: boolean) {
        setBusy(true);
        setError(null);
        try {
            const res = await fetch(`${API}/foundReports/${encodeURIComponent(reportId)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead }),
            });
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, isRead } : r)));
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία ενημέρωσης ειδοποίησης.");
        } finally {
            setBusy(false);
        }
    }

    async function markAllRead() {
        const unread = reports.filter((r) => r.isRead === false);
        if (unread.length === 0) return;

        setBusy(true);
        setError(null);
        try {
            await Promise.all(
                unread.map((r) =>
                    fetch(`${API}/foundReports/${encodeURIComponent(r.id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isRead: true }),
                    }).then((res) => {
                        if (!res.ok) throw new Error(`API error: ${res.status}`);
                    }),
                ),
            );

            setReports((prev) => prev.map((r) => ({ ...r, isRead: true })));
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία ενημέρωσης ειδοποιήσεων.");
        } finally {
            setBusy(false);
        }
    }

    // ✅ Delete one notification
    async function deleteOne(reportId: string) {
        // optional confirm (remove if you hate confirmations)
        const ok = window.confirm("Θέλεις σίγουρα να διαγράψεις αυτή την ειδοποίηση;");
        if (!ok) return;

        setBusy(true);
        setError(null);
        try {
            const res = await fetch(`${API}/foundReports/${encodeURIComponent(reportId)}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error(`API error: ${res.status}`);

            setReports((prev) => prev.filter((r) => r.id !== reportId));
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία διαγραφής ειδοποίησης.");
        } finally {
            setBusy(false);
        }
    }

    // ✅ Delete all read notifications (optional convenience)
    async function deleteAllRead() {
        const read = reports.filter((r) => r.isRead === true);
        if (read.length === 0) return;

        const ok = window.confirm(`Διαγραφή ${read.length} αναγνωσμένων ειδοποιήσεων;`);
        if (!ok) return;

        setBusy(true);
        setError(null);
        try {
            await Promise.all(
                read.map((r) =>
                    fetch(`${API}/foundReports/${encodeURIComponent(r.id)}`, {
                        method: "DELETE",
                    }).then((res) => {
                        if (!res.ok) throw new Error(`API error: ${res.status}`);
                    }),
                ),
            );

            setReports((prev) => prev.filter((r) => r.isRead !== true));
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία διαγραφής αναγνωσμένων ειδοποιήσεων.");
        } finally {
            setBusy(false);
        }
    }

    if (!isAuthenticated) return null;

    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 py-24">
                {/* Top bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={load}
                            disabled={busy || loading}
                            className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
                        >
                            Ανανέωση
                        </button>

                        <button
                            type="button"
                            onClick={markAllRead}
                            disabled={busy || loading || unreadCount === 0}
                            className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-60"
                        >
                            Σήμανση όλων ως διαβασμένα
                        </button>

                        <button
                            type="button"
                            onClick={deleteAllRead}
                            disabled={busy || loading || readCount === 0}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                            <Trash2 size={16} />
                            Διαγραφή αναγνωσμένων
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Κέντρο Ειδοποιήσεων
                    </h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        Αναφορές εύρεσης κατοικιδίων που αφορούν τα δικά σου κατοικίδια.
                    </p>
                </div>

                {/* Controls */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Αναζήτηση (όνομα, τοποθεσία, επαφή...)"
                            className="w-full rounded-xl border border-black/15 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none"
                        >
                            <option value="unread">Μη αναγνωσμένα</option>
                            <option value="read">Αναγνωσμένα</option>
                            <option value="all">Όλα</option>
                        </select>

                        <div className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-700">
                            Νέα: <span className="font-semibold">{unreadCount}</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                        Φόρτωση…
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700">
                        {error}
                        <div className="mt-2 text-xs text-red-700/80">
                            Έλεγξε ότι τρέχει το JSON Server στο <b>{API}</b> και ότι υπάρχει
                            collection <b>foundReports</b>.
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                        Δεν υπάρχουν ειδοποιήσεις με τα τρέχοντα φίλτρα.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {filtered.map((r) => {
                            const pet = petsById[r.petId];
                            const petName = normalize(pet?.name) || `Pet #${r.petId}`;
                            const petMeta = [normalize(pet?.species), normalize(pet?.breed)]
                                .filter(Boolean)
                                .join(" • ");
                            const petImg = toPublicSrc(pet?.photo) || "/images/dog_1.jpg";

                            return (
                                <div
                                    key={r.id}
                                    className={[
                                        "overflow-hidden rounded-2xl border bg-white shadow-sm",
                                        r.isRead ? "border-black/10" : "border-black/20",
                                    ].join(" ")}
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="h-44 w-full bg-zinc-200 sm:h-auto sm:w-40">
                                            <img
                                                src={petImg}
                                                alt={petName}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src =
                                                        "/images/dog_1.jpg";
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1 p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="truncate text-base font-semibold text-zinc-900">
                                                        {petName}
                                                    </div>
                                                    {petMeta ? (
                                                        <div className="mt-1 text-sm text-zinc-600">
                                                            {petMeta}
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <span
                                                    className={[
                                                        "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                                                        r.isRead
                                                            ? "bg-zinc-100 text-zinc-700"
                                                            : "bg-amber-100 text-amber-800",
                                                    ].join(" ")}
                                                >
                                                    {r.isRead ? "Αναγνωσμένο" : "Νέο"}
                                                </span>
                                            </div>

                                            <div className="mt-4 space-y-2 text-sm text-zinc-700">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-zinc-500" />
                                                    <span className="truncate">
                                                        Βρέθηκε:{" "}
                                                        <span className="font-medium">
                                                            {r.foundLocation}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-zinc-500" />
                                                    <span>
                                                        Ημερομηνία:{" "}
                                                        <span className="font-medium">
                                                            {fmtDateOnly(r.foundDate)}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Mail size={16} className="text-zinc-500" />
                                                    <span className="truncate">
                                                        Επαφή:{" "}
                                                        <span className="font-medium">
                                                            {r.reporterContact}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Dog size={16} className="text-zinc-500" />
                                                    <span className="truncate">
                                                        Από:{" "}
                                                        <span className="font-medium">
                                                            {r.reporterFirstName}{" "}
                                                            {r.reporterLastName}
                                                        </span>
                                                    </span>
                                                </div>

                                                {normalize(r.extraInfo) ? (
                                                    <div className="mt-2 rounded-xl border border-black/10 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                                                        {r.extraInfo}
                                                    </div>
                                                ) : null}

                                                <div className="text-xs text-zinc-500">
                                                    Υποβλήθηκε: {fmtDateTime(r.createdAt)}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => markOneRead(r.id, !r.isRead)}
                                                    disabled={busy}
                                                    className={[
                                                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                                                        r.isRead
                                                            ? "border border-black/15 bg-white text-zinc-900 hover:bg-zinc-50"
                                                            : "bg-black text-white hover:bg-zinc-900",
                                                        busy ? "opacity-60" : "",
                                                    ].join(" ")}
                                                >
                                                    <Check size={16} />
                                                    {r.isRead
                                                        ? "Σήμανση ως μη αναγνωσμένο"
                                                        : "Σήμανση ως διαβασμένο"}
                                                </button>

                                                {/* ✅ Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOne(r.id)}
                                                    disabled={busy}
                                                    className={[
                                                        "inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100",
                                                        busy ? "opacity-60" : "",
                                                    ].join(" ")}
                                                >
                                                    <Trash2 size={16} />
                                                    Διαγραφή
                                                </button>

                                                {r.photoName ? (
                                                    <span className="text-xs text-zinc-500">
                                                        Συνημμένο: {r.photoName}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
