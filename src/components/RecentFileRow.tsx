"use client";

interface RecentFileRowProps {
  name: string;
  type: string;
  members?: number;
  size: string;
  date: string;
  active?: boolean;
}

export function RecentFileRow({ name, type, members = 1, size, date, active }: RecentFileRowProps) {
  return (
    <div className={`group flex items-center gap-4 rounded-md px-4 py-3 text-sm ${active ? 'bg-(--color-brand) text-white shadow' : 'card-base hover:shadow-md transition'} `}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold ${active ? 'bg-white/20' : 'bg-(--color-bg-accent) text-(--color-text-secondary)'}`}>{type}</div>
      <div className="flex-1">
        <div className={`font-medium ${active ? 'text-white' : 'text-(--color-text-primary)'}`}>{name}</div>
        <div className={`text-[11px] ${active ? 'text-white/70' : 'text-(--color-text-secondary)'}`}>{members} members</div>
      </div>
      <div className={`hidden sm:block w-20 text-[11px] ${active ? 'text-white/80' : 'text-(--color-text-secondary)'}`}>{date}</div>
      <div className={`w-14 text-right text-[11px] ${active ? 'text-white/80' : 'text-(--color-text-secondary)'}`}>{size}</div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition text-[11px]">
        <button className="rounded px-2 py-1 bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70">Open</button>
        <button className="rounded px-2 py-1 bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70">⋯</button>
      </div>
    </div>
  );
}
