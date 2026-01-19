import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import * as authApi from "../../lib/authApi";

type Role = "user" | "vet" | null;
type Mode = "login" | "signup";

type Theme = {
    shell: string;
    card: string;
    input: string;
    button: string;
    subtle: string;
};

export default function Auth() {
    const [hovered, setHovered] = useState<Role>(null);
    const [userMode, setUserMode] = useState<Mode>("login");
    const [vetMode, setVetMode] = useState<Mode>("login");

    const panels = useMemo(
        () => [
            {
                role: "user" as const,
                title: "Ιδιοκτήτης",
                emoji: "🧍‍♂️",
                theme: {
                    shell: "bg-zinc-100 text-zinc-900",
                    card: "bg-white/85 border-black/10",
                    input: "bg-white border-black/15 text-zinc-900 placeholder:text-zinc-500",
                    button: "bg-black text-white hover:bg-zinc-900",
                    subtle: "text-zinc-600",
                },
                mode: userMode,
                setMode: setUserMode,
                loginIdPlaceholder: "Email",
            },
            {
                role: "vet" as const,
                title: "Κτηνίατρος",
                emoji: "🩺",
                theme: {
                    shell: "bg-slate-950 text-white",
                    card: "bg-white/5 border-white/10",
                    input: "bg-white/5 border-white/15 text-white placeholder:text-white/50",
                    button: "bg-white text-black hover:bg-white/90",
                    subtle: "text-white/70",
                },
                mode: vetMode,
                setMode: setVetMode,
                loginIdPlaceholder: "Email",
            },
        ],
        [userMode, vetMode],
    );

    return (
        <div className="flex h-screen w-full">
            {panels.map((p) => (
                <AuthPanel
                    key={p.role}
                    role={p.role}
                    hovered={hovered}
                    onHover={setHovered}
                    title={p.title}
                    emoji={p.emoji}
                    theme={p.theme}
                    mode={p.mode}
                    setMode={p.setMode}
                    loginIdPlaceholder={p.loginIdPlaceholder}
                />
            ))}
        </div>
    );
}

/* ---------------- PANEL ---------------- */

function AuthPanel(props: {
    role: Exclude<Role, null>;
    hovered: Role;
    onHover: (r: Role) => void;
    title: string;
    emoji: string;
    theme: Theme;
    mode: Mode;
    setMode: (m: Mode) => void;
    loginIdPlaceholder: string;
}) {
    const { role, hovered, onHover, title, emoji, theme, mode, setMode, loginIdPlaceholder } =
        props;

    const active = hovered === role;
    const flexClass = !hovered ? "flex-1" : active ? "flex-[1.18]" : "flex-[0.82]";

    return (
        <section
            className={[
                "relative overflow-hidden transition-[flex] duration-500 ease-in-out",
                "flex items-center justify-center p-6",
                flexClass,
                theme.shell,
            ].join(" ")}
            onMouseEnter={() => onHover(role)}
            onMouseLeave={() => onHover(null)}
        >
            <SwapFade show={active}>
                <AuthCard
                    role={role}
                    title={title}
                    theme={theme}
                    mode={mode}
                    setMode={setMode}
                    loginIdPlaceholder={loginIdPlaceholder}
                />
            </SwapFade>

            <SwapFade show={!active}>
                <RoleSplash title={title} emoji={emoji} subtleClass={theme.subtle} />
            </SwapFade>
        </section>
    );
}

/* ---------------- TRANSITION WRAPPER ---------------- */

function SwapFade({ show, children }: { show: boolean; children: React.ReactNode }) {
    return (
        <div
            className={[
                "absolute transition-all duration-300 ease-out",
                show
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 translate-y-2 scale-[0.985] pointer-events-none",
            ].join(" ")}
            aria-hidden={!show}
        >
            {children}
        </div>
    );
}

/* ---------------- SPLASH ---------------- */

function RoleSplash({
    emoji,
    title,
    subtleClass,
}: {
    emoji: string;
    title: string;
    subtleClass: string;
}) {
    return (
        <div className="text-center">
            <div className="text-7xl leading-none">{emoji}</div>
            <p className={`mt-3 text-lg font-medium ${subtleClass}`}>{title}</p>
            <p className={`mt-1 text-sm ${subtleClass}`}>Πέρασε το ποντίκι για συνέχεια</p>
        </div>
    );
}

/* ---------------- AUTH CARD ---------------- */

