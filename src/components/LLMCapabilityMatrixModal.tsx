import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  Minus,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Code2,
  Database,
  Eye,
  FileText,
  Table,
  Grid,
  Scale,
  Copy,
  CheckCircle2,
  Sliders,
  DollarSign,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Boxes
} from 'lucide-react';

export interface ModelCapabilityInfo {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'Open Weights';
  providerColor: string;
  badge: string;
  tier: 'Flagship' | 'Balanced' | 'Fast / Lightweight' | 'Deep Reasoning';
  contextWindow: string;
  contextTokens: number;
  maxOutputTokens: string;
  systemPrompts: { supported: boolean; level: 'Native' | 'Standard' | 'Simulated'; details: string };
  toolCalling: { supported: boolean; level: 'Native JSON Schema' | 'Advanced' | 'Basic'; details: string };
  structuredOutputs: { supported: boolean; level: 'Strict Schema' | 'JSON Mode' | 'Heuristic'; details: string };
  multimodal: { supported: boolean; modalities: string[]; details: string };
  extendedThinking: { supported: boolean; level: 'Configurable Budget' | 'Native CoT' | 'Unsupported'; details: string };
  promptCaching: { supported: boolean; discount: string; details: string };
  codeExecution: { supported: boolean; details: string };
  streaming: { supported: boolean; details: string };
  pricing: { input: string; output: string };
  bestFramework: string;
  idealUseCases: string[];
}

