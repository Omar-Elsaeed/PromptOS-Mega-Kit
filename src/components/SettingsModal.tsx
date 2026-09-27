import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  Check,
  RotateCcw,
  Download,
  Trash2,
  Sliders,
  Moon,
  Sun,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Database
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onResetTour?: () => void;
  onClearHistory?: () => void;
  onClearFavorites?: () => void;
  favoritesCount?: number;
  historyCount?: number;
}

const STORAGE_SETTINGS_KEY = 'promptos_user_settings_v1';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme = 'light',
  onToggleTheme,
  onResetTour,
  onClearHistory,
  onClearFavorites,
  favoritesCount = 0,
  historyCount = 0
}) => {
  const [defaultFramework, setDefaultFramework] = useState('fable5');
  const [defaultModel, setDefaultModel] = useState('gemini-2.5-flash');
  const [strictJson, setStrictJson] = useState(true);
  const [latencyTelemetry, setLatencyTelemetry] = useState(true);
  const [autoSaveRevisions, setAutoSaveRevisions] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultFramework) setDefaultFramework(parsed.defaultFramework);
        if (parsed.defaultModel) setDefaultModel(parsed.defaultModel);
        if (parsed.strictJson !== undefined) setStrictJson(parsed.strictJson);
        if (parsed.latencyTelemetry !== undefined) setLatencyTelemetry(parsed.latencyTelemetry);
        if (parsed.autoSaveRevisions !== undefined) setAutoSaveRevisions(parsed.autoSaveRevisions);
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const config = {
      defaultFramework,
      defaultModel,
      strictJson,
      latencyTelemetry,
      autoSaveRevisions
    };
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(config));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      app: 'PromptOS',
      version: 'v17.4',
      timestamp: new Date().toISOString(),
      favorites: localStorage.getItem('promptos_favorites_v1') || '[]',
      history: localStorage.getItem('promptos_history_v1') || '[]',
      smartBuilderVersions: localStorage.getItem('promptos_smart_builder_versions_v1') || '[]'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptos_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-md shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                PromptOS Preferences & Settings
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Configure default reasoning engines, framework presets, and storage backups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Framework Defaults */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>Default Prompt Architecture</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'fable5', name: 'Ruben Hassid Fable 5', desc: '11-block agentic delegation' },
                { id: 'ninestep', name: '9-Step Mediation', desc: 'Causal governance & counterfactuals' },
                { id: 'gepa', name: 'GEPA Classic', desc: '6-block goal & expectation' },
                { id: 'gepaplus', name: 'GEPA⁺ Unified', desc: '8-block hybrid with reflection' }
              ].map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setDefaultFramework(fw.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    defaultFramework === fw.id
                      ? 'bg-orange-50/70 border-orange-400 text-orange-950 dark:bg-orange-950/40 dark:border-orange-600 dark:text-orange-200 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <strong className="block text-xs">{fw.name}</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{fw.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model Engine Defaults */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>Default LLM Engine (Benchmark Candidate)</span>
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Sub-400ms • 1M Context)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning • 2M Context)</option>
              <option value="claude-3.7-sonnet">Claude 3.7 Sonnet (Hybrid Thinking • 200k Context)</option>
              <option value="gpt-4o">OpenAI GPT-4o (Frontier Multimodal • 128k Context)</option>
              <option value="deepseek-r1">DeepSeek R1 (Open Reasoning • 64k Context)</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Execution & Guardrails
            </label>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white">
                    Strict JSON Schema Validation
                  </strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enforce structured outputs without markdown formatting leaks
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={strictJson}
                  onChange={(e) => setStrictJson(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white">
                    Real-Time Latency Telemetry
                  </strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Display millisecond timers and token generation speeds during benchmark runs
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={latencyTelemetry}
                  onChange={(e) => setLatencyTelemetry(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white">
                    Auto-Save Prompt Revisions
                  </strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Preserve version snapshots in browser storage for visual diff comparison
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoSaveRevisions}
                  onChange={(e) => setAutoSaveRevisions(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Data & Backup Management */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>Data Management & Backup</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleExportBackup}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
                  <span className="font-bold">Export Vault Backup</span>
                </div>
                <span className="text-[10px] text-slate-400">JSON</span>
              </button>

              {onResetTour && (
                <button
                  onClick={() => {
                    localStorage.removeItem('promptos_onboarding_completed');
                    onResetTour();
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-300 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-orange-600" />
                    <span className="font-bold">Replay Feature Tour</span>
                  </div>
                  <span className="text-[10px] text-slate-400">8 Steps</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {savedSuccess ? 'Settings saved successfully!' : 'All configurations saved locally.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
