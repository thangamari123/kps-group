'use client';

import React from 'react';

/**
 * Custom Logistics Outline Icons matching the reference design
 * - Stroke: currentColor or color prop
 * - StrokeWidth: 1.8 - 2.0
 * - Scalable, sharp vector line art
 */

// 01 — Containerized Cargo: Shipping container suspended by crane hook
export function ContainerizedCargoIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top Crane Hook */}
      <path d="M24 7V10" />
      <path d="M21 7C21 5.34 22.34 4 24 4C25.66 4 27 5.34 27 7C27 8.5 25.8 9.7 24.3 9.95" />
      
      {/* Angled Hoist Cables */}
      <line x1="24" y1="10" x2="10" y2="18" strokeWidth="1.8" />
      <line x1="24" y1="10" x2="38" y2="18" strokeWidth="1.8" />

      {/* Main Shipping Container */}
      <rect x="7" y="18" width="34" height="23" rx="1.5" strokeWidth="2.2" />
      
      {/* Container Corrugated Ribs */}
      <line x1="13" y1="18" x2="13" y2="41" strokeWidth="1.8" />
      <line x1="19" y1="18" x2="19" y2="41" strokeWidth="1.8" />
      <line x1="25" y1="18" x2="25" y2="41" strokeWidth="1.8" />
      <line x1="31" y1="18" x2="31" y2="41" strokeWidth="1.8" />
      <line x1="37" y1="18" x2="37" y2="41" strokeWidth="1.8" />
    </svg>
  );
}

// 02 — Freight Forwarding: Cargo Ship on Water Waves
export function FreightForwardingIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Ship Hull */}
      <path d="M7 28L10 37H38L41 28H7Z" strokeWidth="2.2" />

      {/* Bridge / Wheelhouse on left */}
      <rect x="11" y="20" width="8" height="8" rx="0.5" strokeWidth="1.8" />
      <line x1="13" y1="23" x2="17" y2="23" strokeWidth="1.5" />
      <line x1="15" y1="20" x2="15" y2="16" strokeWidth="1.8" />

      {/* Stacked Containers on deck */}
      <rect x="22" y="22" width="7" height="6" rx="0.5" strokeWidth="1.8" />
      <rect x="31" y="22" width="7" height="6" rx="0.5" strokeWidth="1.8" />
      <rect x="25" y="16" width="7" height="6" rx="0.5" strokeWidth="1.8" />

      {/* Water Waves */}
      <path d="M5 40C8 42 11 40 14 42C17 40 20 42 24 40C28 42 31 40 34 42C37 40 40 42 43 40" strokeWidth="2" />
      <path d="M8 44C11 46 14 44 18 46C22 44 26 46 30 44C34 46 38 44 41 46" strokeWidth="1.6" />
    </svg>
  );
}

// 03 — Project & Maritime: Industrial Quay Crane + Container
export function ProjectMaritimeIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Crane Vertical Tower & Base on Right */}
      <path d="M37 42V15L43 42" strokeWidth="2.2" />
      <line x1="33" y1="42" x2="45" y2="42" strokeWidth="2.2" />
      
      {/* Crane Boom Arm angled left */}
      <path d="M43 15L15 11" strokeWidth="2.2" />
      <line x1="37" y1="15" x2="26" y2="12.5" strokeWidth="1.6" />
      <line x1="37" y1="25" x2="41" y2="25" strokeWidth="1.6" />

      {/* Crane Cable & Hook */}
      <line x1="20" y1="12" x2="20" y2="23" strokeWidth="1.8" />
      <path d="M18 23C18 24.5 20 25.5 20 26C20 25.5 22 24.5 22 23" strokeWidth="1.8" />

      {/* Suspended Container on Left */}
      <rect x="11" y="26" width="18" height="15" rx="1" strokeWidth="2" />
      <line x1="16" y1="26" x2="16" y2="41" strokeWidth="1.6" />
      <line x1="21" y1="26" x2="21" y2="41" strokeWidth="1.6" />
      <line x1="25" y1="26" x2="25" y2="41" strokeWidth="1.6" />
      {/* Slings from hook */}
      <line x1="20" y1="24" x2="13" y2="26" strokeWidth="1.4" />
      <line x1="20" y1="24" x2="27" y2="26" strokeWidth="1.4" />
    </svg>
  );
}

