import { AutoTemplate, AgentBlueprintPreset } from '../types';

export const AUTO_TEMPLATES: AutoTemplate[] = [
  {
    id: 'hc-scribe',
    icon: '📋',
    color: '#10b981',
    title: 'AI Clinical Scribe & EHR Auto-Fill',
    desc: 'Patient consultation audio recorded → AI transcribes → structured SOAP note generated → validation against clinical guidelines → pushed to EHR via FHIR API → clinician sign-off.',
    goal: 'When a patient visit ends, transcribe the recorded consultation audio, generate a structured SOAP note (Subjective, Objective, Assessment, Plan), validate against documentation standards, push the draft note to the EHR system via FHIR API, and notify the physician in Slack for one-click review and signature.',
    platform: 'n8n',
    trigger: 'webhook',
    complexity: 'advanced',
    apps: 'EHR (Epic/Cerner), Claude/Gemini API, Slack, Google Drive',
    tags: ['clinical', 'healthcare', 'EHR', 'HIPAA', 'AI scribe', 'documentation']
  },
  {
    id: 'hc-triage',
    icon: '🚨',
    color: '#ef4444',
    title: 'Patient Intake, Urgency Triage & Scheduling',
    desc: 'Patient submits symptom intake form → AI triages urgency (Critical/Urgent/Routine) → pages on-call physician for critical → auto-schedules routine in calendar → sends prep instructions.',
    goal: 'When a patient submits a symptom intake form, use AI to assess urgency score, page the on-call physician via Twilio SMS for critical cases, auto-schedule routine appointments in Google Calendar, send confirmation emails with prep instructions, and log all interaction details in Salesforce Health Cloud.',
    platform: 'n8n',
    trigger: 'webhook',
    complexity: 'medium',
    apps: 'Typeform, Claude/Gemini API, Google Calendar, Twilio, Gmail, Health Cloud',
    tags: ['triage', 'healthcare', 'scheduling', 'patient intake', 'automation']
  },
  {
    id: 'hc-revenue',
    icon: '💰',
    color: '#f59e0b',
    title: 'Revenue Cycle & Claims Denial Management',
    desc: 'Claim generated → validate insurance eligibility → check prior authorization → submit to payer → monitor daily for denial → AI auto-drafts appeal letter → weekly leakage report.',
    goal: 'When a claim is generated after a patient visit, validate insurance eligibility, check prior authorization status, submit to payer, perform daily denial monitoring, use AI to generate tailored appeal letters for denied claims with clinical evidence, and deliver a weekly revenue leakage report to billing leadership.',
    platform: 'n8n',
    trigger: 'schedule',
    complexity: 'advanced',
    apps: 'Practice Management System, Eligibility API, Claude/Gemini API, Notion, Slack',
    tags: ['revenue cycle', 'healthcare', 'billing', 'claims', 'RCM']
  },
  {
    id: 'hc-care-coord',
    icon: '🤝',
    color: '#3b82f6',
    title: 'Post-Discharge & Readmission Prevention Agent',
    desc: 'Patient discharged → automated check-ins at 48h/7d/30d → AI analyzes survey responses for readmission risk → alerts care team for high-risk patients → auto-schedules follow-up.',
    goal: 'When a patient discharge event occurs in the EHR ADT feed, enroll the patient into a follow-up survey sequence (48h, 7d, 30d). AI analyzes responses for pain levels and medication compliance, flags high-risk patients immediately in Slack, auto-schedules urgent telehealth check-ins, and logs outcomes.',
    platform: 'n8n',
    trigger: 'webhook',
    complexity: 'medium',
    apps: 'EHR ADT feed, Claude/Gemini API, Twilio, Google Calendar, Slack',
    tags: ['readmission', 'healthcare', 'care coordination', 'patient outreach']
  },
  {
    id: 'hc-population',
    icon: '📊',
    color: '#8b5cf6',
    title: 'Population Health Outreach & Care Gaps',
    desc: 'Monthly query for overdue screenings and unmanaged chronic conditions → segment population → AI personalizes outreach → send via SMS/email → schedule visits.',
    goal: 'Monthly: query the EHR for patients with identified care gaps (overdue mammograms, A1c checks, colonoscopies), segment by risk score, use AI to draft personalized empathetic messages, send via preferred channels, track engagement, and book appointments automatically.',
    platform: 'n8n',
    trigger: 'schedule',
    complexity: 'advanced',
    apps: 'EHR Query API, Claude/Gemini API, Twilio, Mailchimp, Patient Portal',
    tags: ['population health', 'healthcare', 'chronic disease', 'preventive care']
  },
  {
    id: 'hc-compliance',
    icon: '🔒',
    color: '#475569',
    title: 'HIPAA Compliance Audit & PHI Monitoring',
    desc: 'Daily audit of EHR access logs → AI detects anomalous PHI access patterns (after-hours, bulk downloads) → alerts compliance officer → generates audit trail.',
    goal: 'Run a daily automated audit of all EHR access logs, use AI to detect anomalous patterns (after-hours access, bulk exports, unauthorized VIP access), alert the compliance officer in Slack, generate an immutable audit trail report, and assign remediation tasks.',
    platform: 'n8n',
    trigger: 'schedule',
    complexity: 'advanced',
    apps: 'EHR Audit API, Claude/Gemini API, Slack, Notion, Google Sheets',
    tags: ['HIPAA', 'healthcare', 'compliance', 'PHI', 'security']
  },
  {
    id: 'saas-lead-nurture',
    icon: '📧',
    color: '#18181b',
    title: 'AI Lead Nurture Sequence',
    desc: 'New form submission → enrich with Clearbit → score lead with AI → add to CRM → send personalized email → notify Slack',
    goal: 'When a new lead submits my Typeform, enrich their data with Clearbit, use AI to score and categorize the lead, add them to Notion CRM, send a personalized welcome email via Gmail, and post a summary to Slack #sales channel.',
    platform: 'n8n',
    trigger: 'webhook',
    complexity: 'medium',
    apps: 'Typeform, Clearbit, Notion, Gmail, Slack, Claude API',
    tags: ['n8n', 'AI', 'CRM', 'Email']
  },
  {
    id: 'bi-daily-report',
    icon: '📊',
    color: '#06b6d4',
    title: 'Daily Business Intelligence Report',
    desc: 'Every morning → pull metrics from GA4 + Stripe → AI analysis → generate PDF report → email to team → post summary to Slack',
    goal: 'Every morning at 8am, pull yesterday\'s metrics from Google Analytics 4 and Stripe, use Claude AI to analyze trends and anomalies, generate a formatted business intelligence report, email it to the leadership team, and post a 3-bullet summary to Slack.',
    platform: 'n8n',
    trigger: 'schedule',
    complexity: 'advanced',
    apps: 'Google Analytics, Stripe, Claude API, Gmail, Slack, Google Sheets',
    tags: ['n8n', 'Analytics', 'AI', 'Reporting']
  },
  {
    id: 'ecom-order-proc',
    icon: '🛒',
    color: '#10b981',
    title: 'E-Commerce Order Processing Agent',
    desc: 'New Shopify order → verify inventory → generate invoice → update Airtable → send confirmation → fulfill or alert',
    goal: 'When a new order comes in from Shopify, verify inventory in Airtable, generate a PDF invoice, update the orders database, send an order confirmation email to the customer, and either trigger fulfillment or send an alert if stock is low.',
    platform: 'Zapier',
    trigger: 'api',
    complexity: 'medium',
    apps: 'Shopify, Airtable, Gmail, Stripe, Slack',
    tags: ['Zapier', 'E-Commerce', 'Orders']
  },
  {
    id: 'content-repurpose',
    icon: '🤖',
    color: '#8b5cf6',
    title: 'AI Content Repurposing Pipeline',
    desc: 'New YouTube video → transcribe → AI rewrites into blog post + tweets + LinkedIn post → auto-publish everywhere',
    goal: 'When I upload a new YouTube video, automatically transcribe it using Whisper, then use Claude AI to rewrite the transcript into an SEO blog post, 5 Twitter/X threads, and a LinkedIn article, then publish the blog to WordPress, schedule tweets in Buffer, and draft the LinkedIn post.',
    platform: 'Make',
    trigger: 'file',
    complexity: 'advanced',
    apps: 'YouTube, Whisper API, Claude API, WordPress, Buffer, LinkedIn',
    tags: ['Make.com', 'AI', 'Content', 'Social Media']
  },
  {
    id: 'support-agent',
    icon: '💬',
    color: '#f59e0b',
    title: 'AI Customer Support Agent',
    desc: 'New support email → AI classifies urgency → generates response draft → routes to right team → logs everything',
    goal: 'When a new customer support email arrives in Gmail, use Claude AI to classify urgency and topic, generate a personalized draft response, route to the correct team channel in Slack, create a ticket in Linear, and log everything to a Google Sheet support dashboard.',
    platform: 'n8n',
    trigger: 'email',
    complexity: 'advanced',
    apps: 'Gmail, Claude API, Slack, Linear, Google Sheets',
    tags: ['n8n', 'AI', 'Support', 'Classification']
  },
  {
    id: 'proposal-gen',
    icon: '📝',
    color: '#ef4444',
    title: 'Automated Proposal Generator',
    desc: 'New client inquiry → research their company with AI → generate custom proposal → create PDF → send for signature',
    goal: 'When a new client inquiry form is submitted, use AI to research their company online, generate a personalized proposal using our template, create a professional PDF, send it via DocuSign for e-signature, add the prospect to HubSpot CRM, and notify the sales team in Slack.',
    platform: 'n8n',
    trigger: 'webhook',
    complexity: 'advanced',
    apps: 'Typeform, Claude API, Google Docs, DocuSign, HubSpot, Slack',
    tags: ['n8n', 'AI', 'Sales', 'Proposals']
  },
  {
    id: 'social-monitor',
    icon: '📱',
    color: '#ec4899',
    title: 'Social Media Monitoring Agent',
    desc: 'Monitor brand mentions → AI sentiment analysis → alert on negative → auto-respond positively → log all mentions',
    goal: 'Monitor Twitter, Reddit, and Google Alerts for brand mentions every hour. Use Claude AI to analyze sentiment of each mention. Immediately alert the team in Slack for negative mentions. Auto-draft positive responses for Twitter. Log all mentions with sentiment scores to Airtable for trend analysis.',
    platform: 'Make',
    trigger: 'schedule',
    complexity: 'advanced',
    apps: 'Twitter API, Reddit API, Claude API, Slack, Airtable, Google Alerts',
    tags: ['Make.com', 'AI', 'Social', 'Monitoring']
  },
  {
    id: 'invoice-payment',
    icon: '💰',
    color: '#f97316',
    title: 'Invoice and Payment Automation',
    desc: 'Project completed in Notion → auto-generate invoice → send via Stripe → track payment → update accounting → notify',
    goal: 'When a project is marked complete in Notion, automatically generate a professional invoice using the project data, send it to the client via Stripe, track payment status, update QuickBooks with the transaction when paid, send a receipt to the client, and notify our accountant via email.',
    platform: 'Zapier',
    trigger: 'database',
    complexity: 'medium',
    apps: 'Notion, Stripe, QuickBooks, Gmail, Slack',
    tags: ['Zapier', 'Finance', 'Invoicing']
  },
  {
    id: 'research-briefing',
    icon: '🔍',
    color: '#6366f1',
    title: 'AI Research and Briefing Agent',
    desc: 'Topic input → scrape web sources → AI synthesizes → generates briefing doc → sends to team → archives in Notion',
    goal: 'When a research topic is submitted via a web form, automatically search Google, scrape top 10 articles using Firecrawl, use Claude AI to synthesize findings, generate a structured research briefing document, save it to Notion, email it to the requester, and post a summary to the team Slack channel.',
    platform: 'n8n',
    trigger: 'webhook',
    complexity: 'enterprise',
    apps: 'Google Search API, Firecrawl, Claude API, Notion, Gmail, Slack',
    tags: ['n8n', 'AI', 'Research', 'Knowledge']
  },
  {
    id: 'hr-onboarding',
    icon: '👥',
    color: '#06b6d4',
    title: 'HR Onboarding Automation',
    desc: 'New hire in HRIS → create accounts → send welcome kit → schedule meetings → assign training → track completion',
    goal: 'When a new employee is added to our HR system, automatically create their Google Workspace account, add them to relevant Slack channels, send a personalized welcome email with onboarding checklist, schedule intro meetings with key team members via Google Calendar, assign training courses in our LMS, and create a 90-day plan in Notion.',
    platform: 'Make',
    trigger: 'database',
    complexity: 'enterprise',
    apps: 'BambooHR, Google Workspace, Slack, Gmail, Google Calendar, Notion, LMS',
    tags: ['Make.com', 'HR', 'Onboarding']
  },
  {
    id: 'seo-content-pipe',
    icon: '📈',
    color: '#10b981',
    title: 'SEO Content Pipeline',
    desc: 'Keyword list → AI research → outline generation → full article draft → SEO optimization → publish to CMS',
    goal: 'Take a list of target keywords from a Google Sheet, use Claude AI to research each topic and create a detailed outline, generate a full SEO-optimized article for each keyword, run it through an SEO checker, optimize meta tags and structure, then automatically publish to WordPress with proper categories and tags.',
    platform: 'n8n',
    trigger: 'manual',
    complexity: 'advanced',
    apps: 'Google Sheets, Claude API, WordPress, Semrush API, Slack',
    tags: ['n8n', 'AI', 'SEO', 'Content']
  },
  {
    id: 'multi-product-launch',
    icon: '🏪',
    color: '#8b5cf6',
    title: 'Multi-Platform Product Launch',
    desc: 'Product launch input → generate all assets → publish everywhere → start ad campaigns → track performance',
    goal: 'When a new product launch is triggered, use Claude AI to generate all marketing copy (product descriptions, ads, social posts, email sequence), create social media graphics brief, publish product to Shopify, launch Google and Meta ad campaigns, send launch email to subscriber list, and set up a performance dashboard in Google Data Studio.',
    platform: 'Make',
    trigger: 'manual',
    complexity: 'enterprise',
    apps: 'Claude API, Shopify, Mailchimp, Meta Ads, Google Ads, Google Data Studio, Canva',
    tags: ['Make.com', 'AI', 'Marketing', 'Launch']
  }
];

