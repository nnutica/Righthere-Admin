import Sidebar from "../components/sidebar";
import DiaryList from "@/components/DiaryList";

export default function DiariesPage() {
  return (
    <div className="h-screen bg-zinc-100 flex items-start justify-center px-4 md:px-6">
      <div className="flex h-10/12 w-full max-w-6xl my-5 rounded-xl border border-zinc-200 bg-white shadow-md overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full p-6 md:p-8 overflow-y-auto">
          <DiaryList />
        </main>
      </div>
    </div>
  );
}
