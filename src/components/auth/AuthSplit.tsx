import { useState } from "react";

type Role = "user" | "vet" | null;

export default function AuthSplit() {
    const [hovered, setHovered] = useState<Role>(null);
    const [locked, setLocked] = useState<Role>(null);

    const active = locked ?? hovered;

    const panelBase =
        "relative flex items-center justify-center transition-all duration-500 ease-in-out cursor-pointer overflow-hidden";

    function panelStyle(role: Role) {
        if (!active) return "flex-1";
        if (active === role) return "flex-[1.15]";
        return "flex-[0.85] blur-[1.5px] brightness-75";
    }

    return (
        <div className="flex h-screen w-full">
            {/* USER */}
            <section
                className={`${panelBase} ${panelStyle("user")} bg-zinc-100`}
                onMouseEnter={() => !locked && setHovered("user")}
                onMouseLeave={() => !locked && setHovered(null)}
                onClick={() => setLocked("user")}
            >
                {active === "user" ? <UserForm /> : <CitizenVector />}
            </section>

            {/* VET */}
            <section
                className={`${panelBase} ${panelStyle("vet")} bg-slate-900 text-white`}
                onMouseEnter={() => !locked && setHovered("vet")}
                onMouseLeave={() => !locked && setHovered(null)}
                onClick={() => setLocked("vet")}
            >
                {active === "vet" ? <VetForm /> : <DoctorVector />}
            </section>
        </div>
    );
}

/* ---------------- FORMS ---------------- */

function UserForm() {
    return (
        <div className="w-[320px] animate-fadeUp">
            <h2 className="mb-6 text-2xl font-semibold">User Login</h2>

            <input className="mb-3 w-full rounded-lg border px-4 py-3" placeholder="Email" />
            <input
                className="mb-4 w-full rounded-lg border px-4 py-3"
                type="password"
                placeholder="Password"
            />

            <button className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-zinc-800">
                Login
            </button>
        </div>
    );
}

function VetForm() {
    return (
        <div className="w-[320px] animate-fadeUp">
            <h2 className="mb-6 text-2xl font-semibold">Veterinarian Login</h2>

            <input
                className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                placeholder="Vet ID / Email"
            />
            <input
                className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                type="password"
                placeholder="Password"
            />

            <button className="w-full rounded-lg bg-white py-3 font-medium text-black transition hover:bg-slate-200">
                Login
            </button>
        </div>
    );
}

/* ---------------- VECTORS ---------------- */

function CitizenVector() {
    return (
        <div className="text-center animate-vectorIn">
            <div className="text-7xl">🧍‍♂️</div>
            <p className="mt-3 text-lg opacity-70">Pet Owner</p>
        </div>
    );
}

function DoctorVector() {
    return (
        <div className="text-center animate-vectorIn">
            <div className="text-7xl">🩺</div>
            <p className="mt-3 text-lg opacity-70">Veterinarian</p>
        </div>
    );
}
