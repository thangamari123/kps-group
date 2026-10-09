export interface JobPosition {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  experience?: string;
  salary?: string;
  description: string;
  responsibilities: string[] | string;
  requirements: string[] | string;
  benefits: string[] | string;
  deadline?: string;
  status: 'published' | 'draft' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export const defaultJobs: JobPosition[] = [
  {
    id: 'job-seed-001',
    title: 'Customs Documentation Executive',
    slug: 'customs-documentation-executive',
    department: 'Customs Brokerage',
    location: 'Chennai Head Office (Parrys)',
    employment_type: 'Full-time',
    experience: '2 - 5 Years',
    salary: '₹35,000 - ₹50,000 / month',
    description:
      'We are seeking an experienced Customs Documentation Executive to handle Bill of Entry & Shipping Bill clearance filings via ICEGATE, liaison with customs authorities at Chennai Port, and verify tariff HS codes for multinational cargo.',
    responsibilities: [
      'Prepare and file online Bills of Entry and Shipping Bills on ICEGATE portal.',
      'Classify imported goods in compliance with Indian Customs Tariff and HTS nomenclature.',
      'Coordinate with customs appraisers, examiners, and port CFS officials for smooth inspection.',
      'Resolve queries, bonding/ex-bonding procedures, and duty assessment documentation.',
    ],
    requirements: [
      "Bachelor's degree in Logistics, Commerce, or related discipline.",
      'Minimum 2 years direct experience in customs house agency (CHA) operations.',
      'Proficiency in ICEGATE, e-Sanchit, and customs documentation software.',
      'Solid understanding of DGFT policies, FTAs, and customs exemptions.',
    ],
    benefits: [
      'Competitive performance incentives and annual increments.',
      'Comprehensive health insurance coverage for family.',
      'Professional certification assistance (Rule 6 Customs Exam support).',
      'Supportive work culture and healthy work-life integration.',
    ],
    deadline: '2026-10-31',
    status: 'published',
  },
  {
    id: 'job-seed-002',
    title: 'Freight Forwarding Operations Specialist',
    slug: 'freight-forwarding-operations-specialist',
    department: 'Ocean & Air Freight',
    location: 'Chennai Port Operations',
    employment_type: 'Full-time',
    experience: '3 - 6 Years',
    salary: 'Competitive / Commensurate with experience',
    description:
      'Coordinate international sea and air freight movements, booking container slots with major ocean carriers, monitoring vessel schedules, and managing end-to-end multimodal transport chains.',
    responsibilities: [
      'Negotiate freight rates with ocean carriers and airlines for FCL/LCL shipments.',
      'Manage vessel bookings, MBL/HBL preparation, and tracking manifests.',
      'Coordinate with overseas agents and consignees for door-to-door delivery.',
      'Maintain real-time operational status dashboards and resolve transit bottlenecks.',
    ],
    requirements: [
      'Proven track record in international freight forwarding operations.',
      'Strong relationship with shipping lines calling Chennai, Ennore, and Kattupalli ports.',
      'Excellent verbal and written communication skills.',
      'Ability to work proactively in fast-paced logistics environments.',
    ],
    benefits: [
      'Attractive variable bonus and quarterly performance rewards.',
      'Corporate health benefits and executive travel allowance.',
      'Rapid leadership career progression opportunities.',
    ],
    deadline: '2026-11-15',
    status: 'published',
  },
];
