import React, { useState, useMemo } from 'react';
import {
  Download,
  FileJson,
  FileCode,
  Check,
  X,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Sliders,
  FileText
} from 'lucide-react';
import { PromptItem } from '../types';
import {
  ExportFormat,
  ExportCategory,
  generatePromptExport,
  triggerFileDownload
} from '../utils/promptExporters';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrompts: PromptItem[];
  onClearSelection: () => void;
  onSelectAllPage: () => void;
  isAllPageSelected: boolean;
  totalPagePromptsCount: number;
  onNavigateToFineTuning?: () => void;
}

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  isOpen,
  onClose,
  selectedPrompts,
  onClearSelection,
  onSelectAllPage,
  isAllPageSelected,
  totalPagePromptsCount,
  onNavigateToFineTuning
}) => {
  const [activeCategory, setActiveCategory] = useState<ExportCategory>('local_storage');
  const [format, setFormat] = useState<ExportFormat>('json_full');
  const [selectedFramework, setSelectedFramework] = useState<'all' | 'gepa' | 'fable5' | 'gepaplus' | 'ninestep'>('all');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const count = selectedPrompts.length;

  // Generate preview or full export in real time
  const currentExport = useMemo(() => {
    if (count === 0) return null;
    return generatePromptExport(selectedPrompts, {
      format,
      framework: selectedFramework,
      includeMetadata
    });
  }, [selectedPrompts, format, selectedFramework, includeMetadata, count]);

  if (!isOpen) return null;

  const handleExecuteExport = () => {
    if (!currentExport || count === 0) return;
    setIsExporting(true);

    try {
      triggerFileDownload(currentExport.content, currentExport.filename, currentExport.mimeType);
      setExportedSuccess(true);
      setTimeout(() => {
        setExportedSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Batch export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!currentExport) return;
    navigator.clipboard.writeText(currentExport.content);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                Export Prompts & Datasets
                <span className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                  {count} {count === 1 ? 'Prompt' : 'Prompts'} Selected
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Export to JSON or YAML files for local storage or LLM fine-tuning datasets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs: Local Storage vs Fine-Tuning Datasets */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950 px-4 pt-2 gap-2">
          <button
            onClick={() => {
              setActiveCategory('local_storage');
              if (format.startsWith('jsonl_') || format === 'json_alpaca' || format === 'yaml_dataset') {
                setFormat('json_full');
              }
            }}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeCategory === 'local_storage'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Local Storage & Configs</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('finetuning');
              if (format === 'json_full' || format === 'yaml_local' || format.startsWith('markdown_')) {
                setFormat('jsonl_chatml');
              }
            }}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeCategory === 'finetuning'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>LLM Fine-Tuning Datasets</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
              SFT / DPO
            </span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto max-h-[68vh]">
          {/* Quick Selection Helper */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAllPage}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400"
              >
                {isAllPageSelected ? (
                  <CheckSquare className="w-4 h-4 text-orange-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Select current page ({totalPagePromptsCount})</span>
              </button>
            </div>

            {count > 0 && (
              <button
                onClick={onClearSelection}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Format Selector: Category 1 (Local Storage) */}
          {activeCategory === 'local_storage' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Select Local Storage Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* JSON Local */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'json_full'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileJson className="w-4 h-4 text-blue-500" />
                      <span>Structured JSON (.json)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'json_full'}
                      onChange={() => setFormat('json_full')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Programmatic JSON manifest with prompt schemas, variants, and role metadata for local databases.
                  </p>
                </label>

                {/* YAML Local */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'yaml_local'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileCode className="w-4 h-4 text-emerald-500" />
                      <span>Clean YAML (.yaml)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'yaml_local'}
                      onChange={() => setFormat('yaml_local')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Human-readable YAML 1.2 manifest with multiline scalar blocks for prompt repos and Git configs.
                  </p>
                </label>

                {/* Markdown */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'markdown_playgrounds'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <span>Markdown Bundle (.md)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'markdown_playgrounds'}
                      onChange={() => setFormat('markdown_playgrounds')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Table of contents, formatted markdown blocks, and comparison tables.
                  </p>
                </label>

                {/* Raw Text */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'markdown_raw'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Layers className="w-4 h-4 text-purple-500" />
                      <span>Plain Text Stream (.txt)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'markdown_raw'}
                      onChange={() => setFormat('markdown_raw')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Concatenated prompt stream with delimiter dividers for quick clipboard paste.
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Format Selector: Category 2 (Fine-Tuning Datasets) */}
          {activeCategory === 'finetuning' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Select Fine-Tuning Architecture & Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* ChatML / OpenAI JSONL */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'jsonl_chatml'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>ChatML / OpenAI JSONL (.jsonl)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'jsonl_chatml'}
                      onChange={() => setFormat('jsonl_chatml')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Industry standard system/user/assistant turn pairs. Ready for OpenAI, Gemini, Together, and Unsloth.
                  </p>
                </label>

                {/* Alpaca / Instruction Dataset */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'json_alpaca'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileJson className="w-4 h-4 text-amber-500" />
                      <span>Alpaca Instruction JSON (.json)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'json_alpaca'}
                      onChange={() => setFormat('json_alpaca')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Instruction-Input-Output format for LLaMA-Factory, Axolotl, Qwen, and DeepSeek fine-tuning.
                  </p>
                </label>

                {/* DPO Preference Pairs */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'jsonl_dpo'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Cpu className="w-4 h-4 text-indigo-500" />
                      <span>DPO Alignment Pairs (.jsonl)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'jsonl_dpo'}
                      onChange={() => setFormat('jsonl_dpo')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Direct Preference Optimization dataset with chosen (expert) and rejected (shallow) responses.
                  </p>
                </label>

                {/* YAML Fine-Tuning Corpus */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    format === 'yaml_dataset'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileCode className="w-4 h-4 text-purple-500" />
                      <span>YAML Training Corpus (.yaml)</span>
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === 'yaml_dataset'}
                      onChange={() => setFormat('yaml_dataset')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    Structured YAML dataset specification compatible with Ollama Modelfile and Hugging Face loaders.
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Framework Variant Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Target Reasoning Framework:
              </label>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
              >
                <option value="all">✦ All Architectures (Complete Bundle)</option>
                <option value="ninestep">🧠 9-Step Cognitive Mediation</option>
                <option value="fable5">✦ Ruben Hassid Fable 5 Framework</option>
                <option value="gepaplus">⚡ GEPA⁺ Unified 8-Block</option>
                <option value="gepa">📋 GEPA Classic 6-Block</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showPreview ? 'Hide File Preview' : 'Show File Preview'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          {showPreview && currentExport && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>Preview: {currentExport.filename}</span>
                <span>{(new Blob([currentExport.content]).size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto border border-slate-800 custom-scrollbar select-text">
                <pre>{currentExport.content.slice(0, 2000)}{currentExport.content.length > 2000 ? '\n... (truncated for preview)' : ''}</pre>
              </div>
            </div>
          )}

          {/* Success messages */}
          {copiedSuccess && (
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Full export copied to clipboard!</span>
            </div>
          )}

          {exportedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>File download initiated ({currentExport?.filename})!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {onNavigateToFineTuning && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFineTuning();
                }}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1"
                title="Open Fine-Tuning Studio to configure LoRA or synthetic expansion"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Fine-Tuning Studio</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToClipboard}
              disabled={count === 0}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleExecuteExport}
              disabled={count === 0 || isExporting}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                count === 0 || isExporting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-orange-500/20'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : `Download ${format.endsWith('yaml') ? 'YAML' : format.includes('json') ? 'JSON' : 'File'} (${count})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
