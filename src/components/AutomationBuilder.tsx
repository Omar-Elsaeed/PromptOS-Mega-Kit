import React, { useState } from 'react';
import {
  Workflow,
  Copy,
  Check,
  Download,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Play,
  Zap,
  RefreshCw,
  Clock,
  ShieldAlert,
  Sliders,
  DollarSign,
  FileCode,
  ListOrdered,
  HelpCircle,
  Cpu,
  Loader2,
  Wand2
} from 'lucide-react';
import { AUTO_TEMPLATES } from '../data/templates';
import { AutoTemplate } from '../types';
import { generateAIContent } from '../utils/api';

interface AutomationBuilderProps {
  onCopy: (text: string, title: string) => void;
}

export const AutomationBuilder: React.FC<AutomationBuilderProps> = ({ onCopy }) => {
  const [goal, setGoal] = useState(
    'When a new lead submits my Typeform, enrich their data with Clearbit, use AI to score and categorize the lead, add them to Notion CRM, send a personalized welcome email via Gmail, and post a summary to Slack #sales channel.'
  );
  const [platform, setPlatform] = useState<'n8n' | 'zapier' | 'make' | 'all'>('n8n');
  const [trigger, setTrigger] = useState<'webhook' | 'schedule' | 'email' | 'database' | 'api' | 'file' | 'chat' | 'manual'>('webhook');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'advanced' | 'enterprise'>('medium');
  const [apps, setApps] = useState('Typeform, Clearbit, Notion, Gmail, Slack, Claude API');
  const [aiNodes, setAiNodes] = useState<string[]>(['claude', 'openai']);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'nodes' | 'prompts' | 'setup' | 'json'>('blueprint');
  const [isGenerated, setIsGenerated] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isAiArchitecting, setIsAiArchitecting] = useState(false);

  const handleAiArchitect = async () => {
    if (!goal.trim()) return;
    setIsAiArchitecting(true);
    try {
      const prompt = `You are a Principal Automation & AI Workflow Systems Architect.
Analyze this user automation goal and recommend the optimal enterprise configuration:
GOAL: "${goal}"

Provide strict JSON only (no backticks, no markdown):
{
  "platform": "n8n" | "zapier" | "make" | "all",
  "trigger": "webhook" | "schedule" | "email" | "database" | "api" | "file" | "chat" | "manual",
  "complexity": "simple" | "medium" | "advanced" | "enterprise",
  "apps": "Comma-separated list of 3-6 connected services",
  "aiNodes": ["claude", "openai"] or ["claude", "gemini"] or ["gemini"]
}`;

      const res = await generateAIContent({
        prompt,
        systemInstruction: 'You are a principal automation systems engineer. Output strictly valid JSON without code fences or commentary.',
        temperature: 0.2
      });

      const cleaned = res.text?.replace(/```json?/g, '').replace(/```/g, '').trim();
      const match = cleaned?.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.platform) setPlatform(parsed.platform.toLowerCase());
        if (parsed.trigger) setTrigger(parsed.trigger.toLowerCase());
        if (parsed.complexity) setComplexity(parsed.complexity.toLowerCase());
        if (parsed.apps) setApps(parsed.apps);
        if (Array.isArray(parsed.aiNodes)) setAiNodes(parsed.aiNodes);
      }
      setIsGenerated(true);
      onCopy('', 'AI Workflow Architecture Synthesized & Configured');
    } catch (e) {
      console.error('Failed to auto-architect workflow:', e);
      setIsGenerated(true);
    } finally {
      setIsAiArchitecting(false);
    }
  };

  const toggleAiNode = (val: string) => {
    if (val === 'none') {
      setAiNodes([]);
      return;
    }
    if (aiNodes.includes(val)) {
      setAiNodes(aiNodes.filter((x) => x !== val));
    } else {
      setAiNodes([...aiNodes, val]);
    }
  };

  const handleLoadTemplate = (tpl: AutoTemplate) => {
    setGoal(tpl.goal);
    setPlatform((tpl.platform.toLowerCase() as any) || 'n8n');
    setTrigger(tpl.trigger as any);
    setComplexity(tpl.complexity as any);
    setApps(tpl.apps);
    setIsGenerated(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Generate dynamic nodes based on user configuration
  const generateNodes = () => {
    const appList = apps ? apps.split(',').map((a) => a.trim()).filter(Boolean) : ['Webhook', 'AI API', 'Database', 'Email'];
    const hasAI = aiNodes.length > 0;
    const aiModel = aiNodes.includes('claude') ? 'Claude Sonnet 4.6' : aiNodes.includes('openai') ? 'GPT-4o' : 'Gemini 2.5 Pro';

    const triggerLabels: Record<string, string> = {
      webhook: 'Webhook / Form Trigger',
      schedule: 'Schedule / Cron Trigger',
      email: 'Email Trigger (IMAP)',
      database: 'Database Change Trigger',
      api: 'API / App Event Trigger',
      file: 'File Upload Trigger',
      chat: 'Chat Message Trigger',
      manual: 'Manual / Button Trigger'
    };

    const nodes: any[] = [];
    let idx = 1;

    // 1. Trigger node
    nodes.push({
      num: idx++,
      type: 'TRIGGER',
      icon: '⚡',
      color: '#f97316',
      name: triggerLabels[trigger] || 'Event Trigger',
      app: appList[0] || 'Webhook',
      desc: 'Entry point for the workflow. Ingests payload and dispatches downstream.',
      config: {
        Event: trigger,
        Authentication: 'API Key / OAuth2',
        'Output format': 'All payload JSON fields',
        'Retry policy': 'Exponential backoff (3 attempts)'
      }
    });

    // 2. Input validation
    nodes.push({
      num: idx++,
      type: 'FILTER',
      icon: '🔍',
      color: '#eab308',
      name: 'Input Schema Validator',
      app: 'Built-in Validator',
      desc: 'Validates structure and type integrity of incoming parameters.',
      config: {
        'Required fields': 'payload_id, timestamp, entity_data',
        'On invalid': 'Route to Error Handler & Halt',
        'Log target': 'System Telemetry'
      }
    });

    // 3. Data enrichment
    if (apps.toLowerCase().includes('clearbit') || complexity === 'advanced' || complexity === 'enterprise') {
      nodes.push({
        num: idx++,
        type: 'TRANSFORM',
        icon: '🔄',
        color: '#06b6d4',
        name: 'Data Enrichment Engine',
        app: appList.find((a) => /clearbit|hunter|apollo/i.test(a)) || 'Enrichment API',
        desc: 'Augments records with firmographic metadata and verified credentials.',
        config: {
          'Lookup key': 'email / domain',
          'Append fields': 'company_size, industry, tech_stack',
          'Cache duration': '24h TTL'
        }
      });
    }

    // 4. AI Processing Node
    if (hasAI) {
      nodes.push({
        num: idx++,
        type: 'AI',
        icon: '🤖',
        color: '#10b981',
        name: 'AI Intelligence Processor',
        app: aiModel,
        desc: `Invokes ${aiModel} for contextual classification, entity extraction, and structured output.`,
        config: {
          Model: aiModel,
          Temperature: '0.2 (deterministic)',
          'System Prompt': 'See AI Prompts tab',
          'Output schema': 'Strict JSON Schema'
        },
        isAI: true
      });
    }

    // 5. Conditional Router
    if (complexity === 'medium' || complexity === 'advanced' || complexity === 'enterprise') {
      nodes.push({
        num: idx++,
        type: 'FILTER',
        icon: '🔀',
        color: '#eab308',
        name: 'Branching Conditional Router',
        app: 'Built-in Router',
        desc: 'Routes workflow executions across priority tiers based on AI scores.',
        config: {
          'Route A': 'Priority Score ≥ 8 (Immediate VIP Action)',
          'Route B': 'Priority Score 4-7 (Standard Pipeline)',
          'Route C': 'Priority Score < 4 (Low Priority Nurture)'
        }
      });
    }

    // 6-N. Action Nodes for remaining apps
    const remainingApps = appList.slice(1, 4);
    remainingApps.forEach((app) => {
      nodes.push({
        num: idx++,
        type: 'ACTION',
        icon: '⚙️',
        color: '#f97316',
        name: `${app} Action Dispatcher`,
        app: app,
        desc: `Executes create/update operations on ${app} using upstream variables.`,
        config: {
          'Operation type': 'Upsert / Dispatch',
          'Target entity': 'Primary Collection',
          'Error fallback': 'Queue to retry buffer'
        }
      });
    });

    // Error Handler
    nodes.push({
      num: idx++,
      type: 'ERROR',
      icon: '🚨',
      color: '#ef4444',
      name: 'Global Exception Catch',
      app: 'Slack / PagerDuty',
      desc: 'Catches runtime anomalies and fires automated incident notices.',
      config: {
        'Catch scope': 'All workflow nodes',
        'Notification channel': '#automation-alerts',
        'Max auto-retries': '3 before human escalation'
      }
    });

    // Final Logger
    nodes.push({
      num: idx++,
      type: 'OUTPUT',
      icon: '✅',
      color: '#8b5cf6',
      name: 'Telemetry & Audit Logger',
      app: 'Notion / Postgres',
      desc: 'Writes execution timestamp, token metrics, and run status to the audit log.',
      config: {
        'Log target': 'Execution Audit Database',
        Retention: '90 days immutable'
      }
    });

    return nodes;
  };

  const currentNodes = generateNodes();

  // AI Prompts
  const aiPromptsList = [
    {
      title: 'Primary AI Classification & Extraction Prompt',
      model: aiNodes.includes('claude') ? 'Claude Sonnet 4.6' : 'GPT-4o',
      node: 'Node 4 (AI Intelligence Processor)',
      prompt: `ROLE:
You are an expert enterprise automation intelligence engine.

TASK:
Analyze the provided event payload and output a structured JSON evaluation.

INPUT DATA:
{{$json}}

WORKFLOW MISSION:
${goal}

OUTPUT SCHEMA (STRICT JSON ONLY):
{
  "classification": "string",
  "priority_score": 1-10,
  "urgency": "low | medium | high | critical",
  "entities": {
    "name": "string",
    "email": "string",
    "company": "string",
    "intent": "string"
  },
  "recommended_action": "string",
  "confidence": 0.0-1.0
}

RULES:
- Zero formatting outside JSON. No markdown codeblocks.
- If a field cannot be derived, populate null.`
    },
    {
      title: 'Personalized Communication & Dispatch Prompt',
      model: aiNodes.includes('claude') ? 'Claude Sonnet 4.6' : 'GPT-4o',
      node: 'Node 4 / Action Handlers',
      prompt: `ROLE:
You are a senior executive communication strategist.

TASK:
Draft a personalized response tailored to the recipient's metadata.

RECIPIENT PARAMETERS:
- Name: {{$json["name"]}}
- Company: {{$json["company"]}}
- Urgency: {{$json["urgency"]}}

OUTPUT SCHEMA (JSON):
{
  "subject": "Clear, compelling email subject",
  "body_html": "<p>Formatted body content...</p>",
  "plain_text": "Plain text fallback...",
  "primary_cta": "Action text"
}

CONSTRAINTS:
- Maximum 150 words in body.
- Match professional industry vocabulary.`
    },
    {
      title: 'Data Normalization & Sanitization Prompt',
      model: aiNodes.includes('claude') ? 'Claude Sonnet 4.6' : 'GPT-4o',
      node: 'Pre-processing Node',
      prompt: `ROLE:
You are an automated ETL data sanitization processor.

TASK:
Standardize raw incoming payload keys into canonical camelCase format, format phone numbers to E.164, and strip tracking noise.

INPUT:
{{$json}}

OUTPUT: Valid sanitized JSON.`
    }
  ];

  // Setup guides
  const setupGuides: Record<string, Array<{ icon: string; title: string; body: string }>> = {
    n8n: [
      {
        icon: '🖥️',
        title: 'Initialize n8n Workflow',
        body: 'Launch n8n via Docker or n8n Cloud. Click <code>+ New Workflow</code> and name it.'
      },
      {
        icon: '🔑',
        title: 'Configure Credentials in Credentials Vault',
        body: 'Navigate to <code>Settings → Credentials</code>. Add secure OAuth/API tokens for connected services.'
      },
      {
        icon: '🔀',
        title: 'Add Trigger & AI Processing Node',
        body: 'Add an HTTP Request node configured with your LLM endpoint (Claude / Gemini). Bind system prompts via the expression editor.'
      },
      {
        icon: '🔗',
        title: 'Map Data Variables across Nodes',
        body: 'Use standard n8n expression syntax <code>{{ $json["field_name"] }}</code> to pass variables between nodes.'
      },
      {
        icon: '🧪',
        title: 'Test Node Execution & Activate',
        body: 'Click <code>Execute Workflow</code> with test payload. Once green, toggle status to <code>Active</code>.'
      }
    ],
    zapier: [
      {
        icon: '⚡',
        title: 'Create New Zap',
        body: 'Sign in to Zapier, create a new Zap, and select your trigger app.'
      },
      {
        icon: '🤖',
        title: 'Add AI Action Step',
        body: 'Add an AI / Webhook step to prompt Claude or OpenAI with dynamic trigger variables.'
      },
      {
        icon: '🔀',
        title: 'Configure Paths for Branching',
        body: 'Use Paths to split execution logic based on priority score thresholds.'
      },
      {
        icon: '🚀',
        title: 'Publish and Monitor',
        body: 'Test all steps with live sample data, then turn on the Zap.'
      }
    ],
    make: [
      {
        icon: '🔧',
        title: 'Create Make Scenario',
        body: 'Create a new scenario on Make.com canvas. Add your initial trigger module.'
      },
      {
        icon: '🤖',
        title: 'Add HTTP Claude / OpenAI Module',
        body: 'Configure an HTTP request module with JSON payload and system prompt headers.'
      },
      {
        icon: '🔀',
        title: 'Add Router for Flow Control',
        body: 'Connect a Router module to distribute executions to multiple downstream apps.'
      },
      {
        icon: '⏰',
        title: 'Activate Schedule & Error Handling',
        body: 'Attach an Error Handler directive to critical modules and schedule execution.'
      }
    ],
    all: [
      {
        icon: '📋',
        title: 'Select Your Execution Platform',
        body: 'Choose n8n for maximum privacy/self-hosting, Make for visual scenarios, or Zapier for rapid no-code deployment.'
      },
      {
        icon: '🔑',
        title: 'Provision Service API Credentials',
        body: 'Store all API keys securely in the platform vault. Never hardcode credentials.'
      },
      {
        icon: '🔗',
        title: 'Wire Trigger to Output Nodes',
        body: 'Follow the node specifications outlined in the blueprint to connect your pipeline.'
      }
    ]
  };

  const currentSetupGuide = setupGuides[platform] || setupGuides.n8n;

  // JSON representation
  const generatePlatformJson = () => {
    return {
      name: `PromptOS Blueprint: ${goal.slice(0, 40)}`,
      platform: platform,
      trigger: trigger,
      complexity: complexity,
      nodes: currentNodes.map((n, i) => ({
        id: `node_${n.num}`,
        name: n.name,
        type: n.type.toLowerCase(),
        app: n.app,
        parameters: n.config,
        position: [250 + i * 200, 300]
      })),
      connections: currentNodes.slice(0, -1).reduce((acc: any, n, i) => {
        acc[`node_${n.num}`] = {
          main: [[{ node: `node_${n.num + 1}`, type: 'main', index: 0 }]]
        };
        return acc;
      }, {})
    };
  };

  const jsonCodeString = JSON.stringify(generatePlatformJson(), null, 2);

  // Full blueprint text
  const generateFullBlueprintText = () => {
    return `══════════════════════════════════════════════════════════════════════════════
PROMPTOS AUTOMATION BLUEPRINT
══════════════════════════════════════════════════════════════════════════════
Platform:    ${platform.toUpperCase()}
Trigger:     ${trigger.toUpperCase()}
Complexity:  ${complexity.toUpperCase()}
AI Models:   ${aiNodes.length > 0 ? aiNodes.join(', ') : 'None'}
Connected:   ${apps}

MISSION GOAL:
${goal}

══════════════════════════════════════════════════════════════════════════════
WORKFLOW ARCHITECTURE (${currentNodes.length} NODES)
══════════════════════════════════════════════════════════════════════════════
${currentNodes
  .map(
    (n) => `NODE ${n.num}: ${n.name} [${n.type}]
App:    ${n.app}
Action: ${n.desc}
Config:
${Object.entries(n.config)
  .map(([k, v]) => `  • ${k}: ${v}`)
  .join('\n')}`
  )
  .join('\n\n')}

══════════════════════════════════════════════════════════════════════════════
ERROR RECOVERY & RETRY CONTRACT
══════════════════════════════════════════════════════════════════════════════
• Transient API Timeouts: Exponential backoff retry up to 3 attempts.
• Schema Mismatch: Route payload to quarantine bucket and notify on-call in Slack.
• Auth Failures: Immediately halt execution and flag credential expiration.`;
  };

  const fullBlueprintText = generateFullBlueprintText();

  const handleCopySection = () => {
    if (activeTab === 'json') {
      onCopy(jsonCodeString, `${platform.toUpperCase()} Workflow JSON`);
    } else if (activeTab === 'blueprint') {
      onCopy(fullBlueprintText, `Automation Blueprint (${platform.toUpperCase()})`);
    } else if (activeTab === 'prompts') {
      onCopy(aiPromptsList[0].prompt, 'AI Automation System Prompt');
    } else {
      onCopy(fullBlueprintText, 'Automation Setup');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([fullBlueprintText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `automation_blueprint_${platform}_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          <span>⚡ AUTOMATION AGENT BUILDER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Build Complete{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Automation Workflows
          </span>{' '}
          Step by Step
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Describe your automation goal — get a complete workflow with every node, trigger, action, prompt, and connection mapped out for n8n, Zapier, or Make.com.
        </p>

        {/* Platform Pills */}
        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="text-base">🔀</span>
            <span className="font-bold text-slate-900">n8n</span>
            <span className="text-[11px] text-slate-400">Self-hosted / Cloud</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="text-base">⚡</span>
            <span className="font-bold text-slate-900">Zapier</span>
            <span className="text-[11px] text-slate-400">No-code automation</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="text-base">🔧</span>
            <span className="font-bold text-slate-900">Make.com</span>
            <span className="text-[11px] text-slate-400">Visual scenarios</span>
          </div>
        </div>
      </div>

      {/* Builder Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-10 space-y-6">
        {/* Goal Input */}
        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              🎯 What do you want to automate?
            </label>
            <button
              onClick={handleAiArchitect}
              disabled={isAiArchitecting || !goal.trim()}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
            >
              {isAiArchitecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Architecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ AI Auto-Architect Pipeline</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all leading-relaxed"
            placeholder="e.g. When a new lead fills my Typeform, add them to Notion CRM, send a welcome email via Gmail, post a Slack notification to my team, and start a 3-day email drip sequence..."
          />
        </div>

        {/* 4-column parameter grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Platform */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">🛠 Automation Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
            >
              <option value="n8n">🔀 n8n (Self-hosted / Cloud)</option>
              <option value="zapier">⚡ Zapier</option>
              <option value="make">🔧 Make.com</option>
              <option value="all">📋 Platform-Agnostic Blueprint</option>
            </select>
          </div>

          {/* Trigger */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">⚡ Trigger Type</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
            >
              <option value="webhook">Webhook / Form Submission</option>
              <option value="schedule">Schedule / Cron Job</option>
              <option value="email">New Email Received</option>
              <option value="database">Database Change / Row Added</option>
              <option value="api">API Event / Stripe / Shopify</option>
              <option value="file">New File / Cloud Upload</option>
              <option value="chat">Chat Message / Slack / Discord</option>
              <option value="manual">Manual Trigger / Button</option>
            </select>
          </div>

          {/* Complexity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">⚙️ Workflow Complexity</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
            >
              <option value="simple">Simple (3-5 nodes, linear flow)</option>
              <option value="medium">Medium (6-10 nodes, branching)</option>
              <option value="advanced">Advanced (10+ nodes, AI + router)</option>
              <option value="enterprise">Enterprise (Multi-workflow, sub-agents)</option>
            </select>
          </div>

          {/* Apps */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">📱 Apps & Services</label>
            <input
              type="text"
              value={apps}
              onChange={(e) => setApps(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
              placeholder="e.g. Gmail, Notion, Slack, Stripe..."
            />
          </div>
        </div>

        {/* AI Model Toggle Chips */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">🤖 Include AI Nodes?</label>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => toggleAiNode('claude')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                aiNodes.includes('claude')
                  ? 'bg-orange-50 border-orange-400 text-orange-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              ⚡ Claude API
            </button>
            <button
              onClick={() => toggleAiNode('openai')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                aiNodes.includes('openai')
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              🟢 OpenAI GPT-4o
            </button>
            <button
              onClick={() => toggleAiNode('gemini')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                aiNodes.includes('gemini')
                  ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              🔵 Gemini 2.5 Pro
            </button>
            <button
              onClick={() => toggleAiNode('none')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                aiNodes.length === 0
                  ? 'bg-red-50 border-red-400 text-red-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              ❌ No AI nodes
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => {
            setIsGenerated(true);
            toastNotification();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <Zap className="w-4 h-4" />
          <span>⚡ Generate Complete Automation Blueprint</span>
        </button>
      </div>

      {/* Output Section */}
      {isGenerated && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Health Score & Cost Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-black text-xl shrink-0">
                98
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Workflow Health Score</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Single trigger ✓ · Error handler ✓ · AI schema ✓
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-black text-lg shrink-0">
                ${(0.003 + (aiNodes.length > 0 ? 0.015 : 0)).toFixed(3)}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Estimated Cost per Run</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ~${((0.003 + (aiNodes.length > 0 ? 0.015 : 0)) * 100 * 30).toFixed(2)}/mo at 100 runs/day
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-black text-lg shrink-0">
                {currentNodes.length}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Nodes in Pipeline</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {platform.toUpperCase()} · {trigger.toUpperCase()} trigger
                </p>
              </div>
            </div>
          </div>

          {/* Tabs bar */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'blueprint'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                📋 Full Blueprint
              </button>
              <button
                onClick={() => setActiveTab('nodes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'nodes'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                🔷 Node Map
              </button>
              <button
                onClick={() => setActiveTab('prompts')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'prompts'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                ✨ AI Prompts
              </button>
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'setup'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                🚀 Setup Guide
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'json'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {'{ }'} JSON / Code
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySection}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadTxt}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .txt</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Full Blueprint */}
          {activeTab === 'blueprint' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <pre className="p-5 rounded-xl bg-slate-900 text-orange-200 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[550px] overflow-y-auto">
                {fullBlueprintText}
              </pre>
            </div>
          )}

          {/* Tab 2: Visual Node Map */}
          {activeTab === 'nodes' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="space-y-4">
                {currentNodes.map((node, i) => (
                  <div key={node.num} className="relative flex items-start gap-4">
                    {/* Visual Connector Dot & Line */}
                    <div className="flex flex-col items-center shrink-0 w-8 pt-1">
                      <div
                        className="w-7 h-7 rounded-full border-2 bg-white flex items-center justify-center text-xs font-bold shadow-2xs z-10"
                        style={{ borderColor: node.color, color: node.color }}
                      >
                        {node.icon}
                      </div>
                      {i < currentNodes.length - 1 && (
                        <div
                          className="w-0.5 flex-1 min-h-[48px] my-1"
                          style={{
                            background: `linear-gradient(180deg, ${node.color}, #e2e8f0)`
                          }}
                        />
                      )}
                    </div>

                    {/* Node Card */}
                    <div
                      className="flex-1 p-4 rounded-2xl border bg-slate-50/50 hover:bg-white transition-all space-y-2"
                      style={{ borderLeftWidth: 4, borderLeftColor: node.color }}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{node.name}</span>
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase"
                            style={{ backgroundColor: `${node.color}15`, color: node.color }}
                          >
                            {node.type}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">{node.app}</span>
                      </div>
                      <p className="text-xs text-slate-600">{node.desc}</p>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                        {Object.entries(node.config).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-500">{k}:</span>
                            <span className="text-orange-600 truncate">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: AI Prompts */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              {aiPromptsList.map((p, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{p.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        {p.model} · {p.node}
                      </p>
                    </div>
                    <button
                      onClick={() => onCopy(p.prompt, p.title)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-orange-200 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                    {p.prompt}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Setup Guide */}
          {activeTab === 'setup' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                🚀 Step-by-Step {platform.toUpperCase()} Implementation Guide
              </h3>
              <div className="space-y-3">
                {currentSetupGuide.map((step, i) => (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span>{step.icon}</span>
                        <span>{step.title}</span>
                      </h4>
                      <div
                        className="text-xs text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: step.body }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: JSON / Code */}
          {activeTab === 'json' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  {platform === 'n8n' ? 'n8n Workflow Export JSON' : `${platform.toUpperCase()} Configuration Schema`}
                </span>
                <button
                  onClick={() => onCopy(jsonCodeString, 'Workflow JSON')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-orange-200 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {jsonCodeString}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Quick-Start Templates Grid (All 12 Templates) */}
      <div className="mt-14 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">⚡ Quick-Start Automation Blueprints</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any template to pre-fill the builder and instantly generate its production pipeline.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 px-3 py-1 bg-orange-50 rounded-full border border-orange-200">
            {AUTO_TEMPLATES.length} Verified Presets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUTO_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleLoadTemplate(tmpl)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group"
              style={{ borderTopWidth: 3, borderTopColor: tmpl.color || '#f97316' }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tmpl.icon}</span>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {tmpl.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {tmpl.platform}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{tmpl.desc}</p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
                {tmpl.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  function toastNotification() {
    onCopy(fullBlueprintText, 'Generated Complete Workflow Blueprint (Copied to Clipboard)');
  }
};
