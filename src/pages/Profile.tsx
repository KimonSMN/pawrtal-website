// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

const API = "http://localhost:3001";

async function asJson(res) {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
}

export default function Profile() {
    const navigate = useNavigate();
    const { user, isAuthenticated, token } = useAuth();

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated) navigate("/auth", { replace: true });
    }, [isAuthenticated, navigate]);

    const userId = user?.id;

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    // Form fields (match your db.json keys)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [age, setAge] = useState(0);

    // Vet-only
    const [afm, setAfm] = useState("");
    const [photo, setPhoto] = useState("");

    const isVet = useMemo(() => user?.role === "vet", [user]);

    // Load current user from JSON Server (source of truth)
    useEffect(() => {
        if (!userId) return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            setSaved(false);

            try {
                const dbUser = await asJson(await fetch(`${API}/users/${userId}`));

                if (cancelled) return;

                setFullName(dbUser.fullName ?? "");
                setEmail(dbUser.email ?? "");
                setPhoneNumber(dbUser.phone_number ?? "");
                setCity(dbUser.city ?? "");
                setAddress(dbUser.address ?? "");
                setAge(Number(dbUser.age ?? 0));

                setAfm(dbUser.afm ?? "");
                setPhoto(dbUser.photo ?? "");
            } catch (e) {
                if (!cancelled) setError(e?.message ?? "Αποτυχία φόρτωσης προφίλ.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    async function handleSave() {
        setError(null);
        setSaved(false);

        if (!fullName.trim() || !email.trim()) {
            setError("Το Ονοματεπώνυμο και το Email είναι υποχρεωτικά.");
            return;
        }

        setBusy(true);
        try {
            // Optional: prevent duplicate email (except current user)
            const check = await asJson(
                await fetch(`${API}/users?email=${encodeURIComponent(email.trim().toLowerCase())}`),
            );
            const someoneElse = Array.isArray(check) && check.some((u) => u.id !== userId);
            if (someoneElse) {
                setError("Υπάρχει ήδη χρήστης με αυτό το email.");
                setBusy(false);
                return;
            }

            const payload = {
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                phone_number: phoneNumber.trim(),
                city: city.trim(),
                address: address.trim(),
                age: Number.isFinite(Number(age)) ? Number(age) : 0,
                ...(isVet ? { afm: afm.trim(), photo: photo.trim() } : {}),
            };

            // If you want to require "auth", you can send token header.
            // JSON Server ignores it, but it's fine for architecture consistency.
            const res = await fetch(`${API}/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            await asJson(res);
            setSaved(true);
        } catch (e) {
            setError(e?.message ?? "Αποτυχία αποθήκευσης.");
        } finally {
            setBusy(false);
        }
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-zinc-50 pt-24">
            <div className="mx-auto max-w-3xl px-6 pb-16">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                        Επεξεργασία Προφίλ
                    </h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        Ενημέρωσε τα στοιχεία που δήλωσες κατά την εγγραφή.
                    </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    {loading ? (
                        <div className="text-sm text-zinc-600">Φόρτωση…</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Ονοματεπώνυμο">
                                    <input
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={busy}
                                    />
                                </Field>

                                <Field label="Email">
                                    <input
                                        type="email"
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={busy}
                                    />
                                </Field>

                                <Field label="Τηλέφωνο">
                                    <input
                                        type="tel"
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        disabled={busy}
                                    />
                                </Field>

                                <Field label="Ηλικία">
                                    <input
                                        type="number"
                                        min={0}
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        disabled={busy}
                                    />
                                </Field>

                                <Field label="Πόλη">
                                    <input
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        disabled={busy}
                                    />
                                </Field>

                                <Field label="Διεύθυνση">
                                    <input
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={busy}
                                    />
                                </Field>

                                {isVet && (
                                    <>
                                        <Field label="ΑΦΜ (Κτηνίατρος)">
                                            <input
                                                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                                value={afm}
                                                onChange={(e) => setAfm(e.target.value)}
                                                disabled={busy}
                                            />
                                        </Field>

                                        <Field label="Φωτογραφία (URL ή path)">
                                            <input
                                                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                                value={photo}
                                                onChange={(e) => setPhoto(e.target.value)}
                                                disabled={busy}
                                                placeholder="/images/profile.jpg"
                                            />
                                        </Field>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {saved && !error && (
                                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800">
                                    Αποθηκεύτηκαν οι αλλαγές.
                                </div>
                            )}

                            <div className="mt-6 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
                                    onClick={() => navigate("/", { replace: true })}
                                    disabled={busy}
                                >
                                    Ακύρωση
                                </button>
                                <button
                                    type="button"
                                    className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-60"
                                    onClick={handleSave}
                                    disabled={busy || loading}
                                >
                                    {busy ? "Αποθήκευση..." : "Αποθήκευση"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <div className="mb-1 text-xs font-medium text-zinc-600">{label}</div>
            {children}
        </label>
    );
}
