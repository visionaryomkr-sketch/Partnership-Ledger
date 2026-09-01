import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/ledger/StatCard";
import MonthlyTrendBar from "@/components/records/MonthlyTrendBar";

const sourceColors = { "Direct Sale": "#2D7D46", Organic: "#4A5FE8", "Ads-driven": "#B7791F" };

export default function RevenueSummary({ rows = [] }) {
  const isPreLaunch = !rows || rows.length === 0;

  const totalRevenue = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalCustomers = rows.reduce((s, r) => s + Number(r.customers || 0), 0);
  const avgPerEntry = rows.length ? Math.round(totalRevenue / rows.length) : 0;

  const sources = {};
  rows.forEach((r) => {
    sources[r.source] = (sources[r.source] || 0) + (Number(r.amount) || 0);
  });
  const sourceData = Object.entries(sources).map(([source, amount]) => ({
    source,
    amount,
    color: sourceColors[source] || "#62666F",
  }));
  const totalSource = totalRevenue || 1;

  const chartData = [...rows]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      amount: Number(r.amount) || 0,
    }));

  return (
    <div className="space-y-4">
      {isPreLaunch ? (
        <div className="flex items-center justify-between rounded-xl bg-[#E8F0EB] px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1B4332] animate-pulse" />
            <span className="font-medium text-[#1B4332]">Status: Pre-launch Mode</span>
            <span className="text-[#62666F]">— Website built, awaiting public launch</span>
          </div>
          <span className="font-semibold text-[#1B4332] text-xs uppercase tracking-wider">
            Ready for First Sales
          </span>
        </div>
      ) : (
        <MonthlyTrendBar
          current={totalRevenue}
          previous={0}
          prefix="₹"
          entries={rows.length}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} />
        <StatCard label="Total Customers" value={totalCustomers} />
        <StatCard label="Avg Revenue / Entry" value={`₹${avgPerEntry.toLocaleString("en-IN")}`} />
        <StatCard
          label="Trend"
          value={isPreLaunch ? "Pre-launch" : "↑ Active"}
          sub={isPreLaunch ? "Awaiting launch" : "Live verified sales"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm min-h-[220px] flex flex-col justify-center">
          <p className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">
            Revenue by Source
          </p>
          {isPreLaunch || sourceData.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm font-semibold text-[#16181D]">No Revenue Sources Yet</p>
              <p className="mt-1 text-xs text-[#9498A0]">
                Customer report purchases (₹199 each) will be tracked here by source.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sourceData.map((d) => (
                <div key={d.source}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#62666F]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                      {d.source}
                    </span>
                    <span className="font-heading tabular-nums font-medium">
                      ₹{d.amount.toLocaleString("en-IN")} ({Math.round((d.amount / totalSource) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F5F4F2]">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(d.amount / totalSource) * 100}%`, background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm min-h-[220px] flex flex-col justify-center">
          <p className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[#9498A0]">
            Revenue Over Time
          </p>
          {isPreLaunch || chartData.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm font-semibold text-[#16181D]">Chart Awaiting Sales</p>
              <p className="mt-1 text-xs text-[#9498A0]">
                Daily sales trajectory will chart automatically once public launch starts.
              </p>
            </div>
          ) : (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B4332" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#1B4332" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9498A0" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#1B4332"
                    strokeWidth={2}
                    fill="url(#rev)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}