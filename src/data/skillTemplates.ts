export interface SkillTemplate {
  icon: string;
  name: string;
  desc: string;
  name_val: string;
  purpose: string;
  trigger: string;
  output_fmt: string;
  edge: string;
  donts: string;
  tools: string;
  level: 'simple' | 'standard' | 'advanced' | 'expert';
  example: string;
}

export const SG_TEMPLATES: SkillTemplate[] = [
  {
    icon: '📧',
    name: 'Cold Email Drafter',
    desc: 'Personalised outreach emails',
    name_val: 'cold-email-drafter',
    purpose: 'Draft personalised, professional cold emails based on a target person, company, and goal. Research context clues, match tone to the industry, and output a ready-to-send email with a subject line and 3 follow-up variants.',
    trigger: 'Use when the user wants to write a cold email, outreach email, or prospect to someone via email.',
    output_fmt: 'markdown',
    edge: 'Missing contact name → use generic opener\nB2C vs B2B → adjust formality\nFollow-up vs cold → different structure',
    donts: 'Never invent company details not provided. Never exceed 200 words for the main email. Never use aggressive or spammy sales language.',
    tools: 'web_search',
    level: 'standard',
    example: 'Input: Draft a cold email to the Head of Engineering at Stripe about our API monitoring tool.\nOutput: Subject: Cut API incident response time by 60%?\n\nHi [Name],\n\nI noticed Stripe recently expanded its API offerings — congrats on the growth...'
  },
  {
    icon: '🔍',
    name: 'Code Reviewer',
    desc: 'Thorough PR and code review',
    name_val: 'code-reviewer',
    purpose: 'Perform a thorough, structured code review on any submitted code or pull request. Check for correctness, security vulnerabilities, performance issues, maintainability, test coverage gaps, and adherence to best practices. Output structured feedback with line references.',
    trigger: 'Use when the user says "review this code", "review this PR", "check my code", or pastes code and asks for feedback.',
    output_fmt: 'markdown',
    edge: 'No tests present → flag as critical gap\nLegacy code → note but do not require full refactor\nSecurity issue → mark CRITICAL',
    donts: 'Never rewrite the entire file unless asked. Never be vague — give specific line references. Never skip security checks.',
    tools: '',
    level: 'standard',
    example: 'Input: [pastes a Python function with a SQL injection vulnerability]\nOutput: ## Code Review\n### 🔴 CRITICAL: SQL Injection (Line 14)\nThe query concatenates user input directly...'
  },
  {
    icon: '📊',
    name: 'Data Analyst',
    desc: 'Analyse data and generate insights',
    name_val: 'data-analyst',
    purpose: 'Analyse any data the user provides (CSV, table, numbers, metrics). Identify the top 3 patterns or anomalies, hypothesise causes, and recommend specific actions. Output an executive-ready analysis with findings, so-what, and recommended next steps.',
    trigger: 'Use when the user shares data, metrics, numbers, or asks to analyse, interpret, or find insights in data.',
    output_fmt: 'markdown',
    edge: 'Missing baseline → note what comparison is needed\nOutliers → always investigate separately\nSmall sample size → flag confidence caveat',
    donts: 'Never describe data without giving insights. Never present estimates as facts. Never exceed 3 key findings unless critical.',
    tools: 'python',
    level: 'advanced',
    example: "Input: Here is last month's sales data: [table]\nOutput: ## Analysis\n### Finding 1: Revenue dropped 23% week 3\n**What:** $143K → $110K in week 3..."
  },
  {
    icon: '✍️',
    name: 'Content Rewriter',
    desc: 'Rewrite content in any tone',
    name_val: 'content-rewriter',
    purpose: 'Rewrite any piece of content in a specified tone, voice, or style while preserving all key information. Support tones including: professional, casual, persuasive, empathetic, executive, technical, and custom. Output the rewritten version plus a brief note on what changed.',
    trigger: 'Use when the user asks to rewrite, rephrase, change tone, make more professional/casual, or edit for style.',
    output_fmt: 'markdown',
    edge: 'No tone specified → ask one question before proceeding\nTechnical content → preserve all terminology\nBrand voice → ask for example if not provided',
    donts: 'Never add new information not in the original. Never remove key facts. Never change numbers, names, or dates.',
    tools: '',
    level: 'simple',
    example: 'Input: Rewrite this in a casual tone: "We are pleased to announce the commencement of..."\nOutput: "We\'re excited to kick off..."'
  },
  {
    icon: '🤖',
    name: 'AI Agent Architect',
    desc: 'Design multi-agent systems',
    name_val: 'ai-agent-architect',
    purpose: 'Design complete multi-agent AI systems for any goal. Define the orchestrator, worker agents, their tools, communication contracts, state schema, error recovery, and completion criteria. Output a full LangGraph-compatible architecture with Fable 5 master prompt.',
    trigger: 'Use when the user wants to build an AI agent, multi-agent system, autonomous workflow, or asks to design an agentic solution.',
    output_fmt: 'mixed',
    edge: 'Unclear goal → ask ONE scoping question\nToo many agents → recommend max 4 for first version\nNo tools specified → suggest 3 most likely tools',
    donts: 'Never design more than 6 agents without flagging complexity risk. Never skip error recovery contracts. Never promise real-time capabilities without flagging infrastructure needs.',
    tools: '',
    level: 'expert',
    example: 'Input: I need an agent that researches competitors and writes weekly reports.\nOutput: ## Agent Architecture\n### Orchestrator: Research Supervisor\n### Workers: [Researcher, Analyst, Writer, Reviewer]...'
  },
  {
    icon: '🎯',
    name: 'SEO Content Optimizer',
    desc: 'Optimise content for search',
    name_val: 'seo-optimizer',
    purpose: 'Optimise any piece of content for search engines while maintaining readability and quality. Check keyword placement, meta description, heading structure, internal linking opportunities, content depth, and E-E-A-T signals. Output an optimised version plus an SEO score with specific improvements.',
    trigger: 'Use when the user asks to optimise for SEO, improve search ranking, write SEO content, or check if content is SEO-friendly.',
    output_fmt: 'markdown',
    edge: 'No target keyword → ask before proceeding\nExisting content → show diff of changes\nThin content < 300 words → flag and recommend expansion',
    donts: 'Never keyword-stuff. Never sacrifice readability for SEO. Never invent statistics or facts.',
    tools: 'web_search',
    level: 'standard',
    example: 'Input: Optimise this blog post for the keyword "project management software"\nOutput: ## SEO Analysis Score: 72/100\n### 🔴 Missing: Keyword in H1...'
  },
  {
    icon: '💼',
    name: 'Proposal Generator',
    desc: 'Write winning business proposals',
    name_val: 'proposal-generator',
    purpose: 'Generate professional business proposals, project briefs, or client pitches. Structure them with: executive summary, problem statement, proposed solution, methodology, timeline, investment, team credentials, and next steps. Tone should match the client industry.',
    trigger: 'Use when the user wants to write a proposal, pitch, quote, or scope of work document.',
    output_fmt: 'markdown',
    edge: 'Missing budget → leave as [INVESTMENT TBC]\nUnknown client industry → use neutral professional tone\nRFP response → structure to mirror their questions',
    donts: 'Never invent client company details. Never make promises about delivery time without flagging it as an estimate.',
    tools: '',
    level: 'standard',
    example: 'Input: Write a proposal for a web redesign project for a legal firm, budget $25K.\nOutput: # Website Redesign Proposal\n## For: [Law Firm Name]\n### Executive Summary...'
  },
  {
    icon: '🧪',
    name: 'Test Case Generator',
    desc: 'Generate comprehensive test suites',
    name_val: 'test-case-generator',
    purpose: 'Generate comprehensive test cases for any code, feature, API, or user story. Cover: happy path, edge cases, error conditions, security cases, and performance cases. Output test code in the project\'s existing test framework or plain pseudocode if unspecified.',
    trigger: 'Use when the user asks to write tests, generate test cases, improve test coverage, or mentions testing a feature or function.',
    output_fmt: 'code',
    edge: 'No framework specified → ask or default to pytest/jest\nLegacy code → write characterisation tests first\nAPI testing → include auth, rate limit, and error cases',
    donts: 'Never write tests that only test the happy path. Never skip error condition tests. Never hardcode test data that could become stale.',
    tools: '',
    level: 'advanced',
    example: 'Input: Write tests for this login function [code]\nOutput: ## Test Suite: login()\n```python\ndef test_valid_login():\ndef test_wrong_password():\ndef test_sql_injection():\n```'
  }
];
