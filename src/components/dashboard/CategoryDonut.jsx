import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function CategoryDonut({ data = [] }) {
  const hasData = data && data.length > 0 && data.some((d) => d.value > 0);

  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-semibold">Contribution by Category</h2>
      <div className="flex items-center gap-6 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm min-h-[160px] justify-center">
        {!hasData ? (
          <div className="py-6 text-center">
            <p className="text-sm font-semibold text-[#16181D]">No Work Logged Yet</p>
            <p className="mt-1 text-xs text-[#9498A0] max-w-sm mx-auto">
              Add your first work entry in the Work Log to see development, creative, and marketing time shares.
            </p>
          </div>
        ) : (
          <>
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    animationDuration={900}
                  >
                    {data.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}h`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {data.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-heading tabular-nums font-medium">{d.value}h</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}