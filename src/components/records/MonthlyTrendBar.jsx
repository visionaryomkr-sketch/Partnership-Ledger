import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
export default function MonthlyTrendBar({ current, previous, unit = "", prefix = "", entries }) {
  const change = previous === 0 ? null : ((current - previous) / previous) * 100;
  const up = change !== null && change > 0;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#E8F0EB] px-4 py-2.5 text-sm">
      <span className="font-medium text-[#1B4332]">This month:</span>
      <span className="tabular-nums text-[#16181D]">{prefix}{current.toLocaleString("en-IN")}{unit}{entries ? ` across ${entries} entries` : ""}</span>
      {change === null ? <span className="text-[#2D7D46]">New this month</span>
        : <span className={`flex items-center gap-1 ${up ? "text-[#2D7D46]" : "text-[#C0392B]"}`}>{up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{Math.abs(change).toFixed(0)}% vs last month</span>}
    </div>
  );
}