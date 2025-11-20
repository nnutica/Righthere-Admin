"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Auth, db } from "@/libs/firebase";
import type { User as AppUser } from "@/type/user";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Pick<AppUser, "username" | "email"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(Auth, async (u) => {
      setFbUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as AppUser;
          setProfile({ username: data.username, email: data.email });
        } else {
          // fallback to email local-part if user doc not found
          setProfile({ username: (u.email ?? "").split("@")[0] || "User", email: u.email ?? "" });
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(Auth);
    router.replace("/login");
  };

  return (
    <aside className="flex w-64 flex-col justify-between border-r border-zinc-200 bg-white p-6">
      <div>
        <div className="mb-6 text-lg font-semibold text-zinc-900">Righthere Admin</div>
        <div className="rounded-md bg-zinc-50 p-3 text-sm">
          {loading ? (
            <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
          ) : fbUser ? (
            <div>
              <div className="font-medium text-zinc-900">
                {profile?.username || "User"}
              </div>
              <div className="text-xs text-zinc-500">{profile?.email}</div>
            </div>
          ) : (
            <div className="text-zinc-600">Not signed in</div>
          )}
        </div>
        <nav className="mt-4 mb-4 flex flex-col gap-1">
          <Link
            href="/"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname === "/" ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/diaries"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname === "/diaries" ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            Diaries
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-400"
      >
        Log out
      </button>
    </aside>
  );
}
