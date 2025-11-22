"use client";
import React, { useState } from "react";
import Sidebar from "../components/sidebar";
interface DiaryResponse {
  emotion: string;
  advice: string;
}

export default function DiaryTestPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiaryResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!text.trim()) {
      setError("กรุณากรอกข้อความไดอารี่ก่อน");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://nitinat-right-here.hf.space/getadvice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        throw new Error("ส่งข้อมูลไม่สำเร็จ");
      }
      const data: DiaryResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen bg-zinc-100 flex items-start justify-center px-4 md:px-6">
      <div className="flex h-10/12 w-full max-w-6xl my-5 rounded-xl border border-zinc-200 bg-white shadow-md overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full p-6 md:p-8 overflow-y-auto">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-semibold">ส่งไดอารี่จำลอง (Diarytest)</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-2">
                <span className="font-medium">ข้อความไดอารี่:</span>
                <textarea
                  className="w-full min-h-40 rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="พิมพ์ความรู้สึกหรือเรื่องที่อยากบันทึก..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                >
                  {loading ? "กำลังส่ง..." : "ส่งจำลอง"}
                </button>
                <button
                  type="button"
                  onClick={() => { setText(""); setResult(null); setError(null); }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  ล้างข้อมูล
                </button>
              </div>
            </form>
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
            )}
            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded border border-green-200">
                  <h2 className="font-medium mb-2">ผลวิเคราะห์</h2>
                  <p className="text-sm"><span className="font-semibold">อารมณ์ (emotion):</span> {result.emotion}</p>
                  <pre className="whitespace-pre-wrap text-xs mt-3 bg-white p-3 rounded border border-gray-200">{result.advice}</pre>
                </div>
              </div>
            )}
            {!result && !error && (
              <p className="text-xs text-gray-500">หลังส่ง ผลลัพธ์จะแสดงด้านล่างนี้</p>
            )}
            <p className="text-[10px] text-gray-400">Endpoint: https://nitinat-right-here.hf.space/getadvice</p>
          </div>
        </main>
        
      </div>
    </div>
  );
}