// 04 — Over Dimensional Cargo: Heavy Truck Carrying Oversized Cargo
export function OverDimensionalCargoIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Oversized Container on Trailer */}
      <rect x="5" y="16" width="26" height="17" rx="1.5" strokeWidth="2.2" />
      {/* Ribs */}
      <line x1="10" y1="16" x2="10" y2="33" strokeWidth="1.6" />
      <line x1="15" y1="16" x2="15" y2="33" strokeWidth="1.6" />
      <line x1="20" y1="16" x2="20" y2="33" strokeWidth="1.6" />
      <line x1="25" y1="16" x2="25" y2="33" strokeWidth="1.6" />

      {/* Truck Cab on Right */}
      <path d="M31 23H37L43 28V35H31V23Z" strokeWidth="2" />
      <path d="M37 23V28H42" strokeWidth="1.6" />

      {/* Trailer Chassis */}
      <line x1="4" y1="33" x2="31" y2="33" strokeWidth="2" />

      {/* Wheels */}
      <circle cx="9" cy="37" r="3" strokeWidth="2" />
      <circle cx="17" cy="37" r="3" strokeWidth="2" />
      <circle cx="25" cy="37" r="3" strokeWidth="2" />
      <circle cx="38" cy="37" r="3" strokeWidth="2" />

      {/* Road line */}
      <line x1="2" y1="41" x2="46" y2="41" strokeWidth="1.6" />
    </svg>
  );
}

// 05 — Customs Brokerage: Customs Officer with Peaked Cap & Official Document
export function CustomsBrokerageIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Officer Head */}
      <circle cx="22" cy="18" r="5" strokeWidth="2" />
      
      {/* Peaked Cap */}
      <path d="M16 15C16 12 18.5 10 22 10C25.5 10 28 12 28 15H16Z" strokeWidth="2" />
      <path d="M15 15H29" strokeWidth="2.2" />
      {/* Cap Emblem */}
      <circle cx="22" cy="12.5" r="1" fill={color} />

      {/* Officer Uniform / Torso */}
      <path d="M13 36C13 28 16.5 25 22 25C27.5 25 31 28 31 36" strokeWidth="2" />
      <path d="M19 25L22 29L25 25" strokeWidth="1.6" />
      <line x1="22" y1="29" x2="22" y2="36" strokeWidth="1.6" />

      {/* Document / Clipboard in Foreground */}
      <rect x="7" y="27" width="13" height="15" rx="1.5" strokeWidth="2" fill="white" />
      <line x1="10" y1="31" x2="17" y2="31" strokeWidth="1.6" />
      <line x1="10" y1="35" x2="16" y2="35" strokeWidth="1.6" />
      <line x1="10" y1="39" x2="14" y2="39" strokeWidth="1.6" />
    </svg>
  );
}

// 06 — Industrial Warehousing: Industrial Warehouse with Palletized Cargo Boxes
export function IndustrialWarehousingIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Gable Warehouse Building */}
      <path d="M6 21L24 10L42 21V41H6V21Z" strokeWidth="2.2" />
      <path d="M6 21L24 10L42 21" strokeWidth="2.2" />

      {/* Main Entrance / Shutter Bay */}
      <path d="M16 41V27H32V41" strokeWidth="2" />
      
      {/* Cargo Boxes inside / in front */}
      <rect x="10" y="33" width="7" height="7" rx="0.5" strokeWidth="1.8" fill="white" />
      <line x1="10" y1="36.5" x2="17" y2="36.5" strokeWidth="1.2" />
      <line x1="13.5" y1="33" x2="13.5" y2="40" strokeWidth="1.2" />

      <rect x="15" y="26" width="6" height="6" rx="0.5" strokeWidth="1.6" fill="white" />
    </svg>
  );
}

// 07 — FTWZ Solutions Hub: Warehouse / Logistics Storage Facility with Multiple Boxes
export function FTWZSolutionsHubIcon({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Storage Facility Gable Structure */}
      <path d="M6 21L24 10L42 21V41H6V21Z" strokeWidth="2.2" />
      
      {/* Interior Racking / Division Line */}
      <line x1="24" y1="10" x2="24" y2="24" strokeWidth="1.8" />

      {/* Stack of Multiple Cargo Boxes inside Facility */}
      <rect x="11" y="32" width="8" height="8" rx="0.5" strokeWidth="1.8" fill="white" />
      <line x1="11" y1="36" x2="19" y2="36" strokeWidth="1.2" />
      <line x1="15" y1="32" x2="15" y2="40" strokeWidth="1.2" />

      <rect x="21" y="32" width="8" height="8" rx="0.5" strokeWidth="1.8" fill="white" />
      <line x1="21" y1="36" x2="29" y2="36" strokeWidth="1.2" />
      <line x1="25" y1="32" x2="25" y2="40" strokeWidth="1.2" />

      <rect x="16" y="24" width="8" height="7.5" rx="0.5" strokeWidth="1.8" fill="white" />
      <line x1="16" y1="28" x2="24" y2="28" strokeWidth="1.2" />
      <line x1="20" y1="24" x2="20" y2="31.5" strokeWidth="1.2" />
    </svg>
  );
}
