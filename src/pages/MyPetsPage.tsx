// // src/pages/MyPetsPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../components/auth/AuthProvider";
// import Navbar from "../components/layout/Navbar";

// const API = "http://localhost:3001";

// async function asJson(res) {
//     if (!res.ok) throw new Error(`API error: ${res.status}`);
//     return await res.json();
// }

// function normalize(s) {
//     return (s ?? "").toString().trim();
// }

// function genId() {
//     return Math.random().toString(16).slice(2, 8);
// }

// export default function MyPetsPage() {
//     const navigate = useNavigate();
//     const { user, isAuthenticated, token } = useAuth();

//     const userId = user?.id;

//     const [loading, setLoading] = useState(true);
//     const [busy, setBusy] = useState(false);
//     const [error, setError] = useState(null);

//     const [pets, setPets] = useState([]);

//     // form fields
//     const [name, setName] = useState("");
//     const [species, setSpecies] = useState("dog"); // dog | cat | other
//     const [breed, setBreed] = useState("");
//     const [age, setAge] = useState(0);

//     // optional listing-ish fields (you already have them in db)
//     const [lastSeenDate, setLastSeenDate] = useState("");
//     const [location, setLocation] = useState("");
//     const [description, setDescription] = useState("");
//     const [photo, setPhoto] = useState(""); // recommended: /images/...

//     // Guard
//     useEffect(() => {
//         if (!isAuthenticated) navigate("/auth", { replace: true });
//     }, [isAuthenticated, navigate]);

//     async function load() {
//         if (!userId) return;
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await asJson(
//                 await fetch(`${API}/pets?ownerId=${encodeURIComponent(userId)}`),
//             );
//             setPets(Array.isArray(data) ? data : []);
//         } catch (e) {
//             setError(e?.message ?? "Αποτυχία φόρτωσης κατοικιδίων.");
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         load();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [userId]);

//     const canSubmit = useMemo(() => {
//         return normalize(name).length > 0 && normalize(species).length > 0;
//     }, [name, species]);

//     async function handleCreate(e) {
//         e.preventDefault();
//         setError(null);

//         if (!canSubmit) {
//             setError("Συμπλήρωσε τουλάχιστον Όνομα και Είδος.");
//             return;
//         }

//         setBusy(true);
//         try {
//             const payload = {
//                 id: genId(), // json-server also auto-generates if you omit, but you use strings already
//                 ownerId: userId,
//                 name: normalize(name),
//                 species,
//                 breed: normalize(breed),
//                 age: Number.isFinite(Number(age)) ? Number(age) : 0,
//                 lastSeenDate: normalize(lastSeenDate), // optional
//                 location: normalize(location),
//                 description: normalize(description),
//                 photo: normalize(photo),
//                 createdAt: new Date().toISOString(),
//             };

//             const res = await fetch(`${API}/pets`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                 },
//                 body: JSON.stringify(payload),
//             });

//             await asJson(res);

//             // reset form (keep species by preference)
//             setName("");
//             setBreed("");
//             setAge(0);
//             setLastSeenDate("");
//             setLocation("");
//             setDescription("");
//             setPhoto("");

//             await load();
//         } catch (e) {
//             setError(e?.message ?? "Αποτυχία δημιουργίας κατοικιδίου.");
//         } finally {
//             setBusy(false);
//         }
//     }

//     async function handleDelete(petId) {
//         setError(null);
//         setBusy(true);
//         try {
//             const res = await fetch(`${API}/pets/${encodeURIComponent(petId)}`, {
//                 method: "DELETE",
//                 headers: {
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                 },
//             });

//             // json-server returns empty object sometimes; still treat 200/204 as ok
//             if (!res.ok) throw new Error(`API error: ${res.status}`);

//             await load();
//         } catch (e) {
//             setError(e?.message ?? "Αποτυχία διαγραφής.");
//         } finally {
//             setBusy(false);
//         }
//     }

//     if (!isAuthenticated) return null;

//     return (
//         <>
//             <Navbar />
//             <div className="min-h-screen bg-zinc-50 pt-24">
//                 <div className="mx-auto max-w-5xl px-6 pb-16">
//                     <header className="mb-6">
//                         <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
//                             Τα Κατοικίδιά μου
//                         </h1>
//                         <p className="mt-1 text-sm text-zinc-600">
//                             Προσθήκη/Διαγραφή κατοικιδίων που ανήκουν στον λογαριασμό σου.
//                         </p>
//                     </header>

//                     {/* Create form */}
//                     <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
//                         <h2 className="text-lg font-semibold text-zinc-900">
//                             Προσθήκη Κατοικιδίου
//                         </h2>

//                         <form
//                             onSubmit={handleCreate}
//                             className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
//                         >
//                             <Field label="Όνομα *">
//                                 <input
//                                     className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     disabled={busy}
//                                 />
//                             </Field>

