"use client";

import { useEffect, useRef } from "react";
import { Ticket } from "@/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SEVERITY_COLORS: Record<string, string> = {
  Low:      "#22c55e",
  Medium:   "#f59e0b",
  High:     "#f97316",
  Critical: "#ef4444",
};

interface Props {
  tickets: Ticket[];
}

export default function TicketMapClient({ tickets }: Props) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = document.getElementById("ticket-map");
    if (!container) return;
    
    // Check if map already initialized
    if (mapRef.current) return;
    if (container.dataset.leafletInit) return;
    container.dataset.leafletInit = "true";

    const map = L.map("ticket-map").setView([28.6139, 77.209], 12);
    mapRef.current = map;

    // Try to get user's actual location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Verify the map hasn't been unmounted before the callback fires
          if (!mapRef.current) return;
          
          mapRef.current.flyTo([position.coords.latitude, position.coords.longitude], 13, {
            animate: true,
            duration: 1.5,
          });
        },
        (error) => console.log("Geolocation error:", error)
      );
    }

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    tickets.forEach((ticket) => {
      if (!ticket.isValidIssue) return;
      const color = SEVERITY_COLORS[ticket.severity] || "#888";

      const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 6px ${color}88;"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker([ticket.latitude, ticket.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <strong>${ticket.category}</strong><br/>
          Severity: ${ticket.severity}<br/>
          ${ticket.description.slice(0, 80)}...
        `);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      container.removeAttribute("data-leaflet-init");
    };
  }, [tickets]);

  return (
    <div
      id="ticket-map"
      className="w-full h-[480px] rounded-xl overflow-hidden border border-border z-0 relative"
    />
  );
}
