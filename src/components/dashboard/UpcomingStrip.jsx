import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { milestones, partners } from "@/data/mockLedger";
export default function UpcomingStrip() {
  const upcoming = milestones.filter(m => m.category !== "Completed").slice(0, 2);
  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-semibold">Upcoming</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {upcoming.map(m => (
          <Link key={m.id} to="/milestones" className="flex items-center justify-between rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-sm transition hover:-translate-y-px hover:shadow-md">
            <div>
              <p className="text-[13px] text-[#9498A0]">{m.category}{m.targetDate ? ` · Target: ${m.targetDate}` : ""}</p>
              <h3 className="mt-1 font-heading text-base font-semibold text-[#16181D]">{m.title}</h3>
              <div className="mt-2 flex gap-1">
                {m.owners.map(o => { const p = partners.find(p => p.name === o); return <span key={o} className="flex items-center gap-1 rounded-full bg-[#F5F4F2] px-2 py-0.5 text-xs text-[#62666F]"><span className="h-2 w-2 rounded-full" style={{background: p?.color}} />{o.split(" ")[0]}</span>; })}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-[#9498A0]" />
          </Link>
        ))}
      </div>
    </section>
  );
}