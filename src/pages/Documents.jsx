import React, { useState } from "react";
import {
  Plus,
  FileText,
  Search,
  ExternalLink,
  Trash2,
  Download,
  FileSpreadsheet,
  FileCode,
  FileCheck,
  UploadCloud,
  Tag as TagIcon,
} from "lucide-react";
import PageHeader from "@/components/ledger/PageHeader";
import Tag from "@/components/ledger/Tag";
import SlideOver from "@/components/ledger/SlideOver";
import { Skeleton } from "@/components/ui/skeleton";
import { partners as mockPartners } from "@/data/mockLedger";
import {
  useDocuments,
  useAddDocument,
  useDeleteDocument,
  usePartners,
} from "@/hooks/useLedger";
import { useAuth } from "@/lib/AuthContext";

const categories = ["All", "Legal", "Financial", "Product", "Other"];

export default function Documents() {
  const { user } = useAuth();
  const { data: documents, isLoading } = useDocuments();
  const { data: partnersData } = usePartners();
  const addDocument = useAddDocument();
  const deleteDocument = useDeleteDocument();

  const partners = partnersData || mockPartners;

  // Detect active founder
  const detectedFounder = React.useMemo(() => {
    const email = user?.email?.toLowerCase() || "";
    if (email.includes("shubham")) return "Shubham Jain";
    if (email.includes("ashwin")) return "Ashwin Pillai";
    return "OM Kumar";
  }, [user]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Legal",
    uploadedBy: detectedFounder,
    fileUrl: "",
    notes: "",
  });

  const filtered = (documents || []).filter((d) => {
    const matchesSearch =
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.category?.toLowerCase().includes(search.toLowerCase()) ||
      d.uploadedBy?.toLowerCase().includes(search.toLowerCase()) ||
      d.notes?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || d.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      if (!form.name) {
        // Auto fill document name from filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        setForm((prev) => ({ ...prev, name: cleanName }));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      await addDocument.mutateAsync({
        doc: {
          name: form.name,
          category: form.category,
          uploadedBy: form.uploadedBy || detectedFounder,
          fileUrl: form.fileUrl,
          notes: form.notes,
        },
        file: fileToUpload,
      });

      setOpen(false);
      setFileToUpload(null);
      setForm({
        name: "",
        category: "Legal",
        uploadedBy: detectedFounder,
        fileUrl: "",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to save document:", err);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete document "${name}" from permanent records?`)) {
      deleteDocument.mutate(id);
    }
  };

  const getFileIcon = (type) => {
    const t = (type || "").toUpperCase();
    if (t === "XLSX" || t === "XLS" || t === "CSV")
      return <FileSpreadsheet className="h-5 w-5 text-[#2D7D46]" />;
    if (t === "HTML" || t === "CODE")
      return <FileCode className="h-5 w-5 text-[#4A5FE8]" />;
    return <FileText className="h-5 w-5 text-[#1B4332]" />;
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
            Documents & Agreements
          </h1>
          <p className="mt-1 text-[15px] text-[#62666F]">
            Permanently accessible agreements, audit reports, and files synced with Supabase.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2.5 font-heading font-semibold text-white transition hover:bg-[#143A28] hover:shadow-md active:scale-[.98] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {/* Search & Category Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9498A0]" />
          <input
            className="w-full rounded-xl border border-[#E8E6E1] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB] shadow-xs"
            placeholder="Search documents by name, author, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#1B4332] text-white shadow-xs"
                  : "bg-white border border-[#E8E6E1] text-[#62666F] hover:bg-[#FAFAF9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-[#F0EFEB] last:border-0"
              >
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-10 w-10 text-[#C4C2BC] mx-auto mb-3" />
            <p className="font-semibold text-sm text-[#16181D]">No documents found</p>
            <p className="text-xs text-[#9498A0] mt-1">
              {search
                ? `No files match "${search}".`
                : "No files in this category yet."}
            </p>
          </div>
        ) : (
          filtered.map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center gap-4 p-4 transition hover:bg-[#F9F8F6] ${
                i < filtered.length - 1 ? "border-b border-[#E8E6E1]" : ""
              }`}
            >
              {/* Icon Box */}
              <div className="rounded-xl bg-[#F5F4F2] p-3 flex-shrink-0 flex items-center justify-center border border-[#EAE8E4]">
                {getFileIcon(d.type)}
              </div>

              {/* Title & Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-[#16181D] truncate">
                    {d.name}
                  </p>
                  {d.fileUrl && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                      Live Link
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-[#9498A0]">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: getPartnerColor(d.uploadedBy) }}
                    />
                    <span className="text-[#62666F] font-medium">{d.uploadedBy}</span>
                  </span>
                  <span>•</span>
                  <span>{d.date}</span>
                  {d.fileSize && (
                    <>
                      <span>•</span>
                      <span>{d.fileSize}</span>
                    </>
                  )}
                  {d.notes && (
                    <>
                      <span>•</span>
                      <span className="truncate italic max-w-[200px]">"{d.notes}"</span>
                    </>
                  )}
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center gap-3">
                <Tag>{d.category}</Tag>
                <span className="text-xs font-mono font-semibold text-[#9498A0] uppercase">
                  {d.type || "PDF"}
                </span>

                {/* View / Download */}
                {d.fileUrl ? (
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#1B4332] hover:bg-[#E8F0EB] rounded-lg transition"
                    title="Open document"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(d.id, d.name)}
                  className="p-1.5 text-[#9498A0] hover:text-[#B91C1C] hover:bg-red-50 rounded-lg transition"
                  title="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SlideOver for Uploading Document */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Upload Document / Agreement"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Document Name <span className="text-red-500">*</span>
            </span>
            <input
              required
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="e.g. Partnership Agreement v2, Trademark Filing"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-[#62666F]">Category</span>
              <select
                className="mt-1 w-full rounded-lg border border-[#E8E6E1] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1B4332]"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Legal">Legal</option>
                <option value="Financial">Financial</option>
                <option value="Product">Product</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#62666F]">Uploaded By</span>
              <select
                className="mt-1 w-full rounded-lg border border-[#E8E6E1] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1B4332]"
                value={form.uploadedBy}
                onChange={(e) => setForm({ ...form, uploadedBy: e.target.value })}
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* File Upload Box */}
          <div>
            <span className="block text-sm font-medium text-[#62666F] mb-1">
              Select File (PDF, DOCX, Sheet, etc.)
            </span>
            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D5D3CC] p-5 cursor-pointer hover:border-[#1B4332] hover:bg-[#F9F8F6] transition">
              <UploadCloud className="h-8 w-8 text-[#9498A0] mb-2" />
              <p className="text-xs font-semibold text-[#16181D]">
                {fileToUpload ? fileToUpload.name : "Click to browse or drag file here"}
              </p>
              <p className="text-[11px] text-[#9498A0] mt-0.5">
                {fileToUpload
                  ? `${(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB`
                  : "PDF, DOCX, XLSX, images up to 25MB"}
              </p>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* External Link Option */}
          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              External URL / Link (Optional)
            </span>
            <input
              type="url"
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="e.g. Google Drive, Figma, or Notion URL"
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#62666F]">
              Description / Notes
            </span>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border border-[#E8E6E1] px-3 py-2.5 text-sm outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8F0EB]"
              placeholder="Short note about what this document is for..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>

          <button
            type="submit"
            disabled={addDocument.isPending}
            className="w-full rounded-lg bg-[#1B4332] p-3 font-heading font-semibold text-white transition hover:bg-[#143A28] disabled:opacity-50 shadow-sm"
          >
            {addDocument.isPending ? "Uploading to Supabase..." : "Save Document"}
          </button>
        </form>
      </SlideOver>
    </>
  );
}