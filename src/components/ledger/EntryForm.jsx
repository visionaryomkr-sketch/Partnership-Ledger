import React, { useState } from "react";
import { Lock, UserCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useMilestones } from "@/hooks/useLedger";

const field =
  "w-full rounded-lg border border-[#E8E6E1] bg-white px-3 py-2.5 text-[15px] outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]";

export default function EntryForm({ type, onSave }) {
  const { currentPartner } = useAuth();
  const { data: milestonesData } = useMilestones();
  const milestones = milestonesData || [];

  const partnerName = currentPartner?.name || "OM Kumar";

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    partner: partnerName,
    category:
      type === "work"
        ? currentPartner?.role === "Ad Creative"
          ? "Ad Creative"
          : currentPartner?.role === "Marketing"
          ? "Marketing"
          : "Development"
        : "Infrastructure",
    title: "",
    description: "",
    hours: "",
    amount: "",
    proof: "",
    source: "Direct Sale",
    customers: "",
    notes: "",
    milestone: "",
  });

  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, partner: partnerName });
      }}
    >
      {/* Partner Identification & Security Badge */}
      <div>
        <span className="block text-sm font-medium text-[#62666F] mb-1.5">
          {type === "work" ? "Logged By" : type === "expense" ? "Paid By" : "Entered By"}
        </span>
        <div className="flex items-center justify-between rounded-xl border border-[#B7DFCA] bg-[#F4F9F6] p-3 text-sm">
          <div className="flex items-center gap-2.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: currentPartner?.color || "#4A5FE8" }}
            />
            <span className="font-semibold text-[#16181D]">{partnerName}</span>
            <span className="text-xs text-[#9498A0]">({currentPartner?.role})</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332]">
            <Lock className="h-3 w-3" />
            Verified Co-Founder
          </span>
        </div>
      </div>

      {type === "revenue" ? (
        <label className="block">
          <span className="text-sm font-medium text-[#62666F]">Source</span>
          <select
            className={field}
            value={form.source}
            onChange={(e) => set("source", e.target.value)}
          >
            <option>Direct Sale</option>
            <option>Ads-driven</option>
            <option>Organic</option>
          </select>
        </label>
      ) : (
        <label className="block">
          <span className="text-sm font-medium text-[#62666F]">Category</span>
          <select
            className={field}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {type === "work" ? (
              <>
                <option>Development</option>
                <option>Ad Creative</option>
                <option>Marketing</option>
              </>
            ) : (
              <>
                <option>Infrastructure</option>
                <option>Advertising</option>
                <option>Creative Tools</option>
              </>
            )}
          </select>
        </label>
      )}

      {type === "work" && (
        <label className="block">
          <span className="text-sm font-medium text-[#62666F]">
            Task Title <span className="text-red-500">*</span>
          </span>
          <input
            required
            className={field}
            placeholder="e.g. Built Gun Milan calculation algorithm"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </label>
      )}

      <label className="block">
        <span className="text-sm font-medium text-[#62666F]">
          {type === "revenue" ? "Notes" : "Description / Details"}
        </span>
        <textarea
          className={field}
          rows="3"
          placeholder="Specific deliverables, PRs, campaign names, or context..."
          value={type === "revenue" ? form.notes : form.description}
          onChange={(e) =>
            set(type === "revenue" ? "notes" : "description", e.target.value)
          }
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-[#62666F]">Date</span>
          <input
            type="date"
            className={field}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#62666F]">
            {type === "work" ? "Hours Spent" : "Amount (₹)"}{" "}
            <span className="text-red-500">*</span>
          </span>
          <input
            required
            min="0"
            step={type === "work" ? "0.5" : "1"}
            type="number"
            className={field}
            placeholder={type === "work" ? "e.g. 6" : "e.g. 1500"}
            value={type === "work" ? form.hours : form.amount}
            onChange={(e) =>
              set(type === "work" ? "hours" : "amount", e.target.value)
            }
          />
        </label>
      </div>

      {type === "revenue" && (
        <label className="block">
          <span className="text-sm font-medium text-[#62666F]">Customer Count</span>
          <input
            type="number"
            className={field}
            placeholder="e.g. 15"
            value={form.customers}
            onChange={(e) => set("customers", e.target.value)}
          />
        </label>
      )}

      {type === "work" ? (
        <label className="block">
          <span className="text-sm font-medium text-[#62666F]">
            Proof URL (Commit, PR, or Drive link)
          </span>
          <input
            type="url"
            className={field}
            placeholder="https://github.com/..."
            value={form.proof}
            onChange={(e) => set("proof", e.target.value)}
          />
        </label>
      ) : (
        type === "expense" && (
          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Receipt / Invoice filename
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className={field}
              onChange={(e) => set("proof", e.target.files[0]?.name || "")}
            />
          </label>
        )
      )}

      <label className="block">
        <span className="text-sm font-medium text-[#62666F]">
          Related Milestone (Optional)
        </span>
        <select
          className={field}
          value={form.milestone}
          onChange={(e) => set("milestone", e.target.value)}
        >
          <option value="">None</option>
          {milestones.map((m) => (
            <option key={m.id} value={m.title}>
              {m.title}
            </option>
          ))}
        </select>
      </label>

      <button className="w-full rounded-lg bg-[#1B4332] px-4 py-3 font-heading font-semibold text-white transition hover:bg-[#143A28] hover:shadow-md active:scale-[.98]">
        Save Immutable Entry
      </button>
    </form>
  );
}