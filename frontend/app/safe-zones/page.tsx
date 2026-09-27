"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSafeZones } from "@/lib/api";
import { SafeZoneListResponse, SafeZoneItem } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import {
  ShieldCheck,
  MapPin,
  Users,
  Mountain,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  Navigation,
} from "lucide-react";

export default function SafeZonesPage() {
  const [data, setData] = useState<SafeZoneListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    fetchSafeZones()
      .then(setData)
      .catch((err) => console.error("Failed to load safe zones:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = (data?.items || []).filter((sz) => {
    if (selectedDistrict && sz.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        sz.name.toLowerCase().includes(q) ||
        sz.code.toLowerCase().includes(q) ||
        sz.district.toLowerCase().includes(q) ||
        sz.state.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Safe Zones & Evacuation Shelters Directory
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Module 4
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Registered geo-secure relief hubs, elevation profiles, and real-time available shelter capacity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/relocation"
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>Match With Habitations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Capacity KPI summary */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Safe Hubs</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{data.total_safe_zones}</div>
            <p className="text-xs text-slate-400 mt-0.5">Verified non-hazard locations</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Shelter Capacity</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {data.total_max_capacity.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Total beds/spaces available</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Occupancy</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {data.total_current_occupancy.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Currently sheltered citizens</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-sm">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Surplus Available Capacity</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {data.total_available_capacity.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-600 mt-0.5">Ready for immediate intake</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search safe zones by name, code, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Districts</option>
            <option value="Chamoli">Chamoli (Uttarakhand)</option>
            <option value="Tehri Garhwal">Tehri Garhwal (Uttarakhand)</option>
            <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
            <option value="Baramulla">Baramulla (Jammu & Kashmir)</option>
          </select>
        </div>
      </div>

      {/* Safe Zones Table */}
      <Card>
        <CardHeader
          title={`Safe Zone Infrastructure Registry (${filteredItems.length})`}
          subtitle="Geo-referenced relief centers, verified elevation, and structural shelter status"
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Loading safe zones...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">No safe zones match your filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Safe Zone Name</th>
                    <th className="py-3 px-4">District / State</th>
                    <th className="py-3 px-4">Elevation</th>
                    <th className="py-3 px-4">Max Capacity</th>
                    <th className="py-3 px-4">Current Occupancy</th>
                    <th className="py-3 px-4">Available Intake</th>
                    <th className="py-3 px-4">Occupancy Rate</th>
                    <th className="py-3 px-4">Operational Status</th>
                    <th className="py-3 px-4 text-right">Relocation Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredItems.map((sz) => (
                    <tr key={sz.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        <div>{sz.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{sz.code}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {sz.district}, {sz.state}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">
                        <span className="flex items-center space-x-1">
                          <Mountain className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sz.elevation_meters} m</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sz.max_capacity.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {sz.current_occupancy.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                        {sz.available_capacity.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                            <span>{sz.occupancy_rate}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${sz.occupancy_rate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {sz.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/relocation"
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-900 hover:bg-emerald-700 text-white rounded-md transition-colors shadow-sm inline-flex items-center space-x-1"
                        >
                          <span>Match &rarr;</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
