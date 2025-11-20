"use client";

import { useEffect, useState, useMemo } from "react";
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

const moodColors: Record<string, string> = {
  sadness: "#93C5FD",
  anger: "#FCA5A5",
  love: "#F9A8D4",
  fear: "#D8B4FE",
  disgust: "#86EFAC",
  surprise: "#F9E88C",
  joy: "#E9922B",
  happiness: "#E9922B",
};

export default function DiaryList() {
  const [diaries, setDiaries] = useState<DiaryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodFilter, setMoodFilter] = useState<string>("all");

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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((d) => (
          <DiaryCard key={d.id} diary={d} />
        ))}
      </div>
    </div>
  );
}

interface DiaryCardProps {
  diary: DiaryDoc;
}

function DiaryCard({ diary }: DiaryCardProps) {
  const {
    content,
    keywords,
    suggestion,
    emotionalReflection,
    createdDate,
    imageUrl,
    imageUrls,
    mood,
  } = diary;

  const nmood = normalizeMood(mood);
  const bgColor = moodColors[nmood] || "#FFFFFF";
  const displayDate = createdDate
    ? createdDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown date";

  const images: string[] = [];
  if (imageUrl) images.push(imageUrl);
  if (Array.isArray(imageUrls)) {
    imageUrls.forEach((u) => {
      if (u && !images.includes(u)) images.push(u);
    });
  }

  return (
    <div
      className="rounded-lg border border-zinc-200 p-4 shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-zinc-700">{displayDate}</span>
        {images.length > 0 && (
          <span className="text-[10px] rounded bg-yellow-100 px-2 py-1 text-yellow-700">
            {images.length} image{images.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      {nmood && (
        <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-700">
          Mood: {nmood}
        </div>
      )}
      {images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt="diary"
              className="h-24 w-24 shrink-0 rounded object-cover border border-zinc-200"
            />
          ))}
        </div>
      )}
      {content && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-800 line-clamp-4">
          {content}
        </p>
      )}
      {keywords && (
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.split(",").map((k) => (
            <span
              key={k.trim()}
              className="rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600"
            >
              {k.trim()}
            </span>
          ))}
        </div>
      )}
      {emotionalReflection && (
        <div className="mt-4 rounded-md bg-zinc-50 p-3 text-xs text-zinc-600">
          <strong className="block mb-1 text-zinc-700">Reflection</strong>
          {emotionalReflection}
        </div>
      )}
      {suggestion && (
        <div className="mt-3 rounded-md bg-yellow-50 p-3 text-xs text-yellow-800">
          <strong className="block mb-1">Suggestion</strong>
          {suggestion}
        </div>
      )}
    </div>
  );
}
