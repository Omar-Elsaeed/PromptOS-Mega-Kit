import React, { useState } from 'react';
import { Bot, Play, Sparkles, Copy, Check, RotateCcw, Thermometer, Sliders, ShieldCheck, Flame, Loader2, Zap } from 'lucide-react';
import { generateAIContent } from '../utils/api';
import { PromptItem } from '../types';

interface AgentPlaygroundProps {
  onCopy: (text: string, title: string) => void;
  initialPrompt?: PromptItem | null;
}

export const AgentPlayground: React.FC<AgentPlaygroundProps> = ({ onCopy, initialPrompt }) => {
  const [systemPrompt, setSystemPrompt] = useState(
    initialPrompt ? `You are an expert specialist in ${initialPrompt.niche}.\nRole: ${initialPrompt.role}.\nFollow the precision guidelines and output structured, actionable content.`
    : 'You are a senior AI precision engineer. Answer directly, structured, and accurately with verified logic.'
  );
  const [userPrompt, setUserPrompt] = useState(
    initialPrompt ? (initialPrompt.fable || initialPrompt.gepa || initialPrompt.title) : 'Outline a 5-step operational strategy to scale enterprise client onboarding with zero data loss.'
  );
  const [model, setModel] = useState('gemini-3.7-flash');
  const [temperature, setTemperature] = useState(0.3);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: '🚀 GTM Launch Plan', task: 'Create a 30-day go-to-market execution roadmap for an enterprise B2B SaaS platform.' },
    { label: '🛡️ Security Audit', task: 'Audit this authentication flow for token hijacking and session fixation risks: JWT stored in localStorage.' },
    { label: '🤖 Multi-Agent Logic', task: 'Design a 3-agent supervisor graph for automated competitive intelligence and executive reporting.' },
    { label: '📊 Financial Unit Economics', task: 'Calculate LTV:CAC, payback period, and Net Dollar Retention metrics for a $10M ARR subscription service.' },
  ];

  const handleExecute = async () => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setResponse(null);

    const res = await generateAIContent({
      prompt: userPrompt,
      systemInstruction: systemPrompt,
      model,
      temperature
    });

    setResponse(res.text);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!response) return;
    onCopy(response, 'Agent Playground Response');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
          <span>⚡ Live Gemini Agentic Playground</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Test & Execute Any Prompt in{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Real Time
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Powered by live Gemini 3.7 Flash & 3.1 Pro APIs. Tune temperature, edit system directives, and stream outputs directly.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Quick Test:</span>
        {presets.map((pr, idx) => (
          <button
            key={idx}
            onClick={() => setUserPrompt(pr.task)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-xs font-medium text-slate-700 whitespace-nowrap shadow-2xs hover:bg-orange-50/50 transition-all"
          >
            {pr.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            {/* System Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                System Prompt (Persona & Guidelines)
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            {/* User Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                User Prompt / Task
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            {/* Controls: Model & Temperature */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Model Engine</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="gemini-3.7-flash">Gemini 3.7 Flash (Default)</option>
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Temperature</span>
                  <span className="font-mono text-orange-600 font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing live through Gemini...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Prompt Live</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-orange-500" />
                  Model Output Stream
                </span>

                {response && (
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Output'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Generating live structured response...</span>
                </div>
              ) : response ? (
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto shadow-inner">
                  {response}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center mb-3 text-orange-500 shadow-2xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-1">Awaiting Execution</h4>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Click "Execute Prompt Live" to run this prompt through the Gemini model engine and inspect performance.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Live server-side execution proxy
              </span>
              <span className="text-slate-400 font-mono">Engine: {model}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
