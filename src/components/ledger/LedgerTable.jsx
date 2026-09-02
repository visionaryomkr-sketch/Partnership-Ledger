import React from "react";
import { ExternalLink, FileText, MessageSquare } from "lucide-react";
import Tag from "@/components/ledger/Tag";

export default function LedgerTable({ type, rows, onStatus, onNote, onPreview }) {
  const heads =
    type === "work"
      ? ["Date", "Partner", "Category", "Deliverables & Details", "Hours", "Proof", ""]
      : type === "expense"
      ? ["Date", "Partner", "Category", "Amount", "Description", "Proof", "Status"]
      : ["Date", "Source", "Amount", "Customers", "Notes", "Entered By"];

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-[15px]">
        <thead>
          <tr className="border-b border-[#E8E6E1] bg-[#F5F4F2]">
            {heads.map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8E6E1]">
          {rows.map((r, i) => (
            <tr
              key={r.id}
              className={`${
                i === 0 && r.isNew ? "new-row" : ""
              } transition hover:bg-[#FBFBFA]`}
            >
              {type === "work" ? (
                <>
                  <td className="align-top px-4 py-4 whitespace-nowrap text-sm text-[#62666F] tabular-nums">
                    {r.date}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap font-medium text-[#16181D]">
                    {r.partner}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap">
                    <Tag>{r.category}</Tag>
                  </td>
                  <td className="align-top px-4 py-4 min-w-[340px] max-w-xl">
                    <div className="font-heading font-semibold text-[#16181D] text-[15px] leading-snug">
                      {r.title}
                    </div>
                    {r.description ? (
                      <div className="mt-2.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#4A4E57] whitespace-pre-line font-normal space-y-1 border-l-2 border-[#E8E6E1] pl-3 py-0.5">
                        {r.description}
                      </div>
                    ) : null}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap font-heading font-bold tabular-nums text-base text-[#16181D]">
                    {r.hours}h
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap">
                    {r.proof && (
                      <a
                        href={r.proof}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#1B4332] hover:underline"
                        title="Open proof link"
                      >
                        <ExternalLink className="h-4 w-4 text-[#1B4332]" />
                      </a>
                    )}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onNote(r)}
                      className="flex items-center gap-1 text-xs text-[#62666F] hover:text-[#1B4332] transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Add a note
                    </button>
                  </td>
                </>
              ) : type === "expense" ? (
                <>
                  <td className="align-top px-4 py-4 whitespace-nowrap text-sm text-[#62666F] tabular-nums">
                    {r.date}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap font-medium text-[#16181D]">
                    {r.partner}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap">
                    <Tag>{r.category}</Tag>
                  </td>
                  <td className="align-top px-4 py-4 text-right tabular-nums font-heading font-semibold text-[#16181D]">
                    ₹{Number(r.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="align-top px-4 py-4 text-sm leading-relaxed text-[#4A4E57] whitespace-pre-line">
                    {r.description}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap">
                    <button
                      title={`Preview ${r.proof}`}
                      onClick={() => onPreview(r)}
                      className="rounded-lg bg-[#F5F4F2] p-2 transition hover:bg-[#E8F0EB]"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap">
                    <button
                      title={r.updated && `Last updated ${r.updated}`}
                      onClick={() => onStatus(r)}
                    >
                      <Tag>{r.status}</Tag>
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="align-top px-4 py-4 whitespace-nowrap text-sm text-[#62666F] tabular-nums">
                    {r.date}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap">
                    <Tag>{r.source}</Tag>
                  </td>
                  <td className="align-top px-4 py-4 tabular-nums font-heading font-semibold text-[#16181D]">
                    ₹{Number(r.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="align-top px-4 py-4 tabular-nums text-sm">
                    {r.customers || "—"}
                  </td>
                  <td className="align-top px-4 py-4 text-sm leading-relaxed text-[#4A4E57] whitespace-pre-line">
                    {r.notes}
                  </td>
                  <td className="align-top px-4 py-4 whitespace-nowrap font-medium text-[#16181D]">
                    {r.partner}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}