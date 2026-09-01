import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { useExpenseEntries } from "@/hooks/useLedger";

export default function PendingReimbursements() {
  const { data: expenseData, isLoading } = useExpenseEntries();
  const expenses = expenseData || [];

  const pending = expenses.filter((e) => e.status === "Pending");
  const total = pending.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#B7791F]" />
        <h2 className="font-heading text-xl font-semibold">Pending Reimbursements</h2>
      </div>
      <div className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm min-h-[140px] flex flex-col justify-center">
        {pending.length === 0 ? (
          <div className="py-4 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0EB] px-3 py-1 text-xs font-semibold text-[#1B4332]">
              <CheckCircle2 className="h-3.5 w-3.5" /> All Settled
            </div>
            <p className="mt-2 text-sm text-[#62666F]">
              No pending reimbursements. Any future business expenses marked "Pending" will appear here for partner review.
            </p>
          </div>
        ) : (
          <>
            {pending.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between border-b border-[#E8E6E1] py-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-[#16181D]">{e.partner}</p>
                  <p className="text-sm text-[#9498A0]">{e.description}</p>
                </div>
                <span className="font-heading tabular-nums font-semibold text-[#B7791F]">
                  ₹{Number(e.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-[#E8E6E1] pt-3">
              <span className="text-sm font-medium text-[#62666F]">Total pending</span>
              <span className="font-heading tabular-nums font-bold text-[#B7791F]">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}