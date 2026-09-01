import React from "react";

export default function ExpenseBreakdown({ data = [] }) {
  const max = Math.max(...data.map((d) => d.amount), 0) || 1;

  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-semibold">
        Expense Breakdown by Category
      </h2>
      <div className="space-y-3 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm min-h-[160px] flex flex-col justify-center">
        {!data || data.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm font-semibold text-[#16181D]">No Expenses Logged</p>
            <p className="mt-1 text-xs text-[#9498A0] max-w-sm mx-auto">
              No operating or marketing expenses have been recorded yet. Real receipts will appear here.
            </p>
          </div>
        ) : (
          data.map((d) => (
            <div key={d.category}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-[#62666F]">{d.category}</span>
                <span className="font-heading tabular-nums font-medium">
                  ₹{Number(d.amount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F5F4F2]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(d.amount / max) * 100}%`,
                    background: d.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}