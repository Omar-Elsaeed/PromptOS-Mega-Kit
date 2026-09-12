import { NicheMeta } from '../types';

export const NICHES_LIST: string[] = [
  "Marketing", "Sales", "Copywriting", "SEO", "Content Strategy", "Social Media", "Email Marketing",
  "Advertising", "Branding", "E-Commerce", "E-Commerce Video", "Startups", "HR & Recruiting", "Finance", "Legal",
  "Education", "Healthcare", "Real Estate", "Consulting", "Executive Coaching", "Product Management",
  "UX Design", "Data Science", "Cybersecurity", "DevOps", "Web Development", "Mobile Apps",
  "AI & Machine Learning", "Cloud Architecture", "Blockchain", "SaaS", "Fintech", "EdTech",
  "HealthTech", "PropTech", "RetailTech", "LegalTech", "InsurTech", "AgriTech", "CleanTech",
  "SpaceTech", "Supply Chain", "Manufacturing", "Logistics", "Operations", "Customer Success",
  "Business Development", "Partnerships", "Growth Hacking", "Community Building", "Event Planning",
  "PR & Communications", "Journalism", "Photography", "Video Production", "Podcast", "Music",
  "Fashion", "Interior Design", "Architecture", "Food & Beverage", "Travel", "Sports",
  "Fitness", "Mental Health", "Nutrition", "Parenting", "Personal Finance", "Investing",
  "Crypto", "NFTs", "Gaming", "Esports", "Automotive", "Construction", "Energy", "Mining",
  "Agriculture", "Non-Profit", "Government", "Politics", "Philosophy", "Research", "Academia",
  "Writing", "Screenwriting", "Novel Writing", "Poetry", "Translation", "Voice Acting",
  "Animation", "Graphic Design", "Motion Graphics", "UI Design", "Brand Design", "Typography",
  "Illustration", "3D Modeling", "Virtual Reality", "Augmented Reality", "IoT", "Robotics",
  "Biotechnology", "Pharmaceuticals", "Medical Devices", "Telemedicine", "Mental Wellness",
  "Pet Care", "Elderly Care", "Childcare", "Social Work", "Environmental Science", "Sustainability",
  "Renewable Energy", "Waste Management", "Urban Planning", "Transportation", "Aerospace",
  "Defense", "Maritime", "Railway", "Telecommunications", "Broadcasting", "Publishing",
  "Libraries", "Museums", "Art Galleries", "Theater", "Dance", "Comedy", "Magic",
  "Astrology", "Spirituality", "Yoga", "Meditation", "Self-Help", "Life Coaching",
  "Dropshipping", "Print-on-Demand", "Amazon FBA", "TikTok Shop", "Shopify",
  "UX Research", "Motion Design", "VR/AR Development", "Game Design",
  "Newsletter Publishing", "Documentary Filmmaking", "Street Photography", "Wedding Photography", "Food Photography", "Drone Photography",
  "NFTs & Web3", "DeFi", "Crypto Trading", "Blockchain Development", "Tokenomics",
  "Wealth Management", "Estate Planning", "Tax Strategy", "Private Equity",
  "Procurement", "Quality Assurance", "Six Sigma",
  "Environmental Consulting", "Sustainability Reporting", "Carbon Credits",
  "Solar Energy", "Wind Energy", "K-12 Education", "Higher Education",
  "Curriculum Design", "Corporate L&D", "Speech Therapy", "Physical Therapy",
  "Nutrition Science", "Biotech", "Pharmaceutical Marketing", "Clinical Research", "MedTech",
  "Interior Architecture", "Landscape Design", "Civil Engineering",
  "Platform Engineering", "Data Engineering"
];

