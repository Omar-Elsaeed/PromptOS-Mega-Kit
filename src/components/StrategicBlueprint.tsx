import React, { useState } from 'react';
import { DollarSign, Copy, Check, Download, Sparkles, Target, TrendingUp, Briefcase, Flame, Calculator, FileText, Loader2, Bot } from 'lucide-react';
import { generateAIContent } from '../utils/api';

interface StrategicBlueprintProps {
  onCopy: (text: string, title: string) => void;
}

const STRATEGY_1_PLAN = `# STRATEGY 1: MICRO-NICHE DIGITAL PACKS ($3,900 - $7,500 / MO)
Target Market: Solopreneurs, Fractional Executives, Specialists

1. PACKAGING METHODOLOGY
• Slice the 100,000 vault into hyper-targeted packs:
  - "500 High-Converting Prompts for Real Estate Wholesalers"
  - "750 B2B Outbound Cold Outreach & Follow-up Blueprints"
  - "1,200 DevOps Incident Response & SRE Prompts"
• Include 3 Core Frameworks: GEPA 6-Block + Ruben Fable 5 + GEPA⁺ Unified

2. PRICING TIERS
• Basic Tier ($29): 500 Curated Prompts + CSV Export
• Professional Tier ($49): Basic + 5 n8n Automation Workflows + Prompt Playground Guide
• Team Tier ($129): Pro + Commercial Resale License + Synthetic Fine-Tuning JSONL Pairs

3. CONVERSION CHANNELS & FUNNEL
• Channel A (LinkedIn / X Carousels): Teardown bad naive prompts vs structured Fable 5 prompts
• Channel B (Lead Magnet): Give away 25 prompts in exchange for email address on Gumroad / LemonSqueezy
• Channel C (Email Sequence): 4-day drip educating on hallucination prevention

4. 30-DAY LAUNCH CHECKLIST
[✓] Step 1: Filter 500 prompts from PromptOS library for chosen niche
[✓] Step 2: Set up Gumroad or LemonSqueezy product page with the provided sales copy
[✓] Step 3: Record 90-second Loom showing copy-pasting a prompt into ChatGPT/Claude
[✓] Step 4: Publish 5 value breakdown posts on social media`;

const STRATEGY_2_PLAN = `# STRATEGY 2: AI AGENCY SERVICE RETAINERS ($6,000 - $15,000 / MO)
Target Market: Mid-Market B2B Companies, Accounting Firms, Law Practices, Logistics

1. CORE VALUE PROPOSITION
• Do not sell "prompts" — sell "Automated Enterprise AI Operations"
• Deliver turnkey LangChain/CrewAI agents and n8n pipelines backed by validated prompt contracts
• Guarantee: Reduce manual data processing time by 70% with zero-data-loss failover

2. SERVICE PACKAGES
• System Audit & Blueprint ($1,500 one-off): Audit client workflow & design architecture
• Core Deployment Retainer ($3,500/mo): 3 automated agent workflows + prompt calibration + monthly maintenance
• Enterprise Retainer ($6,500/mo): Unlimited agent refinement + custom fine-tuning datasets + SLA support

3. SALES OUTREACH TEMPLATE
"Hey [Name], noticed your team manually qualifies inbound sales inquiries from your web forms. We built an automated AI triage system that categorizes leads into CRM, drafts customized executive replies, and alerts Slack within 4 seconds. Would you like a 3-minute video showing the exact blueprint we deployed for a similar firm?"

4. ONBOARDING & DELIVERY
• Week 1: Ingest client SOPs and map to PromptOS GEPA/Fable templates
• Week 2: Generate LangChain or CrewAI Python microservice
• Week 3: Staging integration with client webhooks
• Week 4: Production launch and executive sign-off`;

const STRATEGY_3_PLAN = `# STRATEGY 3: PROMPT-AS-A-SERVICE MEMBERSHIP SAAS ($7,000 - $25,000 / MO)
Target Market: AI Engineers, Prompt Engineers, Digital Agencies

1. BUSINESS MODEL & ARCHITECTURE
• Private vault community with weekly drop of 1,000 niche prompts
• Synthetic dataset downloads for fine-tuning (LoRA, Unsloth, SFT JSONL)
• Direct API access to prompt template compiler endpoints

2. PRICING ARCHITECTURE
• Pro Member ($29/mo): Full web catalog access + weekly curated updates
• Team ($79/mo): 5 team seats + raw JSON exports + Python SDK generators
• Enterprise API ($199/mo): Programmatic API access to prompt template generation engine

3. RETENTION MECHANISMS
• Weekly "Prompt of the Week" teardown and benchmark comparison against Claude 3.5 Sonnet and Gemini 1.5 Pro
• Monthly fine-tuning dataset releases for emerging open-source models (Llama 3.3, DeepSeek R1)
• Private Discord/Slack community with weekly office hours`;

