// src/lib/authApi.ts
export type Role = "user" | "vet";

export type DbUser = {
    id: string;
    fullName: string;
    email: string;
    password: string;
    phone_number: string;
    age: number;
    role: Role;
    address?: string;
    city?: string;
    afm?: string;
    photo?: string;
    createdAt: string;
};

export type AuthResponse = {
    token: string; // mock token
    user: { id: string; email: string; role: Role; fullName: string };
};

const API = "http://localhost:3001";

async function asJson<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return (await res.json()) as T;
}

function generateId(): string {
    // simple id for json-server (you already use short strings like "8bae")
    return Math.random().toString(16).slice(2, 6);
}

function makeMockToken(user: Pick<DbUser, "id" | "email" | "role">) {
    // Not a real JWT; just a stable mock token for your frontend.
    return btoa(
        JSON.stringify({ sub: user.id, email: user.email, role: user.role, t: Date.now() }),
    );
}

export async function login(
    role: Role,
    identifier: string,
    password: string,
): Promise<AuthResponse> {
    const email = identifier.trim().toLowerCase();

    const url = new URL(`${API}/users`);
    url.searchParams.set("email", email);
    url.searchParams.set("role", role);
    url.searchParams.set("password", password);

    const res = await fetch(url.toString());
    const matches = await asJson<DbUser[]>(res);

    if (!matches.length) {
        throw new Error("Λάθος email/κωδικός ή δεν υπάρχει λογαριασμός.");
    }

    const user = matches[0];
    return {
        token: makeMockToken(user),
        user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    };
}

export type SignupInput = {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
    // you can add address/afm/photo later for vet flow if you want
};

export async function signup(role: Role, input: SignupInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    // 1) Ensure email not already used
    const existsRes = await fetch(`${API}/users?email=${encodeURIComponent(email)}`);
    const existing = await asJson<DbUser[]>(existsRes);
    if (existing.length) {
        throw new Error("Υπάρχει ήδη χρήστης με αυτό το email.");
    }

    // 2) Create user
    const newUser: DbUser = {
        id: generateId(),
        fullName: input.fullName.trim(),
        email,
        password: input.password,
        phone_number: input.phone.trim(),
        age: 0,
        role,
        city: input.city.trim(),
        createdAt: new Date().toISOString(),
    };

    const createRes = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
    });

    const created = await asJson<DbUser>(createRes);

    return {
        token: makeMockToken(created),
        user: {
            id: created.id,
            email: created.email,
            role: created.role,
            fullName: created.fullName,
        },
    };
}
