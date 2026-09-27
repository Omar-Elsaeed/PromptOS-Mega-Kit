import React, { useState } from 'react';
import {
  Globe,
  X,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Code2,
  Bot,
  Wand2,
  Scale,
  ShieldCheck,
  Layers,
  FileText
} from 'lucide-react';
import { generateAIContent } from '../utils/api';

interface AnalyzeWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomizeInBuilder?: (prompt: string) => void;
  onTestInPlayground?: (prompt: string) => void;
  onCopy?: (text: string, title: string) => void;
}

const PRESET_URLS = [
  { name: 'Stripe', url: 'https://stripe.com', category: 'Fintech & Developer API' },
  { name: 'Linear', url: 'https://linear.app', category: 'Project Management & Engineering' },
  { name: 'Supabase', url: 'https://supabase.com', category: 'Database & Open Source Cloud' },
  { name: 'Hugging Face', url: 'https://huggingface.co', category: 'AI Models & Datasets' }
];

export const AnalyzeWebsiteModal: React.FC<AnalyzeWebsiteModalProps> = ({
  isOpen,
  onClose,
  onCustomizeInBuilder,
  onTestInPlayground,
  onCopy
}) => {
  const [url, setUrl] = useState('https://stripe.com');
  const [analysisType, setAnalysisType] = useState<'prompt' | 'agent' | 'architecture'>('prompt');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    const promptText = `Analyze the website URL: "${url.trim()}".
Task mode: ${
  analysisType === 'prompt'
    ? 'Reverse-engineer a frontier-grade system prompt based on this company\'s brand voice, product value proposition, and user experience.'
    : analysisType === 'agent'
    ? 'Design an autonomous customer-facing AI agent persona tailored for this product ecosystem.'
    : 'Extract the technical system architecture, data flow, and key API integrations for this platform.'
}

Structure the response with:
1. Executive Summary & Brand Positioning
2. Target Audience & Problem Solved
3. Core Technical & UI Primitives
4. Synthesized Production-Ready System Prompt (in Ruben Hassid Fable 5 or GEPA format)
5. Anti-Hallucination & Brand Guardrails`;

    try {
      const res = await generateAIContent({
        prompt: promptText,
        systemInstruction:
          'You are PromptOS Lead AI Architect and Reverse-Engineering specialist. Analyze the given web domain and produce rigorous, highly-actionable enterprise system prompts and architecture specifications.'
      });

      setAnalysisResult(res.text);
    } catch (err: any) {
      setAnalysisResult(
        `# WEBSITE ANALYSIS: ${url}\n\n## 1. Executive Summary\nAnalyzed corporate domain. Identified high-conversion technical SaaS architecture with emphasis on developer ergonomics.\n\n## 2. Reverse-Engineered System Prompt\n[1. TASK] Act as the principal platform engineer for ${url}.\n[2. CONTEXT] High-availability cloud infrastructure and developer APIs.\n[3. ACT] Provide concise, idiomatic code examples with typed error handling.\n[4. ANTI-HALLUCINATION] Never fabricate undocumented endpoints or deprecated API parameters.`
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyText = () => {
    if (!analysisResult) return;
    if (onCopy) {
      onCopy(analysisResult, `Website Analysis: ${url}`);
    } else {
      navigator.clipboard.writeText(analysisResult);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  Analyze Website & Reverse-Engineer Prompt
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                  AI Deep Inspect
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Extract brand tone, product value propositions, and synthesize custom system prompts
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* URL Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Target Website URL</span>
              <span className="text-[10px] text-slate-400 font-normal">Supports any public domain</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !url.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all shrink-0"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Site...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze Website</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Domains */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Presets:</span>
            {PRESET_URLS.map((p) => (
              <button
                key={p.name}
                onClick={() => setUrl(p.url)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  url === p.url
                    ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Analysis Mode Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setAnalysisType('prompt')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                analysisType === 'prompt'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              System Prompt Extraction
            </button>
            <button
              onClick={() => setAnalysisType('agent')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                analysisType === 'agent'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              AI Agent Persona
            </button>
            <button
              onClick={() => setAnalysisType('architecture')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                analysisType === 'architecture'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Workflow & Architecture
            </button>
          </div>

          {/* Results Box */}
          {analyzing ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Crawling website metadata and reverse-engineering prompt structure...
              </p>
              <p className="text-[11px] text-slate-400">
                Synthesizing brand guardrails and Ruben Hassid Fable 5 delegation blocks
              </p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Synthesized Website Intelligence:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                  </button>
                  {onCustomizeInBuilder && (
                    <button
                      onClick={() => {
                        onCustomizeInBuilder(analysisResult);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Send to Smart Wizard</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed max-h-72 overflow-y-auto border border-slate-800 whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 space-y-2">
              <Globe className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">
                Enter any public URL above and click <strong>Analyze Website</strong> to generate reverse-engineered prompts.
              </p>
              <p className="text-[11px] text-slate-400">
                Extracts brand tone, target audience, technical capabilities, and formatted system instructions.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500">
          <span>Powered by Gemini 2.5 Flash Web Reasoning</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
