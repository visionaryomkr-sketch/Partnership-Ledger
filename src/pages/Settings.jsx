import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import PageHeader from "@/components/ledger/PageHeader";
import ImpactPreview from "@/components/settings/ImpactPreview";
import AgreementSummary from "@/components/settings/AgreementSummary";
import { partners as mockPartners, changeLog as mockChangeLog } from "@/data/mockLedger";
import {
  usePartners,
  useAppSettings,
  useChangeLog,
  useUpdatePartnerHourlyRate,
  useUpdateProfitShares,
} from "@/hooks/useLedger";
import { useAuth } from "@/lib/AuthContext";

export default function Settings() {
  const { user, currentPartner } = useAuth();
  const { data: partnersData } = usePartners();
  const { data: settingsData } = useAppSettings();
  const { data: changeLogData } = useChangeLog();

  const updatePartnerHourlyRate = useUpdatePartnerHourlyRate();
  const updateProfitShares = useUpdateProfitShares();

  const partners = partnersData || mockPartners;
  const currentRate = settingsData?.hourly_rate || 1600;
  const changeLog = changeLogData || mockChangeLog;

  const actingFounder = currentPartner?.name || "OM Kumar";

  // Form states
  const [shares, setShares] = useState(partners.map((p) => p.share || 0));
  const [partnerRates, setPartnerRates] = useState({});
  const [savingPartner, setSavingPartner] = useState(null);
  const [confirm, setConfirm] = useState(null); // 'share' | null

  // Filters for change log
  const [logPartner, setLogPartner] = useState("All");
  const [logField, setLogField] = useState("All");

  // Sync state when data loads
  useEffect(() => {
    if (partnersData) {
      setShares(partnersData.map((p) => p.share || 0));
    }
  }, [partnersData]);

  useEffect(() => {
    const rates = {
      "OM Kumar": 1600,
      "Shubham Jain": 1000,
      "Ashwin Pillai": 1000,
    };

    if (settingsData?.hourly_rates) {
      Object.assign(rates, settingsData.hourly_rates);
    }
    if (settingsData?.hourly_rate) {
      rates["OM Kumar"] = Number(settingsData.hourly_rate);
    }
    if (partnersData) {
      partnersData.forEach((p) => {
        if (p.hourly_rate) {
          rates[p.name] = Number(p.hourly_rate);
        }
      });
    }

    setPartnerRates(rates);
  }, [settingsData, partnersData]);

  const total = shares.reduce((a, b) => a + Number(b), 0);

  const filteredLog = changeLog.filter(
    (c) =>
      (logPartner === "All" || c.who === logPartner) &&
      (logField === "All" || c.field === logField)
  );

  const isMyPartnerRate = (partnerName) => {
    const current = (actingFounder || "").toLowerCase().trim();
    const target = (partnerName || "").toLowerCase().trim();
    return current === target || current.includes(target.split(" ")[0]);
  };

  const handleSavePartnerRate = async (partnerName) => {
    const newRate = Number(partnerRates[partnerName] || 1000);
    const oldRate = Number(
      settingsData?.hourly_rates?.[partnerName] ||
        (partnerName.includes("OM") ? 1600 : 1000)
    );
    setSavingPartner(partnerName);
    try {
      await updatePartnerHourlyRate.mutateAsync({
        partnerName,
        newRate,
        who: actingFounder,
        oldRate,
      });
    } finally {
      setSavingPartner(null);
    }
  };

  const handleConfirmSave = async () => {
    if (confirm === "share") {
      const sharesMap = {};
      partners.forEach((p, idx) => {
        sharesMap[p.id] = Number(shares[idx]);
      });

      const oldSummary = partners.map((p) => p.share).join(" / ");
      const newSummary = shares.map((s) => Number(s)).join(" / ");

      await updateProfitShares.mutateAsync({
        sharesMap,
        who: actingFounder,
        oldSharesSummary: oldSummary,
        newSharesSummary: newSummary,
      });
    }
    setConfirm(null);
  };

  const selectCls =
    "rounded-lg border border-[#E8E6E1] px-3 py-2 text-sm text-[#62666F] outline-none focus:border-[#1B4332]";

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#16181D]">
            Settings
          </h1>
          <p className="mt-1 text-[15px] text-[#62666F]">
            Shared assumptions that power every fairness calculation in Supabase.
          </p>
        </div>

        {/* Current Active User pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-full bg-[#E8F0EB] px-3.5 py-1.5 text-xs font-semibold text-[#1B4332] border border-[#B7DFCA]">
          <span>Acting as:</span>
          <b>{actingFounder}</b>
        </div>
      </div>

      {/* Real Agreement Summary */}
      <AgreementSummary partners={partners} />

      {/* Side-by-side Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profit Share Section */}
        <section className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#16181D]">Profit Share %</h2>
            <p className="mt-2 text-sm text-[#62666F]">
              Current agreed split across partners. Any change here directly updates the Supabase partners table and logs into the Change Log.
            </p>

            <div className="mt-6 space-y-4">
              {partners.map((p, i) => (
                <label
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-24 rounded-lg border border-[#E8E6E1] px-3 py-2 text-right tabular-nums text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
                      type="number"
                      min="0"
                      max="100"
                      value={shares[i]}
                      onChange={(e) =>
                        setShares(
                          shares.map((x, j) => (j === i ? e.target.value : x))
                        )
                      }
                    />
                    <span className="text-sm font-semibold text-[#62666F]">%</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div
              className={`mt-6 flex justify-between border-t border-[#E8E6E1] pt-4 font-heading font-semibold ${
                total === 100 ? "text-[#2D7D46]" : "text-[#C0392B]"
              }`}
            >
              <span>Total</span>
              <span>{total}%</span>
            </div>

            <button
              disabled={total !== 100 || updateProfitShares.isPending}
              onClick={() => setConfirm("share")}
              className="mt-4 w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white transition hover:bg-[#143A28] disabled:cursor-not-allowed disabled:opacity-40 shadow-sm active:scale-98"
            >
              {updateProfitShares.isPending ? "Saving to Supabase..." : "Save profit share"}
            </button>
          </div>
        </section>

        {/* Partner Hourly Rates Section */}
        <section className="rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-[#16181D]">
                Hourly Rate (₹)
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F0EB] text-[#1B4332] border border-[#B7DFCA]">
                Per-Partner Rate
              </span>
            </div>
            <p className="mt-2 text-sm text-[#62666F]">
              Individual hourly rates to value each role's sweat equity fairly. For security, each co-founder can only modify their own rate.
            </p>

            <div className="mt-5 space-y-3.5">
              {partners.map((p) => {
                const canEdit = isMyPartnerRate(p.name);
                const currentVal =
                  partnerRates[p.name] ?? (p.name.includes("OM") ? 1600 : 1000);
                const isSaving = savingPartner === p.name;

                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-4 transition ${
                      canEdit
                        ? "border-[#1B4332]/40 bg-[#FBFBFA] shadow-xs ring-1 ring-[#1B4332]/10"
                        : "border-[#E8E6E1] bg-[#FAFAFA]/70 opacity-90"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: p.color }}
                        />
                        <span className="font-semibold text-sm text-[#16181D]">
                          {p.name}
                        </span>
                        <span className="text-xs text-[#62666F] bg-white px-2 py-0.5 rounded-md border border-[#E8E6E1]">
                          {p.role}
                        </span>
                      </div>

                      {canEdit ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4332] bg-[#E8F0EB] px-2.5 py-0.5 rounded-full border border-[#B7DFCA]">
                          ● You (Active)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9498A0] bg-[#F5F4F2] px-2 py-0.5 rounded-full">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#9498A0]">
                          ₹
                        </span>
                        <input
                          disabled={!canEdit}
                          type="number"
                          step="50"
                          min="0"
                          value={currentVal}
                          onChange={(e) =>
                            setPartnerRates({
                              ...partnerRates,
                              [p.name]: e.target.value,
                            })
                          }
                          className={`w-full rounded-lg border pl-8 pr-12 py-2 text-base font-semibold tabular-nums outline-none transition ${
                            canEdit
                              ? "border-[#E8E6E1] bg-white focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
                              : "border-transparent bg-transparent text-[#62666F] cursor-not-allowed"
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9498A0] font-medium">
                          / hr
                        </span>
                      </div>

                      {canEdit ? (
                        <button
                          disabled={updatePartnerHourlyRate.isPending}
                          onClick={() => handleSavePartnerRate(p.name)}
                          className="rounded-lg bg-[#1B4332] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#143A28] disabled:opacity-50 whitespace-nowrap active:scale-95"
                        >
                          {isSaving ? "Saving..." : "Save My Rate"}
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#9498A0] italic px-1 whitespace-nowrap">
                          Only {p.name.split(" ")[0]} can edit
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-xs text-[#9498A0] border-t border-[#E8E6E1] pt-3">
            Logged hours in Work Log are multiplied by each partner's own hourly rate to calculate total sweat equity.
          </p>
        </section>
      </div>

      <div className="mt-6">
        <ImpactPreview
          shares={shares.map(Number)}
          rate={Number(partnerRates["OM Kumar"] || 1600)}
          savedShares={partners.map((p) => p.share || 0)}
          savedRate={currentRate}
        />
      </div>

      {/* Change Log Section */}
      <section className="mt-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold">Change Log</h2>
            <p className="text-xs text-[#62666F]">Audit trail synced from Supabase settings_changelog table.</p>
          </div>
          <div className="flex gap-3">
            <select
              value={logPartner}
              onChange={(e) => setLogPartner(e.target.value)}
              className={selectCls}
            >
              <option>All</option>
              {partners.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={logField}
              onChange={(e) => setLogField(e.target.value)}
              className={selectCls}
            >
              <option>All</option>
              <option>Profit Share</option>
              <option>Hourly Rate</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E8E6E1] bg-[#F5F4F2] text-xs uppercase tracking-wider text-[#9498A0]">
              <tr>
                <th className="px-6 py-3 font-medium">Who</th>
                <th className="px-6 py-3 font-medium">Field</th>
                <th className="px-6 py-3 font-medium">When</th>
                <th className="px-6 py-3 font-medium">Old value</th>
                <th className="px-6 py-3 font-medium">Next value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E1]">
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9498A0]">
                    No changes recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLog.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-semibold text-[#16181D]">
                      {c.who}
                    </td>
                    <td className="px-6 py-4 text-[#62666F]">{c.field}</td>
                    <td className="px-6 py-4 text-[#9498A0] tabular-nums">
                      {c.when}
                    </td>
                    <td className="px-6 py-4 text-[#C0392B] tabular-nums line-through">
                      {c.old}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#2D7D46] tabular-nums">
                      {c.next}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confirmation Modal for Profit Share */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E8E6E1]">
            <h3 className="font-heading text-lg font-bold text-[#16181D]">
              Confirm Profit Share Update
            </h3>
            <p className="mt-2 text-sm text-[#62666F]">
              This will update the profit split in Supabase and permanently log this change to the Change Log under <b>{actingFounder}</b>.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="rounded-lg border border-[#E8E6E1] px-4 py-2 text-sm font-semibold text-[#62666F] hover:bg-[#F5F4F2]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white hover:bg-[#143A28]"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}