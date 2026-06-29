"use client";

import { useEffect, useState } from "react";
import type { HistoryEntry, TaxInput } from "@/lib/tax";

const KEY = "tncn-history-v1";
const MAX = 20;

/**
 * Lưu lịch sử các lần tính thuế trong localStorage của trình duyệt.
 * Không cần đăng nhập, không gửi đi đâu — dữ liệu nằm trên máy người dùng.
 */
export function useTaxHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  // Đọc lịch sử sau khi component đã mount (tránh lệch SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setEntries(JSON.parse(raw) as HistoryEntry[]);
    } catch {
      // localStorage bị chặn hoặc dữ liệu hỏng — bỏ qua.
    }
  }, []);

  function persist(next: HistoryEntry[]) {
    setEntries(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // bỏ qua nếu không ghi được.
    }
  }

  function add(data: { input: TaxInput; tax: number; net: number; taxable: number }) {
    const entry: HistoryEntry = {
      ...data,
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      savedAt: new Date().toISOString(),
    };
    persist([entry, ...entries].slice(0, MAX));
  }

  function remove(id: string) {
    persist(entries.filter((e) => e.id !== id));
  }

  function clear() {
    persist([]);
  }

  return { entries, add, remove, clear };
}
