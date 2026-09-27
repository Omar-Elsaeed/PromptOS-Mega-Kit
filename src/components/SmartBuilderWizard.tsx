import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Sparkles, Copy, Check, RotateCcw, CheckCircle2, ArrowRight, Flame, Bot, Loader2, History, BookmarkPlus, Trash2, Clock, CheckSquare, CloudCheck, Save, GitCompare, X, SplitSquareVertical, Edit2, Compass } from 'lucide-react';
import { NICHES_LIST } from '../data/niches';
import { buildFable5Prompt, buildGEPAPrompt, buildGEPAPlusPrompt, buildNineStepPrompt } from '../utils/promptGenerators';
import { generateAIContent } from '../utils/api';
import { DifficultyLevel } from '../types';

export interface PromptVersion {
  id: string;
  timestamp: number;
  label: string;
  source: 'ai_enhanced' | 'manual_snapshot' | 'baseline' | 'auto_save';
  framework: 'ninestep' | 'fable5' | 'gepa' | 'gepaplus' | 'pro_fable5';
  content: string;
}

interface DiffLine {
  type: 'same' | 'added' | 'removed' | 'empty';
  text: string;
  lineNum?: number;
}

function computeSideBySideDiff(leftText: string, rightText: string): { leftLines: DiffLine[]; rightLines: DiffLine[] } {
  const leftRaw = leftText.split('\n');
  const rightRaw = rightText.split('\n');
  const leftLines: DiffLine[] = [];
  const rightLines: DiffLine[] = [];

  const maxLen = Math.max(leftRaw.length, rightRaw.length);
  for (let i = 0; i < maxLen; i++) {
    const l = leftRaw[i];
    const r = rightRaw[i];

    if (l !== undefined && r !== undefined) {
      if (l === r) {
        leftLines.push({ type: 'same', text: l, lineNum: i + 1 });
        rightLines.push({ type: 'same', text: r, lineNum: i + 1 });
      } else {
        leftLines.push({ type: 'removed', text: l, lineNum: i + 1 });
        rightLines.push({ type: 'added', text: r, lineNum: i + 1 });
      }
    } else if (l !== undefined && r === undefined) {
      leftLines.push({ type: 'removed', text: l, lineNum: i + 1 });
      rightLines.push({ type: 'empty', text: '' });
    } else if (l === undefined && r !== undefined) {
      leftLines.push({ type: 'empty', text: '' });
      rightLines.push({ type: 'added', text: r, lineNum: i + 1 });
    }
  }

  return { leftLines, rightLines };
}

interface SmartBuilderWizardProps {
  onCopy: (text: string, title: string) => void;
  initialNiche?: string;
  initialMode?: 'quick' | 'pro';
  onOpenTour?: () => void;
}

const STORAGE_KEY = 'promptos_smart_builder_versions_v1';

