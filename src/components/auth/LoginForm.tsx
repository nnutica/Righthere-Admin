"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Auth, db } from "@/libs/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { User as AppUser } from "@/type/user";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await setPersistence(
        Auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      const cred = await signInWithEmailAndPassword(Auth, email.trim(), password);
      const { user } = cred;

      // Check or create Firestore user document
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const newUser: AppUser = {
          uid: user.uid,
          username: email.split("@")[0],
          email: user.email || email,
          role: "admin",
          coin: 0,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newUser);
      } else {
        const data = snap.data() as Partial<AppUser> & { role?: string };
        if (data.role === "user") {
          await updateDoc(userRef, { role: "admin" });
        }
      }

      // Navigate after login
      router.push("/");
    } catch (err: any) {
      const code = err?.code as string | undefined;
      const message =
        code === "auth/invalid-credential"
          ? "Invalid email or password"
          : code === "auth/user-disabled"
          ? "This account has been disabled"
          : code?.startsWith("auth/")
          ? code.replace("auth/", "").replace(/-/g, " ")
          : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-white dark:bg-black">
      <div className="relative w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-black">
        {/* Decorative dots/waves could be added with SVGs; keeping minimal for now */}
        <h1 className="mb-8 text-center text-3xl font-semibold text-black dark:text-zinc-50">
          Welcome Back
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-md border border-zinc-200 bg-white px-4 py-2 text-black placeholder-zinc-400 outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-md border border-zinc-200 bg-white px-4 py-2 text-black placeholder-zinc-400 outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-yellow-500"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Forgot password?
            </a>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-yellow-500 px-6 py-3 font-medium text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don’t have an account? <span className="font-medium text-zinc-700 dark:text-zinc-200">Contact admin</span>
        </div>
      </div>
    </div>
  );
}
