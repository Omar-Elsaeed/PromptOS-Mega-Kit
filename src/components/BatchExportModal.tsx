import React, { useState } from 'react';
import { Download, FileJson, FileText, Check, X, Layers, Sparkles, CheckSquare, Square } from 'lucide-react';
import { PromptItem } from '../types';
import {
  buildGEPAPrompt,
  buildFable5Prompt,
  buildGEPAPlusPrompt,
  buildNineStepPrompt,
  getSkillsForNiche
} from '../utils/promptGenerators';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrompts: PromptItem[];
  onClearSelection: () => void;
  onSelectAllPage: () => void;
  isAllPageSelected: boolean;
  totalPagePromptsCount: number;
}

export type ExportFormat = 'json_full' | 'json_openai_evals' | 'markdown_playgrounds' | 'markdown_raw';

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  isOpen,
  onClose,
  selectedPrompts,
  onClearSelection,
  onSelectAllPage,
  isAllPageSelected,
  totalPagePromptsCount
}) => {
  const [format, setFormat] = useState<ExportFormat>('markdown_playgrounds');
  const [selectedFramework, setSelectedFramework] = useState<'all' | 'gepa' | 'fable5' | 'gepaplus' | 'ninestep'>('all');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  if (!isOpen) return null;

  const count = selectedPrompts.length;

  const handleExecuteExport = () => {
    if (count === 0) return;
    setIsExporting(true);

    try {
      let content = '';
      let filename = `promptos_export_${count}_prompts_${new Date().toISOString().slice(0, 10)}`;
      let mimeType = 'text/plain;charset=utf-8';

      if (format === 'json_full') {
        // Universal JSON schema suitable for LangSmith, LangFuse, Weights & Biases, or custom prompt pipelines
        const exportData = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedCount: count,
          targetFramework: selectedFramework,
          prompts: selectedPrompts.map((p, idx) => {
            const gepa = buildGEPAPrompt(p.title, p.niche, p.role, p.difficulty);
            const fable5 = buildFable5Prompt(p.title, p.niche, p.role, p.difficulty);
            const gepaplus = buildGEPAPlusPrompt(p.title, p.niche, p.role, p.difficulty);
            const ninestep = buildNineStepPrompt(p.title, p.niche, p.role, p.difficulty);
            const skills = getSkillsForNiche(p.niche, p.difficulty, parseInt(p.id.replace('c', '')) || 1);

            return {
              id: p.id,
              index: idx + 1,
              title: p.title,
              niche: p.niche,
              role: p.role,
              difficulty: p.difficulty,
              framework: p.framework,
              requiredSkills: skills,
              variants: {
                gepa_6block: selectedFramework === 'all' || selectedFramework === 'gepa' ? gepa : undefined,
                fable_5block: selectedFramework === 'all' || selectedFramework === 'fable5' ? fable5 : undefined,
                gepa_plus: selectedFramework === 'all' || selectedFramework === 'gepaplus' ? gepaplus : undefined,
                nine_step_cognitive: selectedFramework === 'all' || selectedFramework === 'ninestep' ? ninestep : undefined
              },
              primaryPromptText:
                selectedFramework === 'gepa' ? gepa :
                selectedFramework === 'fable5' ? fable5 :
                selectedFramework === 'gepaplus' ? gepaplus :
                selectedFramework === 'ninestep' ? ninestep : ninestep
            };
          })
        };
        content = JSON.stringify(exportData, null, 2);
        filename += '.json';
        mimeType = 'application/json;charset=utf-8';

      } else if (format === 'json_openai_evals') {
        // OpenAI Playground / Anthropic Console / OpenRouter system-user chat messages format
        const evalsData = selectedPrompts.map((p) => {
          const promptBody =
            selectedFramework === 'gepa' ? buildGEPAPrompt(p.title, p.niche, p.role, p.difficulty) :
            selectedFramework === 'fable5' ? buildFable5Prompt(p.title, p.niche, p.role, p.difficulty) :
            selectedFramework === 'gepaplus' ? buildGEPAPlusPrompt(p.title, p.niche, p.role, p.difficulty) :
            buildNineStepPrompt(p.title, p.niche, p.role, p.difficulty);

          return {
            name: p.title,
            description: `${p.niche} • ${p.role} (${p.difficulty})`,
            messages: [
              {
                role: 'system',
                content: `You are an expert ${p.role} specializing in ${p.niche}. Calibrate your reasoning depth to ${p.difficulty} level standard.`
              },
              {
                role: 'user',
                content: promptBody
              }
            ],
            metadata: {
              niche: p.niche,
              difficulty: p.difficulty,
              framework: selectedFramework
            }
          };
        });
        content = JSON.stringify(evalsData, null, 2);
        filename += '_evals.json';
        mimeType = 'application/json;charset=utf-8';

      } else if (format === 'markdown_playgrounds') {
        // Structured Markdown bundle with Table of Contents and Playground delimiters
        let md = `# PromptOS Master Prompts Export\n\n`;
        md += `> **Exported:** ${new Date().toLocaleString()}  \n`;
        md += `> **Count:** ${count} Prompts  \n`;
        md += `> **Framework Filter:** ${selectedFramework.toUpperCase()}  \n\n`;

        md += `## Table of Contents\n\n`;
        selectedPrompts.forEach((p, idx) => {
          const anchor = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          md += `${idx + 1}. [${p.title}](#${anchor}) — *${p.niche} (${p.difficulty})*\n`;
        });
        md += `\n---\n\n`;

        selectedPrompts.forEach((p, idx) => {
          const gepa = buildGEPAPrompt(p.title, p.niche, p.role, p.difficulty);
          const fable5 = buildFable5Prompt(p.title, p.niche, p.role, p.difficulty);
          const gepaplus = buildGEPAPlusPrompt(p.title, p.niche, p.role, p.difficulty);
          const ninestep = buildNineStepPrompt(p.title, p.niche, p.role, p.difficulty);
          const skills = getSkillsForNiche(p.niche, p.difficulty, parseInt(p.id.replace('c', '')) || 1);

          md += `## ${idx + 1}. ${p.title}\n\n`;

          if (includeMetadata) {
            md += `| Attribute | Details |\n`;
            md += `| :--- | :--- |\n`;
            md += `| **Niche** | ${p.niche} |\n`;
            md += `| **Role / Persona** | ${p.role} |\n`;
            md += `| **Complexity** | ${p.difficulty} |\n`;
            md += `| **Recommended Skills** | ${skills.slice(0, 4).join(', ')} |\n\n`;
          }

          if (selectedFramework === 'all') {
            md += `### 9-Step Cognitive Mediation Framework\n\n\`\`\`markdown\n${ninestep}\n\`\`\`\n\n`;
            md += `### Ruben Hassid Fable 5 Framework\n\n\`\`\`markdown\n${fable5}\n\`\`\`\n\n`;
            md += `### GEPA Classic 6-Block Framework\n\n\`\`\`markdown\n${gepa}\n\`\`\`\n\n`;
            md += `### GEPA⁺ Unified Architecture\n\n\`\`\`markdown\n${gepaplus}\n\`\`\`\n\n`;
          } else if (selectedFramework === 'ninestep') {
            md += `\`\`\`markdown\n${ninestep}\n\`\`\`\n\n`;
          } else if (selectedFramework === 'fable5') {
            md += `\`\`\`markdown\n${fable5}\n\`\`\`\n\n`;
          } else if (selectedFramework === 'gepaplus') {
            md += `\`\`\`markdown\n${gepaplus}\n\`\`\`\n\n`;
          } else {
            md += `\`\`\`markdown\n${gepa}\n\`\`\`\n\n`;
          }

          md += `---\n\n`;
        });

        content = md;
        filename += '.md';
        mimeType = 'text/markdown;charset=utf-8';

      } else {
        // Plain raw text / playground copy stream
        let raw = '';
        selectedPrompts.forEach((p, idx) => {
          const promptBody =
            selectedFramework === 'gepa' ? buildGEPAPrompt(p.title, p.niche, p.role, p.difficulty) :
            selectedFramework === 'fable5' ? buildFable5Prompt(p.title, p.niche, p.role, p.difficulty) :
            selectedFramework === 'gepaplus' ? buildGEPAPlusPrompt(p.title, p.niche, p.role, p.difficulty) :
            buildNineStepPrompt(p.title, p.niche, p.role, p.difficulty);

          raw += `### PROMPT ${idx + 1}: ${p.title.toUpperCase()}\n`;
          raw += `// Niche: ${p.niche} | Role: ${p.role} | Difficulty: ${p.difficulty}\n\n`;
          raw += `${promptBody}\n\n`;
          raw += `${'='.repeat(60)}\n\n`;
        });
        content = raw;
        filename += '.txt';
        mimeType = 'text/plain;charset=utf-8';
      }

      // Trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                Batch Export Prompts
                <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold">
                  {count} {count === 1 ? 'Prompt' : 'Prompts'} Selected
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Compatible with OpenAI Playground, LM Studio, Ollama, LangChain & LLM evals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Quick Selection Helper */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAllPage}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600"
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
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Export Format Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Select Output Format:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  format === 'markdown_playgrounds'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-950 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span>Markdown Playground (.md)</span>
                  </div>
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'markdown_playgrounds'}
                    onChange={() => setFormat('markdown_playgrounds')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  TOC index, clean markdown codeblocks, metadata tables & delimiter sections.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  format === 'json_full'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-950 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
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
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Full programmatic schema with all 4 framework variants and niche metadata.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  format === 'json_openai_evals'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-950 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>OpenAI / Chat Evals JSON</span>
                  </div>
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'json_openai_evals'}
                    onChange={() => setFormat('json_openai_evals')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Chat format (`system`, `user` messages) ready for model testing and evals.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  format === 'markdown_raw'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-950 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
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
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Minimalist single-file concatenated text feed with header breaks.
                </p>
              </label>
            </div>
          </div>

          {/* Framework Variant Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Reasoning Framework Architecture:
            </label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-orange-500"
            >
              <option value="all">✦ All 4 Architectures (Complete Bundle)</option>
              <option value="ninestep">9-Step Cognitive Mediation & Causal Governance</option>
              <option value="fable5">Ruben Hassid Fable 5 Framework</option>
              <option value="gepaplus">GEPA⁺ Unified 8-Block Framework</option>
              <option value="gepa">GEPA Classic 6-Block Framework</option>
            </select>
          </div>

          {/* Optional Toggles */}
          {format.startsWith('markdown') && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="includeMetadata"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="includeMetadata" className="text-xs text-slate-700 font-medium select-none cursor-pointer">
                Include niche, role persona, difficulty, and skill requirements table
              </label>
            </div>
          )}

          {exportedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Export generated and download initiated successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/80">
          <span className="text-[11px] text-slate-500">
            {count === 0 ? 'Select prompts to export' : `Ready to package ${count} items`}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
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
              <span>{isExporting ? 'Generating...' : `Export ${count} Prompts`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
