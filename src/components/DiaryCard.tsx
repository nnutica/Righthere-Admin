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

function withAlpha(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

  const tintBg = withAlpha(bgColor, 0.08);
  const badgeBg = withAlpha(bgColor, 0.25);

  const mainImage = images[0];
  const otherImages = images.slice(1);

  return (
    <div className="rounded-lg p-4 shadow flex flex-col h-full border border-zinc-200 overflow-hidden" style={{ backgroundColor: tintBg }}>
      <div className="h-1 w-full rounded" style={{ backgroundColor: bgColor }} />
      <div className="mt-2 flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-zinc-700">{displayDate}</span>
        {nmood && (
          <span
            className="text-[10px] px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: badgeBg }}
          >
            {nmood}
          </span>
        )}
      </div>
      {(mainImage || keywords) && (
        <div className="mt-3 flex gap-3 items-start mb-0">
          {mainImage && (
            <div className="flex flex-col gap-2">
              <img
                src={mainImage}
                alt="diary main"
                loading="lazy"
                className="w-40 h-28 rounded-md object-cover border border-zinc-200"
              />
              {otherImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                  {otherImages.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="thumb"
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded object-cover border border-zinc-200"
                    />
                  ))}
                </div>
              )}
              {images.length > 0 && (
                <div className="text-[10px] text-zinc-600">
                  {images.length} image{images.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
          {keywords && (
            <div className="flex flex-wrap gap-2 flex-1 max-h-28 overflow-y-auto pr-1">
              {keywords.split(",").map((k) => (
                <span
                  key={k.trim()}
                  className="rounded-md bg-white/60 backdrop-blur px-2 py-1 text-[11px] font-medium text-zinc-700 border border-zinc-200"
                >
                  {k.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {content && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-800 flex-1 overflow-hidden">
          {content.length > 360 ? content.slice(0, 360) + "…" : content}
        </p>
      )}
      {emotionalReflection && (
        <div className="mt-4 rounded-md bg-white/70 p-3 text-xs text-zinc-600">
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
