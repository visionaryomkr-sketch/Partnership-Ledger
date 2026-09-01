import React from "react";
import { partners } from "@/data/mockLedger";
export default function ImpactPreview({ shares, rate, savedShares, savedRate }) {
  const savedContributions = partners.map(p => p.contribution);
  const savedTotal = savedContributions.reduce((s, c) => s + c, 0);
  const rateChanged = Number(rate) !== savedRate;
  const sharesChanged = shares.some((s, i) => Number(s) !== savedShares[i]);
  if (!rateChanged && !sharesChanged) return null;
  const newContributions = rateChanged ? partners.map(p => p.hours * Number(rate) + p.invested) : [...savedContributions];
  const newTotal = newContributions.reduce((s, c) => s + c, 0);
  const newNets = partners.map((p, i) => Math.round(newContributions[i] - (Number(shares[i]) / 100 * newTotal)));
  const changes = partners.map((p, i) => ({ name: p.name, oldNet: p.net, newNet: newNets[i], changed: p.net !== newNets[i] })).filter(c => c.changed);
  if (!changes.length) return null;
  return (
    <section className="rounded-2xl border border-[#E8F0EB] bg-[#E8F0EB]/30 p-6">
      <h3 className="font-heading text-lg font-semibold text-[#1B4332]">Live Impact Preview</h3>
      <p className="mt-1 text-sm text-[#62666F]">If saved, these Net Position values would change:</p>
      <div className="mt-4 space-y-3">
        {changes.map(c => (
          <div key={c.name} className="flex items-center justify-between text-sm">
            <span className="font-medium">{c.name}</span>
            <span className="tabular-nums">
              <span className="text-[#9498A0]">{c.oldNet >= 0 ? "+" : "−"}₹{Math.abs(c.oldNet).toLocaleString("en-IN")}</span>
              <span className="mx-2 text-[#9498A0]">→</span>
              <span className={c.newNet >= 0 ? "font-semibold text-[#2D7D46]" : "font-semibold text-[#B7791F]"}>{c.newNet >= 0 ? "+" : "−"}₹{Math.abs(c.newNet).toLocaleString("en-IN")}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}