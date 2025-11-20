import Sidebar from "../components/sidebar";
import DiaryList from "@/components/DiaryList";

export default function DiariesPage() {
  return (
    <div className="min-h-screen bg-zinc-100 flex items-start justify-center py-8 md:py-10 px-4 md:px-6">
      <div className="flex w-full max-w-6xl rounded-xl border border-zinc-200 bg-white shadow-md overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <DiaryList />
        </main>
      </div>
    </div>
  );
}
