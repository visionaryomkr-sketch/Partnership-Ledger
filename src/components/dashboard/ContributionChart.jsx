import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ContributionChart({ data = [] }) {
  const allTimeData = data.map((p) => ({
    name: p.name,
    contribution: Number(p.contribution) || 0,
    color: p.color || "#4A5FE8",
  }));

  const hasContributions = allTimeData.some((p) => p.contribution > 0);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Contribution comparison</h2>
        <span className="text-xs font-semibold text-[#1B4332] bg-[#E8F0EB] px-2.5 py-1 rounded-full">
          Live Equivalent Pool
        </span>
      </div>
      <div className="h-72 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm flex flex-col justify-center">
        {!hasContributions ? (
          <div className="py-8 text-center">
            <p className="text-sm font-semibold text-[#16181D]">No Contributions Logged Yet</p>
            <p className="mt-1 text-xs text-[#9498A0] max-w-sm mx-auto">
              As partners log hours in the Work Log and capital in Expenses, live contribution shares will chart here automatically.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={allTimeData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 13, fill: "#62666F" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
              <Bar dataKey="contribution" radius={[8, 8, 0, 0]} animationDuration={1000}>
                {allTimeData.map((p) => (
                  <Cell key={p.name} fill={p.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}