import React from "react";
import { ExternalLink, MessageSquare } from "lucide-react";
import Tag from "@/components/ledger/Tag";
function getWeekStart(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}
export default function WeeklyGroupedTable({ rows, onNote }) {
  const groups = {};
  [...rows].sort((a, b) => b.date.localeCompare(a.date)).forEach(r => {
    const ws = getWeekStart(r.date);
    const key = ws.toISOString();
    if (!groups[key]) groups[key] = { label: `Week of ${ws.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`, entries: [], total: 0 };
    groups[key].entries.push(r);
    groups[key].total += Number(r.hours);
  });
  return (
    <div className="space-y-4">
      {Object.values(groups).map((g, i) => (
        <details key={i} open className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
          <summary className="cursor-pointer p-4 font-heading font-semibold text-[#16181D]">{g.label} — <span className="text-[#62666F]">{g.total}h total</span></summary>
          <table className="w-full min-w-[800px] text-left text-[15px]">
            <tbody>
              {g.entries.map(r => (
                <tr key={r.id} className="border-t border-[#E8E6E1] transition hover:bg-[#F5F4F2]">
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.partner}</td>
                  <td className="px-4 py-3"><Tag>{r.category}</Tag></td>
                  <td className="px-4 py-3"><div className="font-medium">{r.title}</div><div className="mt-1 text-[13px] text-[#9498A0]">{r.description}</div></td>
                  <td className="px-4 py-3 tabular-nums">{r.hours}h</td>
                  <td className="px-4 py-3">{r.proof && <a href={r.proof} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 text-[#1B4332]" /></a>}</td>
                  <td className="px-4 py-3"><button onClick={() => onNote(r)} className="flex items-center gap-1 text-xs text-[#62666F] hover:text-[#1B4332]"><MessageSquare className="h-3.5 w-3.5" />Note</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  );
}