export const LLM_MODELS_DATA: ModelCapabilityInfo[] = [
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    providerColor: '#ea580c',
    badge: 'Frontier Reasoning & 2M Context',
    tier: 'Flagship',
    contextWindow: '2,097,152 (2M tokens)',
    contextTokens: 2097152,
    maxOutputTokens: '65,536 tokens',
    systemPrompts: {
      supported: true,
      level: 'Native',
      details: 'First-class system instruction object; persists across multimodal audio/video contexts'
    },
    toolCalling: {
      supported: true,
      level: 'Native JSON Schema',
      details: 'Parallel function execution, Google Search grounding & auto-retrieval hooks'
    },
    structuredOutputs: {
      supported: true,
      level: 'Strict Schema',
      details: 'Enforces JSON schemas with 100% grammar compliance via response_schema'
    },
    multimodal: {
      supported: true,
      modalities: ['Text', 'Code', 'Images', 'Audio (up to 9.5h)', 'Video (up to 1h)', 'PDFs (up to 1,000 pages)'],
      details: 'Native native cross-modal tokenization without external OCR pipelines'
    },
    extendedThinking: {
      supported: true,
      level: 'Configurable Budget',
      details: 'Built-in thinking tokens with dynamic budget controls for math & architectural verification'
    },
    promptCaching: {
      supported: true,
      discount: '75% discount',
      details: 'Context caching for prompts >= 32k tokens, TTL manageable via API'
    },
    codeExecution: {
      supported: true,
      details: 'Native server-side Python sandbox execution with stdout/stderr piped back into reasoning'
    },
    streaming: {
      supported: true,
      details: 'Chunked SSE streaming + Multimodal Live bidirectional WebSockets API'
    },
    pricing: {
      input: '$1.25 / 1M (<128k)',
      output: '$5.00 / 1M (<128k)'
    },
    bestFramework: '9-Step Cognitive Mediation & GEPA⁺',
    idealUseCases: ['Massive codebase refactoring', 'Hour-long video analysis', 'Multi-agent orchestration', 'Formal logic verification']
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    providerColor: '#ea580c',
    badge: 'Sub-Second Latency & 1M Window',
    tier: 'Fast / Lightweight',
    contextWindow: '1,048,576 (1M tokens)',
    contextTokens: 1048576,
    maxOutputTokens: '65,536 tokens',
    systemPrompts: {
      supported: true,
      level: 'Native',
      details: 'System instructions support zero-shot guardrailing with sub-350ms TTFT'
    },
    toolCalling: {
      supported: true,
      level: 'Native JSON Schema',
      details: 'High-throughput tool calling with schema validation and Search tool'
    },
    structuredOutputs: {
      supported: true,
      level: 'Strict Schema',
      details: 'Full JSON schema enforcement; zero markdown leaks when format is specified'
    },
    multimodal: {
      supported: true,
      modalities: ['Text', 'Code', 'Images', 'Audio', 'Video', 'PDFs'],
      details: 'Full multimodal ingestion at 1/10th the cost of legacy frontier models'
    },
    extendedThinking: {
      supported: true,
      level: 'Configurable Budget',
      details: 'Optional thinking mode adjustable for balance between speed and reasoning depth'
    },
    promptCaching: {
      supported: true,
      discount: '75% discount',
      details: 'Automatic or explicit caching for repetitive document QA datasets'
    },
    codeExecution: {
      supported: true,
      details: 'Native in-model Python sandbox execution enabled via single boolean flag'
    },
    streaming: {
      supported: true,
      details: 'Ultra-fast streaming; optimized for real-time customer chatbots & agents'
    },
    pricing: {
      input: '$0.075 / 1M (<128k)',
      output: '$0.30 / 1M (<128k)'
    },
    bestFramework: 'Ruben Hassid Fable 5 & GEPA Classic',
    idealUseCases: ['Real-time interactive agents', 'High-volume data extraction', 'Customer support triage', 'Fast synthetic generation']
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    providerColor: '#7c3aed',
    badge: 'Hybrid Extended Thinking & Computer Use',
    tier: 'Flagship',
    contextWindow: '200,000 (200k tokens)',
    contextTokens: 200000,
    maxOutputTokens: '64,000 tokens (thinking)',
    systemPrompts: {
      supported: true,
      level: 'Native',
      details: 'Top-level system parameter with native role caching and persona stability'
    },
    toolCalling: {
      supported: true,
      level: 'Advanced',
      details: 'Tool use with exact schema adherence, custom tool choice, and Computer Use API'
    },
    structuredOutputs: {
      supported: true,
      level: 'Strict Schema',
      details: 'Tool-call schema extraction or strict JSON mode via schema wrapper'
    },
    multimodal: {
      supported: true,
      modalities: ['Text', 'Code', 'Images', 'PDF Documents'],
      details: 'Advanced diagram, chart, and technical drawing parsing (audio/video via pre-processing)'
    },
    extendedThinking: {
      supported: true,
      level: 'Configurable Budget',
      details: 'First hybrid model with user-controllable thinking token budget (up to 64k)'
    },
    promptCaching: {
      supported: true,
      discount: '90% discount on cached reads',
      details: 'Breakpoint-based prompt caching with 5-minute TTL refreshed on each call'
    },
    codeExecution: {
      supported: false,
      details: 'Requires external tool calling or MCP server integration'
    },
    streaming: {
      supported: true,
      details: 'Granular SSE event stream for both thinking blocks and standard content'
    },
    pricing: {
      input: '$3.00 / 1M',
      output: '$15.00 / 1M'
    },
    bestFramework: '9-Step Cognitive Mediation & XML-Tag Structured CoT',
    idealUseCases: ['Complex software engineering', 'System architecture design', 'Interactive GUI automation', 'Long-form reasoning']
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    providerColor: '#7c3aed',
    badge: 'High-Velocity Coding & Tools',
    tier: 'Fast / Lightweight',
    contextWindow: '200,000 (200k tokens)',
    contextTokens: 200000,
    maxOutputTokens: '8,192 tokens',
    systemPrompts: {
      supported: true,
      level: 'Native',
      details: 'Fast system prompt compilation with prompt caching support'
    },
    toolCalling: {
      supported: true,
      level: 'Advanced',
      details: 'High-speed function dispatching suited for multi-step agent loops'
    },
    structuredOutputs: {
      supported: true,
      level: 'Strict Schema',
      details: 'Tool use response format extraction with strong schema compliance'
    },
    multimodal: {
      supported: true,
      modalities: ['Text', 'Code', 'Images', 'PDFs'],
      details: 'Rapid document and screenshot inspection'
    },
    extendedThinking: {
      supported: false,
      level: 'Unsupported',
      details: 'Direct output generation optimized for minimal TTFT'
    },
    promptCaching: {
      supported: true,
      discount: '90% discount on cache hits',
      details: 'Anthropic prompt caching supported across system prompts and message history'
    },
    codeExecution: {
      supported: false,
      details: 'Requires client-side or sandbox tool execution'
    },
    streaming: {
      supported: true,
      details: 'Standard SSE streaming'
    },
    pricing: {
      input: '$0.80 / 1M',
      output: '$4.00 / 1M'
    },
    bestFramework: 'GEPA Classic & Fable 5',
    idealUseCases: ['Sub-second agent execution', 'Fast code editing', 'Classification pipelines', 'High-volume routing']
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerColor: '#10b981',
    badge: 'Omni-Modal Workhorse & Strict Schemas',
    tier: 'Flagship',
    contextWindow: '128,000 (128k tokens)',
    contextTokens: 128000,
    maxOutputTokens: '16,384 tokens',
    systemPrompts: {
      supported: true,
      level: 'Native',
      details: 'System & Developer messages supported natively with deterministic steering'
    },
    toolCalling: {
      supported: true,
      level: 'Native JSON Schema',
      details: 'Parallel tool calling with strict schema mode and required tool choices'
    },
    structuredOutputs: {
      supported: true,
      level: 'Strict Schema',
      details: '100% adherence guarantee via constrained token masking (Strict Mode: true)'
    },
    multimodal: {
      supported: true,
      modalities: ['Text', 'Code', 'Images', 'Audio (Realtime)', 'PDFs'],
      details: 'Omni model trained end-to-end on text, audio, and visual inputs'
    },
    extendedThinking: {
      supported: false,
      level: 'Unsupported',
      details: 'Direct generation; use o1/o3-mini for extended hidden reasoning tokens'
    },
    promptCaching: {
      supported: true,
      discount: '50% discount',
      details: 'Automatic prompt caching on prompts exceeding 1,024 tokens'
    },
    codeExecution: {
      supported: false,
      details: 'Available in ChatGPT UI; in API requires function calling hook or Assistant API'
    },
    streaming: {
      supported: true,
      details: 'Server-Sent Events streaming and Realtime WebRTC / WebSocket audio protocol'
    },
    pricing: {
      input: '$2.50 / 1M',
      output: '$10.00 / 1M'
    },
    bestFramework: 'GEPA⁺ & Ruben Hassid Fable 5',
    idealUseCases: ['Structured JSON synthesis', 'Omni-channel agents', 'Product workflows', 'Customer-facing chat']
  },
  {
    id: 'o3-mini',
    name: 'o3-mini / o1',
    provider: 'OpenAI',
    providerColor: '#10b981',
    badge: 'Reasoning Specialist (Math & Coding)',
    tier: 'Deep Reasoning',
    contextWindow: '200,000 (200k tokens)',
    contextTokens: 200000,
    maxOutputTokens: '100,000 tokens (reasoning + output)',
    systemPrompts: {
      supported: true,
      level: 'Native',
      details: 'Developer message support calibrated specifically for reasoning models'
    },
    toolCalling: {
      supported: true,
      level: 'Native JSON Schema',
      details: 'Tool calling supported natively alongside extended reasoning steps'
    },
    structuredOutputs: {
      supported: true,
      level: 'Strict Schema',
      details: 'Strict JSON schema formatting guaranteed even during deep reasoning chains'
    },
    multimodal: {
      supported: false,
      modalities: ['Text', 'Code'],
      details: 'Text & code specialized; o1 supports images, o3-mini is text/code focused'
    },
    extendedThinking: {
      supported: true,
      level: 'Configurable Budget',
      details: 'Reasoning effort parameter (low, medium, high) allocating hidden CoT tokens'
    },
    promptCaching: {
      supported: true,
      discount: '50% discount',
      details: 'Automatic prompt caching on recurring prompt prefixes'
    },
    codeExecution: {
      supported: false,
      details: 'Requires custom function execution integration'
    },
    streaming: {
      supported: true,
      details: 'Supports streaming output chunks; thinking tokens remain encrypted/hidden'
    },
    pricing: {
      input: '$1.10 / 1M',
      output: '$4.40 / 1M'
    },
    bestFramework: '9-Step Cognitive Mediation & Step-Wise Decomposition',
    idealUseCases: ['Competitive programming', 'Complex algorithm design', 'Mathematical proofs', 'Database query optimization']
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'Open Weights',
    providerColor: '#0284c7',
    badge: 'Open Weights Frontier Reasoning',
    tier: 'Deep Reasoning',
    contextWindow: '64,000 (64k tokens)',
    contextTokens: 64000,
    maxOutputTokens: '8,192 tokens',
    systemPrompts: {
      supported: true,
      level: 'Standard',
      details: 'Standard system prompts supported; best steered via prompt framing rather than heavy system rules'
    },
    toolCalling: {
      supported: true,
      level: 'Basic',
      details: 'Function calling supported via format prompting or fine-tuned distributor runtimes'
    },
    structuredOutputs: {
      supported: true,
      level: 'JSON Mode',
      details: 'Reliable JSON output when structured through explicit <output_schema> blocks'
    },
    multimodal: {
      supported: false,
      modalities: ['Text', 'Code'],
      details: 'Pure text & code architecture trained via reinforcement learning'
    },
    extendedThinking: {
      supported: true,
      level: 'Native CoT',
      details: 'Transparent raw <think> tags containing full chain-of-thought visible to users'
    },
    promptCaching: {
      supported: true,
      discount: '90% discount on DeepSeek API',
      details: 'Context caching supported on DeepSeek official endpoint and vLLM KV-cache'
    },
    codeExecution: {
      supported: false,
      details: 'Requires local Python sandbox or dockerized container'
    },
    streaming: {
      supported: true,
      details: 'Full token streaming including progressive <think> block emission'
    },
    pricing: {
      input: '$0.55 / 1M ($0.14 cached)',
      output: '$2.19 / 1M'
    },
    bestFramework: '9-Step Cognitive Mediation & Zero-Shot CoT',
    idealUseCases: ['Self-hosted enterprise reasoning', 'Complex logic puzzles', 'Low-cost code generation', 'Research pipelines']
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Open Weights',
    providerColor: '#0284c7',
    badge: 'Open Source Production Workhorse',
    tier: 'Balanced',
    contextWindow: '128,000 (128k tokens)',
    contextTokens: 128000,
    maxOutputTokens: '4,096 tokens',
    systemPrompts: {
      supported: true,
      level: 'Native',
      details: 'Native <|start_header_id|>system<|end_header_id|> token protocol'
    },
    toolCalling: {
      supported: true,
      level: 'Native JSON Schema',
      details: 'Trained explicitly on tool calls, multi-turn functions, and Python interpreter calls'
    },
    structuredOutputs: {
      supported: true,
      level: 'Strict Schema',
      details: 'High schema reliability with Outlines, SGLang, vLLM guided decoding, and Ollama'
    },
    multimodal: {
      supported: false,
      modalities: ['Text', 'Code'],
      details: 'Text & code specialized; multi-modal variant is Llama 3.2 Vision'
    },
    extendedThinking: {
      supported: false,
      level: 'Unsupported',
      details: 'Direct instruction-tuned output; requires prompting techniques for CoT'
    },
    promptCaching: {
      supported: true,
      discount: 'Engine-dependent (vLLM PagedAttention)',
      details: 'Prefix caching supported in modern open-source inference servers'
    },
    codeExecution: {
      supported: false,
      details: 'Built-in prompt syntax for Python tool calls; requires runner runtime'
    },
    streaming: {
      supported: true,
      details: 'Fast token-by-token streaming across self-hosted and cloud providers'
    },
    pricing: {
      input: '$0.20 / 1M (Groq / Together)',
      output: '$0.60 / 1M'
    },
    bestFramework: 'GEPA⁺ & Ruben Hassid Fable 5',
    idealUseCases: ['Private on-premise deployment', 'High throughput API backends', 'Agentic tool automation', 'Fine-tuning base']
  }
];

