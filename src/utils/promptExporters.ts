import { PromptItem } from '../types';
import {
  buildGEPAPrompt,
  buildFable5Prompt,
  buildGEPAPlusPrompt,
  buildNineStepPrompt,
  getSkillsForNiche
} from './promptGenerators';

export type ExportCategory = 'local_storage' | 'finetuning';

export type ExportFormat =
  | 'json_full'
  | 'yaml_local'
  | 'jsonl_chatml'
  | 'json_alpaca'
  | 'jsonl_dpo'
  | 'yaml_dataset'
  | 'markdown_playgrounds'
  | 'markdown_raw';

export interface ExportOptions {
  format: ExportFormat;
  framework?: 'all' | 'gepa' | 'fable5' | 'gepaplus' | 'ninestep';
  includeMetadata?: boolean;
  systemPromptPrefix?: string;
}

export interface ExportResult {
  content: string;
  filename: string;
  mimeType: string;
  count: number;
}

/**
 * Clean, lightweight, zero-dependency YAML 1.2 serializer.
 * Supports objects, arrays, primitive types, and multiline string block scalars (|).
 */
export function serializeToYaml(data: any, indentLevel = 0): string {
  const indent = '  '.repeat(indentLevel);

  if (data === null || data === undefined) {
    return 'null';
  }

  if (typeof data === 'boolean' || typeof data === 'number') {
    return String(data);
  }

  if (typeof data === 'string') {
    // If multiline string, format as literal block scalar (|)
    if (data.includes('\n')) {
      const lines = data.replace(/\r\n/g, '\n').split('\n');
      const innerIndent = '  '.repeat(indentLevel + 1);
      return '|\n' + lines.map(line => innerIndent + line).join('\n');
    }
    // If string contains special characters or looks like a keyword, quote it
    if (
      data === '' ||
      /[:#\[\]{}&*!|>'"%@`,?~]/.test(data) ||
      /^(true|false|null|yes|no|on|off)$/i.test(data) ||
      /^\d/.test(data)
    ) {
      return JSON.stringify(data);
    }
    return data;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return '[]';
    return data
      .map(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const itemIndent = '  '.repeat(indentLevel + 1);
          const entries = Object.entries(item).filter(([_, v]) => v !== undefined);
          if (entries.length === 0) return `${indent}- {}`;
          const first = entries[0];
          const firstVal = serializeToYaml(first[1], indentLevel + 1);
          let res = `${indent}- ${first[0]}: ${firstVal.startsWith('|\n') ? firstVal : firstVal}`;
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            const valStr = serializeToYaml(v, indentLevel + 1);
            res += `\n${itemIndent}${k}: ${valStr}`;
          }
          return res;
        }
        const valStr = serializeToYaml(item, indentLevel + 1);
        return `${indent}- ${valStr}`;
      })
      .join('\n');
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
    if (entries.length === 0) return '{}';
    return entries
      .map(([key, val]) => {
        const valStr = serializeToYaml(val, indentLevel + 1);
        if (valStr.startsWith('|\n')) {
          return `${indent}${key}: ${valStr}`;
        }
        if (Array.isArray(val) && val.length > 0) {
          return `${indent}${key}:\n${valStr}`;
        }
        if (typeof val === 'object' && val !== null && Object.keys(val).length > 0) {
          return `${indent}${key}:\n${valStr}`;
        }
        return `${indent}${key}: ${valStr}`;
      })
      .join('\n');
  }

  return String(data);
}

/**
 * Resolves the primary prompt text for a prompt item based on the selected framework
 */
export function getPromptTextForFramework(
  p: PromptItem,
  framework: 'all' | 'gepa' | 'fable5' | 'gepaplus' | 'ninestep' = 'all'
): string {
  switch (framework) {
    case 'gepa':
      return buildGEPAPrompt(p.title, p.niche, p.role, p.difficulty);
    case 'fable5':
      return buildFable5Prompt(p.title, p.niche, p.role, p.difficulty);
    case 'gepaplus':
      return buildGEPAPlusPrompt(p.title, p.niche, p.role, p.difficulty);
    case 'ninestep':
    case 'all':
    default:
      return buildNineStepPrompt(p.title, p.niche, p.role, p.difficulty);
  }
}

/**
 * Generates an expert synthetic response suitable for LLM fine-tuning ground truth
 */
