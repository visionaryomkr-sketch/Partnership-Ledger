import React from "react";

export default function RevenueSourceBreakdown({ data }) {
  const total = (data || []).reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-semibold">Revenue Source Breakdown</h2>
      <div className="space-y-3 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm min-h-[160px] flex flex-col justify-center">
        {total === 0 || !data || data.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm font-semibold text-[#16181D]">No Revenue Sources Yet</p>
            <p className="mt-1 text-xs text-[#9498A0] max-w-sm mx-auto">
              Jyotish App is in pre-launch mode. Direct sales, ads-driven, and organic revenue will appear here once live.
            </p>
          </div>
        ) : (
          data.map((d) => (
            <div key={d.source}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[#62666F]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  {d.source}
                </span>
                <span className="font-heading tabular-nums font-medium">
                  ₹{d.amount.toLocaleString("en-IN")} ({Math.round((d.amount / total) * 100)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F5F4F2]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(d.amount / total) * 100}%`, background: d.color }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}