function AuthCard({
    role,
    title,
    theme,
    mode,
    setMode,
    loginIdPlaceholder,
}: {
    role: Exclude<Role, null>;
    title: string;
    theme: {
        card: string;
        input: string;
        button: string;
        subtle: string;
    };
    mode: Mode;
    setMode: (m: Mode) => void;
    loginIdPlaceholder: string;
}) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login fields
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    // Signup fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit() {
        setError(null);

        if (mode === "login") {
            if (!identifier.trim() || !password) {
                setError("Συμπλήρωσε τα στοιχεία σύνδεσης.");
                return;
            }
        } else {
            if (!fullName.trim() || !email.trim() || !phone.trim() || !city.trim()) {
                setError("Συμπλήρωσε όλα τα πεδία.");
                return;
            }
            if (!signupPassword || signupPassword.length < 6) {
                setError("Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.");
                return;
            }
            if (signupPassword !== confirmPassword) {
                setError("Οι κωδικοί δεν ταιριάζουν.");
                return;
            }
        }

        setBusy(true);
        try {
            const res =
                mode === "login"
                    ? await authApi.login(role, identifier, password)
                    : await authApi.signup(role, {
                          fullName,
                          email,
                          phone,
                          city,
                          password: signupPassword,
                      });

            login(res.token, {
                id: res.user.id,
                email: res.user.email,
                role: res.user.role,
                ...(res.user.fullName ? { name: res.user.fullName } : {}),
            } as any);

            navigate(role === "vet" ? "/vet" : "/client/home", { replace: true });
        } catch (e: any) {
            setError(e?.message ?? "Κάτι πήγε στραβά. Δοκίμασε ξανά.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div
            className={[
                "w-[360px] rounded-2xl border p-6 shadow-sm backdrop-blur",
                theme.card,
            ].join(" ")}
        >
            <header className="mb-5">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {title} — {mode === "login" ? "Σύνδεση" : "Εγγραφή"}
                </h2>
                <p className={`mt-1 text-sm ${theme.subtle}`}>
                    {mode === "login"
                        ? "Συμπλήρωσε τα στοιχεία σου για να συνεχίσεις."
                        : "Συμπλήρωσε τα στοιχεία σου για να δημιουργήσεις λογαριασμό."}
                </p>
            </header>

            {mode === "login" ? (
                <div className="space-y-3">
                    <LabeledInput
                        label={loginIdPlaceholder}
                        placeholder={loginIdPlaceholder}
                        className={theme.input}
                        autoComplete="username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={busy}
                    />
                    <LabeledInput
                        label="Κωδικός"
                        placeholder="Κωδικός"
                        type="password"
                        className={theme.input}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={busy}
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    <LabeledInput
                        label="Ονοματεπώνυμο"
                        placeholder="Ονοματεπώνυμο"
                        className={theme.input}
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={busy}
                    />
                    <LabeledInput
                        label="Email"
                        placeholder="Email"
                        type="email"
                        className={theme.input}
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={busy}
                    />
                    <LabeledInput
                        label="Τηλέφωνο"
                        placeholder="Τηλέφωνο"
                        type="tel"
                        className={theme.input}
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={busy}
                    />
                    <LabeledInput
                        label="Πόλη"
                        placeholder="Πόλη"
                        className={theme.input}
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={busy}
                    />
                    <LabeledInput
                        label="Κωδικός"
                        placeholder="Κωδικός"
                        type="password"
                        className={theme.input}
                        autoComplete="new-password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={busy}
                    />
                    <LabeledInput
                        label="Επιβεβαίωση Κωδικού"
                        placeholder="Επιβεβαίωση Κωδικού"
                        type="password"
                        className={theme.input}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={busy}
                    />
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm">
                    {error}
                </div>
            )}

            <button
                className={[
                    "mt-5 w-full rounded-xl py-3 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                    theme.button,
                ].join(" ")}
                type="button"
                onClick={handleSubmit}
                disabled={busy}
            >
                {busy
                    ? "Παρακαλώ περίμενε..."
                    : mode === "login"
                      ? "Σύνδεση"
                      : "Δημιουργία Λογαριασμού"}
            </button>

            <div className="mt-4">
                <AuthSwitch mode={mode} setMode={setMode} subtleClass={theme.subtle} />
            </div>
        </div>
    );
}

function LabeledInput({
    label,
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-medium opacity-70">{label}</span>
            <input
                {...props}
                className={[
                    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-[box-shadow,border-color]",
                    "focus:ring-2 focus:ring-black/10 focus:border-black/25",
                    className,
                ].join(" ")}
            />
        </label>
    );
}

/* ---------------- SWITCH ---------------- */

function AuthSwitch({
    mode,
    setMode,
    subtleClass,
}: {
    mode: Mode;
    setMode: (m: Mode) => void;
    subtleClass: string;
}) {
    return (
        <p className={`text-center text-sm ${subtleClass}`}>
            {mode === "login" ? "Δεν έχεις λογαριασμό;" : "Έχεις ήδη λογαριασμό;"}{" "}
            <button
                type="button"
                className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-80"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
                {mode === "login" ? "Εγγραφή" : "Σύνδεση"}
            </button>
        </p>
    );
}
