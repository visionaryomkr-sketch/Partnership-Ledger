import React from "react";
import StatCard from "@/components/ledger/StatCard";
import MonthlyTrendBar from "@/components/records/MonthlyTrendBar";

const catColors = {
  Hosting: "#4A5FE8",
  "Ads Spend": "#E8734A",
  "Tools/Software": "#D14F9C",
  "Design Assets": "#B7791F",
  Domain: "#2D7D46",
};

export default function ExpenseSummary({ rows = [], statusFilter, setStatusFilter }) {
  const totalSpent = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const pending = rows.filter((r) => r.status === "Pending");
  const pendingTotal = pending.reduce((s, r) => s + Number(r.amount || 0), 0);
  const adjustedTotal = rows
    .filter((r) => r.status === "Adjusted")
    .reduce((s, r) => s + Number(r.amount || 0), 0);

  const cats = {};
  rows.forEach((r) => {
    cats[r.category] = (cats[r.category] || 0) + Number(r.amount || 0);
  });
  const catData = Object.entries(cats)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      color: catColors[category] || "#62666F",
    }));

  const maxCat = Math.max(...catData.map((d) => d.amount)) || 1;
  const statuses = ["Pending", "Adjusted", "Not Needed"];

  return (
    <div className="space-y-4">
      {rows.length === 0 ? (
        <div className="flex items-center justify-between rounded-xl bg-[#E8F0EB] px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1B4332]" />
            <span className="font-medium text-[#1B4332]">No Expenses Logged</span>
            <span className="text-[#62666F]">— Clean ledger ready for real operating receipts</span>
          </div>
          <span className="font-semibold text-[#1B4332] text-xs uppercase tracking-wider">
            All Settled
          </span>
        </div>
      ) : (
        <MonthlyTrendBar
          current={totalSpent}
          previous={0}
          prefix="₹"
          entries={rows.length}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} />
        <StatCard
          label="Pending Reimbursement"
          value={`₹${pendingTotal.toLocaleString("en-IN")}`}
          sub={`${pending.length} entries`}
        />
        <StatCard label="Adjusted" value={`₹${adjustedTotal.toLocaleString("en-IN")}`} />
        <StatCard label="Total Entries" value={rows.length} />
      </div>

      <div className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm min-h-[140px] flex flex-col justify-center">
        <p className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">
          Spend by Category
        </p>
        {catData.length === 0 ? (
          <p className="py-4 text-center text-sm text-[#9498A0]">
            No expenses recorded yet. Click '+ Add Entry' to log verified receipts.
          </p>
        ) : (
          <div className="space-y-2">
            {catData.map((d) => (
              <div key={d.category} className="flex items-center gap-3">
                <span className="w-28 text-sm text-[#62666F]">{d.category}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F5F4F2]">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(d.amount / maxCat) * 100}%`,
                      background: d.color,
                    }}
                  />
                </div>
                <span className="w-20 text-right font-heading tabular-nums text-sm font-medium">
                  ₹{d.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[#62666F]">Status:</span>
        <button
          onClick={() => setStatusFilter("All statuses")}
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            statusFilter === "All statuses"
              ? "bg-[#1B4332] text-white"
              : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"
          }`}
        >
          All ({rows.length})
        </button>
        {statuses.map((s) => {
          const count = rows.filter((r) => r.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                statusFilter === s
                  ? "bg-[#1B4332] text-white"
                  : "bg-[#F5F4F2] text-[#62666F] hover:bg-[#E8E6E1]"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}