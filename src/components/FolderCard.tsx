"use client";

interface FolderCardProps {
  name: string;
  files: number;
  created: string;
  color?: string; // tailwind bg color class or hex
  avatars?: string[];
}

export function FolderCard({ name, files, created, color = '#f43f5e', avatars = [] }: FolderCardProps) {
  return (
    <div className="relative card-base flex flex-col gap-3 p-4" style={{ background: color }}>
      <div className="flex items-start justify-between">
        <div className="rounded-md bg-white/30 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">Folder</div>
        <button className="h-6 w-6 rounded-md bg-white/30 text-white text-xs backdrop-blur-sm">•••</button>
      </div>
      <h3 className="text-sm font-semibold text-white drop-shadow-sm">{name}</h3>
      <div className="mt-auto flex items-center justify-between text-[10px] text-white/90">
        <span>{files} files</span>
        <span>{created}</span>
      </div>
      {avatars.length > 0 && (
        <div className="absolute -bottom-3 left-3 flex">
          {avatars.slice(0,4).map((a,i) => (
            <img key={i} src={a} alt="avatar" className="h-7 w-7 rounded-full border border-white object-cover -ml-2 first:ml-0" />
          ))}
        </div>
      )}
    </div>
  );
}
