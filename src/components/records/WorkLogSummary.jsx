import React from "react";
import { CalendarRange } from "lucide-react";
import StatCard from "@/components/ledger/StatCard";
import MonthlyTrendBar from "@/components/records/MonthlyTrendBar";
import { usePartners } from "@/hooks/useLedger";

export default function WorkLogSummary({
  rows = [],
  category,
  setCategory,
  weeklyView,
  setWeeklyView,
}) {
  const { data: partnersData } = usePartners();

  const totalEntries = rows.length;
  const totalHours = rows.reduce((s, r) => s + (Number(r.hours) || 0), 0);
  const avgHours = totalEntries ? (totalHours / totalEntries).toFixed(1) : 0;
  const categories = ["Development", "Ad Creative", "Marketing"];

  // Real month calculations from actual rows
  const now = new Date();
  const currentMonthStr = now.toISOString().slice(0, 7); // e.g. "2026-09"
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevDate.toISOString().slice(0, 7);

  const currentMonthRows = rows.filter((r) => (r.date || "").startsWith(currentMonthStr));
  const currentMonthHours = currentMonthRows.reduce((s, r) => s + (Number(r.hours) || 0), 0);

  const prevMonthRows = rows.filter((r) => (r.date || "").startsWith(prevMonthStr));
  const prevMonthHours = prevMonthRows.reduce((s, r) => s + (Number(r.hours) || 0), 0);

  // Real partner hours aggregated from actual rows
  const partnersList =
    partnersData && partnersData.length > 0
      ? partnersData
      : [
          { id: "om", name: "OM Kumar", color: "#4A5FE8" },
          { id: "shubham", name: "Shubham Jain", color: "#D14F9C" },
          { id: "ashwin", name: "Ashwin Pillai", color: "#E8734A" },
        ];

  const partnerHoursMap = partnersList.map((p) => {
    const pRows = rows.filter(
      (r) => (r.partner || "").toLowerCase().trim() === (p.name || "").toLowerCase().trim()
    );
    const h = pRows.reduce((s, r) => s + (Number(r.hours) || 0), 0);
    return {
      ...p,
      hours: h,
    };
  });

  const maxHours = Math.max(...partnerHoursMap.map((p) => p.hours), 1);

  return (
    <div className="space-y-4">
      {/* Real-time Month Trend Bar */}
      {totalEntries === 0 ? (
        <div className="flex items-center justify-between rounded-xl bg-[#E8F0EB] px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#1B4332]">This month:</span>
            <span className="tabular-nums text-[#16181D]">0h logged</span>
          </div>
          <span className="text-xs font-medium text-[#1B4332] bg-white px-2.5 py-0.5 rounded-full border border-[#B7DFCA]">
            Pre-launch
          </span>
        </div>
      ) : (
        <MonthlyTrendBar
          current={currentMonthHours || totalHours}
          previous={prevMonthHours}
          unit="h"
          entries={currentMonthRows.length || totalEntries}
        />
      )}

      {/* Metrics Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Entries" value={totalEntries} />
        <StatCard label="Total Hours" value={`${totalHours}h`} />
        <StatCard label="Avg Hours / Entry" value={`${avgHours}h`} />

        {/* Real Dynamic Hours by Partner */}
        <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-sm flex flex-col justify-between">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">
            Hours by Partner
          </p>
          <div className="mt-2 flex h-10 items-end gap-2.5">
            {partnerHoursMap.map((p) => (
              <div key={p.id} className="flex-1 flex flex-col items-center" title={`${p.name}: ${p.hours}h`}>
                <div className="w-full flex items-end h-8">
                  <div
                    className="w-full rounded-t transition-all duration-700"
                    style={{
                      height: p.hours > 0 ? `${Math.max((p.hours / maxHours) * 100, 10)}%` : "4px",
                      backgroundColor: p.color || "#4A5FE8",
                      opacity: p.hours > 0 ? 1 : 0.25,
                      minHeight: "4px",
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between w-full text-[10px] sm:text-[11px] font-medium text-[#62666F]">
                  <span className="truncate">{p.name.split(" ")[0]}</span>
                  <span className="font-semibold tabular-nums text-[#16181D]">{p.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Grouping Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[#62666F]">Filter:</span>
        <button
          onClick={() => setCategory("All categories")}
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            category === "All categories"
              ? "bg-[#1B4332] text-white"
              : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"
          }`}
        >
          All ({totalEntries})
        </button>
        {categories.map((c) => {
          const count = rows.filter((r) => r.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                category === c
                  ? "bg-[#1B4332] text-white"
                  : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"
              }`}
            >
              {c} ({count})
            </button>
          );
        })}
        <button
          onClick={() => setWeeklyView(!weeklyView)}
          className={`ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            weeklyView
              ? "bg-[#E8F0EB] text-[#1B4332]"
              : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"
          }`}
        >
          <CalendarRange className="h-4 w-4" />
          Weekly grouping
        </button>
      </div>
    </div>
  );
}