export const NICHE_DETAILS: Record<string, { emoji: string; color: string; roles: string[]; topics: string[] }> = {
  "Marketing": {
    emoji: "📢",
    color: "#3b82f6",
    roles: ["CMO", "Brand Strategist", "Demand Gen Manager", "Performance Marketer", "Growth Hacker", "Marketing Analytics Lead", "Product Marketing Manager", "Lifecycle Marketing Lead"],
    topics: ["Brand Positioning", "Demand Generation", "Go-to-Market", "Content Calendar", "Customer Persona", "ABM Program", "Marketing Attribution", "Campaign Messaging", "Funnel Optimization"]
  },
  "Sales": {
    emoji: "💼",
    color: "#06b6d4",
    roles: ["VP of Sales", "Account Executive", "SDR Lead", "Sales Engineer", "Revenue Operations Lead", "Enterprise Sales Director", "Sales Enablement Director"],
    topics: ["Pipeline Management", "Quota Setting", "Cold Outreach", "Discovery Call", "Objection Handling", "Enterprise Closing", "Sales Cadence", "Negotiation Strategy"]
  },
  "Copywriting": {
    emoji: "✍️",
    color: "#f59e0b",
    roles: ["Chief Copywriter", "Brand Voice Lead", "Direct Response Writer", "Conversion Copywriter", "UX Writer", "Email Copy Specialist"],
    topics: ["Long-Form Sales Letter", "VSL Script", "Homepage Hero", "Email Drip", "Headline Formula", "Landing Page", "Call-to-Action Blueprint"]
  },
  "SEO": {
    emoji: "🔍",
    color: "#10b981",
    roles: ["SEO Director", "Technical SEO Lead", "Link Building Lead", "Content SEO Strategist", "Local SEO Expert", "Core Web Vitals Specialist"],
    topics: ["Technical Audit", "Keyword Clustering", "Link Building Protocol", "E-E-A-T Authority", "Schema Markup", "Topic Authority Map", "Search Intent Optimization"]
  },
  "Healthcare": {
    emoji: "🏥",
    color: "#ef4444",
    roles: ["Chief Medical Officer", "Clinical Director", "Hospitalist Physician", "Nurse Practitioner", "Healthcare Quality Lead", "Clinical Informatics Lead", "HIPAA Compliance Officer", "Telemedicine Director"],
    topics: ["Clinical Documentation Scribe", "Patient Triage Protocol", "Post-Discharge Care Plan", "Revenue Cycle Optimization", "Prior Authorization Workflow", "HIPAA Compliance Audit", "Population Health Strategy", "Chronic Disease Pathway"]
  },
  "AI & Machine Learning": {
    emoji: "🤖",
    color: "#8b5cf6",
    roles: ["Chief AI Officer", "ML Platform Lead", "AI Research Director", "Prompt Engineering Architect", "MLOps Lead", "Foundation Model Engineer", "Agent Orchestrator"],
    topics: ["LLM Fine-tuning", "RAG Pipeline Architecture", "Multi-Agent System", "Prompt Engineering Evaluation", "LangGraph State Machine", "Model Registry & Benchmarking", "Tool-Calling Agent Design"]
  },
  "SaaS": {
    emoji: "⚡",
    color: "#2563eb",
    roles: ["SaaS Founder", "Head of Product", "SaaS Growth Lead", "Customer Success VP", "Product-Led Growth Specialist", "Pricing Architect"],
    topics: ["Self-Serve Onboarding", "Churn Reduction Playbook", "Usage-Based Pricing", "Feature Gating Strategy", "NRR Optimization", "Trial-to-Paid Conversion", "Expansion Revenue Engine"]
  },
  "Fintech": {
    emoji: "💳",
    color: "#10b981",
    roles: ["Fintech CEO", "Financial Products Lead", "Payments Architect", "Compliance Director", "Risk & Fraud Officer", "Open Banking Specialist"],
    topics: ["Payment Flow Architecture", "KYC & AML Automation", "Lending Algorithm Model", "Embedded Finance Integration", "PCI-DSS Compliance", "Financial Data API"]
  },
  "DevOps": {
    emoji: "🔄",
    color: "#06b6d4",
    roles: ["VP of Engineering", "Site Reliability Lead", "Platform Engineer", "Cloud Infrastructure Lead", "CI/CD Pipeline Architect", "Kubernetes Specialist"],
    topics: ["CI/CD Pipeline Design", "Infrastructure as Code", "Kubernetes Deployment", "Incident Runbook & SRE", "Observability Stack", "Zero-Downtime Rollout", "GitOps Workflow"]
  },
  "Product Management": {
    emoji: "💡",
    color: "#ec4899",
    roles: ["Chief Product Officer", "Senior PM", "Technical PM", "Growth PM", "Product Operations Lead", "Data Product Manager"],
    topics: ["Product Roadmap (Now-Next-Later)", "PRD Specification", "RICE Feature Prioritization", "User Story Mapping", "North Star Metric Architecture", "Sprint Planning & OKRs"]
  },
  "E-Commerce": {
    emoji: "🛒",
    color: "#f97316",
    roles: ["E-Commerce Director", "Conversion Rate Lead", "Merchandising Director", "Marketplace Strategist", "Retention Specialist"],
    topics: ["Product Detail Page", "Checkout Optimization", "Post-Purchase Email Sequence", "Subscription Box Model", "Cart Abandonment Recovery", "LTV Maximization"]
  },
  "Startups": {
    emoji: "🚀",
    color: "#6366f1",
    roles: ["Startup Founder & CEO", "Founding Engineer", "VP of Growth", "Fundraising Strategist", "Chief of Staff"],
    topics: ["MVP Specification", "Investor Pitch Deck Narrative", "Product-Market Fit Engine", "Fundraising Strategy (Seed/Series A)", "Unit Economics Calculator", "Go-to-Market Launch"]
  },
  "Consulting": {
    emoji: "♟️",
    color: "#14b8a6",
    roles: ["Managing Partner", "Strategy Consultant", "Management Consultant", "Transformation Lead", "Operations Advisor"],
    topics: ["Consulting Proposal", "Client Discovery Framework", "Target Operating Model", "Transformation Roadmap", "Executive Board Presentation", "ROI Case Study"]
  },
  "Real Estate": {
    emoji: "🏠",
    color: "#0284c7",
    roles: ["Real Estate Broker", "Commercial Investment Lead", "Property Development Manager", "Luxury Real Estate Specialist"],
    topics: ["Property Listing Copy", "Investment Yield Analysis", "Cap Rate Calculator", "Neighborhood Market Report", "Buyer Presentation Deck", "Client Nurture Drip"]
  },
  "Data Science": {
    emoji: "📊",
    color: "#9333ea",
    roles: ["Chief Data Officer", "Lead Data Scientist", "Data Engineer", "BI Architect", "Analytics Engineer"],
    topics: ["Predictive Modeling Pipeline", "A/B Test Statistical Framework", "Executive Dashboard Design", "Data Quality & Governance", "Feature Engineering System", "Data Storytelling Brief"]
  },
  "Cybersecurity": {
    emoji: "🛡️",
    color: "#dc2626",
    roles: ["CISO", "Threat Intelligence Lead", "Security Architect", "SOC Manager", "Penetration Tester"],
    topics: ["Zero-Trust Architecture", "Incident Response Playbook", "Vulnerability Management", "Cloud Security Audit", "Threat Modeling", "SOC 2 & ISO Compliance"]
  },
  "Content Strategy": {
    emoji: "📰",
    color: "#8b5cf6",
    roles: ["Chief Content Officer", "Editorial Director", "Content Operations Lead", "Audience Development Director"],
    topics: ["Editorial Calendar", "Thought Leadership System", "Content Repurposing Engine", "Pillar-Cluster Architecture", "Content-to-Revenue Model"]
  },
  "Social Media": {
    emoji: "📱",
    color: "#d946ef",
    roles: ["Head of Social Media", "Viral Content Strategist", "Community Manager", "Influencer Director"],
    topics: ["Viral Hook Framework", "Cross-Platform Calendar", "Short-Form Video Scripting", "Community Engagement Playbook", "Social Listening & Response"]
  },
  "Email Marketing": {
    emoji: "📧",
    color: "#f59e0b",
    roles: ["Email Marketing Director", "Deliverability Specialist", "Lifecycle Email Architect", "Newsletter Editor"],
    topics: ["Welcome Onboarding Sequence", "Abandoned Cart Flow", "Re-Engagement Drip", "Newsletter Monetization Blueprint", "List Segmentation Strategy"]
  },
  "Finance": {
    emoji: "📈",
    color: "#16a34a",
    roles: ["CFO", "FP&A Director", "Corporate Finance Lead", "Treasury Lead", "M&A Analyst"],
    topics: ["Financial Model & Forecasting", "Cash Flow Waterfall", "Budget vs Actuals Analysis", "Valuation Analysis (DCF/LBO)", "Board Financial Presentation"]
  },
  "Legal": {
    emoji: "⚖️",
    color: "#475569",
    roles: ["General Counsel", "Corporate Counsel", "IP Law Specialist", "Compliance Lead", "Contracts Director"],
    topics: ["SaaS Master Services Agreement", "Privacy Policy & GDPR", "Terms of Service", "IP Licensing Framework", "Non-Disclosure Agreement (NDA)"]
  },
  "Education": {
    emoji: "🎓",
    color: "#eab308",
    roles: ["Curriculum Director", "Instructional Designer", "Learning Experience Lead", "EdTech Specialist"],
    topics: ["Curriculum Architecture", "Differentiated Learning Plan", "Formative Assessment Rubric", "Flipped Classroom Lesson Plan", "Student Engagement Framework"]
  },
  "Cloud Architecture": {
    emoji: "☁️",
    color: "#38bdf8",
    roles: ["Chief Cloud Architect", "AWS Solutions Architect", "Azure Enterprise Lead", "GCP Solutions Lead", "FinOps Director"],
    topics: ["Multi-Cloud Architecture", "Serverless System Design", "Disaster Recovery & High Availability", "Cloud Migration Strategy", "FinOps Cost Optimization"]
  },
  "Blockchain": {
    emoji: "⛓️",
    color: "#f59e0b",
    roles: ["Blockchain Protocol Architect", "Smart Contract Lead", "DeFi Strategist", "Tokenomics Designer", "Web3 Product Manager"],
    topics: ["Smart Contract Architecture", "Tokenomics Incentive Model", "DeFi Protocol Blueprint", "DAO Governance Framework", "Layer 2 Scaling Roadmap"]
  },
  "HR & Recruiting": {
    emoji: "👥",
    color: "#0d9488",
    roles: ["CHRO", "Talent Acquisition Director", "People Operations Lead", "Employee Experience Manager", "Total Rewards Lead"],
    topics: ["Structured Interview Scorecard", "90-Day Onboarding Program", "Performance Management & 360", "Compensation & Equity Benchmarking", "Talent Pipeline Strategy"]
  }
};

