import React, { useState } from "react";
import { Edit2, Shield, Lock, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ledger/PageHeader";
import SlideOver from "@/components/ledger/SlideOver";
import { Skeleton } from "@/components/ui/skeleton";
import { partners as mockPartners } from "@/data/mockLedger";
import { useRoles, useUpdateRole, useAddRole, usePartners } from "@/hooks/useLedger";
import { useAuth } from "@/lib/AuthContext";

export default function Roles() {
  const { currentPartner } = useAuth();
  const { data: roles, isLoading } = useRoles();
  const { data: partnersData } = usePartners();
  const updateRole = useUpdateRole();
  const addRole = useAddRole();

  const partners = partnersData || mockPartners;

  const [editModal, setEditModal] = useState({
    open: false,
    id: null,
    partner: "",
    responsibility: "",
    deliverables: "",
    authority: "",
  });

  const handleOpenEdit = (role) => {
    setEditModal({
      open: true,
      id: role.id,
      partner: role.partner,
      responsibility: role.responsibility,
      deliverables: role.deliverables,
      authority: role.authority,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editModal.id) return;

    try {
      await updateRole.mutateAsync({
        id: editModal.id,
        roleData: {
          responsibility: editModal.responsibility,
          deliverables: editModal.deliverables,
          authority: editModal.authority,
        },
      });
      setEditModal({ open: false, id: null, partner: "", responsibility: "", deliverables: "", authority: "" });
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const getPartnerColor = (name) => {
    const p = partners.find((x) => x.name === name);
    return p?.color || "#4A5FE8";
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#16181D]">
            Roles & Responsibilities
          </h1>
          <p className="mt-1 text-[15px] text-[#62666F]">
            A permanent reference of who owns what and who has final say across the partnership.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[#F0EFEB] last:border-0">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="border-b border-[#E8E6E1] bg-[#FAFAF9]">
                  <th className="px-5 py-3.5 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                    Partner
                  </th>
                  <th className="px-5 py-3.5 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                    Primary Responsibility
                  </th>
                  <th className="px-5 py-3.5 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                    Specific Deliverables
                  </th>
                  <th className="px-5 py-3.5 font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                    Decision Authority
                  </th>
                  <th className="px-4 py-3.5 text-right font-heading text-[13px] font-semibold uppercase tracking-[.05em] text-[#62666F]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {(roles || []).map((r) => {
                  const color = getPartnerColor(r.partner);
                  return (
                    <tr
                      key={r.id || r.partner}
                      className="border-b border-[#E8E6E1] last:border-0 hover:bg-[#F9F8F6] transition"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ background: color }}
                          />
                          <b className="text-[#16181D] font-semibold">{r.partner}</b>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#16181D] font-medium">
                        {r.responsibility}
                      </td>
                      <td className="px-5 py-4 text-[#62666F] text-sm leading-relaxed max-w-xs">
                        {r.deliverables}
                      </td>
                      <td className="px-5 py-4 text-sm leading-relaxed text-[#1B4332] font-medium max-w-xs">
                        <div className="flex items-start gap-1.5 bg-[#F4F9F6] p-2.5 rounded-xl border border-[#C6E6D5]">
                          <Shield className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#1B4332]" />
                          <span>{r.authority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        {r.partner === currentPartner?.name ? (
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] bg-[#E8F0EB] hover:bg-[#D3E5DA] px-3 py-1.5 rounded-lg transition active:scale-95 shadow-xs"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit My Scope
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#9498A0] bg-[#F5F4F2] px-2.5 py-1 rounded-lg border border-[#E8E6E1]">
                            <Lock className="h-3 w-3 text-[#9498A0]" />
                            Protected ({r.partner.split(" ")[0]})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SlideOver to Edit Role */}
      <SlideOver
        open={editModal.open}
        onClose={() =>
          setEditModal({ open: false, id: null, partner: "", responsibility: "", deliverables: "", authority: "" })
        }
        title={`Edit Role: ${editModal.partner}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Primary Responsibility
            </span>
            <input
              required
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              value={editModal.responsibility}
              onChange={(e) =>
                setEditModal({ ...editModal, responsibility: e.target.value })
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Specific Deliverables
            </span>
            <textarea
              rows={3}
              required
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="e.g. Platform, astronomical calculation engine, security..."
              value={editModal.deliverables}
              onChange={(e) =>
                setEditModal({ ...editModal, deliverables: e.target.value })
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Decision Authority (Final Say)
            </span>
            <textarea
              rows={3}
              required
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="e.g. Final say on technical architecture and security..."
              value={editModal.authority}
              onChange={(e) =>
                setEditModal({ ...editModal, authority: e.target.value })
              }
            />
          </label>

          <button
            type="submit"
            disabled={updateRole.isPending}
            className="w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white transition hover:bg-[#143A28] disabled:opacity-50 shadow-sm"
          >
            {updateRole.isPending ? "Saving to Supabase..." : "Save Role Updates"}
          </button>
        </form>
      </SlideOver>
    </>
  );
}