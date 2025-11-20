"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/libs/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type RangeOption = "today" | "3d" | "7d" | "1m" | "all";

interface DiaryDoc {
  id: string;
  createdAt?: any; // Firestore Timestamp | string
}

// Utility: start/end of today in local time
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

function getRange(option: RangeOption) {
  const now = new Date();
  const end = addDays(startOfDay(now), 1); // default end: tomorrow 00:00
  switch (option) {
    case "today": {
      const start = startOfDay(now);
      return { start, end };
    }
    case "3d": {
      const start = startOfDay(addDays(now, -2)); // today + 2 days back = 3 days total
      const end3 = addDays(startOfDay(addDays(now, 1)), 0);
      return { start, end: end3 };
    }
    case "7d": {
      const start = startOfDay(addDays(now, -6));
      const end7 = addDays(startOfDay(addDays(now, 1)), 0);
      return { start, end: end7 };
    }
    case "1m": {
      const start = startOfDay(addDays(now, -29));
      const end30 = addDays(startOfDay(addDays(now, 1)), 0);
      return { start, end: end30 };
    }
    case "all":
    default:
      return { start: null as Date | null, end: null as Date | null };
  }
}

export default function Dashboard() {
  const [diaries, setDiaries] = useState<DiaryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeOption>("today");

  useEffect(() => {
    setLoading(true);
    const { start, end } = getRange(range);

    const colRef = collection(db, "diaries");
    const qRef = start && end
      ? query(colRef, where("createdAt", ">=", start), where("createdAt", "<", end))
      : query(colRef);

    const unsub = onSnapshot(
      qRef,
      (snap) => {
        const list: DiaryDoc[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setDiaries(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [range]);

  // Aggregate counts per hour
  const data = useMemo(() => {
    const toDate = (raw: any): Date | null => {
      if (!raw) return null;
      if (typeof raw?.toDate === "function") return raw.toDate();
      if (typeof raw === "string") {
        const d = new Date(raw);
        return isNaN(d.getTime()) ? null : d;
      }
      if (raw instanceof Date) return raw;
      return null;
    };

    if (range === "today") {
      const hours = Array.from({ length: 24 }, (_, h) => ({ label: `${h}:00`, count: 0 }));
      diaries.forEach((doc) => {
        const d = toDate(doc.createdAt);
        if (!d) return;
        const h = d.getHours();
        if (h >= 0 && h < 24) hours[h].count += 1;
      });
      return hours;
    }

    // Group by day for multi-day ranges
    const bucket = new Map<string, number>();
    diaries.forEach((doc) => {
      const d = toDate(doc.createdAt);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      bucket.set(key, (bucket.get(key) || 0) + 1);
    });
    const entries = Array.from(bucket.entries())
      .map(([key, count]) => {
        const [y, m, da] = key.split("-").map((n) => parseInt(n, 10));
        const d = new Date(y, m - 1, da);
        const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        return { label, sort: d.getTime(), count };
      })
      .sort((a, b) => a.sort - b.sort)
      .map(({ label, count }) => ({ label, count }));
    return entries;
  }, [diaries, range]);

  const barSize = range === "today" ? 18 : 32;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-1 text-lg font-semibold text-zinc-900">
          Today's Diary Creations
        </h2>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-xs text-zinc-500">
            {range === "today" ? "Count per hour (today)" : "Count per day"}
          </p>
          <select
            className="ml-auto rounded border border-zinc-300 bg-white px-2 py-1 text-xs"
            value={range}
            onChange={(e) => setRange(e.target.value as RangeOption)}
          >
            <option value="today">Today</option>
            <option value="3d">Last 3 days</option>
            <option value="7d">Last 7 days</option>
            <option value="1m">Last 1 month</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        {loading ? (
          <div className="flex h-56 md:h-64 lg:h-72 xl:h-80 items-center justify-center text-sm text-zinc-500">
            Loading...
          </div>
        ) : (
          <div className="h-56 md:h-64 lg:h-72 xl:h-80">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="label" interval={range === "today" ? 2 : 0} tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} width={30} domain={[0, 'dataMax + 1']} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Bar dataKey="count" fill="#facc15" radius={[4, 4, 0, 0]} barSize={barSize} />
            </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md bg-white p-4 shadow">
          <div className="text-sm font-medium text-zinc-700">Total Today</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">
            {diaries.length}
          </div>
        </div>
        <div className="rounded-md bg-white p-4 shadow">
          <div className="text-sm font-medium text-zinc-700">Active Hours</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">
            {data.filter((d) => d.count > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}
