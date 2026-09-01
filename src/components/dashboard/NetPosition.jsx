import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { money } from "@/data/mockLedger";
export default function NetPosition({ partners }) {
  const [expanded, setExpanded] = useState(null);
  const total = partners.reduce((s, p) => s + p.contribution, 0);
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="font-heading text-xl font-semibold">Net Position</h2>
        <span title="Contribution − (Profit Share % × Total Pool). Positive means the partnership currently owes them." className="cursor-help text-[#9498A0]"><Info className="h-4 w-4" /></span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {partners.map(p => {
          const shareAmt = Math.round(p.share / 100 * total);
          const isOpen = expanded === p.id;
          return (
            <div key={p.id} onClick={() => setExpanded(isOpen ? null : p.id)} className="cursor-pointer rounded-2xl border border-[#E8E6E1] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm text-[#62666F]">{p.name}</p>
              <strong className={`mt-2 block font-heading text-2xl tabular-nums ${p.net >= 0 ? "text-[#2D7D46]" : "text-[#B7791F]"}`}>{p.net >= 0 ? "+" : "−"}{money(p.net)}</strong>
              <p className="mt-1 text-xs text-[#9498A0]">{p.net >= 0 ? "Currently owed" : "Currently to balance"}</p>
              {isOpen && (
                <div className="mt-3 space-y-1 border-t border-[#E8E6E1] pt-3 text-xs text-[#62666F]">
                  <div className="flex justify-between"><span>Contribution</span><span className="tabular-nums">₹{p.contribution.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span>Share ({p.share}% × Pool)</span><span className="tabular-nums">₹{shareAmt.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between border-t pt-1 font-semibold"><span>Net Position</span><span className={`tabular-nums ${p.net >= 0 ? "text-[#2D7D46]" : "text-[#B7791F]"}`}>{p.net >= 0 ? "+" : "−"}{money(p.net)}</span></div>
                </div>
              )}
              <ChevronDown className={`mt-2 h-4 w-4 text-[#9498A0] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          );
        })}
      </div>
    </section>
  );
}