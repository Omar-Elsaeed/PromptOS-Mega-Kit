import React, { useState } from 'react';
import { Bot, Copy, Check, Download, Sparkles, CheckCircle2, ShieldCheck, RefreshCw, Terminal, Layers } from 'lucide-react';
import { AGENT_BLUEPRINT_PRESETS } from '../data/templates';
import { AgentBlueprintPreset } from '../types';

interface AgentBlueprintBuilderProps {
  onCopy: (text: string, title: string) => void;
}

export const AgentBlueprintBuilder: React.FC<AgentBlueprintBuilderProps> = ({ onCopy }) => {
  const [selectedPreset, setSelectedPreset] = useState<AgentBlueprintPreset>(AGENT_BLUEPRINT_PRESETS[0]);
  const [agentRole, setAgentRole] = useState(selectedPreset.role);
  const [agentGoal, setAgentGoal] = useState(selectedPreset.goal);
  const [agentAutonomy, setAgentAutonomy] = useState(selectedPreset.autonomyLevel);
  const [maxIterations, setMaxIterations] = useState(selectedPreset.maxIterations);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (preset: AgentBlueprintPreset) => {
    setSelectedPreset(preset);
    setAgentRole(preset.role);
    setAgentGoal(preset.goal);
    setAgentAutonomy(preset.autonomyLevel);
    setMaxIterations(preset.maxIterations);
  };

  const generateFullBlueprint = () => {
    return `# AGENT PRODUCTION BLUEPRINT: ${selectedPreset.name.toUpperCase()}
# Framework Version: v17.4 Agentic Specification

══════════════════════════════════════════════════════════════════════════════
1. IDENTITY & CONTRACT
══════════════════════════════════════════════════════════════════════════════
Role: ${agentRole}
Primary Goal: ${agentGoal}
Autonomy Level: ${agentAutonomy}
Max Iteration Budget: ${maxIterations} turns

══════════════════════════════════════════════════════════════════════════════
2. CORE CAPABILITIES & TOOLS
══════════════════════════════════════════════════════════════════════════════
${selectedPreset.tools.map(t => `- ${t}`).join('\n')}

══════════════════════════════════════════════════════════════════════════════
3. DETERMINISTIC COMPLETION CRITERIA (STOP CONDITIONS)
══════════════════════════════════════════════════════════════════════════════
${selectedPreset.completionCriteria.map(c => `[✓] ${c}`).join('\n')}

══════════════════════════════════════════════════════════════════════════════
4. ERROR HANDLING & RETRY CONTRACT
══════════════════════════════════════════════════════════════════════════════
- Max Retries per Subtask: ${selectedPreset.retryContract.maxRetries}
- Fallback Action: ${selectedPreset.retryContract.fallbackAction}
- Human Escalation Threshold: ${selectedPreset.retryContract.escalationThreshold}

══════════════════════════════════════════════════════════════════════════════
5. SYSTEM PROMPT (PRODUCTION READY)
══════════════════════════════════════════════════════════════════════════════
${selectedPreset.systemPrompt}`;
  };

  const blueprintContent = generateFullBlueprint();

  const handleCopyBlueprint = () => {
    onCopy(blueprintContent, `Agent Blueprint — ${selectedPreset.name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([blueprintContent], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `agent_blueprint_${selectedPreset.name.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Bot className="w-3.5 h-3.5 text-orange-500" />
          <span>🤖 Autonomous Agent Blueprint Architect</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Enterprise Agentic Systems &{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Deterministic Contracts
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Design resilient autonomous agents with tool schemas, deterministic stop conditions, and human-in-the-loop escalation rules.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preset Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Agent Preset ({AGENT_BLUEPRINT_PRESETS.length} Archetypes)
          </h3>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {AGENT_BLUEPRINT_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-orange-50/80 border-orange-400 shadow-xs ring-1 ring-orange-400/30'
                      : 'bg-white border-slate-200/90 hover:border-orange-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{preset.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100/70 text-orange-800 shrink-0">
                      {preset.autonomyLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {preset.goal}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Blueprint Configuration & Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            {/* Live Parameter Tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agent Role Identity</label>
                <input
                  type="text"
                  value={agentRole}
                  onChange={(e) => setAgentRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Autonomy Level</label>
                <select
                  value={agentAutonomy}
                  onChange={(e) => setAgentAutonomy(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                >
                  <option value="Semi-Autonomous">Semi-Autonomous (Human Checkpoints)</option>
                  <option value="Fully Autonomous">Fully Autonomous (Self-Directing)</option>
                  <option value="Supervised">Supervised (Approval on Tools)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Mission Goal</label>
                <input
                  type="text"
                  value={agentGoal}
                  onChange={(e) => setAgentGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Generated Blueprint Code View */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Agentic Specification</span>
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyBlueprint}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Blueprint'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-orange-200 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                {blueprintContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