export const StrategicBlueprint: React.FC<StrategicBlueprintProps> = ({ onCopy }) => {
  const [activeTab, setActiveTab] = useState<'monetization' | 'sales-copy' | 'pricing-calculator' | 'ai-custom'>('monetization');
  const [copied, setCopied] = useState<string | null>(null);

  // Custom AI Plan Generator State
  const [customNiche, setCustomNiche] = useState('E-commerce & Shopify Brands');
  const [targetIncome, setTargetIncome] = useState('$10,000 / month');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate Solopreneur');
  const [customPlan, setCustomPlan] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Pricing calculator state
  const [packPrice, setPackPrice] = useState(49);
  const [salesPerMonth, setSalesPerMonth] = useState(85);

  const annualRevenue = packPrice * salesPerMonth * 12;

  const salesCopyKits = [
    {
      platform: 'Gumroad / LemonSqueezy Product Landing Page',
      headline: 'The Ultimate 100,000 AI Prompt Engineering Vault for Builders & Founders',
      body: `Stop wasting hours tweaking ChatGPT prompts that hallucinate and give fluff.

Get instant lifetime access to the enterprise-grade prompt vault:
✦ 100,000 Tested Prompts across 204 specialized business niches
✦ 3 Elite Frameworks: Ruben Hassid Fable 5 (11-block) + GEPA 6-block + GEPA⁺ Unified
✦ 18 Production Automations (n8n, Make & Zapier JSON workflows)
✦ 12 Autonomous Agent Blueprints with deterministic retry contracts
✦ Python Agent Generators for LangChain & CrewAI

Commercial rights included. Free updates forever.`
    },
    {
      platform: 'AppSumo / ProductHunt Launch Pitch',
      headline: '100,000 Precision AI Prompts + Agentic Architecture Suite (Lifetime Access)',
      body: `Transform generic AI outputs into high-precision, executive deliverables.

Features Included:
- 204 Niches & 2,740 Expert Personas
- Full Fable 5 11-Block Prompt Anatomy
- LangChain, LangGraph & CrewAI Python Code Generators
- DeepEval / Promptfoo Automated Evaluation Suites
- Unsloth SFT / DPO Fine-Tuning YAML & Dataset Builders

60-day money-back guarantee.`
    }
  ];

  const handleCopyText = (text: string, title: string) => {
    onCopy(text, title);
    setCopied(title);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerateCustomPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const prompt = `Act as an expert digital product monetization strategist. Create a comprehensive, actionable 4-part monetization blueprint for launching an AI prompt & workflow business in this niche:
- Niche/Domain: ${customNiche}
- Target Income Goal: ${targetIncome}
- Experience Level: ${experienceLevel}

Include:
1. Product Packaging & Offer Tiers (3 specific price points with clear deliverables)
2. Highest-Converting Customer Acquisition Channel for this niche
3. Step-by-Step 30-Day Launch Roadmap (Weeks 1 to 4)
4. Revenue Math & Unit Economics breakdown to reach ${targetIncome}`;

      const res = await generateAIContent({
        prompt,
        systemInstruction: 'You are an elite business strategist specializing in digital AI products and SaaS monetization.',
        temperature: 0.6,
      });

      setCustomPlan(res.text || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
          <span>📈 Monetization & Strategic Execution Blueprint</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          3 Proven Paths to $50,000/Year with{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            AI Prompt Products
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Operational blueprints, revenue calculators, sales copy kits, and live AI monetization generator.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('monetization')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'monetization'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          💰 3 Monetization Paths
        </button>
        <button
          onClick={() => setActiveTab('pricing-calculator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'pricing-calculator'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          📊 Revenue Calculator
        </button>
        <button
          onClick={() => setActiveTab('sales-copy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'sales-copy'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          📝 Sales Copy Kits
        </button>
        <button
          onClick={() => setActiveTab('ai-custom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'ai-custom'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          ✨ AI Custom Plan Generator
        </button>
      </div>

      {/* Monetization Paths */}
      {activeTab === 'monetization' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
            <div>
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Strategy 01</div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Micro-Niche Digital Packs</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Slice the 100,000 vault into hyper-targeted packs (e.g. "500 Prompts for Real Estate Investors", "800 Prompts for Fractional CMOs").
              </p>
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 text-xs text-slate-700 space-y-1">
                <div><strong>Price Point:</strong> $29 - $49 one-time</div>
                <div><strong>Target:</strong> 100 sales/month = $3,900/mo</div>
                <div><strong>Channels:</strong> Twitter/X, LinkedIn Carousels</div>
              </div>
            </div>
            <button
              onClick={() => handleCopyText(STRATEGY_1_PLAN, 'Strategy 1 Blueprint (Micro-Niche Packs)')}
              className="mt-6 w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied === 'Strategy 1 Blueprint (Micro-Niche Packs)' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'Strategy 1 Blueprint (Micro-Niche Packs)' ? 'Copied Full Plan!' : 'Copy Strategy 1 Full Plan'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
            <div>
              <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Strategy 02</div>
              <h3 className="text-lg font-black text-slate-900 mb-2">AI Agency Service Retainers</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Deploy these enterprise prompts and Python agent blueprints directly for local businesses and B2B clients as automated workflow systems.
              </p>
              <div className="p-3 rounded-xl bg-red-50/60 border border-red-200/60 text-xs text-slate-700 space-y-1">
                <div><strong>Price Point:</strong> $1,500 - $3,500 / month</div>
                <div><strong>Target:</strong> 3-4 retainer clients = $8,000/mo</div>
                <div><strong>Channels:</strong> Cold Email, B2B Audits</div>
              </div>
            </div>
            <button
              onClick={() => handleCopyText(STRATEGY_2_PLAN, 'Strategy 2 Blueprint (Agency Retainers)')}
              className="mt-6 w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied === 'Strategy 2 Blueprint (Agency Retainers)' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'Strategy 2 Blueprint (Agency Retainers)' ? 'Copied Full Plan!' : 'Copy Strategy 2 Full Plan'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
            <div>
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Strategy 03</div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Prompt-as-a-Service SaaS</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Wrap the vault in an API or web app with weekly prompt drops and fine-tuning datasets for AI engineering teams.
              </p>
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 text-xs text-slate-700 space-y-1">
                <div><strong>Price Point:</strong> $19 - $49 / month subscription</div>
                <div><strong>Target:</strong> 250 subscribers = $7,250/mo ARR</div>
                <div><strong>Channels:</strong> SEO, GitHub Repo stars</div>
              </div>
            </div>
            <button
              onClick={() => handleCopyText(STRATEGY_3_PLAN, 'Strategy 3 Blueprint (Prompt SaaS)')}
              className="mt-6 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied === 'Strategy 3 Blueprint (Prompt SaaS)' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'Strategy 3 Blueprint (Prompt SaaS)' ? 'Copied Full Plan!' : 'Copy Strategy 3 Full Plan'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Pricing Calculator */}
      {activeTab === 'pricing-calculator' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-orange-500" />
                <span>Simulate Your Digital Product Revenue</span>
              </h3>

              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Product Pack Price ($)</span>
                  <span className="font-mono text-orange-600 font-bold">${packPrice}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="299"
                  value={packPrice}
                  onChange={(e) => setPackPrice(parseInt(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Estimated Sales Per Month</span>
                  <span className="font-mono text-orange-600 font-bold">{salesPerMonth} orders</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="500"
                  value={salesPerMonth}
                  onChange={(e) => setSalesPerMonth(parseInt(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex flex-col justify-between shadow-lg shadow-orange-500/20">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase opacity-80">Projected Annual Run-Rate</span>
                <div className="text-4xl font-black mt-2">
                  ${annualRevenue.toLocaleString()}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  Monthly Revenue: ${(packPrice * salesPerMonth).toLocaleString()} / mo
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 text-xs opacity-90">
                At ${packPrice}/pack with {salesPerMonth} monthly customers, you hit ${(annualRevenue / 12).toFixed(0)}/mo net revenue.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Copy */}
      {activeTab === 'sales-copy' && (
        <div className="space-y-6">
          {salesCopyKits.map((kit, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{kit.platform}</span>
                <button
                  onClick={() => handleCopyText(`${kit.headline}\n\n${kit.body}`, kit.platform)}
                  className="px-3 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200"
                >
                  {copied === kit.platform ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === kit.platform ? 'Copied' : 'Copy Copywriting'}</span>
                </button>
              </div>

              <h4 className="text-base font-extrabold text-slate-900">{kit.headline}</h4>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                {kit.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Custom Plan Generator */}
      {activeTab === 'ai-custom' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Tailored Business Architect</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">Generate Custom AI Monetization Plan</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Enter your specific niche or market focus, and Gemini will synthesize a customized go-to-market offer and roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Niche / Industry</label>
              <input
                type="text"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                placeholder="e.g., Real Estate, MedTech, Shopify"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Monthly Revenue Goal</label>
              <input
                type="text"
                value={targetIncome}
                onChange={(e) => setTargetIncome(e.target.value)}
                placeholder="e.g., $10,000 / month"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
              >
                <option value="Beginner Solopreneur">Beginner Solopreneur</option>
                <option value="Intermediate Solopreneur">Intermediate Solopreneur</option>
                <option value="Established Agency / Consultant">Established Agency / Consultant</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-500">
              Powered by Google Gemini 1.5 & prompt monetization heuristics.
            </span>
            <button
              onClick={handleGenerateCustomPlan}
              disabled={isGeneratingPlan || !customNiche.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isGeneratingPlan ? 'Synthesizing Plan...' : 'Synthesize Custom Plan'}</span>
            </button>
          </div>

          {customPlan && (
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Custom Monetization Architecture</span>
                </span>
                <button
                  onClick={() => handleCopyText(customPlan, `Monetization Plan — ${customNiche}`)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  {copied?.includes('Monetization Plan') ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied?.includes('Monetization Plan') ? 'Copied' : 'Copy Plan'}</span>
                </button>
              </div>

              <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-2 text-slate-200">
                {customPlan}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
