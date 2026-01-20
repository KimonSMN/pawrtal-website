import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/pawrtal_logo.png";
import profileIcon from "../../assets/profile.png";
import { useAuth } from "../auth/AuthProvider";

const API = "http://localhost:3001";

async function asJson(res: Response) {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
}

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Notifications (MVP)
    const [notifLoading, setNotifLoading] = useState(false);
    const [notifError, setNotifError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestUnread, setLatestUnread] = useState<any | null>(null);

    const userId = user?.id;

    const showNotifications = useMemo(() => {
        // you can scope this to "user" role if you want
        return isAuthenticated && !!userId;
    }, [isAuthenticated, userId]);

    async function loadUnread() {
        if (!showNotifications) return;
        setNotifLoading(true);
        setNotifError(null);
        try {
            // json-server supports filtering via query params
            const data = await asJson(
                await fetch(
                    `${API}/foundReports?ownerId=${encodeURIComponent(
                        userId,
                    )}&isRead=false&_sort=createdAt&_order=desc`,
                ),
            );

            const arr = Array.isArray(data) ? data : [];
            setUnreadCount(arr.length);
            setLatestUnread(arr[0] ?? null);
        } catch (e: any) {
            setNotifError(e?.message ?? "Αποτυχία φόρτωσης ειδοποιήσεων.");
            setUnreadCount(0);
            setLatestUnread(null);
        } finally {
            setNotifLoading(false);
        }
    }

    // close on outside click
    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            if (!open) return;
            const target = e.target as Node;
            if (menuRef.current && !menuRef.current.contains(target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [open]);

    // close on Esc
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    // Poll unread notifications while logged in (simple MVP)
    useEffect(() => {
        if (!showNotifications) return;

        loadUnread(); // initial
        const t = window.setInterval(() => {
            loadUnread();
        }, 20000);

        return () => window.clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showNotifications, userId]);

    // When dropdown opens, refresh immediately
    useEffect(() => {
        if (open) loadUnread();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function handleLogout() {
        logout();
        setOpen(false);
        navigate("/auth", { replace: true });
    }

    async function markAllRead() {
        if (!showNotifications) return;
        try {
            setNotifLoading(true);
            setNotifError(null);

            const data = await asJson(
                await fetch(
                    `${API}/foundReports?ownerId=${encodeURIComponent(userId)}&isRead=false`,
                ),
            );

            const arr = Array.isArray(data) ? data : [];

            // json-server: PATCH each item
            await Promise.all(
                arr.map((r: any) =>
                    fetch(`${API}/foundReports/${encodeURIComponent(r.id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isRead: true }),
                    }),
                ),
            );

            setUnreadCount(0);
            setLatestUnread(null);
        } catch (e: any) {
            setNotifError(e?.message ?? "Αποτυχία ενημέρωσης ειδοποιήσεων.");
        } finally {
            setNotifLoading(false);
        }
    }

    return (
        <header className="fixed left-0 top-0 z-10 w-full border-b-2 border-gray-300 bg-gray-100 py-3">
            <div className="flex items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 cursor-pointer">
                    <img className="h-7" src={logo} alt="Pawrtal logo" />
                    <div className="text-xl font-medium">Pawrtal</div>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center space-x-6 font-medium">
                    {/* <a href="#information" className="hover:text-gray-500 cursor-pointer">
                        Πληροφορίες
                    </a>
                    <a href="#contact" className="hover:text-gray-500 cursor-pointer">
                        Επικοινωνία
                    </a> */}

                    {/* Profile dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200 transition cursor-pointer"
                            onClick={() => setOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={open}
                            aria-label="Profile menu"
                        >
                            <img
                                className="h-6 w-6 object-contain"
                                src={profileIcon}
                                alt="Profile icon"
                            />

                            {/* Notification badge */}
                            {showNotifications && unreadCount > 0 && (
                                <span
                                    className={[
                                        "absolute -right-1 -top-1",
                                        "min-w-[18px] h-[18px] px-1",
                                        "rounded-full bg-red-600 text-white",
                                        "text-[11px] leading-[18px] text-center font-semibold",
                                        "ring-2 ring-gray-100",
                                    ].join(" ")}
                                >
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {open && (
                            <div
                                role="menu"
                                className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg "
                            >
                                {/* Header */}
                                <div className="border-b border-black/10 px-4 py-3 ">
                                    {isAuthenticated ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpen(false);

                                                if (user?.role === "vet") {
                                                    navigate("/vet");
                                                } else {
                                                    navigate("/client/home");
                                                }
                                            }}
                                            className="w-full text-left hover:opacity-80 transition cursor-pointer"
                                        >
                                            <div className="text-sm font-semibold text-zinc-900">
                                                {user?.email}
                                            </div>
                                            <div className="text-xs text-zinc-600">
                                                {user?.role === "vet" ? "Κτηνίατρος" : "Χρήστης"}
                                            </div>
                                        </button>
                                    ) : (
                                        <>
                                            <div className="text-sm font-semibold text-zinc-900">
                                                Επισκέπτης
                                            </div>
                                            <div className="text-xs text-zinc-600">
                                                Δεν έχεις συνδεθεί
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Notifications (MVP) */}
                                {isAuthenticated && showNotifications && (
                                    <div className="border-b border-black/10 px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-semibold text-zinc-700">
                                                Ειδοποιήσεις
                                            </div>

                                            {unreadCount > 0 ? (
                                                <button
                                                    type="button"
                                                    onClick={markAllRead}
                                                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                                                    disabled={notifLoading}
                                                >
                                                    Σήμανση ως διαβασμένα
                                                </button>
                                            ) : null}
                                        </div>

                                        {notifError ? (
                                            <div className="mt-2 text-xs text-red-700">
                                                {notifError}
                                            </div>
                                        ) : notifLoading ? (
                                            <div className="mt-2 text-xs text-zinc-600">
                                                Φόρτωση…
                                            </div>
                                        ) : unreadCount === 0 ? (
                                            <div className="mt-2 text-xs text-zinc-600">
                                                Δεν έχεις νέες ειδοποιήσεις.
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Later: go to full notification center
                                                    setOpen(false);
                                                    navigate("/notifications");
                                                }}
                                                className="mt-2 w-full rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-left hover:bg-zinc-100"
                                            >
                                                <div className="text-sm font-medium text-zinc-900">
                                                    Νέα αναφορά εύρεσης
                                                </div>
                                                <div className="mt-0.5 text-xs text-zinc-600">
                                                    {latestUnread?.petId
                                                        ? `Για κατοικίδιο #${latestUnread.petId}`
                                                        : "Άνοιξε για λεπτομέρειες"}
                                                </div>
                                                <div className="mt-1 text-[11px] text-zinc-500">
                                                    {unreadCount} μη αναγνωσμένες
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Items */}
                                <div className="py-2">
                                    {!isAuthenticated ? (
                                        <>
                                            <MenuLink
                                                to="/auth"
                                                onSelect={() => setOpen(false)}
                                                label="Σύνδεση / Εγγραφή"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <MenuLink
                                                to="/profile"
                                                onSelect={() => setOpen(false)}
                                                label="Επεξεργασία Προφίλ"
                                                sub="Στοιχεία λογαριασμού"
                                            />

                                            <MenuLink
                                                to="/mypets"
                                                onSelect={() => setOpen(false)}
                                                label="Διαχείριση Κατοικιδίων"
                                                sub="Προσθήκη / Αφαίρεση"
                                            />

                                            {/* Placeholder route for notification center */}
                                            <MenuLink
                                                to="/notifications"
                                                onSelect={() => setOpen(false)}
                                                label="Κέντρο Ειδοποιήσεων"
                                                sub={
                                                    unreadCount > 0
                                                        ? `${unreadCount} νέες ειδοποιήσεις`
                                                        : "Καμία νέα ειδοποίηση"
                                                }
                                            />

                                            <div className="my-2 border-t border-black/10" />

                                            <button
                                                type="button"
                                                className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition"
                                                onClick={handleLogout}
                                                role="menuitem"
                                            >
                                                Αποσύνδεση
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

function MenuLink({
    to,
    label,
    sub,
    onSelect,
}: {
    to: string;
    label: string;
    sub?: string;
    onSelect: () => void;
}) {
    return (
        <Link
            to={to}
            onClick={onSelect}
            role="menuitem"
            className="block px-4 py-2 hover:bg-gray-50 transition"
        >
            <div className="text-sm font-medium text-zinc-900">{label}</div>
            {sub && <div className="text-xs text-zinc-600">{sub}</div>}
        </Link>
    );
}

export default Navbar;
