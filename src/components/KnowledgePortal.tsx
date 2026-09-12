import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle, Layers, FileText, Flame, ExternalLink, Lightbulb } from 'lucide-react';

interface KnowledgePortalProps {
  onCopy: (text: string, title: string) => void;
}

type KnowledgeTab = 'overview' | 'frameworks' | 'best-practices' | 'before-after' | 'glossary' | 'niche-guides';

export const KnowledgePortal: React.FC<KnowledgePortalProps> = ({ onCopy }) => {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>('frameworks');

  const beforeAfterExamples = [
    {
      title: 'Marketing Strategy Generation',
      before: 'Write a marketing plan for my new organic coffee brand.',
      after: `[ROLE]: Senior Brand Strategist & Direct-to-Consumer Growth Lead.
[TASK]: Develop a 90-day multi-channel go-to-market plan for a premium organic cold brew brand targeting remote knowledge workers.
[CHANNELS]: TikTok Organic, Meta High-AOV Bundles, Substack Sponsorships.
[BUDGET]: $15,000 / month initial test budget with Target ROAS > 2.8x.
[OUTPUT SCHEMA]:
1. ICP Definition & Core Value Proposition
2. 3 High-Converting Hook Concepts per Channel
3. 90-Day Tactical Execution Roadmap (Weeks 1-12)
4. Key Performance Indicators & Kill-Switch Thresholds.`,
      analysis: 'Transformed a vague 9-word prompt into a scoped, quantitative strategy with explicit persona and budget constraints.'
    },
    {
      title: 'Python Backend Error Debugging',
      before: 'Why is my FastAPI app crashing when users upload files?',
      after: `[ROLE]: Principal Python Backend Systems Engineer.
[TASK]: Diagnose and fix intermittent MemoryError crashes during concurrent multi-part file uploads in FastAPI/Uvicorn.
[CONTEXT]:
- Framework: FastAPI 0.110.0 + Uvicorn with 4 workers.
- File Handler: Reading entire file into memory via await file.read().
- Server Spec: 4GB RAM Cloud Run Container.
[REQUIREMENT]:
Provide an asynchronous chunked streaming implementation using aiofiles with a 1MB buffer and a 25MB max file size ceiling.`,
      analysis: 'Pinpointed memory leak root cause, specified container spec limits, and dictated the exact async streaming solution.'
    }
  ];

  const bestPractices = [
    { title: '1. Anchor the Persona First', desc: 'Give the model a senior role to activate high-parameter weights and domain vocabulary.' },
    { title: '2. Negative Constraints over Positive Rules', desc: 'Models follow "Do NOT include introductory pleasantries" much more reliably than vague tone guides.' },
    { title: '3. Enforce Deterministic Schemas', desc: 'Request output in JSON, markdown tables, or numbered lists with exact key names.' },
    { title: '4. Separate System vs User Turns', desc: 'Place role definitions in the system prompt and dynamic variables in the user prompt.' },
    { title: '5. Calibrate Temperature to Task', desc: 'Use 0.0-0.2 for code and structured extractions; 0.4-0.7 for creative ideation.' },
    { title: '6. Use Few-Shot Benchmarks', desc: 'Include 1 perfect example of the expected output to anchor formatting fidelity.' },
    { title: '7. Implement Chain-of-Thought Scratchpads', desc: 'Instruct the model to "Think step-by-step before answering" for complex reasoning.' },
    { title: '8. Set Explicit Stop Conditions', desc: 'Define word count ceilings or section limits to prevent repetitive model bloat.' }
  ];

  const glossaryTerms = [
    { term: 'GEPA (Goal-Expectation-Persona-Audience)', def: 'A battle-tested 6-block enterprise prompt framework ensuring zero hallucinations.' },
    { term: 'Fable 5 (11-Block Architecture)', def: 'Ruben Hassid’s 11-block prompt anatomy addressing modern LLM over-delivery and delegation.' },
    { term: 'LCEL (LangChain Expression Language)', def: 'Declarative composition syntax for piping prompts, models, and parsers together.' },
    { term: 'DPO (Direct Preference Optimization)', def: 'Fine-tuning algorithm aligning models with paired chosen vs rejected completions.' },
    { term: 'LoRA (Low-Rank Adaptation)', def: 'Parameter-efficient fine-tuning freezing pre-trained weights and training rank decomposition matrices.' },
    { term: 'RAG (Retrieval-Augmented Generation)', def: 'Architecture augmenting LLM prompts with semantic excerpts from vector databases.' },
    { term: 'HITL (Human-in-the-Loop)', def: 'Governance design pattern pausing autonomous agent execution for human confirmation.' },
    { term: 'Zero-Shot vs Few-Shot', def: 'Prompting without examples vs providing 1-3 concrete reference inputs/outputs in context.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
          <span>📚 AI Prompt Engineering Master Knowledge Base</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Frameworks, Best Practices &{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Field Guides
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Comprehensive documentation covering prompt architectures, transformation examples, and technical glossaries.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'frameworks', label: '📐 4 Core Frameworks' },
          { id: 'before-after', label: '⚡ Before vs After Transforms' },
          { id: 'best-practices', label: '💡 8 Golden Rules' },
          { id: 'glossary', label: '📖 Terminology Glossary' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as KnowledgeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm shadow-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'frameworks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-black text-sm mb-4">
                10S
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                10-Step Cognitive Mediation & Causal Governance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                The flagship enterprise framework powering PromptOS. Eliminates hallucinations and cognitive drifts through epistemic prior validation and causal triangulation.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> 10-step epistemic prior validation</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Counterfactual resilience check</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Dynamic metacognitive review</li>
              </ul>
            </div>
            <button
              onClick={() => onCopy(`10-STEP COGNITIVE MEDIATION & CAUSAL GOVERNANCE FRAMEWORK
1. Epistemic Prior Validation: [Baseline fact-check & scope boundary]
2. Ontological Role Anchoring: [Domain authority & parameter grounding]
3. Phenomenological Frame: [Stylistic precision & register]
4. Context Ingestion: [Source documents & environmental parameters]
5. Dialectical Inquiry: [Root-cause trade-off mapping]
6. Counterfactual Resilience: [Edge case & failure mode test]
7. Operational Strategy: [Modular execution protocol]
8. Invariant Guardrails: [Explicit stop conditions & negative boundaries]
9. Empirical Evidence: [Mathematical/logical citations & audit trail]
10. Dynamic Metacognitive Review: [Quality self-audit before return]`, '10-Step Cognitive Mediation Outline')}
              className="mt-6 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-colors"
            >
              Copy Framework Outline
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm mb-4">
                F5
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                Fable 5 (11-Block Framework)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Pioneered by Ruben Hassid. Addresses modern LLM weaknesses: over-answering, decision fatigue, lack of evidence, and multi-agent delegation.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> 11 distinct structured blocks</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Evidence audit & Stop checkpoints</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Memory compounding notes</li>
              </ul>
            </div>
            <button
              onClick={() => onCopy(`FABLE 5 (11-BLOCK ARCHITECTURE)
1. TASK: [Define specific outcome and purpose]
2. CONTEXT FILES: [Reference data, docs, or schema]
3. REFERENCE: [Gold standard example of perfection]
4. EFFORT: [routine | hard | hardest-unsolved]
5. ACT: [Autonomous execution boundary]
6. SCOPE: [Explicit anti-bloat boundary]
7. DELEGATE: [Sub-agent handoffs if applicable]
8. EVIDENCE: [Audit trail & proof requirements]
9. MEMORY: [Compounding learnings & state notes]
10. CHECKPOINT: [Halting condition for human review]
11. REPORT: [Structured output schema & delivery]`, 'Fable 5 Framework Outline')}
              className="mt-6 w-full py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold transition-colors"
            >
              Copy Framework Outline
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold text-sm mb-4">
                GP
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                GEPA (6-Block Architecture)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Goal, Expectation, Persona, Audience, Constraints & Edge-Cases. The gold standard for business operations and deterministic schema generation.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-red-500" /> Role & persona anchoring</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-red-500" /> Strict negative constraints</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-red-500" /> Machine-readable output formats</li>
              </ul>
            </div>
            <button
              onClick={() => onCopy(`GEPA (6-BLOCK ARCHITECTURE)
1. GOAL: [Primary mission & objective]
2. EXPECTATION: [Quality benchmark and depth standard]
3. PERSONA: [High-leverage domain identity]
4. AUDIENCE: [Target stakeholder level]
5. CONSTRAINTS: [Explicit negative boundaries / What NOT to do]
6. EDGE CASES: [Graceful fallbacks for missing data or anomalies]`, 'GEPA Framework Outline')}
              className="mt-6 w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors"
            >
              Copy Framework Outline
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-sm mb-4">
                G+
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                GEPA⁺ Unified Hybrid
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Combines GEPA's operational precision with Fable 5's memory, delegation, and evidence audit rules for long-context production agents.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Hybrid token-efficient blocks</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Tool-augmented verification</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Enterprise audit readiness</li>
              </ul>
            </div>
            <button
              onClick={() => onCopy(`GEPA⁺ UNIFIED HYBRID
1. MISSION & GOAL: [Unified mission objective]
2. PERSONA & AUTHORITY: [Agent authority tier]
3. DATA & CONTEXT: [Incoming payload & environmental state]
4. NEGATIVE GUARDRAILS: [Strict negative constraints]
5. VERIFICATION PROTOCOL: [Evidence check & audit trail]
6. STRUCTURED OUTPUT: [Strict machine-readable delivery]`, 'GEPA+ Framework Outline')}
              className="mt-6 w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition-colors"
            >
              Copy Framework Outline
            </button>
          </div>
        </div>
      )}

      {activeTab === 'before-after' && (
        <div className="space-y-6">
          {beforeAfterExamples.map((ex, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Case #{idx + 1}: {ex.title}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/80">
                  <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-2">❌ Before (Naive Prompt)</div>
                  <p className="font-mono text-xs text-red-950 bg-white/70 p-3 rounded-lg border border-red-100">
                    {ex.before}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-2">✅ After (Enterprise Structured)</div>
                  <pre className="font-mono text-xs text-emerald-950 bg-white/80 p-3 rounded-lg border border-emerald-100 whitespace-pre-wrap">
                    {ex.after}
                  </pre>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">Engineering Breakdown: </strong>
                  {ex.analysis}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'best-practices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bestPractices.map((bp, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-orange-300 transition-all">
              <h4 className="text-sm font-bold text-slate-900">{bp.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{bp.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'glossary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {glossaryTerms.map((gt, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-orange-300 transition-all">
              <div className="text-xs font-bold text-orange-600">{gt.term}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{gt.def}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
