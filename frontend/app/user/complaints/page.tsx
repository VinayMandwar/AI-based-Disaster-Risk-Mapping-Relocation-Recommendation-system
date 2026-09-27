"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquareWarning,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Send,
  MapPin,
  Phone,
  User,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchComplaints, submitCitizenComplaint } from "@/lib/api";
import { ComplaintItem } from "@/types";
import { RAW_DEMO_HABITATIONS } from "@/lib/demoData";

const ISSUE_TYPES = [
  "Flooding",
  "Landslide",
  "Erosion",
  "Unsafe House",
  "Blocked Road",
  "Damaged Infrastructure",
  "Other",
];

export default function UserComplaintsPage() {
  const { user, selectedHabitationId } = useAuth();
  const activeHab =
    RAW_DEMO_HABITATIONS.find((h) => h.id === selectedHabitationId) || RAW_DEMO_HABITATIONS[0];

  const [activeTab, setActiveTab] = useState<"new" | "list">("new");

  // Form inputs
  const [issueType, setIssueType] = useState("Flooding");
  const [locationText, setLocationText] = useState(
    `Ward 2, Near Primary Health Center, ${activeHab.village}`
  );
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [contactName, setContactName] = useState(user?.full_name || "Ramesh Kumar");
  const [contactPhone, setContactPhone] = useState(user?.mobile || "+91 98765 43210");

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<ComplaintItem | null>(null);
  const [complaintsList, setComplaintsList] = useState<ComplaintItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const loadComplaints = async () => {
    setLoadingList(true);
    try {
      const res = await fetchComplaints({ habitation_id: activeHab.id });
      setComplaintsList(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [activeHab.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !contactName.trim() || !contactPhone.trim()) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        issue_type: issueType,
        habitation_id: activeHab.id,
        location_text: locationText,
        description: description,
        photo_url: photoUrl.trim() || undefined,
        contact_name: contactName,
        contact_phone: contactPhone,
      };
      const res = await submitCitizenComplaint(payload);
      setSubmittedComplaint(res);
      setDescription("");
      loadComplaints();
    } catch (err) {
      alert("Error submitting report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wide">
            <Link href="/user-dashboard" className="flex items-center space-x-1 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span>•</span>
            <span>Citizen Grievance Redressal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Report an Issue / Citizen Complaints
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit hazard observations, ground damage reports, or infrastructure failure directly to district responders.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-xl bg-slate-200 p-1 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "new" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Submit New Report
          </button>
          <button
            onClick={() => {
              setActiveTab("list");
              loadComplaints();
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Track Reports ({complaintsList.length})
          </button>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL CARD */}
      {submittedComplaint && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-emerald-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-base font-black">Report Successfully Registered</h3>
              <p className="text-xs text-emerald-700">
                Your incident report has been dispatched to the District Hazard Response Cell.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-emerald-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Complaint ID</span>
              <div className="font-mono font-extrabold text-sm text-slate-900 mt-0.5">
                {submittedComplaint.complaint_code}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
              <div className="mt-0.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-100 text-blue-800">
                  {submittedComplaint.status}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Submission Date</span>
              <div className="font-semibold text-slate-700 mt-0.5">
                {new Date(submittedComplaint.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setSubmittedComplaint(null)}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setActiveTab("list");
              }}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              View My Tracked Reports
            </button>
          </div>
        </div>
      )}

      {/* NEW REPORT FORM */}
      {activeTab === "new" && !submittedComplaint && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Issue Type *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Habitation / Village Sector
              </label>
              <input
                type="text"
                disabled
                value={`${activeHab.name} (${activeHab.district}, ${activeHab.state})`}
                className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Precise Location Details *
            </label>
            <div className="mt-1 relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="e.g. Near Old Culvert, Upper Ridge Ward 3"
                className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Description of Hazard / Incident *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the severity, damage observed, risk to families, or blocked access..."
              className="mt-1 block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Optional Photo Evidence URL
            </label>
            <div className="mt-1 relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Paste public photo URL (optional)"
                className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Your Full Name *
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Contact Phone / Mobile *
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Link
              href="/user-dashboard"
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Incident Report"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TRACKING LIST VIEW */}
      {activeTab === "list" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Submitted Hazard Reports ({complaintsList.length})</span>
            <span className="text-[11px] font-mono text-slate-500">Auto-Refreshed</span>
          </div>

          {complaintsList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No reports filed yet for this settlement.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {complaintsList.map((c) => (
                <div key={c.id} className="p-5 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {c.complaint_code}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{c.issue_type}</span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        c.status === "Resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : c.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{c.description}</p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{c.location_text}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </span>
                    {c.assigned_to && (
                      <span className="text-slate-600 font-medium">
                        Assigned: <strong>{c.assigned_to}</strong>
                      </span>
                    )}
                  </div>

                  {c.admin_notes && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 mt-2">
                      <strong className="text-slate-800">Authority Note:</strong> {c.admin_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
