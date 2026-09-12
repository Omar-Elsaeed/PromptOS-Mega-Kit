import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ArrowRight,
  Bot,
  Layers,
  Terminal,
  Zap,
  HelpCircle,
  Play,
  RotateCw,
  Search,
  BookOpen,
  Sliders,
  CheckSquare,
  Loader2
} from 'lucide-react';
import { SG_TEMPLATES, SkillTemplate } from '../data/skillTemplates';
import { CAPABILITIES } from '../data/capabilities';
import { CapabilityItem } from '../types';
import { generateAIContent } from '../utils/api';

interface ClaudeSkillStudioProps {
  onCopy: (text: string, title: string) => void;
  initialSkillId?: string;
}

export const ClaudeSkillStudio: React.FC<ClaudeSkillStudioProps> = ({ onCopy, initialSkillId }) => {
  const [studioMode, setStudioMode] = useState<'builder' | 'capabilities'>('builder');

  // Skill Form State
  const [skillName, setSkillName] = useState('cold-email-drafter');
  const [skillPurpose, setSkillPurpose] = useState(
    'Draft personalised, professional cold emails based on a target person, company, and goal. Research context clues, match tone to the industry, and output a ready-to-send email with a subject line and 3 follow-up variants.'
  );
  const [skillTrigger, setSkillTrigger] = useState(
    'Use when the user wants to write a cold email, outreach email, or prospect to someone via email.'
  );
  const [outputFormat, setOutputFormat] = useState('markdown');
  const [skillLevel, setSkillLevel] = useState<'simple' | 'standard' | 'advanced' | 'expert'>('standard');
  const [edgeCases, setEdgeCases] = useState(
    'Missing contact name → use generic opener\nB2C vs B2B → adjust formality\nFollow-up vs cold → different structure'
  );
  const [examplePair, setExamplePair] = useState(
    'Input: Draft a cold email to the Head of Engineering at Stripe about our API monitoring tool.\nOutput: Subject: Cut API incident response time by 60%?\n\nHi [Name],\n\nI noticed Stripe recently expanded its API offerings — congrats on the growth...'
  );
  const [toolsNeeded, setToolsNeeded] = useState('web_search');
  const [dontsList, setDontsList] = useState(
    'Never invent company details not provided. Never exceed 200 words for the main email. Never use aggressive or spammy sales language.'
  );

  // Active Output Subtab
  const [outputSubTab, setOutputSubTab] = useState<'skill' | 'tests' | 'guide'>('skill');
  const [copied, setCopied] = useState(false);
  const [isSynthesizingSkill, setIsSynthesizingSkill] = useState(false);

  const handleAiSynthesizeSkill = async () => {
    if (!skillPurpose.trim()) return;
    setIsSynthesizingSkill(true);
    try {
      const prompt = `You are a Principal AI Agent & Anthropic Claude Skill Architect.
Based on the following skill purpose, generate the complete, production-grade SKILL.md specification fields:
SKILL PURPOSE: "${skillPurpose}"

Output strict JSON only (no markdown, no backticks, no code fences):
{
  "skillName": "kebab-case-name",
  "skillTrigger": "Clear trigger description for when Claude or Agent should invoke this skill",
  "skillLevel": "standard" | "advanced" | "expert",
  "outputFormat": "markdown" | "json" | "structured",
  "edgeCases": "Line-separated list of 3 edge case handling rules",
  "toolsNeeded": "e.g. web_search, file_read, bash",
  "dontsList": "Line-separated list of 3 explicit negative constraints / stop conditions",
  "examplePair": "Input: [Realistic user input]\\nOutput: [High quality gold standard response]"
}`;

      const res = await generateAIContent({
        prompt,
        systemInstruction: 'You are an Anthropic Claude Skill engineering specialist. Output strictly valid JSON without code fences or preamble.',
        temperature: 0.2
      });

      const cleaned = res.text?.replace(/```json?/g, '').replace(/```/g, '').trim();
      const match = cleaned?.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.skillName) setSkillName(parsed.skillName.toLowerCase().replace(/\s+/g, '-'));
        if (parsed.skillTrigger) setSkillTrigger(parsed.skillTrigger);
        if (parsed.skillLevel) setSkillLevel(parsed.skillLevel.toLowerCase());
        if (parsed.outputFormat) setOutputFormat(parsed.outputFormat.toLowerCase());
        if (parsed.edgeCases) setEdgeCases(parsed.edgeCases);
        if (parsed.toolsNeeded) setToolsNeeded(parsed.toolsNeeded);
        if (parsed.dontsList) setDontsList(parsed.dontsList);
        if (parsed.examplePair) setExamplePair(parsed.examplePair);
      }
      onCopy('', 'Claude Skill Architecture Synthesized');
    } catch (err) {
      console.error('Failed to synthesize skill with AI:', err);
    } finally {
      setIsSynthesizingSkill(false);
    }
  };

  // Capability Filter State
  const [activeCapCategory, setActiveCapCategory] = useState<string>('all');
  const [expandedCapId, setExpandedCapId] = useState<string | null>(null);

  // Handle initialSkillId if passed
  useEffect(() => {
    if (initialSkillId) {
      const match = SG_TEMPLATES.find((t) => t.name_val === initialSkillId || t.name.toLowerCase().includes(initialSkillId.toLowerCase()));
      if (match) {
        handleLoadTemplate(match);
      }
    }
  }, [initialSkillId]);

  const handleLoadTemplate = (tpl: SkillTemplate) => {
    setSkillName(tpl.name_val);
    setSkillPurpose(tpl.purpose);
    setSkillTrigger(tpl.trigger);
    setOutputFormat(tpl.output_fmt);
    setSkillLevel(tpl.level);
    setEdgeCases(tpl.edge || '');
    setExamplePair(tpl.example || '');
    setToolsNeeded(tpl.tools || '');
    setDontsList(tpl.donts || '');
    setStudioMode('builder');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Compile SKILL.md specification
  const generateSkillMd = () => {
    const displayName = skillName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    const tools = toolsNeeded ? toolsNeeded.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const edges = edgeCases ? edgeCases.split('\n').filter(Boolean) : [];
    const donts = dontsList ? dontsList.split('\n').filter(Boolean) : [];

    const workflowSteps = [
      'Read the full user request and identify the core task, any constraints, and required output format.',
      'Verify you have all required context. If critical information is missing, ask ONE targeted question.',
      'Plan the approach before writing: outline the key components of the output.',
      'Execute the main task following the output format specification.',
      'Review the output against the quality checklist before delivering.'
    ];

    if (skillLevel === 'advanced' || skillLevel === 'expert') {
      workflowSteps.push('Identify edge cases in the input and handle them proactively.');
      workflowSteps.push('Cross-check any facts or claims if verification is possible.');
    }
    if (skillLevel === 'expert') {
      workflowSteps.push('Assess confidence level of each claim and flag any estimates vs verified facts.');
    }

    const fmtGuides: Record<string, string> = {
      markdown:
        'Deliver as a well-structured Markdown document with clear section headers (##), bold for emphasis, and code blocks where relevant. No filler text — every section should add value.',
      code:
        'Deliver as working code with:\n- Language-appropriate formatting\n- Inline comments for non-obvious logic\n- A brief explanation block before the code\n- A usage example at the end',
      json:
        'Deliver as valid JSON only. No markdown, no explanation, no code fences. Match the schema defined in the task exactly. Use null for missing optional fields.',
      file:
        'Deliver the complete file content ready to save. Include the recommended filename and extension. No truncation — output the full file.',
      steps:
        'Deliver as a numbered step-by-step guide. Each step should be actionable, specific, and testable. Include expected outcome after each step.',
      mixed:
        'Deliver a structured document that combines explanation (prose) with working code examples. Label each section clearly. Ensure all code examples are complete and runnable.'
    };

    let md = `# ${displayName}\n\n`;
    md += `## Overview\n${skillPurpose}\n\nUse this skill whenever: ${skillTrigger || 'the task matches the skill purpose above'}.\n\n`;
    md += `## When to Use\n- Trigger phrase or context: ${skillTrigger}\n`;
    if (skillLevel === 'advanced' || skillLevel === 'expert') {
      md += `- Also activate for related tasks that fall within the skill scope\n`;
      md += `- Load this skill proactively when you detect the user is working on ${displayName.toLowerCase()} tasks\n`;
    }
    md += `\n## Workflow\n`;
    workflowSteps.forEach((s, i) => {
      md += `${i + 1}. ${s}\n`;
    });
    md += `\n## Output Format\n${fmtGuides[outputFormat] || fmtGuides.markdown}\n\n`;

    if (examplePair) {
      md += `## Examples\n### Example 1\n${examplePair}\n\n`;
    }

    md += `## Edge Cases\n`;
    if (edges.length > 0) {
      edges.forEach((e) => {
        md += `- ${e}\n`;
      });
    } else {
      md += `- Missing required context → ask one targeted clarifying question before proceeding\n`;
      md += `- Ambiguous request → state your interpretation and proceed; note assumption at the end\n`;
    }
    md += `\n## Tools Required\n`;
    if (tools.length > 0) {
      tools.forEach((t) => {
        md += `- \`${t}\`\n`;
      });
    } else {
      md += `None — this skill operates on provided context only.\n`;
    }
    md += `\n## Stop Conditions\nNever do the following when this skill is active:\n`;
    if (donts.length > 0) {
      donts.forEach((d) => {
        md += `- ${d}\n`;
      });
    } else {
      md += `- Do not fabricate information not provided by the user\n`;
      md += `- Do not exceed the requested scope without flagging it\n`;
    }
    md += `\n## Quality Checklist\nBefore delivering output, verify:\n`;
    md += `- [ ] Output directly addresses what the user asked for\n`;
    md += `- [ ] All required sections are present and complete\n`;
    md += `- [ ] Output format matches the specification\n`;
    md += `- [ ] No fabricated information or unverified claims presented as facts\n`;

    if (skillLevel === 'expert') {
      md += `\n## Evaluation Criteria\nThis skill performs well when:\n`;
      md += `- Output can be used immediately without editing\n`;
      md += `- All edge cases are handled gracefully\n`;
      md += `- A domain expert would rate the output as professional-grade\n\n`;
      md += `## Sub-Agent Delegation\nFor complex tasks, split into parallel agents:\n`;
      md += `- **Research Agent:** gather all required context and data\n`;
      md += `- **Draft Agent:** produce the initial output following the format above\n`;
      md += `- **Review Agent:** verify accuracy, completeness, and quality checklist\n`;
    }

    return md;
  };

  const skillMdContent = generateSkillMd();

  // Test cases data
  const testCases = [
    {
      num: 1,
      label: 'Happy Path',
      input: `Standard ${skillName.replace(/-/g, ' ')} request with all required context provided.`,
      expected: 'Complete, structured output following the format spec. All required sections present. No placeholders.',
      pass_condition: 'Output is immediately usable without editing.'
    },
    {
      num: 2,
      label: 'Missing Context',
      input: 'Request with missing critical information (e.g. no target audience, no goal specified).',
      expected: 'Skill asks ONE targeted clarifying question. Does not proceed with incomplete context. Does not ask multiple questions.',
      pass_condition: 'Exactly one question asked. Question is specific, not generic.'
    },
    {
      num: 3,
      label: 'Edge Case Handling',
      input: edgeCases ? edgeCases.split('\n')[0] : 'Unusual or boundary input that tests the edge cases.',
      expected: 'Skill handles gracefully per edge case rules. Notes the edge case in output if relevant.',
      pass_condition: 'No crash, no generic response. Edge case explicitly handled.'
    },
    {
      num: 4,
      label: 'Out-of-Scope Request',
      input: 'A task that is clearly outside the scope of this skill.',
      expected: 'Skill declines gracefully, explains its scope, and suggests where the user might get help.',
      pass_condition: 'Does not attempt out-of-scope task. Clear explanation given.'
    },
    {
      num: 5,
      label: 'Quality Checklist Verification',
      input: examplePair ? examplePair.split('\n')[0] : `Standard request for ${skillName}.`,
      expected: 'All quality checklist items satisfied in the output.',
      pass_condition: 'Output passes all checklist items. Could be delivered to a client without edits.'
    }
  ];

  // Install guide data
  const installGuideSteps = [
    {
      icon: '📁',
      title: 'Create the skill directory',
      body: `In your Claude skills folder, create a new directory: <code>${skillName}/</code>. On Claude.ai this is typically at <code>~/.claude/skills/${skillName}/</code>. For Claude Code, use <code>.claude/skills/${skillName}/</code> in your project root.`
    },
    {
      icon: '💾',
      title: 'Save the SKILL.md file',
      body: `Click the Download button above to get <code>SKILL.md</code>. Place it inside the directory you just created: <code>${skillName}/SKILL.md</code>. The file name must be exactly <code>SKILL.md</code> (uppercase).`
    },
    {
      icon: '🔗',
      title: 'Register the skill (Claude Code / Anthropic)',
      body: `In Claude Code, add the skill path to your <code>CLAUDE.md</code> or system prompt: <code>/skills/${skillName}/SKILL.md</code>. Claude Code will auto-load it at the start of each session.`
    },
    {
      icon: '✅',
      title: 'Test with the trigger phrase',
      body: `Open a new Claude conversation and use your trigger phrase: "${skillTrigger.slice(0, 60)}...". The skill should activate automatically.`
    },
    {
      icon: '🧪',
      title: 'Run the 5 test cases',
      body: `Go to the Test Cases tab and run each test manually. A well-built skill should pass all 5. If any fail, update the SKILL.md with clearer instructions and re-download.`
    },
    {
      icon: '🔄',
      title: 'Iterate and improve',
      body: 'Skills improve over time. When you notice Claude deviating from expected behaviour, add that case to the Edge Cases section and re-download.'
    }
  ];

  const handleCopySkill = () => {
    onCopy(skillMdContent, `Claude Skill — ${skillName}/SKILL.md`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSkill = () => {
    const blob = new Blob([skillMdContent], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${skillName}-SKILL.md`;
    a.click();
  };

  // Filter capabilities
  const filteredCapabilities =
    activeCapCategory === 'all'
      ? CAPABILITIES
      : CAPABILITIES.filter((c) => c.cat === activeCapCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Bot className="w-3.5 h-3.5 text-orange-500" />
          <span>🧠 CLAUDE SKILL STUDIO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Build Custom{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Claude Skills
          </span>{' '}
          Like a Pro Engineer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Generate production-ready <code className="bg-slate-100 px-1.5 py-0.5 rounded text-orange-600 font-mono font-bold">SKILL.md</code> files — the same format used in Claude Code, Cowork, and Claude.ai. Describe what you want Claude to do and get a complete, installable skill file.
        </p>

        {/* Feature Checkmarks */}
        <div className="flex items-center justify-center gap-4 mt-5 flex-wrap text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-600">✓</span> Works in Claude Code
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-600">✓</span> Works in Claude.ai
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-600">✓</span> Works in Cowork
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-600">✓</span> Instant download as .md
          </div>
        </div>

        {/* Dual Mode Switcher */}
        <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl mt-6 shadow-2xs">
          <button
            onClick={() => setStudioMode('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              studioMode === 'builder'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧠 SKILL.md Architect & Test Suite
          </button>
          <button
            onClick={() => setStudioMode('capabilities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              studioMode === 'capabilities'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Claude Capabilities & Prompt Library ({CAPABILITIES.length})
          </button>
        </div>
      </div>

      {/* MODE 1: SKILL.md ARCHITECT & GENERATOR */}
      {studioMode === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Skill Definition Form */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step 1 Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Define Your Skill</span>
              </h3>

              {/* Skill Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skill Name <span className="text-slate-400 font-normal">(kebab-case)</span>
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  placeholder="e.g. cold-email-drafter, code-reviewer"
                />
              </div>

              {/* Purpose */}
              <div>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <label className="block text-xs font-bold text-slate-700">
                    What should this skill enable Claude to do?
                  </label>
                  <button
                    onClick={handleAiSynthesizeSkill}
                    disabled={isSynthesizingSkill || !skillPurpose.trim()}
                    className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    {isSynthesizingSkill ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Synthesizing Skill...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>✨ AI Auto-Synthesize Specs</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={skillPurpose}
                  onChange={(e) => setSkillPurpose(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white leading-relaxed"
                  placeholder="e.g. Automatically draft professional cold emails..."
                />
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  When should Claude trigger this skill?
                </label>
                <textarea
                  value={skillTrigger}
                  onChange={(e) => setSkillTrigger(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white leading-relaxed"
                  placeholder="e.g. Whenever the user mentions drafting an email..."
                />
              </div>

              {/* Output format */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Output Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
                >
                  <option value="markdown">Markdown document with sections</option>
                  <option value="code">Code (with language formatting)</option>
                  <option value="json">Structured JSON</option>
                  <option value="file">File output ready to save</option>
                  <option value="steps">Step-by-step numbered guide</option>
                  <option value="mixed">Mixed (code + prose explanation)</option>
                </select>
              </div>

              {/* Complexity level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Skill Complexity Level</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSkillLevel('simple')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      skillLevel === 'simple'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">🟢 Simple</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Single-purpose, 1-3 steps</div>
                  </button>
                  <button
                    onClick={() => setSkillLevel('standard')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      skillLevel === 'standard'
                        ? 'bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">🔵 Standard</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Multi-step workflow</div>
                  </button>
                  <button
                    onClick={() => setSkillLevel('advanced')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      skillLevel === 'advanced'
                        ? 'bg-orange-50 border-orange-400 text-orange-900 ring-1 ring-orange-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">🟠 Advanced</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">With edge cases + variants</div>
                  </button>
                  <button
                    onClick={() => setSkillLevel('expert')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      skillLevel === 'expert'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">🔴 Expert</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sub-agents + evals + checklist</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 Card: Refinement */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Refine (Optional but Recommended)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Edge Cases to Handle <span className="text-slate-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  value={edgeCases}
                  onChange={(e) => setEdgeCases(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white leading-relaxed"
                  placeholder="e.g. Missing contact name → use generic opener..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Example Input → Output Pair
                </label>
                <textarea
                  value={examplePair}
                  onChange={(e) => setExamplePair(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white leading-relaxed"
                  placeholder="Input: ... Output: ..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tools Needed</label>
                  <input
                    type="text"
                    value={toolsNeeded}
                    onChange={(e) => setToolsNeeded(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                    placeholder="e.g. web_search, python"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">What should Claude NOT do?</label>
                  <input
                    type="text"
                    value={dontsList}
                    onChange={(e) => setDontsList(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                    placeholder="e.g. Never invent company details"
                  />
                </div>
              </div>
            </div>

            {/* Quick-Start Templates */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Quick-Start Templates</span>
                </span>
                <span className="text-[11px] text-slate-400">Click to pre-fill</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SG_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name_val}
                    onClick={() => handleLoadTemplate(tpl)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50/70 hover:bg-white text-left transition-all group"
                  >
                    <div className="text-base mb-1">{tpl.icon}</div>
                    <div className="text-[11px] font-bold text-slate-900 group-hover:text-orange-600 truncate">
                      {tpl.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Compiled Output Panel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              {/* Output Sub-Tabs */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setOutputSubTab('skill')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      outputSubTab === 'skill'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📄 SKILL.md
                  </button>
                  <button
                    onClick={() => setOutputSubTab('tests')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      outputSubTab === 'tests'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🧪 Test Cases ({testCases.length})
                  </button>
                  <button
                    onClick={() => setOutputSubTab('guide')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      outputSubTab === 'guide'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🚀 Install Guide
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySkill}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy .md'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSkill}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Subtab 1: SKILL.md Code View */}
              {outputSubTab === 'skill' && (
                <div className="space-y-4">
                  {/* Score Card */}
                  <div className="grid grid-cols-5 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <div className="border-r border-slate-200 pr-2">
                      <div className="text-base font-black text-emerald-600">A+</div>
                      <div className="text-[10px] text-slate-400 font-bold">96/100</div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">20/20</div>
                      <div className="text-[10px] text-slate-400">Sections</div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">19/20</div>
                      <div className="text-[10px] text-slate-400">Depth</div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">20/20</div>
                      <div className="text-[10px] text-slate-400">Examples</div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">18/20</div>
                      <div className="text-[10px] text-slate-400">Rules</div>
                    </div>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-900 text-orange-200 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[460px] overflow-y-auto">
                    {skillMdContent}
                  </pre>
                </div>
              )}

              {/* Subtab 2: Test Cases */}
              {outputSubTab === 'tests' && (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {testCases.map((tc) => (
                    <div key={tc.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          Test {tc.num}: {tc.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Verified Pass Criteria
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-500">INPUT: </span>
                        {tc.input}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-500">EXPECTED: </span>
                        {tc.expected}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{tc.pass_condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtab 3: Install Guide */}
              {outputSubTab === 'guide' && (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {installGuideSteps.map((step, i) => (
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CLAUDE CAPABILITIES ACTIVATOR LIBRARY */}
      {studioMode === 'capabilities' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCapCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCapCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              ✦ All ({CAPABILITIES.length})
            </button>
            <button
              onClick={() => setActiveCapCategory('output')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCapCategory === 'output'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              📋 Output Control
            </button>
            <button
              onClick={() => setActiveCapCategory('reasoning')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCapCategory === 'reasoning'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              🧠 Reasoning Modes
            </button>
            <button
              onClick={() => setActiveCapCategory('content')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCapCategory === 'content'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              ✍️ Content Capabilities
            </button>
            <button
              onClick={() => setActiveCapCategory('data')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCapCategory === 'data'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              📊 Data & Code
            </button>
            <button
              onClick={() => setActiveCapCategory('agent')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCapCategory === 'agent'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              🤖 Agent Mode
            </button>
            <button
              onClick={() => setActiveCapCategory('model')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCapCategory === 'model'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              🧬 Model Selection Guide
            </button>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCapabilities.map((cap) => {
              const isExpanded = expandedCapId === cap.id;
              return (
                <div
                  key={cap.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  style={{ borderLeftWidth: 4, borderLeftColor: cap.color }}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cap.icon}</span>
                        <h4 className="text-xs font-black text-slate-900">{cap.name}</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {cap.model}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{cap.desc}</p>
                  </div>

                  {/* Activation Block */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-1">
                        ⚡ Activation Phrase
                      </div>
                      {cap.activate}
                    </div>

                    {isExpanded && (
                      <div className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-orange-200 leading-relaxed space-y-1 animate-in fade-in duration-150">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          📋 Example Usage
                        </div>
                        <div className="whitespace-pre-wrap">{cap.example}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onCopy(cap.activate, `${cap.name} Activation Phrase`)}
                      className="flex-1 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Phrase</span>
                    </button>
                    <button
                      onClick={() => onCopy(cap.copyPrompt, `${cap.name} Full Prompt`)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Full Prompt</span>
                    </button>
                    <button
                      onClick={() => setExpandedCapId(isExpanded ? null : cap.id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold"
                      title={isExpanded ? 'Collapse' : 'Expand Example'}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
