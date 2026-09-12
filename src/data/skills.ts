import { SkillItem } from '../types';

export const ALL_SKILLS: SkillItem[] = [
  // Claude Skills
  {
    id: 'claude-reasoning',
    name: 'Extended Thinking',
    icon: '🧠',
    cat: 'Claude Skills',
    category: 'Claude Skills',
    model: 'Claude',
    desc: 'Thinks step-by-step through complex problems. Activate with: think step by step or use extended thinking mode.',
    description: 'Thinks step-by-step through complex problems. Activate with: think step by step or use extended thinking mode.',
    level: 5,
    toolsRequired: ['bash', 'python_repl', 'file_reader'],
    steps: ['Parse problem parameters into algebraic nodes', 'Explore 3 candidate reasoning trees', 'Validate edge constraints before emitting solution'],
    testCases: [
      { scenario: 'Multi-step logic puzzle with 5 constraints', expectedOutcome: 'Deterministic mathematical proof with zero logical leaps' },
      { scenario: 'Algorithm complexity edge-case analysis', expectedOutcome: 'Accurate Big-O derivation with boundary memory tests' }
    ]
  },
  {
    id: 'claude-code',
    name: 'Code Generation',
    icon: '💻',
    cat: 'Claude Skills',
    category: 'Claude Skills',
    model: 'Claude',
    desc: 'Writes, debugs, and explains code in 50+ languages. Best at Python, JavaScript, TypeScript, SQL, and bash.',
    description: 'Writes, debugs, and explains code in 50+ languages. Best at Python, JavaScript, TypeScript, SQL, and bash.',
    level: 5,
    toolsRequired: ['bash', 'test_runner', 'linter'],
    steps: ['Static type verification', 'Implementation synthesis', 'Automated unit test execution'],
    testCases: [
      { scenario: 'Async worker with retry queue', expectedOutcome: 'Production TypeScript file passing lint and unit tests' },
      { scenario: 'SQL query optimization with indices', expectedOutcome: 'EXPLAIN plan optimization with 4x latency reduction' }
    ]
  },
  {
    id: 'claude-analysis',
    name: 'Deep Analysis',
    icon: '🔍',
    cat: 'Claude Skills',
    category: 'Claude Skills',
    model: 'Claude',
    desc: 'Analyzes documents, data, arguments, and strategies with nuanced reasoning. Handles PDFs, CSVs, and long texts.',
    description: 'Analyzes documents, data, arguments, and strategies with nuanced reasoning. Handles PDFs, CSVs, and long texts.',
    level: 5,
    toolsRequired: ['pdf_extractor', 'csv_parser'],
    steps: ['Document structure extraction', 'Semantic synthesis and discrepancy detection', 'Executive summary delivery'],
    testCases: [
      { scenario: '100-page 10-K financial filing review', expectedOutcome: 'Identifies 3 undisclosed revenue risks and key EBITDA variance' },
      { scenario: 'Scientific paper methodology critique', expectedOutcome: 'Pinpoints sample bias and statistical power limitations' }
    ]
  },
  {
    id: 'claude-writing',
    name: 'Long-Form Writing',
    icon: '✍️',
    cat: 'Claude Skills',
    category: 'Claude Skills',
    model: 'Claude',
    desc: 'Writes reports, essays, books, scripts, and articles with consistent voice across very long outputs.',
    description: 'Writes reports, essays, books, scripts, and articles with consistent voice across very long outputs.',
    level: 5,
    toolsRequired: ['outline_planner', 'style_linter'],
    steps: ['Narrative architecture outlining', 'Thematic pacing calibration', 'Prose synthesis with rhythmic sentence variance'],
    testCases: [
      { scenario: '5,000-word Whitepaper on AI Governance', expectedOutcome: 'Cohesive, citation-rich technical report with executive abstract' },
      { scenario: 'Keynote speech draft for Tech Summit', expectedOutcome: 'Engaging oratorical structure with memorable punchy hooks' }
    ]
  },
  {
    id: 'claude-summarize',
    name: 'Summarization',
    icon: '📋',
    cat: 'Claude Skills',
    category: 'Claude Skills',
    model: 'Claude',
    desc: 'Condenses long documents, transcripts, and research into clear structured summaries with key insights preserved.',
    description: 'Condenses long documents, transcripts, and research into clear structured summaries with key insights preserved.',
    level: 5,
    toolsRequired: ['text_tokenizer', 'bullet_summarizer'],
    steps: ['Key entity extraction', 'Hierarchical importance ranking', 'Action-item matrix generation'],
    testCases: [
      { scenario: '60-minute board meeting transcript', expectedOutcome: '1-page decision log, action owners, and risk matrix' },
      { scenario: 'Quarterly earnings call analysis', expectedOutcome: 'Bull vs Bear takeaways with guidance revisions table' }
    ]
  },
  {
    id: 'claude-json',
    name: 'Structured JSON Output',
    icon: '🗂️',
    cat: 'Claude Skills',
    category: 'Claude Skills',
    model: 'Claude',
    desc: 'Returns clean validated JSON matching a schema you define. Critical for API pipelines, agents, and data systems.',
    description: 'Returns clean validated JSON matching a schema you define. Critical for API pipelines, agents, and data systems.',
    level: 5,
    toolsRequired: ['json_validator', 'schema_parser'],
    steps: ['Schema parsing & type mapping', 'Deterministic payload synthesis', 'JSON RFC 8259 validation check'],
    testCases: [
      { scenario: 'Unstructured receipt text to accounting schema', expectedOutcome: '100% valid JSON matching specified TypeScript interface' },
      { scenario: 'Multi-lingual entity extraction', expectedOutcome: 'Strictly formatted JSON array of tagged named entities' }
    ]
  },
  {
    id: 'pe-fable5',
    name: 'Ruben Fable 5 (11-Block)',
    icon: '✨',
    cat: 'Prompt Techniques',
    category: 'Prompt Techniques',
    model: 'Claude',
    desc: '11-block framework: Task, Context Files, Reference, Effort, Act, Scope, Delegate, Evidence, Memory, Checkpoint, Report.',
    description: '11-block framework: Task, Context Files, Reference, Effort, Act, Scope, Delegate, Evidence, Memory, Checkpoint, Report.',
    level: 4,
    toolsRequired: ['fable_compiler', 'evaluator'],
    steps: ['Define Task & Scope anchors', 'Specify Reference standard and Effort ceiling', 'Enforce Evidence verification and Checkpoint constraints'],
    testCases: [
      { scenario: 'High-stakes multi-agent refactor task', expectedOutcome: 'Zero-hallucination execution following all 11 structural blocks' }
    ]
  },
  {
    id: 'agent-multi-agent',
    name: 'Multi-Agent Orchestration',
    icon: '🤖',
    cat: 'Agent Capabilities',
    category: 'Agent Capabilities',
    model: 'Claude',
    desc: 'Spawns sub-agents for parallel tasks, collects results, synthesizes final output via LangGraph/CrewAI.',
    description: 'Spawns sub-agents for parallel tasks, collects results, synthesizes final output via LangGraph/CrewAI.',
    level: 5,
    toolsRequired: ['agent_router', 'task_orchestrator', 'state_store'],
    steps: ['Task decomposition into sub-graphs', 'Parallel execution with thread locking', 'State reconciliation & synthesis'],
    testCases: [
      { scenario: 'Parallel competitor research across 5 domains', expectedOutcome: 'Synthesized comparative dossier with zero state collision' }
    ]
  }
];

export const SKILLS_DB = ALL_SKILLS;
