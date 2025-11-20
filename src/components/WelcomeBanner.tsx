"use client";

export default function WelcomeBanner() {
  return (
    <div className="card-base flex items-center gap-8 p-6" style={{ background: 'var(--gradient-banner)' }}>
      <div className="flex-1">
        <h2 className="text-xl font-semibold tracking-tight">Welcome Back</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] max-w-md">
          Get additional space and unlock premium productivity tools. Upgrade now for more power.
        </p>
        <button className="mt-4 rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white shadow hover:brightness-110">
          Upgrade
        </button>
      </div>
      <div className="hidden md:block w-40 h-28 rounded-md bg-[var(--color-bg-accent)]" />
    </div>
  );
}
