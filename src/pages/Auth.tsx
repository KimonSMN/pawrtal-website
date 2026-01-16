import { useMemo, useState } from "react";

type Role = "user" | "vet" | null;
type Mode = "login" | "signup";

export default function Auth() {
    const [hovered, setHovered] = useState<Role>(null);
    const [userMode, setUserMode] = useState<Mode>("login");
    const [vetMode, setVetMode] = useState<Mode>("login");

    const panels = useMemo(
        () => [
            {
                role: "user" as const,
                title: "Pet Owner",
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
                title: "Veterinarian",
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
                loginIdPlaceholder: "Vet ID / Email",
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
    theme: {
        shell: string;
        card: string;
        input: string;
        button: string;
        subtle: string;
    };
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
            {/* Active content */}
            <SwapFade show={active}>
                <AuthCard
                    title={title}
                    theme={theme}
                    mode={mode}
                    setMode={setMode}
                    loginIdPlaceholder={loginIdPlaceholder}
                />
            </SwapFade>

            {/* Inactive content */}
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
            <p className={`mt-1 text-sm ${subtleClass}`}>Hover to continue</p>
        </div>
    );
}

/* ---------------- AUTH CARD ---------------- */

function AuthCard({
    title,
    theme,
    mode,
    setMode,
    loginIdPlaceholder,
}: {
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
    return (
        <div
            className={[
                "w-[360px] rounded-2xl border p-6 shadow-sm backdrop-blur",
                theme.card,
            ].join(" ")}
        >
            <header className="mb-5">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {title} {mode === "login" ? "Login" : "Sign Up"}
                </h2>
                <p className={`mt-1 text-sm ${theme.subtle}`}>
                    {mode === "login"
                        ? "Enter your credentials to continue."
                        : "Fill in your details to create an account."}
                </p>
            </header>

            {mode === "login" ? (
                <div className="space-y-3">
                    <LabeledInput
                        label={loginIdPlaceholder}
                        placeholder={loginIdPlaceholder}
                        className={theme.input}
                        autoComplete="username"
                    />
                    <LabeledInput
                        label="Password"
                        placeholder="Password"
                        type="password"
                        className={theme.input}
                        autoComplete="current-password"
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    <LabeledInput
                        label="Full Legal Name"
                        placeholder="Full Legal Name"
                        className={theme.input}
                        autoComplete="name"
                    />
                    <LabeledInput
                        label="Email"
                        placeholder="Email"
                        type="email"
                        className={theme.input}
                        autoComplete="email"
                    />
                    <LabeledInput
                        label="Phone"
                        placeholder="Phone"
                        type="tel"
                        className={theme.input}
                        autoComplete="tel"
                    />
                    <LabeledInput
                        label="City"
                        placeholder="City"
                        className={theme.input}
                        autoComplete="address-level2"
                    />
                    <LabeledInput
                        label="Password"
                        placeholder="Password"
                        type="password"
                        className={theme.input}
                        autoComplete="new-password"
                    />
                    <LabeledInput
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        type="password"
                        className={theme.input}
                        autoComplete="new-password"
                    />
                </div>
            )}

            <button
                className={[
                    "mt-5 w-full rounded-xl py-3 text-sm font-medium transition-colors",
                    theme.button,
                ].join(" ")}
                type="button"
            >
                {mode === "login" ? "Login" : "Create Account"}
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
            {mode === "login" ? "No account?" : "Already have an account?"}{" "}
            <button
                type="button"
                className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-80"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
                {mode === "login" ? "Sign up" : "Login"}
            </button>
        </p>
    );
}
