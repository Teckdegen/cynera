"use client";

import { useEffect, useState } from "react";

const seeded: Record<string, { image: string; gpu: string }> = {
  job_7c21aa: { image: "vllm/vllm-openai", gpu: "H100" },
};

export function RunView({ id }: { id: string }) {
  const [meta, setMeta] = useState(seeded[id] || { image: "cynera/hello", gpu: "GPU" });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cynera.runs") || "{}") as Record<string, { image: string; gpu: string }>;
      if (saved[id]) setMeta(saved[id]);
    } catch {
      /* seeded meta still renders */
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="flex h-12 items-center justify-between border-b border-black px-4">
        <p className="text-[14px] font-medium">{meta.image}</p>
        <p className="font-mono text-[12px]">{id}</p>
      </header>
      <div className="mx-auto w-full max-w-xl px-6 py-10">
        <div className="grid grid-cols-3 border border-black text-[13px]">
          <div className="border-r border-black px-3 py-3">
            <p>Status</p>
            <p className="mt-1 font-medium">Listening</p>
          </div>
          <div className="border-r border-black px-3 py-3">
            <p>GPU</p>
            <p className="mt-1 font-medium">{meta.gpu}</p>
          </div>
          <div className="px-3 py-3">
            <p>Port</p>
            <p className="mt-1 font-medium">8000</p>
          </div>
        </div>
        <p className="mt-6 font-mono text-[13px]">0.0.0.0:8000</p>
      </div>
    </main>
  );
}
