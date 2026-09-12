import { PromptItem, DifficultyLevel, FrameworkType, PromptQualityScore } from '../types';
import { NICHES_LIST, getNicheMeta } from '../data/niches';
import { ALL_SKILLS } from '../data/skills';

const ACTION_VERBS = [
  "Build", "Design", "Create", "Develop", "Craft", "Launch", "Scale", "Optimize",
  "Audit", "Architect", "Map", "Engineer", "Define", "Write", "Implement", "Analyze",
  "Structure", "Deploy", "Automate", "Research", "Plan", "Establish", "Evaluate", "Refine",
  "Produce", "Execute", "Streamline", "Diagnose", "Benchmark", "Systemize"
];

const OUTPUT_TYPES = [
  "Framework", "Strategy", "Playbook", "Blueprint", "System", "Guide", "Template",
  "Plan", "Roadmap", "Dashboard", "Protocol", "Toolkit", "Process", "Model", "Checklist",
  "Workflow", "Matrix", "Report", "Scorecard", "SOP", "Outline", "Brief", "Proposal",
  "Assessment", "Program", "Campaign", "Architecture", "Specification", "Calendar", "Audit"
];

const DEFAULT_TOPICS = [
  "Strategic Architecture", "Execution Blueprint", "Growth Plan", "Performance System",
  "Customer Acquisition", "Operational Excellence", "Risk Assessment", "Market Positioning",
  "Conversion Funnel", "Competitive Advantage", "Revenue Engine", "Quality Assurance",
  "Process Optimization", "Digital Transformation", "Retention Protocol", "Data Analytics"
];

const DIFFICULTIES: DifficultyLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
const FRAMEWORKS: FrameworkType[] = ["GEPA Classic", "Ruben Fable 5", "GEPA⁺ Unified", "9-Step Cognitive Mediation"];

// Deterministic pseudo-random based on seed
export function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function generatePromptTitle(niche: string, index: number): string {
  const meta = getNicheMeta(niche);
  const topics = meta.topics && meta.topics.length > 0 ? meta.topics : DEFAULT_TOPICS;
  const tLen = topics.length;
  const oLen = OUTPUT_TYPES.length;
  const vLen = ACTION_VERBS.length;

  const ti = index % tLen;
  const oi = Math.floor(index / tLen) % oLen;
  const vi = Math.floor(index / (tLen * oLen)) % vLen;

  return `${ACTION_VERBS[vi]} ${topics[ti]} ${OUTPUT_TYPES[oi]}`;
}

export function getRoleForNiche(niche: string, seed: number): string {
  const meta = getNicheMeta(niche);
  const roles = meta.roles && meta.roles.length > 0 ? meta.roles : [`Senior ${niche} Specialist`];
  const rIdx = Math.floor(seededRandom(seed * 7 + 3) * roles.length);
  return roles[rIdx];
}

export function getSkillsForNiche(niche: string, difficulty: DifficultyLevel, seed: number) {
  const count = difficulty === 'Expert' ? 5 : difficulty === 'Advanced' ? 4 : difficulty === 'Intermediate' ? 3 : 2;
  const shuffled = [...ALL_SKILLS].sort((a, b) =>
    seededRandom(seed * 13 + a.name.charCodeAt(0)) - seededRandom(seed * 17 + b.name.charCodeAt(0))
  );
  return shuffled.slice(0, count);
}

