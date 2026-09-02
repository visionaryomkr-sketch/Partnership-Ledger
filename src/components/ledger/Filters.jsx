import React from "react";
import { X, Calendar } from "lucide-react";

export default function Filters({
  partner,
  setPartner,
  category,
  setCategory,
  showCategory = true,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const cls =
    "rounded-lg border border-[#E8E6E1] bg-white px-3 py-2 text-sm text-[#62666F] outline-none transition focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]";

  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {/* Partner filter */}
      <select
        className={cls}
        value={partner}
        onChange={(e) => setPartner(e.target.value)}
      >
        <option>All partners</option>
        <option>OM Kumar</option>
        <option>Shubham Jain</option>
        <option>Ashwin Pillai</option>
      </select>

      {/* Category filter */}
      {showCategory && setCategory && (
        <select
          className={cls}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All categories</option>
          <option>Development</option>
          <option>Marketing</option>
          <option>Ad Creative</option>
        </select>
      )}

      {/* Start Date */}
      <div className="relative flex items-center">
        <input
          className={`${cls} tabular-nums`}
          type="date"
          aria-label="Start date"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <span className="text-xs font-semibold text-[#9498A0] uppercase">to</span>

      {/* End Date */}
      <div className="relative flex items-center">
        <input
          className={`${cls} tabular-nums`}
          type="date"
          aria-label="End date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Clear dates button */}
      {hasDateFilter && (
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F4F2] px-3 py-2 text-xs font-semibold text-[#62666F] transition hover:bg-[#E8E6E1] hover:text-[#16181D] active:scale-95"
          title="Clear date filter"
        >
          <X className="h-3.5 w-3.5" />
          Clear dates
        </button>
      )}
    </div>
  );
}