"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  MapPin,
  Shield,
  Hospital,
  AlertOctagon,
  Navigation,
  Compass,
  Maximize2,
  Waves,
  Mountain,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MapContainerProps {
  className?: string;
  selectedHabitationId?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({ className, selectedHabitationId }) => {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupsRef = useRef<{ [key: string]: any }>({});
  const [mapReady, setMapReady] = useState(false);

  // Layer visibility toggles
  const [layers, setLayers] = useState({
    habitations: true,
    redZones: true,
    floodRisk: true,
    landslideRisk: true,
    erosionRisk: true,
    safeZones: true,
    facilities: true,
  });

  const [activeRegion, setActiveRegion] = useState("all");

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize Leaflet map centered over North/Central India
      const map = L.map(mapContainerRef.current, {
        center: [28.2, 79.5],
        zoom: 6,
        scrollWheelZoom: true,
      });

      mapInstanceRef.current = map;

      // Add OpenStreetMap raster tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Aashray GIS',
        maxZoom: 18,
      }).addTo(map);

      // Create LayerGroups
      const lgHabitations = L.layerGroup().addTo(map);
      const lgRedZones = L.layerGroup().addTo(map);
      const lgFlood = L.layerGroup().addTo(map);
      const lgLandslide = L.layerGroup().addTo(map);
      const lgErosion = L.layerGroup().addTo(map);
      const lgSafeZones = L.layerGroup().addTo(map);
      const lgFacilities = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        habitations: lgHabitations,
        redZones: lgRedZones,
        floodRisk: lgFlood,
        landslideRisk: lgLandslide,
        erosionRisk: lgErosion,
        safeZones: lgSafeZones,
        facilities: lgFacilities,
      };

      // Custom SVG icon generator
      const createPinIcon = (color: string, iconType: string = "dot") => {
        return L.divIcon({
          className: "custom-gis-pin",
          html: `
            <div style="
              width: 26px;
              height: 26px;
              background-color: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 11px;
            ">
              ${iconType === "shield" ? "🛡" : iconType === "cross" ? "🏥" : "●"}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -14],
        });
      };

      // Demo Habitations spatial data
      const habitationsData = [
        {
          id: "HAB-UK-CHM-01",
          name: "Nandi Gram Tola",
          code: "HAB-UK-CHM-01",
          district: "Chamoli",
          state: "Uttarakhand",
          coords: [30.4125, 79.3241],
          riskLevel: "CRITICAL",
          riskScore: 91.5,
          population: 480,
          primaryHazard: "Landslide & Riverine Slope Erosion",
          vulnerableCount: 227,
          capacityStatus: "OVER_CAPACITY",
          relocationPriority: "IMMEDIATE",
        },
        {
          id: "HAB-UK-TEH-02",
          name: "Devprayag Ridge Basti",
          code: "HAB-UK-TEH-02",
          district: "Tehri Garhwal",
          state: "Uttarakhand",
          coords: [30.1458, 78.5989],
          riskLevel: "HIGH",
          riskScore: 79.2,
          population: 620,
          primaryHazard: "Landslide & Scarp Erosion",
          vulnerableCount: 269,
          capacityStatus: "STRESSED",
          relocationPriority: "HIGH",
        },
        {
          id: "HAB-UP-VAR-03",
          name: "Varuna River Bank Pura",
          code: "HAB-UP-VAR-03",
          district: "Varanasi",
          state: "Uttar Pradesh",
          coords: [25.337, 82.978],
          riskLevel: "CRITICAL",
          riskScore: 85.8,
          population: 1250,
          primaryHazard: "Riverine Flood & Severe Bank Erosion",
          vulnerableCount: 552,
          capacityStatus: "OVER_CAPACITY",
          relocationPriority: "IMMEDIATE",
        },
        {
          id: "HAB-GA-NG-04",
          name: "Mandovi Estuary Ward 4",
          code: "HAB-GA-NG-04",
          district: "North Goa",
          state: "Goa",
          coords: [15.502, 73.856],
          riskLevel: "MODERATE",
          riskScore: 67.4,
          population: 780,
          primaryHazard: "Coastal Surge & Tidal Erosion",
          vulnerableCount: 318,
          capacityStatus: "NORMAL",
          relocationPriority: "LOW",
        },
        {
          id: "HAB-JK-BAR-05",
          name: "Baramulla Slope Mohalla",
          code: "HAB-JK-BAR-05",
          district: "Baramulla",
          state: "Jammu and Kashmir",
          coords: [34.2012, 74.3436],
          riskLevel: "CRITICAL",
          riskScore: 88.0,
          population: 540,
          primaryHazard: "Landslide & Geological Slope Degradation",
          vulnerableCount: 229,
          capacityStatus: "OVER_CAPACITY",
          relocationPriority: "IMMEDIATE",
        },
        {
          id: "HAB-TN-TNJ-06",
          name: "Kaveri Delta Thottam",
          code: "HAB-TN-TNJ-06",
          district: "Thanjavur",
          state: "Tamil Nadu",
          coords: [10.8812, 79.1034],
          riskLevel: "SAFE_LOW",
          riskScore: 48.2,
          population: 890,
          primaryHazard: "Seasonal Canals Drainage Congestion",
          vulnerableCount: 375,
          capacityStatus: "NORMAL",
          relocationPriority: "NOT_REQUIRED",
        },
      ];

      // Add Habitation Markers
      habitationsData.forEach((hab) => {
        const pinColor =
          hab.riskLevel === "CRITICAL"
            ? "#ef4444"
            : hab.riskLevel === "HIGH"
            ? "#f97316"
            : hab.riskLevel === "MODERATE"
            ? "#f59e0b"
            : "#10b981";

        const marker = L.marker(hab.coords as [number, number], {
          icon: createPinIcon(pinColor, "dot"),
        });

        // Interactive Rich Popup
        const popupContent = document.createElement("div");
        popupContent.className = "gis-popup-card";
        popupContent.innerHTML = `
          <div style="font-family: system-ui, sans-serif; min-width: 220px; font-size: 12px; color: #1e293b;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px; color: #0f172a;">${hab.name}</span>
              <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${
                hab.riskLevel === "CRITICAL" ? "#fee2e2; color: #991b1b;" : "#ffedd5; color: #9a3412;"
              }">${hab.riskLevel}</span>
            </div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
              📍 ${hab.district}, ${hab.state}
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Risk Score:</strong> <span style="font-weight: 800; color: #0f172a;">${hab.riskScore}/100</span>
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Primary Hazard:</strong> <span style="color: #0d9488;">${hab.primaryHazard}</span>
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Population at Risk:</strong> ${hab.population.toLocaleString()} (${hab.vulnerableCount} high-vulnerability)
            </div>
            <div style="margin-bottom: 6px;">
              <strong>Relocation Priority:</strong> <span style="font-weight: 700; color: ${
                hab.relocationPriority === "IMMEDIATE" ? "#b91c1c" : "#0f766e"
              }">${hab.relocationPriority}</span>
            </div>
            <button id="view-btn-${hab.id}" style="
              width: 100%;
              background: #0f172a;
              color: white;
              border: none;
              padding: 6px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
              margin-top: 4px;
              text-align: center;
            ">
              View Full Assessment →
            </button>
          </div>
        `;

        // Wire button to router
        popupContent.querySelector(`#view-btn-${hab.id}`)?.addEventListener("click", () => {
          router.push(`/habitations/${hab.id}`);
        });

        marker.bindPopup(popupContent);
        lgHabitations.addLayer(marker);
      });

      // Safe Zones
      const safeZonesData = [
        {
          name: "Chamoli Plateau Relief Hub",
          district: "Chamoli",
          coords: [30.435, 79.362],
          capacity: 1200,
          current: 150,
          elevation: "1,640m",
          safetyScore: 94,
        },
        {
          name: "Tehri Bypass Multipurpose Center",
          district: "Tehri Garhwal",
          coords: [30.162, 78.625],
          capacity: 900,
          current: 80,
          elevation: "820m",
          safetyScore: 88,
        },
        {
          name: "Varanasi North Elevated Shelter Ground",
          district: "Varanasi",
          coords: [25.362, 83.004],
          capacity: 2500,
          current: 320,
          elevation: "88m",
          safetyScore: 91,
        },
        {
          name: "Baramulla District Sports Complex Shelter",
          district: "Baramulla",
          coords: [34.218, 74.368],
          capacity: 1000,
          current: 110,
          elevation: "1,590m",
          safetyScore: 89,
        },
      ];

      safeZonesData.forEach((sz) => {
        const marker = L.marker(sz.coords as [number, number], {
          icon: createPinIcon("#059669", "shield"),
        });
        marker.bindPopup(`
          <div style="font-family: system-ui; font-size: 12px; color: #1e293b; min-width: 200px;">
            <div style="font-weight: bold; font-size: 13px; color: #047857; margin-bottom: 4px;">
              🛡️ ${sz.name}
            </div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
              Verified Safe Haven • ${sz.district}
            </div>
            <div><strong>Safety Index:</strong> ${sz.safetyScore}/100</div>
            <div><strong>Total Capacity:</strong> ${sz.capacity} spaces</div>
            <div><strong>Available Intake:</strong> ${sz.capacity - sz.current} beds</div>
            <div><strong>Elevation:</strong> ${sz.elevation} (Non-Flood / Stable)</div>
          </div>
        `);
        lgSafeZones.addLayer(marker);
      });

      // Emergency Facilities
      const facilitiesData = [
        { name: "District Hospital Chamoli", coords: [30.428, 79.341], type: "HOSPITAL" },
        { name: "Varanasi Civil Hospital Emergency Annex", coords: [25.345, 82.99], type: "HOSPITAL" },
        { name: "Baramulla Sub-Divisional Fire Station", coords: [34.209, 74.352], type: "FIRE_STATION" },
      ];

      facilitiesData.forEach((ef) => {
        const marker = L.marker(ef.coords as [number, number], {
          icon: createPinIcon("#2563eb", "cross"),
        });
        marker.bindPopup(`
          <div style="font-family: system-ui; font-size: 12px; color: #1e293b;">
            <strong style="color: #1d4ed8;">🏥 ${ef.name}</strong>
            <div style="color: #64748b; font-size: 11px;">Operational Emergency Medical / Rescue Node</div>
          </div>
        `);
        lgFacilities.addLayer(marker);
      });

      // Polygons for Red Zones & Hazard Vectors
      // 1. Chamoli Red Zone & Landslide Scarp
      const chamoliPolygon = L.polygon(
        [
          [30.41, 79.32],
          [30.416, 79.329],
          [30.415, 79.335],
          [30.408, 79.328],
        ],
        { color: "#dc2626", fillColor: "#ef4444", fillOpacity: 0.35, weight: 2, dashArray: "5, 5" }
      ).bindPopup("<strong>🔴 Chamoli Red Zone</strong><br/>Active debris fracture and scarp toe erosion.");
      lgRedZones.addLayer(chamoliPolygon);

      // 2. Varuna River Flood Inundation & Bank Erosion Polygon
      const varunaPolygon = L.polygon(
        [
          [25.332, 82.972],
          [25.341, 82.982],
          [25.339, 82.989],
          [25.33, 82.979],
        ],
        { color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.3, weight: 2 }
      ).bindPopup("<strong>🌊 Varuna Riverine Flood & Bank Cutting Zone</strong><br/>Perennial bank scour vulnerability.");
      lgFlood.addLayer(varunaPolygon);

      // 3. Slope Erosion Buffer (Baramulla)
      const baramullaErosionPolygon = L.polygon(
        [
          [34.198, 74.339],
          [34.205, 74.348],
          [34.202, 74.354],
          [34.195, 74.345],
        ],
        { color: "#d97706", fillColor: "#f59e0b", fillOpacity: 0.25, weight: 2 }
      ).bindPopup("<strong>⚠️ Baramulla Gully Erosion Corridor</strong><br/>Rapid snowmelt sediment run-off.");
      lgErosion.addLayer(baramullaErosionPolygon);

      setMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [router]);

  // Handle Layer Toggles
  const handleToggle = (layerKey: keyof typeof layers) => {
    const updated = !layers[layerKey];
    setLayers((prev) => ({ ...prev, [layerKey]: updated }));

    const lg = layerGroupsRef.current[layerKey];
    if (lg && mapInstanceRef.current) {
      if (updated) {
        mapInstanceRef.current.addLayer(lg);
      } else {
        mapInstanceRef.current.removeLayer(lg);
      }
    }
  };

  // Region Jump Handlers
  const handleRegionJump = (region: string) => {
    setActiveRegion(region);
    if (!mapInstanceRef.current) return;

    if (region === "chamoli") {
      mapInstanceRef.current.setView([30.42, 79.34], 13);
    } else if (region === "varanasi") {
      mapInstanceRef.current.setView([25.34, 82.99], 13);
    } else if (region === "baramulla") {
      mapInstanceRef.current.setView([34.21, 74.35], 13);
    } else {
      mapInstanceRef.current.setView([28.2, 79.5], 6);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-[520px] bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-md flex flex-col justify-between",
        className
      )}
    >
      {/* Top Map Control Bar */}
      <div className="z-[1000] p-2.5 px-4 flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 text-white text-xs">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-wide uppercase text-slate-200">
            Aashray Interactive Spatial Risk Engine
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
            Live Leaflet GIS
          </span>
        </div>

        {/* Region Shortcuts */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 font-medium px-1">Jump to:</span>
          {[
            { id: "all", label: "All India" },
            { id: "chamoli", label: "Chamoli (UK)" },
            { id: "varanasi", label: "Varanasi (UP)" },
            { id: "baramulla", label: "Baramulla (J&K)" },
          ].map((reg) => (
            <button
              key={reg.id}
              onClick={() => handleRegionJump(reg.id)}
              className={cn(
                "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
                activeRegion === reg.id
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-300 hover:bg-slate-800"
              )}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map Target DOM */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Bottom Layer Control Bar */}
      <div className="z-[1000] p-2.5 px-4 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-200">Layers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleToggle("habitations")}
            className={cn(
              "px-2.5 py-1 rounded border text-[11px] font-medium transition-colors flex items-center space-x-1.5",
              layers.habitations
                ? "bg-slate-800 text-white border-slate-600"
                : "bg-slate-900 text-slate-500 border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Habitations</span>
          </button>

          <button
            onClick={() => handleToggle("redZones")}
            className={cn(
              "px-2.5 py-1 rounded border text-[11px] font-medium transition-colors flex items-center space-x-1.5",
              layers.redZones
                ? "bg-rose-950/80 text-rose-300 border-rose-800"
                : "bg-slate-900 text-slate-500 border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Red Zones</span>
          </button>

          <button
            onClick={() => handleToggle("floodRisk")}
            className={cn(
              "px-2.5 py-1 rounded border text-[11px] font-medium transition-colors flex items-center space-x-1.5",
              layers.floodRisk
                ? "bg-blue-950/80 text-blue-300 border-blue-800"
                : "bg-slate-900 text-slate-500 border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Flood</span>
          </button>

          <button
            onClick={() => handleToggle("erosionRisk")}
            className={cn(
              "px-2.5 py-1 rounded border text-[11px] font-medium transition-colors flex items-center space-x-1.5",
              layers.erosionRisk
                ? "bg-amber-950/80 text-amber-300 border-amber-800"
                : "bg-slate-900 text-slate-500 border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Erosion</span>
          </button>

          <button
            onClick={() => handleToggle("safeZones")}
            className={cn(
              "px-2.5 py-1 rounded border text-[11px] font-medium transition-colors flex items-center space-x-1.5",
              layers.safeZones
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                : "bg-slate-900 text-slate-500 border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Safe Zones</span>
          </button>

          <button
            onClick={() => handleToggle("facilities")}
            className={cn(
              "px-2.5 py-1 rounded border text-[11px] font-medium transition-colors flex items-center space-x-1.5",
              layers.facilities
                ? "bg-sky-950/80 text-sky-300 border-sky-800"
                : "bg-slate-900 text-slate-500 border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Facilities</span>
          </button>
        </div>
      </div>
    </div>
  );
};