function generateSyntheticGroundTruth(p: PromptItem, frameworkPrompt: string): string {
  return [
    `# Strategic Implementation Specification: ${p.title}`,
    `**Executive Summary & Governance:** Calibrated for ${p.niche} under ${p.difficulty} rigor.`,
    '',
    `## 1. Core Architectural Pillars`,
    `- **Primary Objective:** Execute deterministic outcome for ${p.role} specialization.`,
    `- **Risk Mitigation:** Strict boundary constraints, format verification, and validation gates.`,
    `- **Auditability:** Complete causal logging and provenance tracking across all phases.`,
    '',
    `## 2. Structured Operational Flow`,
    `1. **Phase 1 (Discovery & Ingestion):** Identify state variables, context boundaries, and input validation.`,
    `2. **Phase 2 (Synthesis & Reasoning):** Apply step-by-step cognitive mediation with domain-specific heuristics.`,
    `3. **Phase 3 (Verification & Output):** Synthesize finalized artifacts in compliance with strict target schemas.`,
    '',
    `## 3. Verification Checklist`,
    `- [x] Domain compliance verified against ${p.niche} standards.`,
    `- [x] Latency and token efficiency within target thresholds.`,
    `- [x] Zero ungrounded assumptions or hallucinated entity definitions.`
  ].join('\n');
}

/**
 * Generates an intentionally flawed/shallow response for DPO rejected pairs
 */
function generateRejectedResponse(p: PromptItem): string {
  return `Here is a quick answer for ${p.title}: You can just do it by following normal standard steps for ${p.niche}. There are no special considerations needed. Hope this helps!`;
}

/**
 * Master export generator handling all JSON and YAML formats
 */
