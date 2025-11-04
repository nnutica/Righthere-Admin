"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Auth, db } from "@/libs/firebase";
import type { User as AppUser } from "@/type/user";

export default function Sidebar() {
  const router = useRouter();
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
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
      <div>
        <div className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Righthere Admin</div>
        <div className="rounded-md bg-zinc-50 p-3 text-sm dark:bg-zinc-900">
          {loading ? (
            <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          ) : fbUser ? (
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">
                {profile?.username || "User"}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{profile?.email}</div>
            </div>
          ) : (
            <div className="text-zinc-600 dark:text-zinc-300">Not signed in</div>
          )}
        </div>
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