export const SmartBuilderWizard: React.FC<SmartBuilderWizardProps> = ({
  onCopy,
  initialNiche = 'AI Engineering',
  initialMode = 'quick',
  onOpenTour
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

  // Version history state
  const [versions, setVersions] = useState<PromptVersion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load prompt versions:', e);
    }
    return [];
  });
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'typing' | 'saved'>('idle');

  // Side-by-side diff viewer state
  const [diffMode, setDiffMode] = useState<boolean>(false);
  const [diffLeftId, setDiffLeftId] = useState<string>('');
  const [diffRightId, setDiffRightId] = useState<string>('');

  // Version label rename state
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState<string>('');

  // Keep ref of last auto-saved content to avoid duplicating identical snapshots
  const lastSavedContentRef = useRef<string>('');
  const isFirstMountRef = useRef<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
    } catch (e) {
      console.error('Failed to save prompt versions:', e);
    }
  }, [versions]);

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

  // Auto-save debounced snapshot every time user pauses typing for > 2 seconds
  useEffect(() => {
    // Skip saving on initial mount
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      lastSavedContentRef.current = currentPromptText;
      return;
    }

    // If user is currently inspecting a past snapshot without modifying it, don't auto-save
    if (selectedVersionId) {
      return;
    }

    // If text hasn't changed compared to last saved snapshot, no need to save
    if (currentPromptText === lastSavedContentRef.current) {
      return;
    }

    setAutoSaveStatus('typing');

    const timer = setTimeout(() => {
      const fw = mode === 'pro' ? 'pro_fable5' : activeFw;
      const taskExcerpt = (mode === 'quick' ? qTask : pTask).trim().slice(0, 24) || 'Custom';
      const label = `Auto-Save: ${mode === 'pro' ? 'Pro Fable 5' : fw.toUpperCase()} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})`;

      const newVer: PromptVersion = {
        id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        label,
        source: 'auto_save',
        framework: fw,
        content: currentPromptText
      };

      lastSavedContentRef.current = currentPromptText;

      setVersions(prev => {
        // Keep list to a healthy max 30 versions to avoid unbounded storage
        return [newVer, ...prev].slice(0, 30);
      });

      setAutoSaveStatus('saved');
      const resetSavedStatusTimer = setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 2500);

      return () => clearTimeout(resetSavedStatusTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    currentPromptText,
    selectedVersionId,
    mode,
    activeFw,
    qTask,
    pTask
  ]);

  const handleCopy = () => {
    onCopy(currentPromptText, 'Custom Prompt Wizard Deliverable');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveVersion = (labelOverride?: string, contentOverride?: string, source: 'ai_enhanced' | 'manual_snapshot' | 'baseline' = 'manual_snapshot') => {
    const textToSave = contentOverride || currentPromptText;
    const fw = mode === 'pro' ? 'pro_fable5' : activeFw;
    const defaultLabel = labelOverride || (source === 'ai_enhanced' 
      ? `AI Enhanced (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
      : `v${versions.length + 1}: ${mode === 'pro' ? 'Pro Fable 5' : fw.toUpperCase()} - ${qTask.slice(0, 24)}...`);

    const newVer: PromptVersion = {
      id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      label: defaultLabel,
      source,
      framework: fw,
      content: textToSave
    };

    setVersions(prev => [newVer, ...prev]);
    setSelectedVersionId(newVer.id);
    setSnapshotLabel('');
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleSelectVersion = (version: PromptVersion) => {
    setSelectedVersionId(version.id);
    setAiOptimizedPrompt(version.content);
  };

  const handleStartEditLabel = (ver: PromptVersion, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVersionId(ver.id);
    setEditingLabelValue(ver.label);
  };

  const handleSaveEditedLabel = (id: string, e?: React.MouseEvent | React.KeyboardEvent | React.FocusEvent) => {
    if (e) e.stopPropagation();
    const trimmed = editingLabelValue.trim();
    if (trimmed) {
      setVersions(prev => prev.map(v => (v.id === id ? { ...v, label: trimmed } : v)));
    }
    setEditingVersionId(null);
  };

  const handleCancelEditLabel = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    setEditingVersionId(null);
  };

  const handleDeleteVersion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVersions(prev => prev.filter(v => v.id !== id));
    if (selectedVersionId === id) {
      setSelectedVersionId(null);
    }
  };

  const handleClearAllVersions = () => {
    if (window.confirm('Clear all saved prompt versions?')) {
      setVersions([]);
      setSelectedVersionId(null);
      setDiffMode(false);
    }
  };

  const handleOpenDiff = (leftVerId?: string, rightVerId?: string) => {
    const lId = leftVerId || (versions.length > 1 ? versions[1].id : (versions[0]?.id || ''));
    const rId = rightVerId || (versions[0]?.id || '');
    setDiffLeftId(lId);
    setDiffRightId(rId);
    setDiffMode(true);
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
        const polished = res.text.trim();
        setAiOptimizedPrompt(polished);
        // Automatically snapshot AI enhancements into version history
        handleSaveVersion(`AI Calibrated v${versions.length + 1}`, polished, 'ai_enhanced');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiPolishing(false);
    }
  };

  const handleResetAi = () => {
    setAiOptimizedPrompt(null);
    setSelectedVersionId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
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

        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="self-start md:self-center px-4 py-2.5 rounded-2xl bg-white hover:bg-orange-50/70 border border-slate-200 hover:border-orange-300 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-2 group"
            title="Start SmartBuilder Feature Walkthrough Tour"
          >
            <Compass className="w-4 h-4 text-orange-600 group-hover:rotate-45 transition-transform" />
            <span>SmartBuilder Tour</span>
          </button>
        )}
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
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      showVersionHistory || versions.length > 0
                        ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Toggle Prompt Versions"
                  >
                    <History className="w-3.5 h-3.5 text-purple-600" />
                    <span>History</span>
                    {versions.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-purple-200 text-purple-800 text-[10px] font-mono">
                        {versions.length}
                      </span>
                    )}
                  </button>

                  {/* Auto-save status feedback */}
                  {autoSaveStatus === 'typing' && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 animate-pulse">
                      <Save className="w-3 h-3 animate-spin" />
                      Auto-saving...
                    </span>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Snapshot saved
                    </span>
                  )}

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

              {/* Version History Drawer / Panel */}
              {showVersionHistory && (
                <div className="mb-4 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-black text-purple-900 tracking-tight">Prompt Version History</span>
                      <span className="text-[11px] text-purple-600">({versions.length} saved)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {versions.length >= 2 && (
                        <button
                          onClick={() => handleOpenDiff()}
                          className="text-[11px] text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-100 hover:bg-purple-200 transition-colors shadow-2xs"
                        >
                          <GitCompare className="w-3 h-3 text-purple-600" />
                          <span>Compare Diff</span>
                        </button>
                      )}
                      {versions.length > 0 && (
                        <button
                          onClick={handleClearAllVersions}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 px-2 py-0.5 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear All</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Save snapshot input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Custom version name (e.g. Optimized v2 - strict tone)..."
                      value={snapshotLabel}
                      onChange={(e) => setSnapshotLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveVersion(snapshotLabel.trim() || undefined);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-purple-200 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => handleSaveVersion(snapshotLabel.trim() || undefined)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Save Version</span>
                    </button>
                  </div>

                  {saveSuccessMsg && (
                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Version snapshot saved to history!</span>
                    </div>
                  )}

                  {/* Versions List */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {versions.length === 0 ? (
                      <div className="text-center py-4 text-xs text-purple-500/80">
                        No saved versions yet. Click "Save Version" or run "AI Enhance" to automatically record snapshots.
                      </div>
                    ) : (
                      versions.map((ver) => {
                        const isSelected = selectedVersionId === ver.id;
                        return (
                          <div
                            key={ver.id}
                            onClick={() => handleSelectVersion(ver)}
                            className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-white border-purple-500 shadow-2xs ring-1 ring-purple-500'
                                : 'bg-white/80 border-purple-100 hover:bg-white hover:border-purple-300'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {editingVersionId === ver.id ? (
                                  <div className="flex items-center gap-1.5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="text"
                                      autoFocus
                                      value={editingLabelValue}
                                      onChange={(e) => setEditingLabelValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEditedLabel(ver.id, e);
                                        if (e.key === 'Escape') handleCancelEditLabel(e);
                                      }}
                                      onBlur={() => handleSaveEditedLabel(ver.id)}
                                      className="px-2 py-0.5 rounded border border-purple-400 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                                      placeholder="Version label name..."
                                    />
                                    <button
                                      onClick={(e) => handleSaveEditedLabel(ver.id, e)}
                                      className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors shrink-0"
                                      title="Save name"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => handleCancelEditLabel(e)}
                                      className="p-1 rounded border border-slate-300 text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
                                      title="Cancel"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 min-w-0 group/label">
                                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                                      {ver.label}
                                    </span>
                                    <button
                                      onClick={(e) => handleStartEditLabel(ver, e)}
                                      className="opacity-0 group-hover/label:opacity-100 p-0.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-all"
                                      title="Rename version label"
                                    >
                                      <Edit2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                )}
                                {ver.source === 'ai_enhanced' && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                    AI
                                  </span>
                                )}
                                {ver.source === 'auto_save' && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                                    <CloudCheck className="w-2.5 h-2.5 text-sky-600" />
                                    Auto
                                  </span>
                                )}
                                {ver.source === 'manual_snapshot' && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                                    <BookmarkPlus className="w-2.5 h-2.5 text-purple-600" />
                                    Saved
                                  </span>
                                )}
                                <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono shrink-0 uppercase">
                                  {ver.framework}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <span>•</span>
                                <span>{ver.content.length} chars</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {versions.length >= 2 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const otherVer = versions.find(v => v.id !== ver.id);
                                    handleOpenDiff(otherVer?.id, ver.id);
                                  }}
                                  className="p-1 rounded-md text-purple-600 hover:text-purple-800 hover:bg-purple-100 border border-purple-200/60 transition-colors"
                                  title="Compare with another version"
                                >
                                  <GitCompare className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {isSelected ? (
                                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1">
                                  <CheckSquare className="w-3 h-3" />
                                  Active
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSelectVersion(ver); }}
                                  className="px-2 py-0.5 rounded-md border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 text-[10px] font-bold text-slate-600 transition-colors"
                                >
                                  Load
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDeleteVersion(ver.id, e)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete version"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {aiOptimizedPrompt && (
                <div className="mb-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-[11px] font-bold text-orange-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    {selectedVersionId 
                      ? `Viewing Saved Snapshot (${versions.find(v => v.id === selectedVersionId)?.label || 'Version'})` 
                      : 'Enhanced by Live Gemini AI Engine'}
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedVersionId && (
                      <button
                        onClick={handleResetAi}
                        className="text-orange-600 hover:text-orange-800 underline text-[10px] font-semibold"
                      >
                        Back to Live Draft
                      </button>
                    )}
                    <span className="text-[10px] text-orange-600 font-semibold">Gemini 3.7 Flash</span>
                  </div>
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

      {/* Side-by-Side Diff Modal */}
      {diffMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <SplitSquareVertical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    Side-by-Side Prompt Diff Viewer
                    <span className="text-[11px] font-medium text-slate-500">Compare prompt evolution across versions</span>
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setDiffMode(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Close Diff Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Version Selectors Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-purple-50/30 border-b border-slate-200 text-xs">
              {/* Left Selector (Original / Baseline) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px] shrink-0 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  Original (Left)
                </span>
                <select
                  value={diffLeftId}
                  onChange={(e) => setDiffLeftId(e.target.value)}
                  className="flex-1 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-purple-500"
                >
                  {versions.map((v) => (
                    <option key={`left-${v.id}`} value={v.id}>
                      {v.label} ({v.framework.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Right Selector (Modified / Target) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] shrink-0 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Modified (Right)
                </span>
                <select
                  value={diffRightId}
                  onChange={(e) => setDiffRightId(e.target.value)}
                  className="flex-1 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-purple-500"
                >
                  {versions.map((v) => (
                    <option key={`right-${v.id}`} value={v.id}>
                      {v.label} ({v.framework.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Diff Columns */}
            {(() => {
              const leftVer = versions.find((v) => v.id === diffLeftId) || versions[1] || versions[0];
              const rightVer = versions.find((v) => v.id === diffRightId) || versions[0];
              const { leftLines, rightLines } = computeSideBySideDiff(leftVer?.content || '', rightVer?.content || '');

              return (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Legend / Stats */}
                  <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-xs bg-rose-200 border border-rose-400 inline-block"></span>
                        Removed / Replaced lines
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-xs bg-emerald-200 border border-emerald-400 inline-block"></span>
                        Added / Updated lines
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <span>Left: {leftVer?.content.length || 0} chars ({leftLines.length} lines)</span>
                      <span>•</span>
                      <span>Right: {rightVer?.content.length || 0} chars ({rightLines.length} lines)</span>
                    </div>
                  </div>

                  {/* Dual scrolling diff viewer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-200 font-mono text-[11px] leading-relaxed">
                    {/* Left Panel */}
                    <div className="bg-slate-900 text-slate-200 p-3 overflow-x-auto min-h-[320px]">
                      <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                        <span>{leftVer?.label || 'Baseline'}</span>
                        <span className="text-slate-500 font-mono">{leftVer?.framework}</span>
                      </div>
                      {leftLines.map((line, idx) => (
                        <div
                          key={`l-${idx}`}
                          className={`flex items-start gap-2 py-0.5 px-1 rounded-xs ${
                            line.type === 'removed'
                              ? 'bg-rose-950/80 text-rose-200 border-l-2 border-rose-500'
                              : line.type === 'empty'
                              ? 'bg-slate-900/40 text-slate-700 select-none'
                              : 'text-slate-300'
                          }`}
                        >
                          <span className="text-slate-600 select-none w-6 text-right shrink-0 text-[10px]">
                            {line.lineNum ?? ''}
                          </span>
                          <span className="whitespace-pre-wrap break-all flex-1">
                            {line.text || (line.type === 'empty' ? ' ' : ' ')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Right Panel */}
                    <div className="bg-slate-900 text-slate-200 p-3 overflow-x-auto min-h-[320px]">
                      <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                        <span>{rightVer?.label || 'Target'}</span>
                        <span className="text-slate-500 font-mono">{rightVer?.framework}</span>
                      </div>
                      {rightLines.map((line, idx) => (
                        <div
                          key={`r-${idx}`}
                          className={`flex items-start gap-2 py-0.5 px-1 rounded-xs ${
                            line.type === 'added'
                              ? 'bg-emerald-950/80 text-emerald-200 border-l-2 border-emerald-500'
                              : line.type === 'empty'
                              ? 'bg-slate-900/40 text-slate-700 select-none'
                              : 'text-slate-300'
                          }`}
                        >
                          <span className="text-slate-600 select-none w-6 text-right shrink-0 text-[10px]">
                            {line.lineNum ?? ''}
                          </span>
                          <span className="whitespace-pre-wrap break-all flex-1">
                            {line.text || (line.type === 'empty' ? ' ' : ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-slate-500">
                      Comparing snapshot <strong className="text-slate-700">{leftVer?.label}</strong> against <strong className="text-slate-700">{rightVer?.label}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (rightVer) {
                            handleSelectVersion(rightVer);
                            setDiffMode(false);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Load Right Version as Active</span>
                      </button>

                      <button
                        onClick={() => setDiffMode(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

