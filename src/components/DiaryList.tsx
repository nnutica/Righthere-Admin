"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import DiaryCard from "./DiaryCard";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/libs/firebase";

interface DiaryDocRaw {
  id: string;
  content?: string;
  keywords?: string;
  suggestion?: string;
  emotionalReflection?: string;
  createdAt?: any; // Firestore Timestamp | string
  imageUrl?: string;
  imageUrls?: string[];
  mood?: string;
}

interface DiaryDoc extends DiaryDocRaw {
  createdDate?: Date;
}

function toDate(v: any): Date | undefined {
  if (!v) return undefined;
  if (typeof v?.toDate === "function") return v.toDate();
  if (typeof v === "string") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return undefined;
}

function normalizeMood(m?: string): string {
  if (!m) return "";
  return m.trim().toLowerCase();
}

export default function DiaryList() {
  const [diaries, setDiaries] = useState<DiaryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const CARD_WIDTH = 384; // px (Tailwind w-96)
  const CARD_GAP = 16; // px
  const scrollByCards = (n: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = n * (CARD_WIDTH + CARD_GAP);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    const col = collection(db, "diaries");
    const qRef = query(col, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      qRef,
      (snap) => {
        const list: DiaryDoc[] = [];
        snap.forEach((d) => {
          const data = d.data() as DiaryDocRaw;
          list.push({ ...data, id: d.id, createdDate: toDate(data.createdAt) });
        });
        list.sort((a, b) => {
          const ta = a.createdDate?.getTime() || 0;
          const tb = b.createdDate?.getTime() || 0;
          return tb - ta;
        });
        setDiaries(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (moodFilter === "all") return diaries;
    return diaries.filter((d) => normalizeMood(d.mood) === moodFilter);
  }, [diaries, moodFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-zinc-900">Diaries</h1>
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500">Filter mood:</label>
          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs"
          >
            <option value="all">All</option>
            <option value="sadness">Sadness</option>
            <option value="anger">Angry</option>
            <option value="love">Love</option>
            <option value="fear">Fear</option>
            <option value="disgust">Disgust</option>
            <option value="surprise">Surprise</option>
            <option value="joy">Joy</option>
            <option value="happiness">Happiness</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-zinc-500">Loading diaries...</div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="text-sm text-zinc-500">No diaries found.</div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-300 bg-white/90 px-2 py-1 text-sm shadow hover:bg-white"
          aria-label="Previous"
        >
          ‹
        </button>
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-8 pb-2"
        >
          {filtered.map((d) => (
            <div key={d.id} className="snap-start w-96 shrink-0">
              <DiaryCard diary={d} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-300 bg-white/90 px-2 py-1 text-sm shadow hover:bg-white"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// DiaryCard extracted to its own component
