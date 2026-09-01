import React from "react";
export default function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-sm">
      <p className="text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-[#16181D]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#9498A0]">{sub}</p>}
    </div>
  );
}