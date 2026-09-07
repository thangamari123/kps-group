export const industriesData = {
  "automotive-logistics": {
    slug: "automotive-logistics",
    title: "Automotive Logistics",
    eyebrow: "AUTOMOTIVE SUPPLY CHAINS",
    heroH1: "Specialized Automotive Logistics & Finished Vehicle Transportation",
    shortDesc: "Reliable transportation and supply chain support for automotive operations.",
    fullDesc: "K.P.S & Co delivers end-to-end automotive logistics across major automotive manufacturing clusters in India. From finished vehicle transport to CKD/SKD import clearance and assembly line feeding, we ensure zero line-stoppage operations.",
    bullets: [
      "Vehicle transportation",
      "Inbound & outbound logistics",
      "Time-critical deliveries",
      "Supply chain coordination"
    ],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    challenges: [
      {
        title: "Assembly Line Stoppage Risk",
        desc: "Automotive assembly lines require synchronous parts delivery; a single delayed shipment can halt multi-million-dollar production shifts."
      },
      {
        title: "Damage-Free Vehicle Transit",
        desc: "High-value finished passenger cars and commercial vehicles demand specialized enclosed carrier trailers and strict lashings."
      },
      {
        title: "Customs Duty Optimization",
        desc: "Complex tariff classifications for CKD, SKD, and auto electronics under concessional duty schemes (EPCG/MOOWR)."
      }
    ],
    kpsSolution: "We deploy dedicated 24/7 port clearance teams at Chennai, Ennore, and Tuticorin ports, integrated with GPS-tracked vehicle fleets and buffer FTWZ warehousing to guarantee on-time plant deliveries.",
    servicesUsed: [
      { name: "Customs Brokerage (CHA R-50)", path: "/services/customs-brokerage" },
      { name: "Specialized Auto Transportation", path: "/services/transportation" },
      { name: "FTWZ Duty Deferment Hubs", path: "/services/ftwz" },
      { name: "Multimodal Freight Forwarding", path: "/services/freight-forwarding" }
    ],
    process: [
      { step: "01", title: "Port Pre-Clearance", desc: "Prior-arrival ICEGATE digital filing and Bill of Entry pre-processing." },
      { step: "02", title: "Dockside De-stuffing", desc: "Supervised container discharge and specialized ramp handling." },
      { step: "03", title: "Dedicated Transit", desc: "GPS-monitored carrier fleet directly routed to factory docks." },
      { step: "04", title: "Proof of Delivery", desc: "Digital OOC handover, electronic POD, and ERP integration." }
    ],
    faqs: [
      {
        q: "Do you handle RoRo (Roll-on/Roll-off) vehicle shipments?",
        a: "Yes, KPS manages port stevedoring, Mafi trailers, and dockside lashing for RoRo vehicle export and import movements across Indian ports."
      },
      {
        q: "How do you ensure zero production downtime for auto plants?",
        a: "Through direct in-house CHA license R-50, 24/7 port operational desks, and buffer bonded warehouse inventory management inside notified FTWZ hubs."
      }
    ]
  },

  "automotive-parts-logistics": {
    slug: "automotive-parts-logistics",
    title: "Automotive Parts Logistics",
    eyebrow: "TIER-1 & SPARE PARTS SUPPLY CHAINS",
    heroH1: "Just-In-Time (JIT) Auto Parts & Tier-1 Component Logistics",
    shortDesc: "JIT delivery, warehousing and distribution solutions for automotive components.",
    fullDesc: "Specialized logistics infrastructure for Tier-1 and Tier-2 automotive component manufacturers, precision engine parts, gearboxes, electronics, and aftermarket spare parts distribution networks.",
    bullets: [
      "Spare parts transportation",
      "Just-in-time (JIT) delivery",
      "Warehousing & distribution",
      "Component movement"
    ],
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
    challenges: [
      {
        title: "Fluctuating JIT Delivery Windows",
        desc: "Demanding 2-hour delivery windows required by auto OEMs to support lean manufacturing schedules."
      },
      {
        title: "High SKU Complexity",
        desc: "Thousands of distinct component part numbers requiring precise serial tracking, barcoding, and protective crating."
      },
      {
        title: "Emergency Line-Side Rush",
        desc: "Immediate air freight clearance and express road transit for unexpected stockouts."
      }
    ],
    kpsSolution: "KPS operates strategically located warehouse hubs near key auto corridors (Oragadam, Sriperumbudur, Hosur, Bengaluru) offering sequenced kitting, cross-docking, and scheduled milk-run deliveries.",
    servicesUsed: [
      { name: "Bonded & Covered Warehousing", path: "/services/warehousing" },
      { name: "Containerized Freight (FCL/LCL)", path: "/services/containerized-cargo" },
      { name: "Express Road Haulage", path: "/services/transportation" },
      { name: "FTWZ Duty Deferment", path: "/services/ftwz" }
    ],
    process: [
      { step: "01", title: "LCL/FCL Inbound Ingestion", desc: "Swift port collection and consolidated container deconsolidation." },
      { step: "02", title: "SKU Sequencing & Kitting", desc: "Barcode scanning, sorting, and sequencing by OEM assembly order." },
      { step: "03", title: "JIT Milk-Run Dispatch", desc: "Scheduled factory dock deliveries matching assembly shifts." },
      { step: "04", title: "Reverse Packaging Logistics", desc: "Return management of reusable returnable crates and pallets." }
    ],
    faqs: [
      {
        q: "Can KPS manage customs duty deferment for imported spare parts?",
        a: "Yes, using our Free Trade Warehousing Zone (FTWZ) solutions, imported auto parts can be stored indefinitely duty-free until demanded on the assembly line."
      }
    ]
  },

  "fmcg-logistics": {
    slug: "fmcg-logistics",
    title: "FMCG Logistics",
    eyebrow: "FAST-MOVING CONSUMER GOODS",
    heroH1: "High-Velocity FMCG Transportation & Agile Distribution",
    shortDesc: "Fast and efficient transportation and distribution for time-sensitive FMCG shipments.",
    fullDesc: "Engineered for consumer packaged goods, food & beverage, personal care, and retail brands requiring rapid port clearances, climate-controlled warehousing, and reliable national distribution networks.",
    bullets: [
      "FMCG transportation",
      "Distribution & last-mile delivery",
      "Inventory movement",
      "Time-sensitive shipments"
    ],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    challenges: [
      {
        title: "Perishability & Expiry Management",
        desc: "Strict FIFO/FEFO inventory turnover requirements to prevent shelf-life expiration."
      },
      {
        title: "Demand Spikes & Seasonal Surges",
        desc: "Rapid scalability needed during festival sales, e-commerce promotions, and seasonal demand peaks."
      },
      {
        title: "FSSAI & Regulatory Approvals",
        desc: "Ensuring zero port delays for imported food ingredients and consumer formulations requiring laboratory NOCs."
      }
    ],
    kpsSolution: "Our dedicated statutory clearance officers expedite FSSAI and port clearances, backed by high-throughput dry and temperature-monitored storage facilities with pan-India distribution.",
    servicesUsed: [
      { name: "Customs Brokerage & FSSAI NOC", path: "/services/customs-brokerage" },
      { name: "Reefer & Containerized Cargo", path: "/services/containerized-cargo" },
      { name: "Regional Warehousing Hubs", path: "/services/warehousing" },
      { name: "Multimodal Freight Forwarding", path: "/services/freight-forwarding" }
    ],
    process: [
      { step: "01", title: "Regulatory Pre-filing", desc: "Immediate document submission for FSSAI/PGA statutory lab clearance." },
      { step: "02", title: "Temperature Monitored Discharge", desc: "Rapid reefer plugging and cold-chain dock transit." },
      { step: "03", title: "Consolidation Hub", desc: "Cross-docking and regional SKU split in central warehouse hubs." },
      { step: "04", title: "Express Dispatch", desc: "Direct distribution to regional retail fulfillment and wholesale centers." }
    ],
    faqs: [
      {
        q: "Do you handle FSSAI statutory clearances at customs?",
        a: "Yes, our in-house customs brokerage team handles food safety sampling, laboratory testing coordination, and NOC procurement directly."
      }
    ]
  },

  "manufacturing-industrial-logistics": {
    slug: "manufacturing-industrial-logistics",
    title: "Manufacturing & Industrial Logistics",
    eyebrow: "INDUSTRIAL & PLANT ENGINEERING",
    heroH1: "Industrial Equipment, Raw Materials & Heavy Plant Logistics",
    shortDesc: "Specialized logistics for industrial equipment, raw materials and heavy cargo.",
    fullDesc: "Tailored supply chain management for heavy engineering, capital machinery, steel fabrication, industrial chemicals, raw material imports, and turnkey factory-to-site installations across India.",
    bullets: [
      "Industrial equipment transportation",
      "Raw material movement",
      "Factory-to-site logistics",
      "Heavy & specialized cargo"
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    challenges: [
      {
        title: "Heavy & Oversized Dimensions",
        desc: "Transformers, boilers, kilns, and structural equipment requiring specialized multi-axle trailers."
      },
      {
        title: "Project Import Scheme Customs",
        desc: "Managing complex Project Import Scheme registrations (Section 98.01) to maximize customs duty benefits."
      },
      {
        title: "Rough Terrain Site Logistics",
        desc: "Delivery to remote industrial construction zones with undeveloped access roads."
      }
    ],
    kpsSolution: "KPS combines 40+ years of heavy transport engineering, in-house hydraulic modular fleets, route bridge calculations, and project customs exemption filing.",
    servicesUsed: [
      { name: "Over Dimensional Cargo (ODC)", path: "/services/odc" },
      { name: "Project Cargo & Heavy Lift", path: "/services/project-logistics" },
      { name: "Customs Brokerage (Project Imports)", path: "/services/customs-brokerage" },
      { name: "Industrial Open Yard Storage", path: "/services/warehousing" }
    ],
    process: [
      { step: "01", title: "Engineering Assessment", desc: "Lifting plan, center of gravity calculation, and route feasibility." },
      { step: "02", title: "Project Import Clearance", desc: "Reconciliation and concessional duty assessment under Indian customs." },
      { step: "03", title: "Heavy Transport Fleet", desc: "Hydraulic multi-axle trailers with escort vehicles." },
      { step: "04", title: "Foundation Placement", desc: "Crane offloading and placement directly onto foundation pads." }
    ],
    faqs: [
      {
        q: "Can KPS handle plant relocation or machinery imports under Project Imports?",
        a: "Yes, we specialize in Project Import Scheme (PIS) clearances, concessional bond executions, and subsequent site deliveries."
      }
    ]
  },

  "healthcare-logistics": {
    slug: "healthcare-logistics",
    title: "Healthcare Logistics",
    eyebrow: "PHARMACEUTICALS & MEDICAL DEVICES",
    heroH1: "Temperature-Controlled Healthcare & Medical Device Logistics",
    shortDesc: "Secure and time-critical logistics solutions for healthcare and pharmaceutical requirements.",
    fullDesc: "High-compliance, temperature-controlled logistics for diagnostic equipment, surgical systems, active pharmaceutical ingredients (API), healthcare consumables, and clinical cold chains.",
    bullets: [
      "Medical equipment transportation",
      "Pharmaceutical logistics",
      "Temperature-sensitive shipments",
      "Secure & time-critical delivery"
    ],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    challenges: [
      {
        title: "Drug Controller (CDSCO) Approvals",
        desc: "Strict statutory validation and testing NOCs required from Indian health authorities."
      },
      {
        title: "Unbroken Cold Chain Integrity",
        desc: "Active temperature monitoring (+2°C to +8°C, -20°C, and cryogenic) throughout transit."
      },
      {
        title: "High-Value Fragile Diagnostics",
        desc: "Sensitive MRI, CT scanner, and surgical robotics requiring shock-dampening transportation."
      }
    ],
    kpsSolution: "We provide prioritized airport tarmac clearances, CDSCO statutory processing, active temperature datalogging, and air-suspension transit vehicles for sensitive medical systems.",
    servicesUsed: [
      { name: "Expedited Air Freight Clearance", path: "/services/customs-brokerage" },
      { name: "Air Freight Forwarding", path: "/services/freight-forwarding" },
      { name: "Climate-Controlled Warehousing", path: "/services/warehousing" },
      { name: "Specialized Air-Suspension Transit", path: "/services/transportation" }
    ],
    process: [
      { step: "01", title: "CDSCO Regulatory Filing", desc: "Pre-arrival submission of drug licenses and medical device import permits." },
      { step: "02", title: "Green-Channel Release", desc: "Priority cargo clearance with minimal tarmac dwell time." },
      { step: "03", title: "Active Temperature Transit", desc: "Calibrated refrigerated vehicle transit with real-time temperature telemetry." },
      { step: "04", title: "Hospital/Lab Handover", desc: "White-glove delivery directly to medical facility receiving bays." }
    ],
    faqs: [
      {
        q: "Do you handle customs clearance for imported medical diagnostic equipment?",
        a: "Yes, we handle duty exemptions, CDSCO permits, AERB approvals for radiology units, and white-glove site delivery."
      }
    ]
  },

  "project-cargo-logistics": {
    slug: "project-cargo-logistics",
    title: "Project Cargo Logistics",
    eyebrow: "HEAVY LIFT & SPECIALIZED MARITIME",
    heroH1: "Turnkey Project Cargo, Heavy-Lift & Break Bulk Freight Logistics",
    shortDesc: "Planned transportation solutions for oversized, heavy and specialized project cargo.",
    fullDesc: "Complete engineering and execution for ultra-heavy, oversized, break bulk, RoRo, and out-of-gauge (OOG) infrastructure cargo across global sea lanes and inland Indian corridors.",
    bullets: [
      "Oversized & heavy cargo",
      "Machinery transportation",
      "Multimodal transportation",
      "Project-based logistics planning"
    ],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
    challenges: [
      {
        title: "Extreme Weight & Dimension Constraints",
        desc: "Single-piece cargo exceeding hundreds of metric tons requiring multi-axle modular transport."
      },
      {
        title: "Vessel Chartering & Port Stevedoring",
        desc: "Coordinating heavy-lift vessel gears, crane tandems, and specialized port berth access."
      },
      {
        title: "Highway Clearance & Civil Works",
        desc: "Bypass construction, overhead power line lifting, and bridge reinforcement along transport corridors."
      }
    ],
    kpsSolution: "End-to-end project command: marine survey, vessel chartering, specialized stevedoring, hydraulic trailer fleet, highway civil clearances, and foundation placement.",
    servicesUsed: [
      { name: "Project Logistics & Stevedoring", path: "/services/project-logistics" },
      { name: "Over Dimensional Cargo (ODC)", path: "/services/odc" },
      { name: "Break Bulk & RoRo Maritime", path: "/services/project-logistics" },
      { name: "Customs Brokerage & Port Desks", path: "/services/customs-brokerage" }
    ],
    process: [
      { step: "01", title: "Feasibility & Marine Survey", desc: "Port capability audit, route survey, and lifting engineering design." },
      { step: "02", title: "Vessel Charter & Discharging", desc: "Break bulk chartering, gear inspection, and tandem crane lifting." },
      { step: "03", title: "Hydraulic Multi-Axle Haulage", desc: "Multi-axle deployment with civil escorts and police clearances." },
      { step: "04", title: "Site Foundation Offloading", desc: "Jacking, skidding, and final equipment positioning on site." }
    ],
    faqs: [
      {
        q: "What is the maximum weight KPS can transport for project cargo?",
        a: "Using modular hydraulic multi-axle trailers, KPS has successfully transported individual units exceeding 500+ metric tons."
      }
    ]
  }
};