export function buildGEPAPrompt(title: string, niche: string, role: string, difficulty: DifficultyLevel): string {
  const wordCount = difficulty === 'Expert' ? '1,500–2,500 words' : difficulty === 'Advanced' ? '800–1,500 words' : '400–800 words';

  return `## ROLE
You are a ${role} with deep expertise in ${niche}. You produce ${difficulty}-grade work that is specific, mathematically sound, and immediately executable.

## TASK
${title}

Complete this task in full. Do not describe what you would do — execute and provide the concrete deliverable directly.

## CONTEXT
- Industry / Niche: ${niche}
- Role Lens: ${role}
- Difficulty Level: ${difficulty}
- Target Standard: Current top-tier industry benchmarks, using real domain vocabulary and practical constraints.

## REASONING
1. Think step-by-step before generating the final response.
2. Prioritize high specificity over generic truisms — cite concrete metrics, frameworks, and actionable mechanics.
3. Balance rapid immediate impact with durable strategic value.
4. When weighing competing alternatives, explicitly recommend the single superior approach and justify why.

## STOP CONDITIONS
- Do not pad the response with polite boilerplate, generic caveats, or empty introductory text.
- Do not exceed or drift outside the requested scope.
- Do not echo back these instructions.
- Flag any missing critical context with [REQUIRED: description] tags.

## OUTPUT
Deliver the complete result as a professional structured document:
- Use clear section headers (##) and high-contrast tables where comparisons exist.
- Include tangible examples, calculation formulas, and clear workflows.
- Expected length: ${wordCount}.
- End with one concrete "Next Action" to be completed within 24 hours.`;
}