export const AUTOMATION_TEMPLATES = AUTO_TEMPLATES;

export const AGENT_BLUEPRINT_PRESETS: AgentBlueprintPreset[] = [
  {
    id: 'autonomous-coder',
    name: 'Autonomous Software Engineering Agent',
    role: 'Lead Systems Software Engineer',
    goal: 'Autonomously analyze bug reports, locate source files, generate minimal diffs, execute tests, and commit pull requests.',
    autonomyLevel: 'Full Autonomous',
    maxIterations: 20,
    tools: ['file_reader', 'ast_grep', 'patch_applier', 'bash_test_runner', 'git_cli'],
    completionCriteria: [
      'All automated test suites execute with 0 failures',
      'Git diff contains only modifications relevant to the reported issue',
      'No compiler or linter warnings introduced'
    ],
    retryContract: {
      maxRetries: 3,
      fallbackAction: 'Roll back git working tree to last known clean HEAD and log diagnostic trace',
      escalationThreshold: 'Escalate to human review if tests fail twice after AST refactoring'
    },
    systemPrompt: `You are an Autonomous Software Engineer.
Operate strictly within the workspace boundaries. Before modifying code, inspect existing patterns and run tests to establish baseline validity.
Produce minimal, surgical diffs. Do not add unsolicited libraries or formatting changes.`
  },
  {
    id: 'healthcare-ehr-agent',
    name: 'Clinical EHR Synthesis & Audit Agent',
    role: 'Clinical Informatics Specialist & Medical Auditor',
    goal: 'Transform patient audio consultation transcripts into HL7/FHIR compliant SOAP notes with automated ICD-10 coding and HIPAA de-identification.',
    autonomyLevel: 'Semi-Autonomous (HITL)',
    maxIterations: 10,
    tools: ['audio_transcriber', 'fhir_validator', 'icd10_lookup', 'ehr_rest_api'],
    completionCriteria: [
      'SOAP structure complies with hospital documentation standards',
      'All ICD-10 and CPT codes validated against ontology database',
      'Physician signature checkpoint confirmed via HITL hook'
    ],
    retryContract: {
      maxRetries: 2,
      fallbackAction: 'Tag note as [PENDING_MANUAL_REVIEW] and route to clinical documentation team',
      escalationThreshold: 'Escalate if allergy or contraindication conflict is detected'
    },
    systemPrompt: `You are a Clinical Informatics Specialist.
Process clinical notes with extreme fidelity. Never infer unmentioned diagnostic findings.
Flag all critical drug interactions immediately.`
  },
  {
    id: 'customer-support-agent',
    name: 'Tier-3 Technical Support & Incident Triager',
    role: 'Staff Customer Escalation Engineer',
    goal: 'Diagnose customer technical issues, query telemetry logs, provide verified workarounds, or auto-file Jira bugs.',
    autonomyLevel: 'Semi-Autonomous (HITL)',
    maxIterations: 12,
    tools: ['zendesk_api', 'datadog_query', 'jira_create_issue', 'knowledge_base_search'],
    completionCriteria: [
      'Customer root cause identified and cited with log timestamp',
      'Workaround verified in sandbox environment',
      'Ticket updated with resolution steps and customer sentiment'
    ],
    retryContract: {
      maxRetries: 3,
      fallbackAction: 'Escalate ticket to on-call Tier-3 human engineer with summarized telemetry',
      escalationThreshold: 'Escalate immediately if customer churn risk or SLA breach < 30 mins'
    },
    systemPrompt: `You are a Staff Technical Support Engineer.
Always provide empathetic, precise, and actionable technical resolutions. Check telemetry logs before asking customers for clarification.`
  },
  {
    id: 'financial-analyst-agent',
    name: 'Quantitative Earnings & Equity Research Agent',
    role: 'Senior Wall Street Equity Research Associate',
    goal: 'Ingest SEC 10-K/10-Q filings, parse financial tables, calculate non-GAAP ratios, and produce an investment memo.',
    autonomyLevel: 'Full Autonomous',
    maxIterations: 15,
    tools: ['sec_edgar_crawler', 'excel_financial_modeler', 'chart_generator', 'markdown_exporter'],
    completionCriteria: [
      'Income statement, balance sheet, and cash flow reconciled across 3 fiscal years',
      'Valuation model (DCF and EV/EBITDA multiple) calculated with sensitivity tables',
      'Full investment thesis with 3 key upside drivers and 3 downside risks'
    ],
    retryContract: {
      maxRetries: 2,
      fallbackAction: 'Mark unverified line items with [UNVERIFIED_DATA] caveat and footnote source discrepancy',
      escalationThreshold: 'Escalate if accounting discrepancy exceeds 2% of revenue'
    },
    systemPrompt: `You are a Senior Equity Research Associate.
Maintain rigorous quantitative accuracy. Every number must have a verifiable source footnote from primary SEC filings.`
  },
  {
    id: 'cybersecurity-threat-hunter',
    name: 'Autonomous SOC Threat Hunter & Incident Responder',
    role: 'Principal Security Operations Center (SOC) Analyst',
    goal: 'Analyze SIEM alerts, correlate network telemetry, isolate compromised endpoints, and draft incident response reports.',
    autonomyLevel: 'Semi-Autonomous (HITL)',
    maxIterations: 16,
    tools: ['siem_query', 'virustotal_api', 'edr_isolate_host', 'mitre_att&ck_mapper'],
    completionCriteria: [
      'Attacker IOCs mapped to MITRE ATT&CK framework techniques',
      'Compromised hosts quarantined with verified firewall rules',
      'Formal Post-Mortem and remediation action checklist completed'
    ],
    retryContract: {
      maxRetries: 2,
      fallbackAction: 'Initiate defensive container quarantine and ring on-call CISO pager',
      escalationThreshold: 'Escalate immediately for lateral movement or domain admin compromise'
    },
    systemPrompt: `You are a Principal SOC Analyst.
Move swiftly to contain security incidents while preserving cryptographic chain-of-custody for forensic logs.`
  },
  {
    id: 'recruiting-talent-agent',
    name: 'Senior Technical Talent Sourcing & Screening Agent',
    role: 'Lead Technical Talent Partner',
    goal: 'Source candidates matching job requirements, evaluate GitHub/portfolio artifacts, and craft hyper-personalized outreach.',
    autonomyLevel: 'Full Autonomous',
    maxIterations: 10,
    tools: ['github_analyzer', 'linkedin_scraper', 'ats_greenhouse_api', 'email_composer'],
    completionCriteria: [
      'Candidate technical competence verified against specific repository PRs',
      'Personalized outreach email references authentic technical achievements',
      'Candidate record synced to Greenhouse ATS with score card'
    ],
    retryContract: {
      maxRetries: 3,
      fallbackAction: 'Route candidate profile to human recruiter queue with reason for uncertainty',
      escalationThreshold: 'Escalate if candidate is currently employed at partner enterprise'
    },
    systemPrompt: `You are a Lead Technical Talent Partner.
Craft genuine, non-templated messages that highlight specific engineering accomplishments.`
  },
  {
    id: 'devops-site-reliability',
    name: 'SRE Incident Triager & Auto-Remediation Agent',
    role: 'Staff Site Reliability Engineer (SRE)',
    goal: 'Detect Kubernetes cluster anomalies, scale pods, cycle faulty worker nodes, and update incident status pages.',
    autonomyLevel: 'Semi-Autonomous (HITL)',
    maxIterations: 14,
    tools: ['kubectl', 'prometheus_query', 'pagerduty_api', 'statuspage_updater'],
    completionCriteria: [
      'Cluster p99 latency restored below SLA target (<120ms)',
      'OOMKilled pods diagnosed and memory limits adjusted safely',
      'Statuspage updated with real-time customer impact assessment'
    ],
    retryContract: {
      maxRetries: 3,
      fallbackAction: 'Execute safe canary rollback to prior release tag',
      escalationThreshold: 'Escalate to human SRE lead if pod crashloop persists past 2 restart attempts'
    },
    systemPrompt: `You are a Staff SRE.
Prioritize service availability, data durability, and fast recovery times. Never execute destructive database commands without HITL confirmation.`
  },
  {
    id: 'content-seo-strategist',
    name: 'Autonomous Content & Technical SEO Architect',
    role: 'Director of Organic Growth & SEO',
    goal: 'Audit search intent, discover content gaps, generate comprehensive long-form articles, and optimize internal linking.',
    autonomyLevel: 'Full Autonomous',
    maxIterations: 12,
    tools: ['ahrefs_api', 'serp_scraper', 'schema_generator', 'cms_wordpress_api'],
    completionCriteria: [
      'Article covers all PAA (People Also Ask) questions with original depth',
      'JSON-LD schema markup passes Google Rich Results test',
      'Draft staged in CMS with semantic heading hierarchy and meta tags'
    ],
    retryContract: {
      maxRetries: 2,
      fallbackAction: 'Save article draft as [NEEDS_EDITORIAL_REVIEW] and list unaddressed SERP queries',
      escalationThreshold: 'Escalate if target keyword difficulty > 85'
    },
    systemPrompt: `You are a Director of Organic Growth.
Produce high-value, authoritative content that directly answers search queries with structured tables and zero fluff.`
  },
  {
    id: 'legal-contract-auditor',
    name: 'Enterprise Contract & NDA Risk Analysis Agent',
    role: 'Senior Commercial Contracts Counsel',
    goal: 'Review vendor agreements, redline non-standard indemnification/liability clauses, and enforce compliance guidelines.',
    autonomyLevel: 'Semi-Autonomous (HITL)',
    maxIterations: 10,
    tools: ['pdf_redliner', 'clause_playbook_matcher', 'docx_exporter', 'email_dispatch'],
    completionCriteria: [
      'All unlimited liability and indemnification clauses flagged with counter-proposals',
      'Standard mutual confidentiality terms verified against company legal playbook',
      'Redlined DOCX deliverable generated with tracked comments'
    ],
    retryContract: {
      maxRetries: 2,
      fallbackAction: 'Highlight contentious clauses in red and assign to General Counsel',
      escalationThreshold: 'Escalate if deal value > $250,000 or IP assignment terms are ambiguous'
    },
    systemPrompt: `You are Senior Commercial Contracts Counsel.
Protect enterprise interests with precision. Cross-reference every proposed clause against the corporate standard playbook.`
  },
  {
    id: 'ecommerce-pricing-agent',
    name: 'Dynamic E-Commerce Pricing & Inventory Agent',
    role: 'Head of Pricing & Yield Management',
    goal: 'Monitor competitor pricing, evaluate stock velocity, and dynamically adjust product prices within margins.',
    autonomyLevel: 'Full Autonomous',
    maxIterations: 18,
    tools: ['competitor_price_scraper', 'shopify_graphql_api', 'margin_calculator', 'slack_notifier'],
    completionCriteria: [
      'Price adjustments stay within min/max gross margin guardrails (≥35%)',
      'Inventory turnover velocity optimized without triggering stockouts',
      'Audit log of price revisions published to business intelligence dashboard'
    ],
    retryContract: {
      maxRetries: 3,
      fallbackAction: 'Maintain current price and post alert to #pricing-ops channel',
      escalationThreshold: 'Escalate if competitor drops price below unit manufacturing cost'
    },
    systemPrompt: `You are Head of Pricing.
Maximize revenue and margin balance. Never violate predefined floor pricing limits.`
  },
  {
    id: 'data-pipeline-orchestrator',
    name: 'ETL / ELT Data Quality & Schema Migration Agent',
    role: 'Principal Data Platform Engineer',
    goal: 'Monitor real-time data ingestion pipelines, detect schema drift, isolate malformed rows, and trigger dbt transformations.',
    autonomyLevel: 'Full Autonomous',
    maxIterations: 15,
    tools: ['dbt_runner', 'snowflake_sql_api', 'great_expectations', 'pagerduty'],
    completionCriteria: [
      'All Great Expectations data quality assertions pass (0 anomalies)',
      'Schema alterations backward-compatible with downstream analytics dashboards',
      'Data freshness SLA met (<15 minute lag on bronze tables)'
    ],
    retryContract: {
      maxRetries: 3,
      fallbackAction: 'Reroute corrupt rows to dead-letter queue (DLQ) and process valid records',
      escalationThreshold: 'Escalate if DLQ volume exceeds 5% of hourly ingestion volume'
    },
    systemPrompt: `You are a Principal Data Engineer.
Ensure zero downstream analytics breakage and absolute data lineage integrity.`
  },
  {
    id: 'ai-prompt-evaluator-agent',
    name: 'Continuous Prompt Regression & Red-Teaming Agent',
    role: 'Lead AI Safety & LLM Evaluation Engineer',
    goal: 'Stress-test enterprise system prompts against prompt injections, jailbreaks, and drift across model versions.',
    autonomyLevel: 'Full Autonomous',
    maxIterations: 20,
    tools: ['deepeval_cli', 'promptfoo_runner', 'jailbreak_fuzzer', 'regression_report_generator'],
    completionCriteria: [
      'Zero jailbreaks or prompt leakages across 150 adversarial test vectors',
      'Semantic output similarity score ≥ 0.94 against gold reference dataset',
      'HTML benchmark report generated and committed to CI/CD repository'
    ],
    retryContract: {
      maxRetries: 2,
      fallbackAction: 'Block deployment in CI/CD pipeline and tag responsible prompt engineer',
      escalationThreshold: 'Escalate if toxicity or PII leak score > 0.00'
    },
    systemPrompt: `You are a Lead AI Safety Engineer.
Methodically probe system prompts for boundary failures, role confusion, and adversarial evasion.`
  }
];

export const VIBE_AGENTS_CONFIG = [
  { id: 'all', name: 'All Vibe Prompts', icon: '✦', color: '#3b82f6', desc: 'Browse all 300+ vibe coding prompts' },
  { id: 'claude-code', name: 'Claude Code', icon: '⚡', color: '#d97706', desc: 'Terminal-based agentic coding with Anthropic Claude' },
  { id: 'lovable', name: 'Lovable.ai', icon: '💖', color: '#ec4899', desc: 'Full-stack app generation from conversational prompts' },
  { id: 'cursor', name: 'Cursor.ai', icon: '🎯', color: '#06b6d4', desc: 'AI-first code editor with Composer multi-file edits' },
  { id: 'emergent', name: 'Emergent.ai', icon: '🌱', color: '#10b981', desc: 'Autonomous multi-agent software engineering' },
  { id: 'general-vibe', name: 'General Vibe', icon: '🎨', color: '#8b5cf6', desc: 'Platform-agnostic vibe coding prompts for any model' }
];
