import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import PageHeader from "@/components/ledger/PageHeader";
import Tag from "@/components/ledger/Tag";
import { Skeleton } from "@/components/ui/skeleton";
import { usePartners, useChangeLog } from "@/hooks/useLedger";

export default function Equity() {
  const { data: partners, isLoading: partnersLoading } = usePartners();
  const { data: changeLog, isLoading: logLoading } = useChangeLog();

  const equityHistory = (changeLog || []).filter(
    (c) => c.field === "Profit Share" || c.field === "Profit Split"
  );

  return (
    <>
      <PageHeader
        title="Equity & Cap Table"
        description="Current ownership split, commitments, and how the split has evolved."
      />

      {partnersLoading ? (
        <div className="space-y-12 animate-in fade-in duration-300">
          {/* Skeleton: Current Profit Share */}
          <section>
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm">
              <div className="h-48 w-48 shrink-0 flex items-center justify-center">
                <Skeleton className="h-36 w-36 rounded-full" />
              </div>
              <div className="flex-1 space-y-4 w-full">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-[#F0EFEB] pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-14" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Skeleton: Commitment vs Delivery */}
          <section>
            <Skeleton className="h-7 w-56 mb-4" />
            <div className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white p-6 space-y-4 shadow-sm">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[#F0EFEB] last:border-0"
                >
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-200">
          {/* Current Profit Share */}
          <section>
            <h2 className="mb-4 font-heading text-xl font-semibold">Current Profit Share</h2>
            <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm">
              <div className="h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={partners || []}
                      dataKey="share"
                      nameKey="name"
                      innerRadius={48}
                      outerRadius={80}
                      paddingAngle={2}
                      animationDuration={500}
                    >
                      {(partners || []).map((p) => (
                        <Cell key={p.id} fill={p.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v}%`, n]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-4 w-full">
                {(partners || []).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border-b border-[#F0EFEB] pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ background: p.color }}
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#16181D]">{p.name}</p>
                        <p className="text-xs text-[#9498A0]">{p.role}</p>
                      </div>
                    </div>
                    <span className="font-heading text-xl font-bold tabular-nums text-[#16181D]">
                      {p.share || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Commitment vs. Delivery */}
          <section>
            <h2 className="mb-4 font-heading text-xl font-semibold">Commitment vs. Delivery</h2>
            <div className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
              <table className="w-full text-left text-[15px]">
                <thead>
                  <tr className="border-b border-[#E8E6E1] bg-[#FAFAF9]">
                    <th className="px-4 py-3 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                      Partner
                    </th>
                    <th className="px-4 py-3 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                      Committed
                    </th>
                    <th className="px-4 py-3 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                      Delivered So Far
                    </th>
                    <th className="px-4 py-3 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(partners || []).map((p) => (
                    <tr key={p.id} className="border-b border-[#E8E6E1] last:border-0">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: p.color }}
                          />
                          <b className="text-[#16181D]">{p.name}</b>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#62666F]">
                        {p.role === "Developer"
                          ? "Full technical development"
                          : p.role === "Ad Creative"
                          ? "Ad creative production"
                          : "Marketing spend + campaign management"}
                      </td>
                      <td className="px-4 py-4 text-[#62666F]">
                        {p.hours || 0}h logged · ₹{(p.invested || 0).toLocaleString("en-IN")} invested
                      </td>
                      <td className="px-4 py-4">
                        <Tag>{p.role === "Developer" ? "Completed" : "In Progress"}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Equity History Timeline */}
          <section>
            <h2 className="mb-6 font-heading text-xl font-semibold">Equity History</h2>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E8E6E1]" />
              {logLoading ? (
                <div className="space-y-4 pl-6">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-12 w-2/3" />
                </div>
              ) : equityHistory.length === 0 ? (
                <p className="text-sm text-[#9498A0] pl-6">No equity history changes logged yet.</p>
              ) : (
                equityHistory.map((c, i) => (
                  <div key={c.id || i} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#1B4332] bg-white shadow-xs" />
                    <div>
                      <p className="text-[13px] text-[#9498A0]">{c.when}</p>
                      <h4 className="mt-0.5 font-heading text-base font-semibold text-[#16181D]">
                        {c.who} changed the split
                      </h4>
                      <p className="mt-1 text-sm text-[#62666F] tabular-nums">
                        {c.old} → <b className="text-[#16181D]">{c.next}</b>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}