// src/pages/Notifications.tsx
import { useEffect, useMemo, useState } from "react";
import { Check, Mail, MapPin, Calendar, Dog, Search, Trash2, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import Navbar from "../components/layout/Navbar";

const API = "http://localhost:3001";

/** ===== Types ===== */
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

type Appointment = {
    id: string;
    pet?: string; // "dog" | "cat" | "pet" etc
    petId?: string;
    petName?: string;

    vetId?: string;
    vetName?: string;

    ownerId: string;

    reason?: string;
    date: string; // ISO
    status?: "new" | "approved" | "completed" | "canceled";
    notify?: "none" | "user" | "vet";
};

type Pet = {
    id: string;
    name?: string;
    species?: string;
    breed?: string;
    photo?: string;
};

type NotificationItem =
    | {
          kind: "foundReport";
          id: string;
          createdAt: string;
          isRead: boolean;
          petId: string;
          title: string;
          subtitle?: string;
          meta?: string;
          image?: string;
          report: FoundReport;
      }
    | {
          kind: "appointment";
          id: string;
          createdAt: string;
          isRead: boolean; // stored locally unless you add isRead to appointments
          petId?: string;
          title: string;
          subtitle?: string;
          meta?: string;
          image?: string;
          appt: Appointment;
      };

/** ===== Helpers ===== */
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

function reasonLabel(reason?: string) {
    const r = normalize(reason).toLowerCase();
    if (!r) return "Ραντεβού";
    const map: Record<string, string> = {
        checkup: "Έλεγχος",
        "check-up": "Έλεγχος",
        vaccination: "Εμβολιασμός",
        microchip: "Microchip",
        neutering: "Στείρωση",
        deworming: "Αποπαρασίτωση",
        blood_tests: "Εξετάσεις αίματος",
        urine_tests: "Εξετάσεις ούρων",
        emergency: "Επείγον",
        sick: "Αδιαθεσία",
    };
    return map[r] ?? reason!;
}

function statusLabel(status?: Appointment["status"]) {
    switch (status) {
        case "approved":
            return "Εγκρίθηκε";
        case "completed":
            return "Ολοκληρώθηκε";
        case "canceled":
            return "Ακυρώθηκε";
        case "new":
            return "Νέο";
        default:
            return "Ραντεβού";
    }
}

function statusBadgeClass(status?: Appointment["status"]) {
    switch (status) {
        case "approved":
            return "bg-emerald-100 text-emerald-800";
        case "completed":
            return "bg-blue-100 text-blue-800";
        case "canceled":
            return "bg-red-100 text-red-800";
        case "new":
            return "bg-zinc-100 text-zinc-700";
        default:
            return "bg-zinc-100 text-zinc-700";
    }
}

export default function Notifications() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const userId = user?.id;

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [petsById, setPetsById] = useState<Record<string, Pet>>({});

    // unified items
    const [items, setItems] = useState<NotificationItem[]>([]);

    // local "read" for appointment notifications (since appointments don’t have isRead)
    const [apptRead, setApptRead] = useState<Record<string, boolean>>(() => {
        try {
            const raw = localStorage.getItem("pawrtal_appt_read");
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "read">("unread");

    // Guard
    useEffect(() => {
        if (!isAuthenticated) navigate("/auth", { replace: true });
    }, [isAuthenticated, navigate]);

    // persist appt read map
    useEffect(() => {
        try {
            localStorage.setItem("pawrtal_appt_read", JSON.stringify(apptRead));
        } catch {
            // ignore
        }
    }, [apptRead]);

    async function load() {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch both sources in parallel
            const [foundReports, appointments] = await Promise.all([
                asJson<FoundReport[]>(
                    await fetch(
                        `${API}/foundReports?ownerId=${encodeURIComponent(
                            userId,
                        )}&_sort=createdAt&_order=desc`,
                    ),
                ),
                asJson<Appointment[]>(
                    await fetch(
                        `${API}/appointments?ownerId=${encodeURIComponent(
                            userId,
                        )}&_sort=date&_order=desc`,
                    ),
                ),
            ]);

            const foundArr = Array.isArray(foundReports) ? foundReports : [];
            const apptArr = Array.isArray(appointments) ? appointments : [];

            // Collect all petIds we need (from reports + appointments)
            const petIds = new Set<string>();
            foundArr.forEach((r) => {
                const pid = normalize(r.petId);
                if (pid) petIds.add(pid);
            });
            apptArr.forEach((a) => {
                const pid = normalize(a.petId);
                if (pid) petIds.add(pid);
            });

            // Fetch pets map once
            const petMap: Record<string, Pet> = {};
            if (petIds.size > 0) {
                const pets = await Promise.all(
                    Array.from(petIds).map(async (pid) => {
                        try {
                            return await asJson<Pet>(
                                await fetch(`${API}/pets/${encodeURIComponent(pid)}`),
                            );
                        } catch {
                            return null;
                        }
                    }),
                );

                pets.filter(Boolean).forEach((p: any) => {
                    petMap[p.id] = p;
                });
            }
            setPetsById(petMap);

            // Build unified items
            const nextItems: NotificationItem[] = [];

            // Found reports
            foundArr.forEach((r) => {
                const pet = petMap[r.petId];
                const petName = normalize(pet?.name) || `Pet #${r.petId}`;
                const petMeta = [normalize(pet?.species), normalize(pet?.breed)]
                    .filter(Boolean)
                    .join(" • ");
                const petImg = toPublicSrc(pet?.photo) || "/images/dog_1.jpg";

                nextItems.push({
                    kind: "foundReport",
                    id: `fr:${r.id}`,
                    createdAt: r.createdAt || r.foundDate,
                    isRead: !!r.isRead,
                    petId: r.petId,
                    title: `Νέα αναφορά εύρεσης για ${petName}`,
                    subtitle: `Βρέθηκε: ${r.foundLocation}`,
                    meta: [petMeta, `Από: ${r.reporterFirstName} ${r.reporterLastName}`]
                        .filter(Boolean)
                        .join(" • "),
                    image: petImg,
                    report: r,
                });
            });

            // Appointments (Owner side)
            apptArr
                // show only ones that matter (optional): notify=user OR status != new
                .filter((a) => a.notify === "user" || a.status !== "new")
                .forEach((a) => {
                    const pid = normalize(a.petId);
                    const pet = pid ? petMap[pid] : undefined;

                    const petName =
                        normalize(a.petName) ||
                        normalize(pet?.name) ||
                        (pid ? `Pet #${pid}` : "Κατοικίδιο");

                    const vetName = normalize(a.vetName) || "Κτηνίατρος";
                    const petMeta = [normalize(pet?.species), normalize(pet?.breed)]
                        .filter(Boolean)
                        .join(" • ");
                    const petImg = toPublicSrc(pet?.photo) || "/images/dog_1.jpg";

                    const localRead = !!apptRead[a.id];

                    nextItems.push({
                        kind: "appointment",
                        id: `ap:${a.id}`,
                        createdAt: a.date,
                        isRead: localRead,
                        petId: pid || undefined,
                        title: `Ραντεβού: ${petName}`,
                        subtitle: `${vetName} • ${fmtDateTime(a.date)}`,
                        meta: [statusLabel(a.status), reasonLabel(a.reason), petMeta]
                            .filter(Boolean)
                            .join(" • "),
                        image: petImg,
                        appt: a,
                    });
                });

            // Sort newest first
            nextItems.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );

            setItems(nextItems);
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

    const unreadCount = useMemo(() => items.filter((i) => i.isRead === false).length, [items]);
    const readCount = useMemo(() => items.filter((i) => i.isRead === true).length, [items]);

    const q = useMemo(() => normalize(query).toLowerCase(), [query]);

    const filtered = useMemo(() => {
        return items
            .filter((i) => {
                if (filter === "unread") return i.isRead === false;
                if (filter === "read") return i.isRead === true;
                return true;
            })
            .filter((i) => {
                if (!q) return true;

                const base = [i.title, i.subtitle, i.meta, i.petId]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (base.includes(q)) return true;

                // deep search per kind
                if (i.kind === "foundReport") {
                    const r = i.report;
                    const hay = [
                        r.reporterFirstName,
                        r.reporterLastName,
                        r.reporterContact,
                        r.foundLocation,
                        r.extraInfo,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();
                    return hay.includes(q);
                }

                if (i.kind === "appointment") {
                    const a = i.appt;
                    const hay = [a.vetName, a.petName, a.reason, a.status]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();
                    return hay.includes(q);
                }

                return false;
            });
    }, [items, filter, q]);

    /** ===== Actions ===== */

    async function markOneRead(item: NotificationItem, isRead: boolean) {
        setBusy(true);
        setError(null);

        try {
            if (item.kind === "foundReport") {
                const res = await fetch(
                    `${API}/foundReports/${encodeURIComponent(item.report.id)}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isRead }),
                    },
                );
                if (!res.ok) throw new Error(`API error: ${res.status}`);

                setItems(
                    (prev) =>
                        prev.map((i) =>
                            i.id === item.id ? { ...i, isRead } : i,
                        ) as NotificationItem[],
                );
            } else if (item.kind === "appointment") {
                // local only
                setApptRead((prev) => ({ ...prev, [item.appt.id]: isRead }));
                setItems(
                    (prev) =>
                        prev.map((i) =>
                            i.id === item.id ? { ...i, isRead } : i,
                        ) as NotificationItem[],
                );
            }
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία ενημέρωσης ειδοποίησης.");
        } finally {
            setBusy(false);
        }
    }

    async function markAllRead() {
        const unread = items.filter((i) => i.isRead === false);
        if (unread.length === 0) return;

        setBusy(true);
        setError(null);

        try {
            // PATCH foundReports, local for appointments
            const fr = unread.filter((i) => i.kind === "foundReport") as Extract<
                NotificationItem,
                { kind: "foundReport" }
            >[];

            const ap = unread.filter((i) => i.kind === "appointment") as Extract<
                NotificationItem,
                { kind: "appointment" }
            >[];

            await Promise.all(
                fr.map((i) =>
                    fetch(`${API}/foundReports/${encodeURIComponent(i.report.id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isRead: true }),
                    }).then((res) => {
                        if (!res.ok) throw new Error(`API error: ${res.status}`);
                    }),
                ),
            );

            if (ap.length > 0) {
                setApptRead((prev) => {
                    const next = { ...prev };
                    ap.forEach((i) => (next[i.appt.id] = true));
                    return next;
                });
            }

            setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία ενημέρωσης ειδοποιήσεων.");
        } finally {
            setBusy(false);
        }
    }

    async function deleteOne(item: NotificationItem) {
        const ok = window.confirm("Θέλεις σίγουρα να διαγράψεις αυτή την ειδοποίηση;");
        if (!ok) return;

        setBusy(true);
        setError(null);

        try {
            if (item.kind === "foundReport") {
                const res = await fetch(
                    `${API}/foundReports/${encodeURIComponent(item.report.id)}`,
                    { method: "DELETE" },
                );
                if (!res.ok) throw new Error(`API error: ${res.status}`);
            } else if (item.kind === "appointment") {
                // If you want hard delete from server, uncomment:
                // const res = await fetch(`${API}/appointments/${encodeURIComponent(item.appt.id)}`, { method: "DELETE" });
                // if (!res.ok) throw new Error(`API error: ${res.status}`);

                // Default: just hide locally
                setApptRead((prev) => {
                    const next = { ...prev };
                    next[item.appt.id] = true; // mark read so it doesn't show as "new" if you keep it
                    return next;
                });
            }

            setItems((prev) => prev.filter((i) => i.id !== item.id));
        } catch (e: any) {
            setError(e?.message ?? "Αποτυχία διαγραφής ειδοποίησης.");
        } finally {
            setBusy(false);
        }
    }

    async function deleteAllRead() {
        const read = items.filter((i) => i.isRead === true);
        if (read.length === 0) return;

        const ok = window.confirm(`Διαγραφή ${read.length} αναγνωσμένων ειδοποιήσεων;`);
        if (!ok) return;

        setBusy(true);
        setError(null);

        try {
            const fr = read.filter((i) => i.kind === "foundReport") as Extract<
                NotificationItem,
                { kind: "foundReport" }
            >[];
            const ap = read.filter((i) => i.kind === "appointment") as Extract<
                NotificationItem,
                { kind: "appointment" }
            >[];

            await Promise.all(
                fr.map((i) =>
                    fetch(`${API}/foundReports/${encodeURIComponent(i.report.id)}`, {
                        method: "DELETE",
                    }).then((res) => {
                        if (!res.ok) throw new Error(`API error: ${res.status}`);
                    }),
                ),
            );

            // remove appointment read marks too (optional)
            if (ap.length > 0) {
                setApptRead((prev) => {
                    const next = { ...prev };
                    ap.forEach((i) => delete next[i.appt.id]);
                    return next;
                });
            }

            setItems((prev) => prev.filter((i) => i.isRead !== true));
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
                        Αναφορές εύρεσης και ενημερώσεις ραντεβού που αφορούν τον λογαριασμό σου.
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
                            placeholder="Αναζήτηση (όνομα, τοποθεσία, κτηνίατρος...)"
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
                            Έλεγξε ότι τρέχει το JSON Server στο <b>{API}</b> και ότι υπάρχουν
                            collections <b>foundReports</b>, <b>appointments</b>, <b>pets</b>.
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
                        Δεν υπάρχουν ειδοποιήσεις με τα τρέχοντα φίλτρα.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {filtered.map((item) => {
                            const badge =
                                item.kind === "foundReport"
                                    ? item.isRead
                                        ? "bg-zinc-100 text-zinc-700"
                                        : "bg-amber-100 text-amber-800"
                                    : item.isRead
                                      ? "bg-zinc-100 text-zinc-700"
                                      : "bg-amber-100 text-amber-800";

                            const badgeText = item.isRead ? "Αναγνωσμένο" : "Νέο";

                            return (
                                <div
                                    key={item.id}
                                    className={[
                                        "overflow-hidden rounded-2xl border bg-white shadow-sm",
                                        item.isRead ? "border-black/10" : "border-black/20",
                                    ].join(" ")}
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="h-44 w-full bg-zinc-200 sm:h-auto sm:w-40">
                                            <img
                                                src={item.image || "/images/dog_1.jpg"}
                                                alt={item.title}
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
                                                        {item.title}
                                                    </div>
                                                    {item.subtitle ? (
                                                        <div className="mt-1 text-sm text-zinc-600">
                                                            {item.subtitle}
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <span
                                                    className={[
                                                        "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                                                        badge,
                                                    ].join(" ")}
                                                >
                                                    {badgeText}
                                                </span>
                                            </div>

                                            <div className="mt-4 space-y-2 text-sm text-zinc-700">
                                                {item.kind === "foundReport" ? (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />
                                                            <span className="truncate">
                                                                Τοποθεσία:{" "}
                                                                <span className="font-medium">
                                                                    {item.report.foundLocation}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Calendar
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />
                                                            <span>
                                                                Ημερομηνία:{" "}
                                                                <span className="font-medium">
                                                                    {fmtDateOnly(
                                                                        item.report.foundDate,
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Mail
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />
                                                            <span className="truncate">
                                                                Επαφή:{" "}
                                                                <span className="font-medium">
                                                                    {item.report.reporterContact}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Dog
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />
                                                            <span className="truncate">
                                                                Από:{" "}
                                                                <span className="font-medium">
                                                                    {item.report.reporterFirstName}{" "}
                                                                    {item.report.reporterLastName}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        {normalize(item.report.extraInfo) ? (
                                                            <div className="mt-2 rounded-xl border border-black/10 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                                                                {item.report.extraInfo}
                                                            </div>
                                                        ) : null}

                                                        <div className="text-xs text-zinc-500">
                                                            Υποβλήθηκε:{" "}
                                                            {fmtDateTime(item.report.createdAt)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <Stethoscope
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />
                                                            <span className="truncate">
                                                                Κατάσταση:{" "}
                                                                <span
                                                                    className={[
                                                                        "ml-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                                                                        statusBadgeClass(
                                                                            item.appt.status,
                                                                        ),
                                                                    ].join(" ")}
                                                                >
                                                                    {statusLabel(item.appt.status)}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Calendar
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />
                                                            <span>
                                                                Ημερομηνία/Ώρα:{" "}
                                                                <span className="font-medium">
                                                                    {fmtDateTime(item.appt.date)}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Dog
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />
                                                            <span className="truncate">
                                                                Λόγος:{" "}
                                                                <span className="font-medium">
                                                                    {reasonLabel(item.appt.reason)}
                                                                </span>
                                                            </span>
                                                        </div>

                                                        {item.appt.vetName ? (
                                                            <div className="flex items-center gap-2">
                                                                <MapPin
                                                                    size={16}
                                                                    className="text-zinc-500"
                                                                />
                                                                <span className="truncate">
                                                                    Κτηνίατρος:{" "}
                                                                    <span className="font-medium">
                                                                        {item.appt.vetName}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        ) : null}

                                                        <div className="text-xs text-zinc-500">
                                                            Προγραμματίστηκε:{" "}
                                                            {fmtDateTime(item.appt.date)}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => markOneRead(item, !item.isRead)}
                                                    disabled={busy}
                                                    className={[
                                                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                                                        item.isRead
                                                            ? "border border-black/15 bg-white text-zinc-900 hover:bg-zinc-50"
                                                            : "bg-black text-white hover:bg-zinc-900",
                                                        busy ? "opacity-60" : "",
                                                    ].join(" ")}
                                                >
                                                    <Check size={16} />
                                                    {item.isRead
                                                        ? "Σήμανση ως μη αναγνωσμένο"
                                                        : "Σήμανση ως διαβασμένο"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteOne(item)}
                                                    disabled={busy}
                                                    className={[
                                                        "inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100",
                                                        busy ? "opacity-60" : "",
                                                    ].join(" ")}
                                                >
                                                    <Trash2 size={16} />
                                                    Διαγραφή
                                                </button>

                                                {item.kind === "foundReport" &&
                                                item.report.photoName ? (
                                                    <span className="text-xs text-zinc-500">
                                                        Συνημμένο: {item.report.photoName}
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
