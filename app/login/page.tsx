"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            localStorage.setItem("ivy_access_token", data.access_token);
            localStorage.setItem("ivy_refresh_token", data.refresh_token);
            localStorage.setItem("ivy_user_email", data.user.email);

            localStorage.setItem(
                "ivy_token_expires_at",
                String(Date.now() + data.expires_in * 1000)
            );

            router.push("/listings");
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#faf9f7]">
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex h-20 max-w-7xl items-center px-6 lg:px-8">
                    <a href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-lg font-bold text-white">
                            I
                        </div>

                        <span className="text-xl font-semibold tracking-tight">
                            ivy homes
                        </span>
                    </a>
                </div>
            </header>

            <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
                <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <div className="text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                            Welcome back
                        </p>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                            Sign in to Ivy Homes
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-zinc-500">
                            Access your saved properties and continue exploring homes.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                required
                                className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                required
                                className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-zinc-400">
                        Use the demo credentials provided with the assignment.
                    </p>
                </div>
            </section>
        </main>
    );
}