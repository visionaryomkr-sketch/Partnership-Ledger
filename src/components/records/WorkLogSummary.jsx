import React from "react";
import { CalendarRange } from "lucide-react";
import StatCard from "@/components/ledger/StatCard";
import { partners, monthComparison } from "@/data/mockLedger";
import MonthlyTrendBar from "@/components/records/MonthlyTrendBar";
export default function WorkLogSummary({ rows, category, setCategory, weeklyView, setWeeklyView }) {
  const totalEntries = rows.length;
  const totalHours = rows.reduce((s, r) => s + Number(r.hours), 0);
  const avgHours = totalEntries ? (totalHours / totalEntries).toFixed(1) : 0;
  const maxHours = Math.max(...partners.map(p => p.hours)) || 1;
  const categories = ["Development", "Ad Creative", "Marketing"];
  return (
    <div className="space-y-4">
      <MonthlyTrendBar current={monthComparison.hours.current} previous={monthComparison.hours.previous} unit="h" entries={rows.filter(r => r.date.startsWith("2026-08")).length} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Entries" value={totalEntries} />
        <StatCard label="Total Hours" value={`${totalHours}h`} />
        <StatCard label="Avg Hours / Entry" value={`${avgHours}h`} />
        <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-sm">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">Hours by Partner</p>
          <div className="mt-3 flex h-10 items-end gap-2">
            {partners.map(p => <div key={p.id} className="flex-1" title={`${p.name}: ${p.hours}h`}><div className="w-full rounded-t transition-all duration-1000" style={{ height: `${(p.hours / maxHours) * 100}%`, background: p.color, minHeight: "4px" }} /></div>)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[#62666F]">Filter:</span>
        <button onClick={() => setCategory("All categories")} className={`rounded-full px-3 py-1 text-sm font-medium transition ${category === "All categories" ? "bg-[#1B4332] text-white" : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"}`}>All ({totalEntries})</button>
        {categories.map(c => { const count = rows.filter(r => r.category === c).length; return <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-3 py-1 text-sm font-medium transition ${category === c ? "bg-[#1B4332] text-white" : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"}`}>{c} ({count})</button>; })}
        <button onClick={() => setWeeklyView(!weeklyView)} className={`ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${weeklyView ? "bg-[#E8F0EB] text-[#1B4332]" : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"}`}><CalendarRange className="h-4 w-4" />Weekly grouping</button>
      </div>
    </div>
  );
}