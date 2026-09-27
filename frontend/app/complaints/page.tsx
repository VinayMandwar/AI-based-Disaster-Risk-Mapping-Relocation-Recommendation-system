"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareWarning,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Phone,
  User,
  X,
  ArrowRight,
  ShieldAlert,
  Edit,
  Save,
  RefreshCw,
} from "lucide-react";
import { fetchComplaints, updateComplaintStatus } from "@/lib/api";
import { ComplaintItem } from "@/types";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [issueFilter, setIssueFilter] = useState("ALL");

  // Selected complaint for drawer/modal inspection
  const [activeComplaint, setActiveComplaint] = useState<ComplaintItem | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editAssigned, setEditAssigned] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchComplaints({
        status: statusFilter,
        issue_type: issueFilter,
        search: search.trim() || undefined,
      });
      setComplaints(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, issueFilter]);

  const handleOpenDrawer = (item: ComplaintItem) => {
    setActiveComplaint(item);
    setEditStatus(item.status);
    setEditAssigned(item.assigned_to || "Disaster Response Unit 1");
    setEditNotes(item.admin_notes || "");
  };

  const handleSaveComplaint = async () => {
    if (!activeComplaint) return;
    setIsSaving(true);
    try {
      const updated = await updateComplaintStatus(activeComplaint.id, {
        status: editStatus,
        assigned_to: editAssigned,
        admin_notes: editNotes,
      });

      // Update in local state
      setComplaints((prev) =>
        prev.map((c) => (c.id === activeComplaint.id ? { ...c, ...updated } : c))
      );
      setActiveComplaint({ ...activeComplaint, ...updated });
      alert("Complaint status updated successfully.");
    } catch (err) {
      alert("Failed to update complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResolveQuick = async (item: ComplaintItem) => {
    try {
      const updated = await updateComplaintStatus(item.id, {
        status: "Resolved",
        admin_notes: "Inspected and resolved on ground by disaster response team.",
      });
      setComplaints((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, ...updated } : c))
      );
    } catch (err) {
      alert("Error resolving complaint.");
    }
  };

  // KPIs
  const totalCount = complaints.length;
  const underReviewCount = complaints.filter((c) => ["Submitted", "Under Review"].includes(c.status)).length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Citizen Grievance & Incident Reports Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, verify, assign, and resolve citizen field reports regarding localized flooding, slope failure, and road blockages.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Logged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-amber-600">Under Review</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{underReviewCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-blue-600">In Progress</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{inProgressCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-600">Resolved</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search complaint ID, location, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadData()}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <span className="font-semibold">Issue:</span>
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Issues</option>
              <option value="Flooding">Flooding</option>
              <option value="Landslide">Landslide</option>
              <option value="Erosion">Erosion</option>
              <option value="Unsafe House">Unsafe House</option>
              <option value="Blocked Road">Blocked Road</option>
              <option value="Damaged Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 pl-5">Complaint ID</th>
                <th className="p-3.5">Issue Type</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Submitted By</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No complaints matching the selected filters.
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-bold text-emerald-800">
                      {c.complaint_code}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{c.issue_type}</td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate" title={c.location_text}>
                      {c.location_text}
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <div className="font-semibold">{c.contact_name}</div>
                      <div className="text-[10px] text-slate-400">{c.contact_phone}</div>
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          c.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : c.status === "In Progress"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : c.status === "Rejected"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDrawer(c)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                      >
                        Open / Edit
                      </button>
                      {c.status !== "Resolved" && (
                        <button
                          onClick={() => handleResolveQuick(c)}
                          className="px-2 py-1 text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & STATUS MANAGEMENT MODAL / DRAWER */}
      {activeComplaint && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
                  {activeComplaint.complaint_code}
                </span>
                <span className="text-lg font-black text-slate-900">
                  {activeComplaint.issue_type} Incident
                </span>
              </div>
              <button
                onClick={() => setActiveComplaint(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Location */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-400">Location</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">
                  {activeComplaint.location_text}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Description</div>
                <p className="text-xs text-slate-700 leading-relaxed mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {activeComplaint.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Citizen Reporter</div>
                  <div className="font-bold text-slate-800 mt-0.5">{activeComplaint.contact_name}</div>
                  <div className="text-slate-500">{activeComplaint.contact_phone}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Logged Timestamp</div>
                  <div className="font-semibold text-slate-700 mt-0.5">
                    {new Date(activeComplaint.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Management Actions: Change Status, Assign, Add Note */}
            <div className="pt-3 border-t border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Authority Actions & Dispatch
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Update Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Assign Response Officer / Unit
                  </label>
                  <input
                    type="text"
                    value={editAssigned}
                    onChange={(e) => setEditAssigned(e.target.value)}
                    placeholder="e.g. Geotechnical Unit A, PWD Sector 4"
                    className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Official Administrative Notes
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record action taken, inspection findings, drone survey results..."
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveComplaint}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Status & Notes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