export function buildFable5Prompt(title: string, niche: string, role: string, difficulty: DifficultyLevel): string {
  const effort = difficulty === 'Expert' ? 'hardest-unsolved' : difficulty === 'Advanced' ? 'hard' : 'routine';

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPTOS · PRECISION 11-BLOCK FRAMEWORK
${niche.toUpperCase()} · ${role.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

① TASK — Start with why, not what.
I am working on "${title}" for ${difficulty}-level professionals in ${niche}.
They need a complete, immediately usable deliverable that enables them to solve their core operational challenge.
With that in mind: deliver the finished work as an expert ${role}.

② CONTEXT — Everything you need is defined.
Domain: ${niche}
Role: ${role}
Audience: ${difficulty}-tier practitioners
Standards: Industry-leading standards with practical operational constraints.

③ REFERENCE — Match this standard.
The output must read like a polished, board-ready deliverable — structured, specific, and immediately actionable. Not a rough draft. Not a generic outline. The finished asset.

④ EFFORT — This is a ${effort} problem.
Scope your response at the absolute ceiling of your capability range. Do not provide a surface-level response.

⑤ ACT — Decide and move.
When you have enough information to act, act. Do not re-litigate established decisions. While weighing options, provide a firm recommendation with rationale.

⑥ SCOPE — Precision over unnecessary volume.
Do the simplest thing that fully solves the task. No extra fluff, unrequested refactors, or tangential advice.

⑦ DELEGATE — Structured execution.
Address independent components in parallel with rigorous consistency across all sections.

⑧ EVIDENCE — Zero unverified assertions.
Every recommendation must be grounded in ${niche}-specific logic. If citing a technique, name its operational mechanics.

⑨ MEMORY — Maintain complete consistency.
Carry tone, terminology, and key data points consistently throughout the response.

⑩ CHECKPOINT — Pause only for true blockers.
Never end your turn on a promise. Complete each section in full.

⑪ REPORT — Lead with the outcome.
Open with the TLDR — the single most critical decision or outcome. Then deliver the full structured deliverable. Close with one concrete next action.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

export function buildGEPAPlusPrompt(title: string, niche: string, role: string, difficulty: DifficultyLevel): string {
  const effort = difficulty === 'Expert' ? 'hardest-unsolved' : difficulty === 'Advanced' ? 'hard' : 'routine';
  const wordCount = difficulty === 'Expert' ? '1,500–2,500 words' : difficulty === 'Advanced' ? '800–1,500 words' : '400–800 words';

  return `╔══════════════════════════════════════════════╗
║  PROMPTOS · GEPA⁺ UNIFIED FRAMEWORK          ║
║  GEPA 6-Block  ×  Fable 5 · 11-Block         ║
╚══════════════════════════════════════════════╝
NICHE: ${niche.toUpperCase()}
ROLE:  ${role.toUpperCase()}
TASK:  ${title}

━━━━━━━━━━━━━━━━ BLOCK 1 · TASK ━━━━━━━━━━━━━━━━
I'm executing on "${title}" for ${niche} professionals at the ${difficulty} level.
They need a high-impact, immediately actionable deliverable.
With that in mind: deliver the complete output as a senior ${role}.

━━━━━━━━━━━━━━━━ BLOCK 2 · CONTEXT ━━━━━━━━━━━━━━
- Domain: ${niche}
- Persona Lens: ${role}
- Quality Bar: Production-ready asset a senior ${role} would stake their reputation on.

━━━━━━━━━━━━━━━━ BLOCK 3 · REFERENCE ━━━━━━━━━━━━
Provide an uncompromisingly specific deliverable — structured, data-grounded, and free of vague advice.

━━━━━━━━━━━━━━━━ BLOCK 4 · EFFORT ━━━━━━━━━━━━━━━
This is a ${effort} problem. Apply full depth, rigorous domain logic, and top-tier analytical precision.

━━━━━━━━━━━━━━━━ BLOCK 5 · ACT ━━━━━━━━━━━━━━━━━
When sufficient context exists, execute directly. Give concrete recommendations, not undecided option lists.

━━━━━━━━━━━━━━━━ BLOCK 6 · SCOPE ━━━━━━━━━━━━━━━
Deliver the simplest complete solution that solves the goal:
- No filler or boilerplate introductory greetings
- No unnecessary disclaimers
- Strictly stay within the problem boundary

━━━━━━━━━━━━━━━━ BLOCK 7 · DELEGATE ━━━━━━━━━━━━━
Structure independent sections cleanly and maintain full internal consistency.

━━━━━━━━━━━━━━━━ BLOCK 8 · EVIDENCE ━━━━━━━━━━━━━
Every assertion must be anchored in ${niche} domain mechanics, operational metrics, or verified methodologies.

━━━━━━━━━━━━━━━━ BLOCK 9 · MEMORY ━━━━━━━━━━━━━━━
Preserve consistent terminology, frameworks, and narrative threads across all sections.

━━━━━━━━━━━━━━━━ BLOCK 10 · CHECKPOINT ━━━━━━━━━━
Execute fully in this turn. Deliver the complete document without trailing promises.

━━━━━━━━━━━━━━━━ BLOCK 11 · REPORT ━━━━━━━━━━━━━━
Open with a 2-sentence executive outcome (the TLDR). Deliver the complete structured body (${wordCount}). Close with 1 concrete action to take within 24 hours.`;
}

export function buildNineStepPrompt(title: string, niche: string, role: string, difficulty: DifficultyLevel): string {
  const effort = difficulty === 'Expert' ? 'hardest-unsolved' : difficulty === 'Advanced' ? 'high-complexity' : 'standard-enterprise';
  const wordCount = difficulty === 'Expert' ? '1,800–3,000 words' : difficulty === 'Advanced' ? '1,000–1,800 words' : '600–1,000 words';

  return `╔══════════════════════════════════════════════════════════════════════════════════════════╗
║  9-STEP COGNITIVE MEDIATION & CAUSAL GOVERNANCE FRAMEWORK                                ║
║  Objective Decoupling · Multi-Stakeholder Consensus · Red-Team Audit · Facilitator Runbook ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝
NICHE:      ${niche.toUpperCase()}
ROLE LENS:  ${role.toUpperCase()}
CHALLENGE:  ${title}
DIFFICULTY: ${difficulty.toUpperCase()} (${effort.toUpperCase()})
STANDARDS:  Production-grade, mathematically verified, zero-hallucination execution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: Depersonalization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Strip all emotional bias, ego attachment, organizational politics, and defensive posture from the challenge statement.
• Isolate raw operational facts, telemetry data, and measurable constraints in ${niche} from subjective opinions.
• Frame the inquiry as an impartial, blameless system failure/optimization problem rather than an interpersonal dispute.
• Define the objective system state (State S₀) vs. the target state (State S₁).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: Classification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Classify the problem taxonomy within ${niche}: identify primary domain primitives, failure modes, and operational tier.
• Determine Decision Reversibility: Type 1 (Irreversible / High-Stakes) vs. Type 2 (Reversible / Two-Way Door).
• Map the 4-quadrant Stakeholder Stance Matrix:
  - Technical Executors: Core constraints and delivery bottlenecks
  - Business / P&L Owners: Revenue, time-to-market, and ROI thresholds
  - Governance / Compliance Officers: Regulatory ceilings, data sovereignty, and audit mandates
  - End Users / Customers: Experience fidelity and reliability expectations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: Reframing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Re-articulate "${title}" from first principles to convert zero-sum trade-offs into positive-sum systemic objectives.
• Dissolve false dichotomies (e.g., speed vs. security, cost vs. quality, developer autonomy vs. enterprise compliance).
• Formulate the Core Synthesis Statement: "How might we achieve [Primary Operational Goal] in ${niche} WITHOUT compromising [Critical Constraint]?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: Overlap Discovery
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Surface hidden common ground, shared incentives, and mutually beneficial boundary conditions across all conflicting parties.
• Establish the Non-Negotiable Invariant Baseline: 3 to 5 core rules that every stakeholder agrees must remain unbroken.
• Pinpoint shared success metrics (e.g., SLA guarantees, margin retention, zero-downtime compliance).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: Option Generation + Scoring
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Systematically construct and compare 3 distinct executable architectures/options:
1. [Option A - Rapid High-Velocity Path]: Minimal overhead, direct execution path.
2. [Option B - Resilient Modular Architecture]: Balanced long-term scalability with decoupled components.
3. [Option C - Hardened Enterprise Governance]: Maximum security, auditability, and fault tolerance.

Weighted Evaluation Matrix (Score 1-10 on each criterion):
┌───────────────────────────┬──────────┬──────────┬──────────┐
│ Evaluation Criteria       │ Option A │ Option B │ Option C │
├───────────────────────────┼──────────┼──────────┼──────────┤
│ Feasibility & Velocity    │    --    │    --    │    --    │
│ Systemic Business Impact  │    --    │    --    │    --    │
│ Implementation Cost & OpEx│    --    │    --    │    --    │
│ Risk Surface & Resilience │    --    │    --    │    --    │
│ Time-to-Value (TTV)       │    --    │    --    │    --    │
└───────────────────────────┴──────────┴──────────┴──────────┘
Explicitly declare the winning recommendation with mathematical justification.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6: Causal Modeling
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Map 1st-Order, 2nd-Order, and 3rd-Order causal ripple effects of the selected path within ${niche}.
• Construct the Causal Dependency Graph:
  - Direct upstream prerequisites -> Execution node -> Downstream operational consequences
• Identify latent systemic feedback loops, perverse incentives, and failure cascades.
• Define 2 Leading Warning Indicators and 2 Lagging Verification Telemetries.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6.5: Security / Governance Audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Threat Model & Vulnerability Scan: Audit the architecture for injection, data leakage, privilege escalation, and rate degradation.
• Regulatory & Compliance Verification: Validate compliance with ${niche} industry standards and privacy protocols.
• Failure Mode and Effects Analysis (FMEA): Document the single most catastrophic failure mode and formulate an automated rollback/kill-switch procedure.
• Blast Radius Containment: Verify that subsystem failures cannot cascade into enterprise-wide outages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6.6: Argument Quality & Adversarial Dialectic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Red-Team Stress-Test: Formulate the strongest possible counter-argument against this proposal.
• Dialectical Defense: Provide empirical proofs, benchmark data, or architectural mechanisms that refute the counter-argument.
• Falsifiability & Kill Criteria: Explicitly state the measurable metrics that would prove this strategy wrong and trigger immediate pivoting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7: Facilitator Scripts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provide verbatim scripts for executive alignment and cross-functional facilitation:
• Alignment Kickoff Script (60 seconds): Clear, neutral framing for leadership.
• Objection-Defusing Script: Verbatim language to resolve resistance from skeptical stakeholders.
• Immediate 24-Hour Action Dispatch: Exact, unambiguous assignments for technical leads to begin deployment immediately.

Expected Deliverable Volume: ${wordCount}. Execute every step thoroughly without placeholder omissions.`;
}

export function buildVibePrompt(title: string, agentName: string, task: string, difficulty: DifficultyLevel): string {
  return `PLATFORM: ${agentName}
${'─'.repeat(50)}
TASK:
${task || title}

${'─'.repeat(50)}
VIBE CODING DIRECTIVES:
• Start building immediately without asking redundant questions.
• Make clean, modern architectural assumptions and state them upfront.
• Prioritize working end-to-end functionality, high-contrast accessible UI, and type safety.
• If edge cases arise, implement the robust fallback pattern and proceed.

DIFFICULTY: ${difficulty}
DELIVERABLE: Fully working code, clean component breakdown, and a brief summary of design decisions.`;
}

export function scorePromptQuality(promptText: string): PromptQualityScore {
  if (!promptText || promptText.length < 30) {
    return {
      total: 20,
      dims: { role: 4, task: 4, context: 4, constraints: 4, output: 4 },
      grade: 'D',
      gradeColor: '#ef4444'
    };
  }

  const text = promptText.toLowerCase();
  const words = promptText.split(/\s+/).length;

  const roleScore = /you are (a|an|the)?\s*(expert|senior|lead|chief|director|specialist|principal)/i.test(promptText) || text.includes('role:') ? 20 : 10;
  const taskScore = /task:|deliverable:|goal:|objective:|build|create|design|step 1|depersonalization/i.test(promptText) ? 20 : 12;
  const contextScore = /context:|domain:|background:|industry:|audience:|classification/i.test(promptText) ? 20 : 10;
  const constraintsScore = /stop|do not|never|must not|limit|scope:|restrictions|security\/governance/i.test(promptText) ? 20 : 8;
  const outputScore = /output:|format:|structure:|deliver|report:|markdown|json|table|facilitator scripts/i.test(promptText) ? 20 : 10;

  let total = roleScore + taskScore + contextScore + constraintsScore + outputScore;
  if (words > 120) total = Math.min(100, total + 5);

  const grade = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'D';
  const gradeColor = total >= 80 ? '#10b981' : total >= 70 ? '#3b82f6' : total >= 60 ? '#f59e0b' : '#ef4444';

  return {
    total,
    dims: {
      role: roleScore,
      task: taskScore,
      context: contextScore,
      constraints: constraintsScore,
      output: outputScore
    },
    grade,
    gradeColor
  };
}

// Generate prompt item on-the-fly for any index (1 to 100,000)
export function getPromptByIndex(globalIndex: number): PromptItem {
  const nicheIndex = Math.floor(globalIndex / 500) % NICHES_LIST.length;
  const niche = NICHES_LIST[nicheIndex];
  const localIndex = globalIndex % 500;
  const seed = nicheIndex * 1000 + localIndex;

  const title = generatePromptTitle(niche, localIndex);
  const role = getRoleForNiche(niche, seed);
  const difficulty = DIFFICULTIES[Math.floor(seededRandom(seed * 3 + 7) * 4)];
  const framework = FRAMEWORKS[localIndex % FRAMEWORKS.length];
  const downloads = Math.floor(seededRandom(seed * 11) * 9800 + 250);
  const price = [19, 27, 37, 47, 57, 67, 97][Math.floor(seededRandom(seed * 5) * 7)];
  const icons = ['🎯', '⚡', '🔍', '📊', '🚀', '💡', '🏆', '🎭', '🔗', '✨', '📐', '🛠️', '💼', '📋', '🌐'];
  const icon = icons[Math.floor(seededRandom(seed * 2) * icons.length)];

  return {
    id: `c${String(globalIndex + 1).padStart(5, '0')}`,
    title,
    niche,
    role,
    difficulty,
    framework,
    downloads,
    price,
    icon
  };
}