//                             <Field label="Είδος *">
//                                 <select
//                                     className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none"
//                                     value={species}
//                                     onChange={(e) => setSpecies(e.target.value)}
//                                     disabled={busy}
//                                 >
//                                     <option value="dog">Σκύλος</option>
//                                     <option value="cat">Γάτα</option>
//                                     <option value="other">Άλλο</option>
//                                 </select>
//                             </Field>

//                             <Field label="Ράτσα">
//                                 <input
//                                     className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
//                                     value={breed}
//                                     onChange={(e) => setBreed(e.target.value)}
//                                     disabled={busy}
//                                 />
//                             </Field>

//                             <Field label="Ηλικία">
//                                 <input
//                                     type="number"
//                                     min={0}
//                                     className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
//                                     value={age}
//                                     onChange={(e) => setAge(e.target.value)}
//                                     disabled={busy}
//                                 />
//                             </Field>

//                             <Field label="Τελευταία φορά (YYYY-MM-DD)">
//                                 <input
//                                     placeholder="2026-01-15"
//                                     className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
//                                     value={lastSeenDate}
//                                     onChange={(e) => setLastSeenDate(e.target.value)}
//                                     disabled={busy}
//                                 />
//                             </Field>

//                             <Field label="Τοποθεσία">
//                                 <input
//                                     className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
//                                     value={location}
//                                     onChange={(e) => setLocation(e.target.value)}
//                                     disabled={busy}
//                                 />
//                             </Field>

//                             <Field label="Φωτογραφία (path)">
//                                 <input
//                                     placeholder="/images/dog1.jpg"
//                                     className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
//                                     value={photo}
//                                     onChange={(e) => setPhoto(e.target.value)}
//                                     disabled={busy}
//                                 />
//                             </Field>

//                             <div className="sm:col-span-2">
//                                 <Field label="Περιγραφή">
//                                     <textarea
//                                         rows={3}
//                                         className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
//                                         value={description}
//                                         onChange={(e) => setDescription(e.target.value)}
//                                         disabled={busy}
//                                     />
//                                 </Field>
//                             </div>

//                             {error && (
//                                 <div className="sm:col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700">
//                                     {error}
//                                 </div>
//                             )}

//                             <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
//                                     onClick={() => navigate("/", { replace: true })}
//                                     disabled={busy}
//                                 >
//                                     Επιστροφή
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-60"
//                                     disabled={busy || !canSubmit}
//                                 >
//                                     {busy ? "Αποθήκευση..." : "Προσθήκη"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>

//                     {/* List */}
//                     <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
//                         <div className="flex items-center justify-between gap-3">
//                             <h2 className="text-lg font-semibold text-zinc-900">
//                                 Λίστα Κατοικιδίων
//                             </h2>
//                             <button
//                                 type="button"
//                                 className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
//                                 onClick={load}
//                                 disabled={busy}
//                             >
//                                 Ανανέωση
//                             </button>
//                         </div>

//                         {loading ? (
//                             <div className="mt-4 text-sm text-zinc-600">Φόρτωση…</div>
//                         ) : pets.length === 0 ? (
//                             <div className="mt-4 text-sm text-zinc-600">
//                                 Δεν έχεις καταχωρήσει κατοικίδια.
//                             </div>
//                         ) : (
//                             <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
//                                 {pets.map((p) => (
//                                     <div
//                                         key={p.id}
//                                         className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
//                                     >
//                                         <div className="flex items-start justify-between gap-3">
//                                             <div className="min-w-0">
//                                                 <div className="truncate text-base font-semibold text-zinc-900">
//                                                     {p.name}
//                                                 </div>
//                                                 <div className="mt-1 text-sm text-zinc-600">
//                                                     {p.species} {p.breed ? `• ${p.breed}` : ""}{" "}
//                                                     {Number(p.age) ? `• ${p.age} ετών` : ""}
//                                                 </div>
//                                                 {p.location ? (
//                                                     <div className="mt-2 text-sm text-zinc-600 truncate">
//                                                         Τοποθεσία: {p.location}
//                                                     </div>
//                                                 ) : null}
//                                                 {p.lastSeenDate ? (
//                                                     <div className="mt-1 text-sm text-zinc-600">
//                                                         Τελευταία φορά: {p.lastSeenDate}
//                                                     </div>
//                                                 ) : null}
//                                             </div>

//                                             <button
//                                                 type="button"
//                                                 className="shrink-0 rounded-xl border border-red-500/30 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
//                                                 onClick={() => handleDelete(p.id)}
//                                                 disabled={busy}
//                                             >
//                                                 Διαγραφή
//                                             </button>
//                                         </div>

//                                         {p.description ? (
//                                             <div className="mt-3 text-sm text-zinc-600 line-clamp-2">
//                                                 {p.description}
//                                             </div>
//                                         ) : null}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// function Field({ label, children }) {
//     return (
//         <label className="block">
//             <div className="mb-1 text-xs font-medium text-zinc-600">{label}</div>
//             {children}
//         </label>
//     );
// }
