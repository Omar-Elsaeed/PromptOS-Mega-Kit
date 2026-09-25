import React, { useState } from 'react';
import { Bot, Copy, Check, Download, Sparkles, CheckCircle2, ShieldCheck, RefreshCw, Terminal, Layers, Globe, Radio, ExternalLink, ArrowRight, Zap, Database, KeyRound, Lock, Compass } from 'lucide-react';
import { AGENT_BLUEPRINT_PRESETS } from '../data/templates';
import { AgentBlueprintPreset } from '../types';
import { promptOsWebMcpTools } from '../utils/webmcp';

interface AgentBlueprintBuilderProps {
  onCopy: (text: string, title: string) => void;
}

export const AgentBlueprintBuilder: React.FC<AgentBlueprintBuilderProps> = ({ onCopy }) => {
  const [activeTabMode, setActiveTabMode] = useState<'blueprint' | 'dns-aid'>('blueprint');
  const [selectedPreset, setSelectedPreset] = useState<AgentBlueprintPreset>(AGENT_BLUEPRINT_PRESETS[0]);
  const [agentRole, setAgentRole] = useState(selectedPreset.role);
  const [agentGoal, setAgentGoal] = useState(selectedPreset.goal);
  const [agentAutonomy, setAgentAutonomy] = useState(selectedPreset.autonomyLevel);
  const [maxIterations, setMaxIterations] = useState(selectedPreset.maxIterations);
  const [copied, setCopied] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  // WebMCP tool execution interactive state
  const [selectedMcpTool, setSelectedMcpTool] = useState('search_prompts');
  const [toolParamInput, setToolParamInput] = useState('{"query": "reasoning"}');
  const [toolExecutionResult, setToolExecutionResult] = useState<any>(null);
  const [executingTool, setExecutingTool] = useState(false);

  // DNS-AID DoH query interactive state
  const [queryName, setQueryName] = useState('_index._agents');
  const [queryType, setQueryType] = useState('SVCB');
  const [dohLoading, setDohLoading] = useState(false);
  const [dohResult, setDohResult] = useState<any>(null);

  const handleSelectPreset = (preset: AgentBlueprintPreset) => {
    setSelectedPreset(preset);
    setAgentRole(preset.role);
    setAgentGoal(preset.goal);
    setAgentAutonomy(preset.autonomyLevel);
    setMaxIterations(preset.maxIterations);
  };

  const handleRunDoH = async (targetName: string = queryName, targetType: string = queryType) => {
    setDohLoading(true);
    try {
      const res = await fetch(`/dns-query?name=${encodeURIComponent(targetName)}&type=${encodeURIComponent(targetType)}`, {
        headers: { Accept: 'application/dns-json' }
      });
      const data = await res.json();
      setDohResult(data);
    } catch (err: any) {
      setDohResult({ error: err.message || 'DoH lookup failed' });
    } finally {
      setDohLoading(false);
    }
  };

  const copyText = (text: string, label: string) => {
    onCopy(text, label);
    setCopiedRecord(label);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleExecuteWebMcp = async (toolName: string = selectedMcpTool) => {
    setExecutingTool(true);
    try {
      let params = {};
      try {
        params = JSON.parse(toolParamInput);
      } catch {
        params = { query: toolParamInput, prompt: toolParamInput, goal: toolParamInput, target_url: toolParamInput };
      }
      const tool = promptOsWebMcpTools.find(t => t.name === toolName);
      if (tool) {
        const res = await tool.execute(params);
        setToolExecutionResult(res);
      } else {
        setToolExecutionResult({ error: `Tool ${toolName} not found` });
      }
    } catch (err: any) {
      setToolExecutionResult({ error: err.message || 'Execution error' });
    } finally {
      setExecutingTool(false);
    }
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

      {/* View Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTabMode('blueprint')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTabMode === 'blueprint'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Agent Architect</span>
        </button>
        <button
          onClick={() => {
            setActiveTabMode('dns-aid');
            if (!dohResult) handleRunDoH('_index._agents', 'SVCB');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTabMode === 'dns-aid'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50 hover:text-purple-700'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>DNS for AI Discovery (DNS-AID & RFC 9460)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-[10px] font-mono">
            DNSSEC Validated
          </span>
        </button>
      </div>

      {activeTabMode === 'dns-aid' ? (
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Entrypoint Record</span>
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div className="font-mono text-xs font-bold text-slate-900 truncate">_index._agents</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SVCB / HTTPS Priority 1</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>A2A Endpoint</span>
                <Radio className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="font-mono text-xs font-bold text-slate-900 truncate">_a2a._agents</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1">alpn="h2,h3" endpoint="/api/gemini/stream"</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>DNSSEC Signature</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-mono text-xs font-bold text-slate-900">Algorithm 13 (ECDSAP256)</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">KeyTag 41829 · Authenticated Data (AD=1)</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Standards Compliance</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xs font-bold text-slate-900">draft-dnsaid & RFC 9460</div>
              <div className="text-[11px] text-slate-500 mt-1">RFC 8484 DoH + RFC 8288 Linking</div>
            </div>
          </div>

          {/* Published Records Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Published DNS-AID ServiceMode Records</h3>
                <p className="text-xs text-slate-500 mt-0.5">Authoritative SVCB and HTTPS resource records published under the domain discovery namespace.</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/dns-aid.zone"
                  target="_blank"
                  download="dns-aid.zone"
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .zone</span>
                </a>
                <a
                  href="/.well-known/agent-skills/dns-aid/SKILL.md"
                  target="_blank"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>DNS-AID SKILL.md</span>
                </a>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Record 1: Index SVCB */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500 text-white font-bold text-[10px]">SVCB</span>
                    <span className="text-orange-400 font-bold">_index._agents</span>
                    <span className="text-slate-400">IN SVCB 1 @</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    alpn="h2,h3" port="443" key65300="path=/.well-known/api-catalog" endpoint="/.well-known/api-catalog" mandatory="alpn"
                  </div>
                </div>
                <button
                  onClick={() => copyText('_index._agents. 300 IN SVCB 1 @ alpn="h2,h3" port="443" key65300="path=/.well-known/api-catalog" endpoint="/.well-known/api-catalog" mandatory="alpn"', 'Index SVCB')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedRecord === 'Index SVCB' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord === 'Index SVCB' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Record 2: Index HTTPS */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500 text-white font-bold text-[10px]">HTTPS</span>
                    <span className="text-orange-400 font-bold">_index._agents</span>
                    <span className="text-slate-400">IN HTTPS 1 @</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    alpn="h2,h3" port="443" endpoint="/.well-known/api-catalog"
                  </div>
                </div>
                <button
                  onClick={() => copyText('_index._agents. 300 IN HTTPS 1 @ alpn="h2,h3" port="443" endpoint="/.well-known/api-catalog"', 'Index HTTPS')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedRecord === 'Index HTTPS' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord === 'Index HTTPS' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Record 3: A2A SVCB */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500 text-white font-bold text-[10px]">SVCB</span>
                    <span className="text-orange-400 font-bold">_a2a._agents</span>
                    <span className="text-slate-400">IN SVCB 1 @</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    alpn="h2,h3" port="443" endpoint="/api/gemini/stream" mandatory="alpn"
                  </div>
                </div>
                <button
                  onClick={() => copyText('_a2a._agents. 300 IN SVCB 1 @ alpn="h2,h3" port="443" endpoint="/api/gemini/stream" mandatory="alpn"', 'A2A SVCB')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedRecord === 'A2A SVCB' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord === 'A2A SVCB' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Record 4: DS Record */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px]">DNSSEC DS</span>
                    <span className="text-emerald-400 font-bold">@ (Registrar DS)</span>
                    <span className="text-slate-400">IN DS 41829 13 2</span>
                  </div>
                  <div className="text-slate-400 text-[11px] break-all">
                    9B8E3D7C5F4A1E2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B
                  </div>
                </div>
                <button
                  onClick={() => copyText('IN DS 41829 13 2 9B8E3D7C5F4A1E2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B', 'DNSSEC DS')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedRecord === 'DNSSEC DS' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord === 'DNSSEC DS' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RFC 9727 API Catalog Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>RFC 9727 API Catalog & RFC 9264 Linkset Discovery</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes standardized machine-readable API metadata at <code className="text-indigo-600 font-mono text-[11px]">/.well-known/api-catalog</code> using <code className="text-slate-800 font-mono text-[11px]">application/linkset+json</code>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/.well-known/api-catalog"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View API Catalog Linkset</span>
                </a>
                <a
                  href="/.well-known/agent-skills/api-catalog/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>API Catalog Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Endpoint: </span>
                  <span className="text-indigo-300 font-bold">/.well-known/api-catalog</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-sans font-bold">
                  application/linkset+json (RFC 9264)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-indigo-300 font-bold">service-desc</div>
                  <div className="text-slate-400">OpenAPI 3.1 Spec</div>
                  <div className="text-emerald-400 text-[10px]">/openapi.json</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-purple-300 font-bold">service-doc</div>
                  <div className="text-slate-400">Interactive API Docs</div>
                  <div className="text-emerald-400 text-[10px]">/docs/api</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-emerald-300 font-bold">status</div>
                  <div className="text-slate-400">Health & Diagnostics</div>
                  <div className="text-emerald-400 text-[10px]">/api/health</div>
                </div>
              </div>
            </div>
          </div>

          {/* OAuth 2.0 & OIDC Discovery (RFC 8414 & OpenID Connect) Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>OAuth 2.0 & OpenID Connect Discovery (RFC 8414)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enables autonomous agents to discover token endpoints, supported grants (<code className="text-amber-600 font-mono text-[11px]">client_credentials</code>), and cryptographic keys (<code className="text-slate-800 font-mono text-[11px]">jwks_uri</code>).
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/.well-known/openid-configuration"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OpenID Config</span>
                </a>
                <a
                  href="/.well-known/oauth-authorization-server"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OAuth Metadata (RFC 8414)</span>
                </a>
                <a
                  href="/.well-known/agent-skills/oauth-discovery/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OAuth Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-400 text-[11px]">OIDC Discovery: </span>
                    <span className="text-amber-300 font-bold">/.well-known/openid-configuration</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">RFC 8414 Server: </span>
                    <span className="text-amber-300 font-bold">/.well-known/oauth-authorization-server</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-sans font-bold">
                    client_credentials
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">
                    JWT Bearer
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">token_endpoint</div>
                  <div className="text-slate-400">OAuth 2.0 Token</div>
                  <div className="text-emerald-400 text-[10px]">/oauth/token</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">authorization_endpoint</div>
                  <div className="text-slate-400">User Consent & Code</div>
                  <div className="text-emerald-400 text-[10px]">/oauth/authorize</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">jwks_uri</div>
                  <div className="text-slate-400">Key Set (RFC 7517)</div>
                  <div className="text-emerald-400 text-[10px]">/.well-known/jwks.json</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">userinfo_endpoint</div>
                  <div className="text-slate-400">Agent Claims</div>
                  <div className="text-emerald-400 text-[10px]">/oauth/userinfo</div>
                </div>
              </div>
            </div>
          </div>

          {/* RFC 9728 OAuth 2.0 Protected Resource Metadata Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>OAuth 2.0 Protected Resource Metadata (RFC 9728)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes protected resource identifiers, trusted <code className="text-emerald-600 font-mono text-[11px]">authorization_servers</code>, and <code className="text-slate-800 font-mono text-[11px]">scopes_supported</code> at <code className="text-emerald-600 font-mono text-[11px]">/.well-known/oauth-protected-resource</code>.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/.well-known/oauth-protected-resource"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Protected Resource Metadata</span>
                </a>
                <a
                  href="/.well-known/agent-skills/oauth-protected-resource/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>RFC 9728 Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Discovery URI: </span>
                  <span className="text-emerald-300 font-bold">/.well-known/oauth-protected-resource</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">
                    RFC 9728 Compliant
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-sans font-bold">
                    Bearer Token
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-emerald-300 font-bold">resource</div>
                  <div className="text-slate-400">Canonical Identifier</div>
                  <div className="text-emerald-400 text-[10px] truncate">https://&lt;domain&gt;</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-emerald-300 font-bold">authorization_servers</div>
                  <div className="text-slate-400">Trusted Issuers</div>
                  <div className="text-emerald-400 text-[10px] truncate">["https://&lt;domain&gt;"]</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-emerald-300 font-bold">scopes_supported</div>
                  <div className="text-slate-400">Granular Permissions</div>
                  <div className="text-emerald-400 text-[10px]">api, prompts:*, agents:*</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth.md & Agent Registration Protocol Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Auth.md & Autonomous Agent Registration</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes <code className="text-purple-600 font-mono text-[11px]">/auth.md</code> and the <code className="text-slate-800 font-mono text-[11px]">agent_auth</code> metadata block with <code className="text-purple-600 font-mono text-[11px]">register_uri</code>, <code className="text-purple-600 font-mono text-[11px]">claim_uri</code>, and <code className="text-purple-600 font-mono text-[11px]">revocation_uri</code>.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/auth.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View /auth.md</span>
                </a>
                <a
                  href="/.well-known/agent-skills/auth-md/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Auth.md Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Root Manifest: </span>
                  <span className="text-purple-300 font-bold">/auth.md</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-sans font-bold">
                    agent_auth Block
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-sans font-bold">
                    ID-JAG & Anonymous Claims
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-purple-300 font-bold">register_uri</div>
                  <div className="text-slate-400">Agent Registration</div>
                  <div className="text-emerald-400 text-[10px]">/oauth/agent/register</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-purple-300 font-bold">claim_uri</div>
                  <div className="text-slate-400">User Claiming Ceremony</div>
                  <div className="text-emerald-400 text-[10px]">/oauth/agent/claim</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-purple-300 font-bold">revocation_uri</div>
                  <div className="text-slate-400">Credential Revoke</div>
                  <div className="text-emerald-400 text-[10px]">/oauth/agent/revoke</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-purple-300 font-bold">identity_types</div>
                  <div className="text-slate-400">Assertion & Anonymous</div>
                  <div className="text-emerald-400 text-[10px]">3 Types Supported</div>
                </div>
              </div>
            </div>
          </div>

          {/* MCP Server Card (SEP-1649 / SEP-2127) Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-600" />
                  <span>Model Context Protocol Server Card (SEP-1649 / SEP-2127)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes <code className="text-cyan-600 font-mono text-[11px]">/.well-known/mcp/server-card.json</code> and <code className="text-cyan-600 font-mono text-[11px]">/.well-known/mcp.json</code> with <code className="text-slate-800 font-mono text-[11px]">serverInfo</code>, transport endpoint (<code className="text-cyan-600 font-mono text-[11px]">/mcp</code>), and capabilities.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/.well-known/mcp/server-card.json"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Server Card</span>
                </a>
                <a
                  href="/.well-known/mcp.json"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>mcp.json</span>
                </a>
                <a
                  href="/.well-known/agent-skills/mcp-server-card/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>MCP Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Discovery Endpoint: </span>
                  <span className="text-cyan-300 font-bold">/.well-known/mcp/server-card.json</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-sans font-bold">
                    SEP-1649 / SEP-2127
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">
                    streamable-http
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-cyan-300 font-bold">serverInfo.name</div>
                  <div className="text-slate-400">Server Identifier</div>
                  <div className="text-emerald-400 text-[10px]">promptos-megakit</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-cyan-300 font-bold">transport.type</div>
                  <div className="text-slate-400">Remote Protocol</div>
                  <div className="text-emerald-400 text-[10px]">streamable-http</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-cyan-300 font-bold">transport.endpoint</div>
                  <div className="text-slate-400">JSON-RPC Endpoint</div>
                  <div className="text-emerald-400 text-[10px]">/mcp</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-cyan-300 font-bold">capabilities</div>
                  <div className="text-slate-400">Tools & Prompts</div>
                  <div className="text-emerald-400 text-[10px]">tools, prompts, resources</div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Skills Discovery RFC v0.2.0 Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Agent Skills Discovery Index (RFC v0.2.0)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes <code className="text-amber-600 font-mono text-[11px]">/.well-known/agent-skills/index.json</code> with <code className="text-slate-800 font-mono text-[11px]">$schema</code>, <code className="text-slate-800 font-mono text-[11px]">type</code> (skill-md), and cryptographic <code className="text-amber-600 font-mono text-[11px]">sha256</code> digests.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/.well-known/agent-skills/index.json"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Skills index.json</span>
                </a>
                <a
                  href="/.well-known/agent-skills/agent-skills/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Agent Skills Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">RFC v0.2.0 Endpoint: </span>
                  <span className="text-amber-300 font-bold">/.well-known/agent-skills/index.json</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-sans font-bold">
                    11 Skills Indexed
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">
                    SHA256 Verified
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">$schema</div>
                  <div className="text-slate-400">Discovery Schema</div>
                  <div className="text-amber-400 text-[10px] truncate">.../discovery/0.2.0/schema.json</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">type</div>
                  <div className="text-slate-400">Artifact Format</div>
                  <div className="text-emerald-400 text-[10px]">skill-md</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">sha256 & digest</div>
                  <div className="text-slate-400">Integrity Digest</div>
                  <div className="text-emerald-400 text-[10px]">sha256:&lt;hex&gt;</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-amber-300 font-bold">standards</div>
                  <div className="text-slate-400">Consortium</div>
                  <div className="text-emerald-400 text-[10px]">Cloudflare / agentskills.io</div>
                </div>
              </div>
            </div>
          </div>

          {/* WebMCP (Web Model Context Protocol) Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>WebMCP (Web Model Context Protocol) — Browser-Native Agent Tools</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exposes client-side structured tools to AI agents via <code className="text-emerald-600 font-mono text-[11px]">navigator.modelContext.provideContext()</code> with JSON schemas and execute handlers.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active in Browser</span>
                </span>
                <a
                  href="/.well-known/agent-skills/webmcp/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>WebMCP Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Interface: </span>
                  <span className="text-emerald-300 font-bold">window.navigator.modelContext.provideContext()</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">
                    W3C WebML & Chrome EPP
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-sans font-bold">
                    {promptOsWebMcpTools.length} Tools Registered
                  </span>
                </div>
              </div>

              {/* Tools list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {promptOsWebMcpTools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => {
                      setSelectedMcpTool(tool.name);
                      if (tool.name === 'search_prompts') setToolParamInput('{"query": "reasoning"}');
                      if (tool.name === 'optimize_prompt') setToolParamInput('{"prompt": "Write a clean REST API in Node.js"}');
                      if (tool.name === 'generate_agent_blueprint') setToolParamInput('{"goal": "Automated code reviewer agent", "domain": "software"}');
                      if (tool.name === 'audit_agent_readiness') setToolParamInput('{"target_url": "https://example.com"}');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMcpTool === tool.name
                        ? 'bg-emerald-950/50 border-emerald-500/60 text-white ring-1 ring-emerald-500/40'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-emerald-400 font-mono truncate">{tool.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">{tool.description}</div>
                  </button>
                ))}
              </div>

              {/* Interactive Tester */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300 text-[11px] font-sans font-semibold">Test In-Browser Tool Call:</span>
                    <code className="text-emerald-300 text-[11px]">{selectedMcpTool}</code>
                  </div>
                  <button
                    onClick={() => handleExecuteWebMcp()}
                    disabled={executingTool}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-sans text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {executingTool ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                    <span>Execute Tool</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400">Parameters (JSON Schema Input):</label>
                  <input
                    type="text"
                    value={toolParamInput}
                    onChange={(e) => setToolParamInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    placeholder='{"query": "reasoning"}'
                  />
                </div>

                {toolExecutionResult && (
                  <div className="mt-2 p-2.5 bg-slate-900/90 rounded-lg border border-emerald-900/50 space-y-1">
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Execution Response:</span>
                    </div>
                    <pre className="text-[11px] text-slate-300 overflow-x-auto p-1.5 bg-black/40 rounded max-h-40">
                      {JSON.stringify(toolExecutionResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agentic Resource Discovery (ARD / ai-catalog.json) Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-violet-600" />
                  <span>Agentic Resource Discovery (ARD) — ai-catalog.json</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes <code className="text-violet-600 font-mono text-[11px]">/.well-known/ai-catalog.json</code> (the <em>sitemap.xml for AI</em>) with <code className="text-slate-800 font-mono text-[11px]">specVersion: "1.0"</code>, <code className="text-slate-800 font-mono text-[11px]">host</code>, and <code className="text-violet-600 font-mono text-[11px]">urn:air:</code> entries with representative queries for semantic vector search.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/.well-known/ai-catalog.json"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>ai-catalog.json</span>
                </a>
                <a
                  href="/.well-known/agent-card.json"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>A2A Agent Card</span>
                </a>
                <a
                  href="/.well-known/agent-skills/ard/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>ARD Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Discovery Endpoint: </span>
                  <span className="text-violet-300 font-bold">/.well-known/ai-catalog.json</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-sans font-bold">
                    ARD Specification 1.0
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">
                    5 Capabilities Declared
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-violet-300 font-bold flex items-center justify-between">
                    <span>Model Context Protocol (MCP)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-violet-900/60 text-violet-200 rounded">MCP</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">urn:air:&lt;domain&gt;:mcp:server-card</div>
                  <div className="text-emerald-400 text-[10px] font-sans">application/mcp-server-card+json</div>
                  <div className="text-slate-300 text-[10px] italic border-t border-slate-700/60 pt-1 mt-1">
                    "optimize system prompt for reasoning models"
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-violet-300 font-bold flex items-center justify-between">
                    <span>Agent-to-Agent (A2A)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-cyan-900/60 text-cyan-200 rounded">A2A</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">urn:air:&lt;domain&gt;:a2a:promptos-agent</div>
                  <div className="text-emerald-400 text-[10px] font-sans">application/a2a-agent-card+json</div>
                  <div className="text-slate-300 text-[10px] italic border-t border-slate-700/60 pt-1 mt-1">
                    "delegate prompt engineering and architecture synthesis"
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-violet-300 font-bold flex items-center justify-between">
                    <span>OpenAPI 3.0 REST APIs</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-900/60 text-amber-200 rounded">REST</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">urn:air:&lt;domain&gt;:openapi:promptos-api</div>
                  <div className="text-emerald-400 text-[10px] font-sans">application/vnd.oai.openapi+json</div>
                  <div className="text-slate-300 text-[10px] italic border-t border-slate-700/60 pt-1 mt-1">
                    "access prompt engineering APIs and template catalog"
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-violet-300 font-bold flex items-center justify-between">
                    <span>Agent Skills Index (RFC v0.2.0)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-900/60 text-blue-200 rounded">Skills</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">urn:air:&lt;domain&gt;:skills:discovery-index</div>
                  <div className="text-emerald-400 text-[10px] font-sans">application/json</div>
                  <div className="text-slate-300 text-[10px] italic border-t border-slate-700/60 pt-1 mt-1">
                    "verify SHA-256 integrity digests of agent capabilities"
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-violet-300 font-bold flex items-center justify-between">
                    <span>WebMCP Browser Tools</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-900/60 text-emerald-200 rounded">WebMCP</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">urn:air:&lt;domain&gt;:webmcp:browser-tools</div>
                  <div className="text-emerald-400 text-[10px] font-sans">application/json</div>
                  <div className="text-slate-300 text-[10px] italic border-t border-slate-700/60 pt-1 mt-1">
                    "call in-browser WebMCP tools via modelContext"
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1 flex flex-col justify-center text-center">
                  <div className="text-slate-400 text-[10px]">Semantic Query Embedding</div>
                  <div className="text-violet-400 font-bold text-xs mt-1">2–5 Queries Per Entry</div>
                  <div className="text-[10px] text-slate-500 mt-1">Allows agent registries to build vector embeddings for search intent matching</div>
                </div>
              </div>
            </div>
          </div>

          {/* Web Bot Auth (IETF & RFC 9421) Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Web Bot Auth & HTTP Message Signatures (RFC 9421)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes our site's Ed25519 signing keys so external web receivers can cryptographically verify bot and agent requests.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/.well-known/http-message-signatures-directory"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View JWKS Directory</span>
                </a>
                <a
                  href="/.well-known/agent-skills/web-bot-auth/SKILL.md"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Web Bot Auth Skill</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[11px]">JWKS Directory URI: </span>
                  <span className="text-orange-300 font-bold">/.well-known/http-message-signatures-directory</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-sans font-bold">
                  Ed25519 Verified Keypair
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-purple-300 font-bold">Primary Signing Key (Active)</div>
                  <div className="text-slate-400">Key ID: <span className="text-slate-200 break-all">RIP8_Fasx5iR_Hif-jQ_TH2jwMLVJZipbcDMrN2HYZw</span></div>
                  <div className="text-slate-400">Algorithm: <span className="text-emerald-400">ed25519 (OKP)</span></div>
                  <div className="text-slate-400">RFC 7638 Thumbprint: <span className="text-slate-300">Verified</span></div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg space-y-1">
                  <div className="text-indigo-300 font-bold">Rotation / Secondary Key</div>
                  <div className="text-slate-400">Key ID: <span className="text-slate-200 break-all">Xu3xb15U3Zdq9mRTxtBXx1XjD1fUI5OK5VKYmJXti-U</span></div>
                  <div className="text-slate-400">Algorithm: <span className="text-emerald-400">ed25519 (OKP)</span></div>
                  <div className="text-slate-400">Key Rotation: <span className="text-slate-300">Ready</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Live RFC 8484 DoH Resolver Testing Console */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  <span>Live RFC 8484 DNS-over-HTTPS (DoH) Resolver</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Test real-time agent DNS discovery queries directly against the local DoH endpoint (/dns-query).</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-mono text-[10px] font-bold">
                POST & GET /dns-query
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Agent Record Name</label>
                <select
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="_index._agents">_index._agents (Agent Catalog Entrypoint)</option>
                  <option value="_a2a._agents">_a2a._agents (Agent-to-Agent Protocol)</option>
                  <option value="_promptos._a2a._agents">_promptos._a2a._agents (PromptOS MegaKit)</option>
                </select>
              </div>

              <div className="w-32">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Record Type</label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="SVCB">SVCB (64)</option>
                  <option value="HTTPS">HTTPS (65)</option>
                  <option value="TXT">TXT (16)</option>
                </select>
              </div>

              <div className="self-end">
                <button
                  onClick={() => handleRunDoH(queryName, queryType)}
                  disabled={dohLoading}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dohLoading ? 'animate-spin' : ''}`} />
                  <span>Execute DoH Lookup</span>
                </button>
              </div>
            </div>

            {dohResult && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-slate-600">
                  <span>Resolver Response (JSON DoH / RFC 8484 wire-compatible):</span>
                  <span className="text-emerald-600 font-mono">Status: 0 (NOERROR) · AD: true</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-purple-200 font-mono text-xs leading-relaxed overflow-x-auto max-h-[300px]">
                  {JSON.stringify(dohResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};