export function getNicheMeta(nicheName: string): NicheMeta {
  const detail = NICHE_DETAILS[nicheName];
  if (detail) {
    return {
      name: nicheName,
      emoji: detail.emoji,
      color: detail.color,
      roles: detail.roles,
      topics: detail.topics
    };
  }

  // Fallback metadata generator
  const emojis = ["🎯", "⚡", "🔍", "📊", "🚀", "💡", "🏆", "🎭", "🔗", "✨", "📐", "🛠️", "💼", "📋", "🌐", "💎", "🌟", "🛡️"];
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#ef4444", "#14b8a6", "#6366f1"];
  const charCode = nicheName.charCodeAt(0) + nicheName.charCodeAt(nicheName.length - 1);
  const emoji = emojis[charCode % emojis.length];
  const color = colors[charCode % colors.length];

  return {
    name: nicheName,
    emoji,
    color,
    roles: [
      `Senior ${nicheName} Specialist`,
      `Head of ${nicheName}`,
      `${nicheName} Strategist`,
      `Principal ${nicheName} Consultant`,
      `${nicheName} Operations Director`
    ],
    topics: [
      `${nicheName} Strategic Architecture`,
      `${nicheName} Execution Blueprint`,
      `${nicheName} Growth Plan`,
      `${nicheName} Performance Optimization`,
      `${nicheName} Best Practice Framework`
    ]
  };
}
