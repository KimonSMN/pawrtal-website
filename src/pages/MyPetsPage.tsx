import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import Navbar from "../components/layout/Navbar";

const API = "http://localhost:3001";

async function asJson(res) {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
}

function normalize(v) {
    return (v ?? "").toString().trim();
}

function photoToPublicSrc(photo) {
    const v = normalize(photo);
    if (!v) return "";
    if (v.startsWith("public/")) return `/${v.slice("public/".length)}`; // public/images/x.jpg -> /images/x.jpg
    return v; // already "/images/..." or full URL
}

export default function MyPetsPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id;

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [pets, setPets] = useState([]);

    // Guard
    useEffect(() => {
        if (!isAuthenticated) navigate("/auth", { replace: true });
    }, [isAuthenticated, navigate]);

    async function load() {
        if (!userId) return;
        setBusy(true);
        setError(null);
        try {
            const data = await asJson(
                await fetch(`${API}/pets?ownerId=${encodeURIComponent(userId)}`),
            );
            setPets(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.message ?? "Αποτυχία φόρτωσης κατοικιδίων.");
        } finally {
            setLoading(false);
            setBusy(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    if (!isAuthenticated) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-zinc-50 pt-24">
                <div className="mx-auto max-w-5xl px-6 pb-16">
                    <header className="mb-6">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                            Τα Κατοικίδια μου
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600">
                            Προβολή των κατοικιδίων που ανήκουν στον λογαριασμό σου.
                        </p>
                    </header>

                    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-zinc-900">
                                Λίστα Κατοικιδίων
                            </h2>
                            <button
                                type="button"
                                className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
                                onClick={load}
                                disabled={busy}
                            >
                                {busy ? "Ανανέωση..." : "Ανανέωση"}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="mt-4 text-sm text-zinc-600">Φόρτωση…</div>
                        ) : pets.length === 0 ? (
                            <div className="mt-4 text-sm text-zinc-600">
                                Δεν έχεις καταχωρήσει κατοικίδια.
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {pets.map((p) => {
                                    const imgSrc = photoToPublicSrc(p.photo) || "/images/dog_1.jpg";

                                    return (
                                        <div
                                            key={p.id}
                                            className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
                                        >
                                            {/* Image */}
                                            <div className="h-48 w-full bg-zinc-200">
                                                <img
                                                    src={imgSrc}
                                                    alt={p.name || "Pet"}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/images/dog_1.jpg";
                                                    }}
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="p-4">
                                                <div className="truncate text-base font-semibold text-zinc-900">
                                                    {p.name || "—"}
                                                </div>
                                                <div className="mt-1 text-sm text-zinc-600">
                                                    {p.species || "—"}{" "}
                                                    {p.breed ? `• ${p.breed}` : ""}{" "}
                                                    {Number(p.age) ? `• ${p.age} ετών` : ""}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                                onClick={() => navigate("/", { replace: true })}
                            >
                                Επιστροφή
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
