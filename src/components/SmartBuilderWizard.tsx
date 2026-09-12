import React, { useState } from 'react';
import { Wand2, Sparkles, Copy, Check, RotateCcw, CheckCircle2, ArrowRight, Flame, Bot, Loader2 } from 'lucide-react';
import { NICHES_LIST } from '../data/niches';
import { buildFable5Prompt, buildGEPAPrompt, buildGEPAPlusPrompt, buildNineStepPrompt } from '../utils/promptGenerators';
import { generateAIContent } from '../utils/api';
import { DifficultyLevel } from '../types';

interface SmartBuilderWizardProps {
  onCopy: (text: string, title: string) => void;
  initialNiche?: string;
  initialMode?: 'quick' | 'pro';
}

export const SmartBuilderWizard: React.FC<SmartBuilderWizardProps> = ({
  onCopy,
  initialNiche = 'AI Engineering',
  initialMode = 'quick'
}) => {
  const [mode, setMode] = useState<'quick' | 'pro'>(initialMode);

  // Quick 4-field states
  const [qNiche, setQNiche] = useState(initialNiche);
  const [qRole, setQRole] = useState('Senior Enterprise AI Architect');
  const [qTask, setQTask] = useState('Design a fault-tolerant multi-agent customer onboarding pipeline');
  const [qDifficulty, setQDifficulty] = useState<DifficultyLevel>('Expert');

  // Pro 11-block states
  const [pTask, setPTask] = useState('Scale enterprise client onboarding automation with zero data loss');
  const [pContext, setPContext] = useState('customer_schemas.json, auth_tokens.md, webhook_events.md');
  const [pRef, setPRef] = useState('Stripe webhook handling architecture documentation');
  const [pEffort, setPEffort] = useState('hardest-unsolved');
  const [pAct, setPAct] = useState('Execute idempotent retry queues; provide clear error logs');
  const [pScope, setPScope] = useState('Minimal viable fault-tolerant worker without extraneous dependencies');
  const [pDelegate, setPDelegate] = useState('Split webhook verification and payload dispatch to dedicated subagents');
  const [pEvidence, setPEvidence] = useState('Audit status codes against mock server tests');
  const [pMemory, setPMemory] = useState('Record edge cases in onboarding_lessons.md');
  const [pCheckpoint, setPCheckpoint] = useState('Pause only for database schema mutations or credentials');
  const [pReport, setPReport] = useState('Open with test pass rate and p99 webhook ingestion latency');

  const [activeFw, setActiveFw] = useState<'ninestep' | 'fable5' | 'gepa' | 'gepaplus'>('ninestep');
  const [copied, setCopied] = useState(false);
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [aiOptimizedPrompt, setAiOptimizedPrompt] = useState<string | null>(null);

  const getBaseGeneratedPrompt = () => {
    if (mode === 'quick') {
      if (activeFw === 'ninestep') return buildNineStepPrompt(qTask, qNiche, qRole, qDifficulty);
      if (activeFw === 'gepa') return buildGEPAPrompt(qTask, qNiche, qRole, qDifficulty);
      if (activeFw === 'gepaplus') return buildGEPAPlusPrompt(qTask, qNiche, qRole, qDifficulty);
      return buildFable5Prompt(qTask, qNiche, qRole, qDifficulty);
    }

    // Pro mode 11-block Fable 5 prompt
    return `① TASK:
I'm working on ${pTask}. With that in mind: deliver a production-ready specification.

② CONTEXT FILES:
Read these files completely before responding:
${pContext}

③ REFERENCE:
Reference for benchmark standard:
${pRef}

④ EFFORT:
This is a ${pEffort} problem. Scope it like it's at the top of your range.

⑤ ACT:
When you have enough to act, act. Don't re-litigate decisions. ${pAct}

⑥ SCOPE:
${pScope}. Do not add unsolicited features or unnecessary refactors.

⑦ DELEGATE:
${pDelegate}. Keep working while subagents run. Verify with a fresh-context subagent.

⑧ EVIDENCE:
${pEvidence}. Before reporting progress, audit every claim against a verified tool result. If unverified, say so.

⑨ MEMORY:
${pMemory} — one insight per file, update rather than duplicate.

⑩ CHECKPOINT:
${pCheckpoint}. Never end your turn on an unfulfilled promise.

⑪ REPORT:
${pReport}. Complete sentences. Clear beats short.`;
  };

  const currentPromptText = aiOptimizedPrompt || getBaseGeneratedPrompt();

  const handleCopy = () => {
    onCopy(currentPromptText, 'Custom Prompt Wizard Deliverable');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiPolish = async () => {
    setIsAiPolishing(true);
    const base = getBaseGeneratedPrompt();
    try {
      const res = await generateAIContent({
        prompt: `Calibrate, elevate and enhance this prompt to maximize reasoning depth and constraint adherence. Maintain the exact structural framework:\n\n${base}`,
        systemInstruction: `You are a Principal Prompt Calibration Architect. Polish and maximize the precision of the prompt while maintaining its exact syntax layout. Return only the enhanced prompt without markdown commentary wrappers.`,
        temperature: 0.2
      });
      if (res.text && res.text.trim()) {
        setAiOptimizedPrompt(res.text.trim());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiPolishing(false);
    }
  };

  const handleResetAi = () => {
    setAiOptimizedPrompt(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
          <span>⚡ Smart Prompt Wizard & Calibrator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Custom Prompt Generator &{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            AI Engine Calibrator
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Quickly assemble production-ready prompts using either 4 fast fields or the complete 11-block Fable 5 anatomy.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => { setMode('quick'); setAiOptimizedPrompt(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'quick'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300'
          }`}
        >
          ✦ Quick Builder (4 Fast Fields)
        </button>
        <button
          onClick={() => { setMode('pro'); setAiOptimizedPrompt(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'pro'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300'
          }`}
        >
          ◈ Pro 11-Block Fable 5 Architecture
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            {mode === 'quick' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Niche (204 Available)
                  </label>
                  <select
                    value={qNiche}
                    onChange={(e) => { setQNiche(e.target.value); setAiOptimizedPrompt(null); }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    {NICHES_LIST.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Role / Persona
                  </label>
                  <input
                    type="text"
                    value={qRole}
                    onChange={(e) => { setQRole(e.target.value); setAiOptimizedPrompt(null); }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Task / Objective
                  </label>
                  <textarea
                    value={qTask}
                    onChange={(e) => { setQTask(e.target.value); setAiOptimizedPrompt(null); }}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => { setQDifficulty(e.target.value as DifficultyLevel); setAiOptimizedPrompt(null); }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="Beginner">🟢 Beginner</option>
                    <option value="Intermediate">🔵 Intermediate</option>
                    <option value="Advanced">🟠 Advanced</option>
                    <option value="Expert">🔴 Expert</option>
                  </select>
                </div>
              </>
            ) : (
              /* Pro 11-Block Controls */
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">① TASK (Goal & Purpose)</label>
                  <input type="text" value={pTask} onChange={e => { setPTask(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">② CONTEXT FILES</label>
                  <input type="text" value={pContext} onChange={e => { setPContext(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">③ REFERENCE (Quality Benchmark)</label>
                  <input type="text" value={pRef} onChange={e => { setPRef(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">④ EFFORT</label>
                  <select value={pEffort} onChange={e => { setPEffort(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white">
                    <option value="routine">routine</option>
                    <option value="hard">hard</option>
                    <option value="hardest-unsolved">hardest-unsolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">⑤ ACT (Autonomy Rule)</label>
                  <input type="text" value={pAct} onChange={e => { setPAct(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">⑥ SCOPE (Anti-Bloat Directive)</label>
                  <input type="text" value={pScope} onChange={e => { setPScope(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">⑦ DELEGATE (Multi-Agent)</label>
                  <input type="text" value={pDelegate} onChange={e => { setPDelegate(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">⑧ EVIDENCE (Audit Verification)</label>
                  <input type="text" value={pEvidence} onChange={e => { setPEvidence(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">⑨ MEMORY (Compounding Notes)</label>
                  <input type="text" value={pMemory} onChange={e => { setPMemory(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">⑩ CHECKPOINT (Stop Conditions)</label>
                  <input type="text" value={pCheckpoint} onChange={e => { setPCheckpoint(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">⑪ REPORT (Outcome Delivery)</label>
                  <input type="text" value={pReport} onChange={e => { setPReport(e.target.value); setAiOptimizedPrompt(null); }} className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 flex-wrap gap-2">
                {mode === 'quick' ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => { setActiveFw('ninestep'); setAiOptimizedPrompt(null); }}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                        activeFw === 'ninestep'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🧠 9-Step Mediation
                    </button>
                    <button
                      onClick={() => { setActiveFw('fable5'); setAiOptimizedPrompt(null); }}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                        activeFw === 'fable5'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Fable 5 (11-Block)
                    </button>
                    <button
                      onClick={() => { setActiveFw('gepa'); setAiOptimizedPrompt(null); }}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                        activeFw === 'gepa'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      GEPA 6-Block
                    </button>
                    <button
                      onClick={() => { setActiveFw('gepaplus'); setAiOptimizedPrompt(null); }}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                        activeFw === 'gepaplus'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      GEPA⁺ Unified
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    Ruben Hassid 11-Block Fable 5 Architecture
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAiPolish}
                    disabled={isAiPolishing}
                    className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isAiPolishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-orange-500" />}
                    <span>{isAiPolishing ? 'AI Tuning...' : 'AI Enhance'}</span>
                  </button>

                  {aiOptimizedPrompt && (
                    <button
                      onClick={handleResetAi}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 text-xs"
                      title="Reset AI optimization"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-500/20 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
              </div>

              {aiOptimizedPrompt && (
                <div className="mb-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-[11px] font-bold text-orange-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    Enhanced by Live Gemini AI Engine
                  </span>
                  <span className="text-[10px] text-orange-600 font-semibold">Gemini 3.7 Flash</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto shadow-inner">
                {currentPromptText}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Zero-hallucination structure guaranteed
              </span>
              <span className="text-orange-600 font-semibold">Ready for production LLM prompt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

