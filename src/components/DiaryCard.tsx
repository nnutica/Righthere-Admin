"use client";

import React from "react";

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

export type DiaryCardData = {
  content?: string;
  keywords?: string;
  suggestion?: string;
  emotionalReflection?: string;
  createdDate?: Date;
  imageUrl?: string;
  imageUrls?: string[];
  mood?: string;
};

export default function DiaryCard({ diary }: { diary: DiaryCardData }) {
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
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="h-1 w-full rounded" style={{ backgroundColor: bgColor }} />
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