interface LLMCapabilityMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModelToBenchmark?: (modelA: string, modelB: string) => void;
}

export const LLMCapabilityMatrixModal: React.FC<LLMCapabilityMatrixModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'diff'>('matrix');
  const [filterFeature, setFilterFeature] = useState<string>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Compare diff selections
  const [diffModelA, setDiffModelA] = useState<string>('gemini-2.5-pro');
  const [diffModelB, setDiffModelB] = useState<string>('claude-3-7-sonnet');

  // Expanded card state
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  // Filtered models
  const filteredModels = useMemo(() => {
    return LLM_MODELS_DATA.filter((m) => {
      // Provider filter
      if (selectedProvider !== 'All' && m.provider !== selectedProvider) {
        return false;
      }
      // Tier filter
      if (selectedTier !== 'All' && m.tier !== selectedTier) {
        return false;
      }
      // Feature tag filter
      if (filterFeature === '1m_context' && m.contextTokens < 1000000) return false;
      if (filterFeature === 'native_code_sandbox' && !m.codeExecution.supported) return false;
      if (filterFeature === 'extended_thinking' && !m.extendedThinking.supported) return false;
      if (filterFeature === 'audio_video' && !m.multimodal.modalities.includes('Audio')) return false;
      if (filterFeature === 'prompt_caching' && !m.promptCaching.supported) return false;
      if (filterFeature === 'strict_json' && m.structuredOutputs.level !== 'Strict Schema') return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesBadge = m.badge.toLowerCase().includes(query);
        const matchesProvider = m.provider.toLowerCase().includes(query);
        const matchesFramework = m.bestFramework.toLowerCase().includes(query);
        const matchesUseCases = m.idealUseCases.some((u) => u.toLowerCase().includes(query));
        return matchesName || matchesBadge || matchesProvider || matchesFramework || matchesUseCases;
      }

      return true;
    });
  }, [searchQuery, selectedProvider, selectedTier, filterFeature]);

  const handleCopyMatrixSummary = () => {
    let md = `# Foundation LLM Capability Matrix (2026 Reference)\n\n`;
    md += `| Model | Provider | Context Window | System Prompts | Tool Calling | Structured JSON | Multimodal | Extended Thinking | Code Sandbox | Prompt Caching |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    filteredModels.forEach((m) => {
      md += `| **${m.name}** | ${m.provider} | ${m.contextWindow} | ${m.systemPrompts.level} | ${m.toolCalling.level} | ${m.structuredOutputs.level} | ${m.multimodal.modalities.join(', ')} | ${m.extendedThinking.level} | ${m.codeExecution.supported ? 'Native' : 'No'} | ${m.promptCaching.supported ? m.promptCaching.discount : 'No'} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-7xl w-full h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Cpu className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                PromptOS Architecture Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                8 Frontier Models
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              LLM Capability & Architecture Matrix
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Empirical side-by-side verification of context windows, tool calling, schema guarantees, and reasoning systems.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            {/* View Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'matrix' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Matrix Grid</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'cards' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Model Cards</span>
              </button>
              <button
                onClick={() => setViewMode('diff')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'diff' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Side-by-Side Diff</span>
              </button>
            </div>

            {/* Copy Summary */}
            <button
              onClick={handleCopyMatrixSummary}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Copy matrix as Markdown table"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{copiedSummary ? 'Copied MD' : 'Export MD'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Controls Toolbar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, features, or framework compatibility..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {/* Provider Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
              {['All', 'Google', 'Anthropic', 'OpenAI', 'Open Weights'].map((prov) => (
                <button
                  key={prov}
                  onClick={() => setSelectedProvider(prov)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    selectedProvider === prov
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>

            {/* Quick Feature Filter dropdown */}
            <select
              value={filterFeature}
              onChange={(e) => setFilterFeature(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:border-orange-500 shrink-0"
            >
              <option value="all">⚡ All Capabilities</option>
              <option value="1m_context">📚 1M+ Context Window</option>
              <option value="native_code_sandbox">🐍 Native Python Sandbox</option>
              <option value="extended_thinking">🧠 Extended Thinking / CoT</option>
              <option value="audio_video">🎥 Audio & Video Ingestion</option>
              <option value="prompt_caching">💾 Prompt Caching Support</option>
              <option value="strict_json">🎯 Strict JSON Schema (100%)</option>
            </select>
          </div>
        </div>

        {/* View Mode 1: Comprehensive Matrix Table */}
        {viewMode === 'matrix' && (
          <div className="flex-1 overflow-auto bg-white p-4">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-separate border-spacing-0 text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/80 sticky top-0 z-20 backdrop-blur-md">
                    <th className="p-3.5 font-black text-slate-800 border-b-2 border-slate-200 sticky left-0 bg-slate-100 z-30 min-w-[210px]">
                      Capability Dimension
                    </th>
                    {filteredModels.map((m) => (
                      <th
                        key={m.id}
                        className="p-3.5 font-black text-slate-900 border-b-2 border-slate-200 min-w-[190px] max-w-[240px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: m.providerColor }}
                          />
                          <span className="font-extrabold text-slate-900 text-xs truncate">{m.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">{m.badge}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Row: Provider & Category Tier */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Boxes className="w-3.5 h-3.5 text-slate-400" />
                        <span>Architecture Tier</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {m.tier}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1 font-semibold">{m.provider}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Context Window Size */}
                  <tr className="hover:bg-slate-50/50 bg-orange-50/20">
                    <td className="p-3.5 font-bold text-slate-800 sticky left-0 bg-orange-50/40 z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-orange-500" />
                        <span>Context Window</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5 font-mono">
                        <span
                          className={`font-black text-xs ${
                            m.contextTokens >= 1000000
                              ? 'text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md'
                              : 'text-slate-800'
                          }`}
                        >
                          {m.contextWindow}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                          Max Out: {m.maxOutputTokens}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: System Prompts */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>System Prompts</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-900">{m.systemPrompts.level}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-tight">{m.systemPrompts.details}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Tool Calling */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-purple-500" />
                        <span>Tool Calling</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-900">{m.toolCalling.level}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-tight">{m.toolCalling.details}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Structured Output / JSON Schema */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Structured Output</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            m.structuredOutputs.level === 'Strict Schema'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {m.structuredOutputs.level}
                        </span>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-tight">
                          {m.structuredOutputs.details}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Multimodal Ingestion */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Multimodal Modalities</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        {m.multimodal.supported ? (
                          <div>
                            <div className="flex flex-wrap gap-1 mb-1">
                              {m.multimodal.modalities.map((mod) => (
                                <span
                                  key={mod}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]"
                                >
                                  {mod}
                                </span>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight">{m.multimodal.details}</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400 font-semibold">
                            <Minus className="w-3.5 h-3.5" />
                            <span>Text & Code Only</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Extended Reasoning / CoT */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-pink-500" />
                        <span>Extended Reasoning</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        {m.extendedThinking.supported ? (
                          <div>
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10.5px]">
                              {m.extendedThinking.level}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                              {m.extendedThinking.details}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Minus className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">Standard Generation</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Code Execution Sandbox */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-amber-500" />
                        <span>Code Sandbox</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        {m.codeExecution.supported ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Native Python Sandbox</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Minus className="w-3.5 h-3.5" />
                            <span>External Tools Only</span>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">{m.codeExecution.details}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Prompt Caching */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-500" />
                        <span>Prompt Caching</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        {m.promptCaching.supported ? (
                          <div>
                            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[10.5px]">
                              {m.promptCaching.discount}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-tight">{m.promptCaching.details}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Unsupported</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Best Prompt Framework */}
                  <tr className="hover:bg-slate-50/50 bg-amber-50/20">
                    <td className="p-3.5 font-bold text-slate-800 sticky left-0 bg-amber-50/40 z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Best Framework</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5">
                        <span className="font-extrabold text-orange-700 text-xs">{m.bestFramework}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Pricing */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cost / 1M Tokens</span>
                      </div>
                    </td>
                    {filteredModels.map((m) => (
                      <td key={m.id} className="p-3.5 font-mono text-[11px]">
                        <div className="text-slate-700">In: <strong>{m.pricing.input}</strong></div>
                        <div className="text-slate-500">Out: {m.pricing.output}</div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode 2: Responsive Card Grid */}
        {viewMode === 'cards' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map((m) => {
                const isExpanded = expandedModelId === m.id;

                return (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all space-y-4"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: m.providerColor }}
                            />
                            <h3 className="text-sm font-black text-slate-900">{m.name}</h3>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
                            {m.provider} • {m.tier}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-700 font-extrabold text-[10px]">
                          {m.contextTokens >= 1000000 ? '1M+ Context' : m.contextWindow.split(' ')[0]}
                        </span>
                      </div>

                      {/* Key Attributes Pills */}
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                          <span className="text-slate-500 font-medium">Context Window</span>
                          <span className="font-mono font-bold text-slate-900">{m.contextWindow}</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                          <span className="text-slate-500 font-medium">Structured Outputs</span>
                          <span className="font-bold text-emerald-700">{m.structuredOutputs.level}</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                          <span className="text-slate-500 font-medium">Extended Thinking</span>
                          <span className={`font-bold ${m.extendedThinking.supported ? 'text-purple-700' : 'text-slate-400'}`}>
                            {m.extendedThinking.supported ? m.extendedThinking.level : 'No'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                          <span className="text-slate-500 font-medium">Code Sandbox</span>
                          <span className={`font-bold ${m.codeExecution.supported ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {m.codeExecution.supported ? 'Native Python' : 'External'}
                          </span>
                        </div>
                      </div>

                      {/* Recommended Framework */}
                      <div className="mt-3 p-2.5 rounded-xl bg-orange-50/60 border border-orange-100 text-xs">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-0.5">
                          Recommended Prompt Architecture
                        </span>
                        <strong className="text-orange-950 font-bold">{m.bestFramework}</strong>
                      </div>

                      {/* Expandable detailed traits */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Modalities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {m.multimodal.modalities.map((mod) => (
                                <span key={mod} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700">
                                  {mod}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Ideal Workloads:</span>
                            <ul className="list-disc pl-4 text-[11px] text-slate-600 mt-1 space-y-0.5">
                              {m.idealUseCases.map((use, i) => (
                                <li key={i}>{use}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 text-[11px] text-slate-500">
                            <strong>Pricing:</strong> In {m.pricing.input} | Out {m.pricing.output}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedModelId(isExpanded ? null : m.id)}
                      className="w-full py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Full Architecture Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 3: Focused Side-by-Side Model Diff */}
        {viewMode === 'diff' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
            {/* Diff Model Selectors */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700">Compare:</span>
                <select
                  value={diffModelA}
                  onChange={(e) => setDiffModelA(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  {LLM_MODELS_DATA.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-1.5 rounded-full bg-slate-100 text-slate-500">
                <Scale className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700">With:</span>
                <select
                  value={diffModelB}
                  onChange={(e) => setDiffModelB(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  {LLM_MODELS_DATA.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Diff Cards */}
            {(() => {
              const mA = LLM_MODELS_DATA.find((m) => m.id === diffModelA) || LLM_MODELS_DATA[0];
              const mB = LLM_MODELS_DATA.find((m) => m.id === diffModelB) || LLM_MODELS_DATA[2];

              const diffFeatures = [
                {
                  title: 'Context Window Capacity',
                  valA: mA.contextWindow,
                  valB: mB.contextWindow,
                  better: mA.contextTokens > mB.contextTokens ? 'A' : mA.contextTokens < mB.contextTokens ? 'B' : 'Tie'
                },
                {
                  title: 'Structured Output Level',
                  valA: mA.structuredOutputs.level,
                  valB: mB.structuredOutputs.level,
                  better: mA.structuredOutputs.level === 'Strict Schema' && mB.structuredOutputs.level !== 'Strict Schema' ? 'A' : mB.structuredOutputs.level === 'Strict Schema' && mA.structuredOutputs.level !== 'Strict Schema' ? 'B' : 'Tie'
                },
                {
                  title: 'Extended Reasoning / Thinking',
                  valA: mA.extendedThinking.supported ? mA.extendedThinking.level : 'Unsupported',
                  valB: mB.extendedThinking.supported ? mB.extendedThinking.level : 'Unsupported',
                  better: mA.extendedThinking.supported && !mB.extendedThinking.supported ? 'A' : !mA.extendedThinking.supported && mB.extendedThinking.supported ? 'B' : 'Tie'
                },
                {
                  title: 'Native Python Code Sandbox',
                  valA: mA.codeExecution.supported ? 'Supported (Native)' : 'Unsupported',
                  valB: mB.codeExecution.supported ? 'Supported (Native)' : 'Unsupported',
                  better: mA.codeExecution.supported && !mB.codeExecution.supported ? 'A' : !mA.codeExecution.supported && mB.codeExecution.supported ? 'B' : 'Tie'
                },
                {
                  title: 'Prompt Caching Discount',
                  valA: mA.promptCaching.supported ? mA.promptCaching.discount : 'None',
                  valB: mB.promptCaching.supported ? mB.promptCaching.discount : 'None',
                  better: 'Tie'
                },
                {
                  title: 'Modalities Supported',
                  valA: mA.multimodal.modalities.join(', '),
                  valB: mB.multimodal.modalities.join(', '),
                  better: mA.multimodal.modalities.length > mB.multimodal.modalities.length ? 'A' : mA.multimodal.modalities.length < mB.multimodal.modalities.length ? 'B' : 'Tie'
                },
                {
                  title: 'Recommended Reasoning Framework',
                  valA: mA.bestFramework,
                  valB: mB.bestFramework,
                  better: 'Context Dependent'
                }
              ];

              return (
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Model 1</span>
                      <h4 className="text-base font-black text-slate-900">{mA.name}</h4>
                      <p className="text-xs text-slate-500">{mA.provider} • {mA.tier}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Model 2</span>
                      <h4 className="text-base font-black text-slate-900">{mB.name}</h4>
                      <p className="text-xs text-slate-500">{mB.provider} • {mB.tier}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {diffFeatures.map((df, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                          <span>{df.title}</span>
                          {df.better !== 'Tie' && df.better !== 'Context Dependent' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Lead: {df.better === 'A' ? mA.name : mB.name}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200/80">
                            {df.valA}
                          </div>
                          <div className="font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200/80">
                            {df.valB}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Updated with latest 2026 specs for Gemini, Claude 3.7, and OpenAI o-series</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