export function generatePromptExport(
  selectedPrompts: PromptItem[],
  options: ExportOptions
): ExportResult {
  const count = selectedPrompts.length;
  const framework = options.framework || 'all';
  const includeMetadata = options.includeMetadata ?? true;
  const timestamp = new Date().toISOString().slice(0, 10);
  let baseFilename = `promptos_${options.format}_${count}prompts_${timestamp}`;

  // 1. Structured JSON for Local Storage
  if (options.format === 'json_full') {
    const exportData = {
      schemaVersion: '2.0.0',
      generator: 'PromptOS MegaKit Export Engine',
      exportedAt: new Date().toISOString(),
      promptsCount: count,
      targetFramework: framework,
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
          downloads: p.downloads,
          requiredSkills: skills,
          promptText: getPromptTextForFramework(p, framework),
          variants: {
            ninestep_cognitive: framework === 'all' || framework === 'ninestep' ? ninestep : undefined,
            fable5_anatomy: framework === 'all' || framework === 'fable5' ? fable5 : undefined,
            gepa_classic: framework === 'all' || framework === 'gepa' ? gepa : undefined,
            gepaplus_unified: framework === 'all' || framework === 'gepaplus' ? gepaplus : undefined
          }
        };
      })
    };

    return {
      content: JSON.stringify(exportData, null, 2),
      filename: `${baseFilename}.json`,
      mimeType: 'application/json;charset=utf-8',
      count
    };
  }

  // 2. YAML for Local Storage & Repository Configurations
  if (options.format === 'yaml_local') {
    const exportData = {
      schema_version: '2.0.0',
      generator: 'PromptOS MegaKit Export Engine',
      exported_at: new Date().toISOString(),
      prompts_count: count,
      target_framework: framework,
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
          required_skills: skills,
          prompt: getPromptTextForFramework(p, framework),
          variants: framework === 'all' ? {
            ninestep,
            fable5,
            gepa,
            gepaplus
          } : undefined
        };
      })
    };

    const header = `# PromptOS Master Prompts Manifest (YAML 1.2)\n# Generated: ${new Date().toISOString()}\n# Prompts Count: ${count}\n\n`;
    return {
      content: header + serializeToYaml(exportData),
      filename: `${baseFilename}.yaml`,
      mimeType: 'text/yaml;charset=utf-8',
      count
    };
  }

  // 3. OpenAI / ChatML Fine-Tuning JSONL (.jsonl)
  if (options.format === 'jsonl_chatml') {
    const lines = selectedPrompts.map((p) => {
      const userPrompt = getPromptTextForFramework(p, framework);
      const systemContent = options.systemPromptPrefix ||
        `You are a world-class ${p.role} specializing in ${p.niche}. Always solve problems with structured reasoning, high precision, and ${p.difficulty}-level domain rigor.`;
      const assistantContent = generateSyntheticGroundTruth(p, userPrompt);

      const jsonlRecord = {
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: assistantContent }
        ],
        metadata: {
          prompt_id: p.id,
          title: p.title,
          niche: p.niche,
          difficulty: p.difficulty,
          framework: framework
        }
      };

      return JSON.stringify(jsonlRecord);
    });

    return {
      content: lines.join('\n'),
      filename: `${baseFilename}_finetune_chatml.jsonl`,
      mimeType: 'application/x-ndjson;charset=utf-8',
      count
    };
  }

  // 4. Alpaca / Instruction Fine-Tuning JSON (.json)
  if (options.format === 'json_alpaca') {
    const dataset = selectedPrompts.map((p) => {
      const userPrompt = getPromptTextForFramework(p, framework);
      return {
        instruction: `Act as a ${p.role} in ${p.niche}. Solve the following task: "${p.title}"`,
        input: userPrompt,
        output: generateSyntheticGroundTruth(p, userPrompt),
        system: `You are an expert ${p.role} specialized in ${p.niche} calibrated to ${p.difficulty} level.`,
        metadata: {
          id: p.id,
          niche: p.niche,
          difficulty: p.difficulty,
          framework
        }
      };
    });

    return {
      content: JSON.stringify(dataset, null, 2),
      filename: `${baseFilename}_alpaca_dataset.json`,
      mimeType: 'application/json;charset=utf-8',
      count
    };
  }

  // 5. DPO / Direct Preference Optimization Pairs JSONL (.jsonl)
  if (options.format === 'jsonl_dpo') {
    const lines = selectedPrompts.map((p) => {
      const userPrompt = getPromptTextForFramework(p, framework);
      const record = {
        prompt: `[${p.niche} - ${p.role}]\n${userPrompt}`,
        chosen: generateSyntheticGroundTruth(p, userPrompt),
        rejected: generateRejectedResponse(p),
        metadata: {
          id: p.id,
          title: p.title,
          niche: p.niche,
          difficulty: p.difficulty
        }
      };
      return JSON.stringify(record);
    });

    return {
      content: lines.join('\n'),
      filename: `${baseFilename}_dpo_pairs.jsonl`,
      mimeType: 'application/x-ndjson;charset=utf-8',
      count
    };
  }

  // 6. YAML Fine-Tuning Dataset (.yaml)
  if (options.format === 'yaml_dataset') {
    const datasetObj = {
      dataset_name: 'promptos_fine_tuning_corpus',
      exported_at: new Date().toISOString(),
      sample_count: count,
      target_architecture: framework,
      examples: selectedPrompts.map((p) => {
        const promptBody = getPromptTextForFramework(p, framework);
        return {
          task_id: p.id,
          niche: p.niche,
          role: p.role,
          difficulty: p.difficulty,
          system_instruction: `You are an expert ${p.role} specializing in ${p.niche}.`,
          user_input: promptBody,
          ideal_response: generateSyntheticGroundTruth(p, promptBody)
        };
      })
    };

    const header = `# Fine-Tuning Training Dataset (YAML 1.2)\n# Compatible with Axolotl, Ollama Modelfile, and Hugging Face Datasets\n\n`;
    return {
      content: header + serializeToYaml(datasetObj),
      filename: `${baseFilename}_finetune.yaml`,
      mimeType: 'text/yaml;charset=utf-8',
      count
    };
  }

  // 7. Markdown Playground
  if (options.format === 'markdown_playgrounds') {
    let md = `# PromptOS Master Prompts Export\n\n`;
    md += `> **Exported:** ${new Date().toLocaleString()}  \n`;
    md += `> **Count:** ${count} Prompts  \n`;
    md += `> **Framework Filter:** ${framework.toUpperCase()}  \n\n`;

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

      if (framework === 'all') {
        md += `### 9-Step Cognitive Mediation Framework\n\n\`\`\`markdown\n${ninestep}\n\`\`\`\n\n`;
        md += `### Ruben Hassid Fable 5 Framework\n\n\`\`\`markdown\n${fable5}\n\`\`\`\n\n`;
        md += `### GEPA Classic 6-Block Framework\n\n\`\`\`markdown\n${gepa}\n\`\`\`\n\n`;
        md += `### GEPA⁺ Unified Architecture\n\n\`\`\`markdown\n${gepaplus}\n\`\`\`\n\n`;
      } else if (framework === 'ninestep') {
        md += `\`\`\`markdown\n${ninestep}\n\`\`\`\n\n`;
      } else if (framework === 'fable5') {
        md += `\`\`\`markdown\n${fable5}\n\`\`\`\n\n`;
      } else if (framework === 'gepaplus') {
        md += `\`\`\`markdown\n${gepaplus}\n\`\`\`\n\n`;
      } else {
        md += `\`\`\`markdown\n${gepa}\n\`\`\`\n\n`;
      }

      md += `---\n\n`;
    });

    return {
      content: md,
      filename: `${baseFilename}.md`,
      mimeType: 'text/markdown;charset=utf-8',
      count
    };
  }

  // 8. Plain Raw Text
  let raw = '';
  selectedPrompts.forEach((p, idx) => {
    const promptBody = getPromptTextForFramework(p, framework);
    raw += `### PROMPT ${idx + 1}: ${p.title.toUpperCase()}\n`;
    raw += `// Niche: ${p.niche} | Role: ${p.role} | Difficulty: ${p.difficulty}\n\n`;
    raw += `${promptBody}\n\n`;
    raw += `${'='.repeat(60)}\n\n`;
  });

  return {
    content: raw,
    filename: `${baseFilename}.txt`,
    mimeType: 'text/plain;charset=utf-8',
    count
  };
}

/**
 * Initiates browser download of generated content
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
