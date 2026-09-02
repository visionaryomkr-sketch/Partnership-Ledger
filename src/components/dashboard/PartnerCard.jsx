import React from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "@/components/ledger/CountUp";
export default function PartnerCard({ p }) {
  const nav = useNavigate();
  const go = (e) => { e?.stopPropagation?.(); nav(`/work?partner=${encodeURIComponent(p.name)}`); };
  return (
    <article onClick={go} className="cursor-pointer rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} /><h2 className="font-heading text-lg sm:text-xl font-semibold">{p.name}</h2></div>
      <div className="mt-4 sm:mt-6 font-heading text-3xl sm:text-[40px] font-bold leading-none"><CountUp value={p.contribution} prefix="₹" /></div>
      <p className="mt-2 text-[13px] text-[#9498A0]">Total equivalent contribution</p>
      <div className="mt-5 sm:mt-6 grid grid-cols-2 border-t border-[#E8E6E1] pt-4">
        <button onClick={go} className="text-left">
          <span className="block text-xs text-[#9498A0]">Hours Logged</span>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <b className="font-heading tabular-nums text-base sm:text-lg">{p.hours}h</b>
            {p.hourly_rate ? (
              <span className="text-[11px] font-medium text-[#62666F]">
                (@₹{Number(p.hourly_rate).toLocaleString("en-IN")}/h)
              </span>
            ) : null}
          </div>
        </button>
        <div>
          <span className="block text-xs text-[#9498A0]">₹ Invested</span>
          <b className="font-heading tabular-nums text-base sm:text-lg">₹{p.invested.toLocaleString("en-IN")}</b>
        </div>
      </div>
      <p className="mt-4 border-t border-[#E8E6E1] pt-3 text-xs text-[#9498A0]">Last active: {p.lastActive} · {p.entriesThisWeek} {p.entriesThisWeek === 1 ? "entry" : "entries"} this week</p>
    </article>
  );
}