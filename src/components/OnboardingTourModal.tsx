import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wand2,
  Layers,
  Scale,
  Cpu,
  Trophy,
  GitCompare,
  Code2,
  CheckCircle2,
  Compass,
  Check,
  ChevronRight,
  Zap,
  Play,
  RotateCcw,
  Sliders,
  Database,
  ExternalLink,
  Flame,
  ShieldCheck
} from 'lucide-react';

export interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

interface TourStep {
  id: string;
  category: 'Overview' | 'SmartBuilderWizard' | 'ModelCompareStudio' | 'Summary';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  content: {
    description: string;
    keyPoints: { icon: any; title: string; desc: string }[];
    tip?: string;
  };
  targetTab?: string;
  targetTabName?: string;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactiveModePreview, setInteractiveModePreview] = useState<'quick' | 'pro'>('quick');
  const [interactiveFwPreview, setInteractiveFwPreview] = useState<'ninestep' | 'fable5' | 'gepa' | 'gepaplus'>('ninestep');
  const [interactiveArenaWinner, setInteractiveArenaWinner] = useState<'modelA' | 'modelB'>('modelB');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Keyboard navigation: Left/Right arrows, Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentStepIndex((prev) => Math.min(prev + 1, tourSteps.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        handleFinishTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleFinishTour = () => {
    if (dontShowAgain) {
      localStorage.setItem('promptos_onboarding_completed', 'true');
    }
    onClose();
  };

  const handleGoToTool = (tab?: string) => {
    if (tab && onNavigateToTab) {
      onNavigateToTab(tab);
    }
    handleFinishTour();
  };

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      category: 'Overview',
      title: 'Welcome to PromptOS v17',
      subtitle: 'The Enterprise Prompt Engineering & Evaluation Operating System',
      badge: 'Core Workflow',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      content: {
        description:
          'PromptOS empowers AI engineers and product builders to synthesize zero-hallucination prompts and empirically benchmark them against frontier models in real time.',
        keyPoints: [
          {
            icon: Wand2,
            title: '1. SmartBuilderWizard',
            desc: 'Precision prompt synthesizer compiling into 4 enterprise frameworks with instant AI polishing and version diffing.'
          },
          {
            icon: Scale,
            title: '2. ModelCompareStudio',
            desc: 'Concurrent multi-model arena with automated AI referee scoring and live LLM capability matrix.'
          },
          {
            icon: Sparkles,
            title: '3. 100K Vault & 204 Niches',
            desc: 'Pre-indexed repository of production-ready prompts spanning enterprise finance, healthcare, software, and marketing.'
          }
        ],
        tip: 'Use the left and right navigation arrows, or keyboard arrow keys, to proceed through the tour.'
      }
    },
    {
      id: 'builder_modes',
      category: 'SmartBuilderWizard',
      title: 'Quick vs Pro 11-Block Mode',
      subtitle: 'Rapid prototyping or rigorous enterprise delegation specification',
      badge: 'SmartBuilder Feature 1',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      targetTab: 'builder',
      targetTabName: 'SmartBuilderWizard',
      content: {
        description:
          'Choose between a streamlined 4-field generator for instant results, or the comprehensive Ruben Hassid 11-Block specification for mission-critical agent workflows.',
        keyPoints: [
          {
            icon: Zap,
            title: 'Quick Mode (4 Fields)',
            desc: 'Select Target Niche, Role Persona, Objective Task, and Complexity Level (Beginner to Expert). Ready in 3 seconds.'
          },
          {
            icon: Sliders,
            title: 'Pro Mode (11-Block Agentic Anatomy)',
            desc: 'Configure Task, Context, References, Effort, Act/Anti-hallucination, Scope, Delegate, Evidence, Memory, Checkpoints, and Report.'
          },
          {
            icon: ShieldCheck,
            title: 'Zero-Hallucination Guarantees',
            desc: 'Pro mode systematically locks down token bounds, citation rules, and confirmation checkpoints before mutations.'
          }
        ],
        tip: 'Toggle between Quick and Pro modes right below to preview how the input interface adapts.'
      }
    },
    {
      id: 'builder_frameworks',
      category: 'SmartBuilderWizard',
      title: '4 Reasoning Architectures',
      subtitle: 'Compile one prompt into 4 battle-tested enterprise frameworks',
      badge: 'SmartBuilder Feature 2',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      targetTab: 'builder',
      targetTabName: 'SmartBuilderWizard',
      content: {
        description:
          'Different LLMs thrive under different prompt structural topologies. SmartBuilderWizard compiles your inputs across 4 elite architectures simultaneously.',
        keyPoints: [
          {
            icon: Code2,
            title: '9-Step Cognitive Mediation',
            desc: 'Causal Governance architecture featuring meta-cognition, hypothesis branching, and counterfactual validation.'
          },
          {
            icon: Flame,
            title: 'Ruben Hassid Fable 5',
            desc: 'The viral 11-block industry standard designed specifically for autonomous agent delegation and enterprise safety.'
          },
          {
            icon: Layers,
            title: 'GEPA Classic & GEPA⁺ Unified',
            desc: 'Classic 6-Block (Goal, Expectation, Persona, Action, Constraints, Output) and the enhanced 8-Block Unified Architecture.'
          }
        ],
        tip: 'Click through the framework tabs below to inspect how the prompt structure dynamically recalculates.'
      }
    },
    {
      id: 'builder_ai_diff',
      category: 'SmartBuilderWizard',
      title: 'AI Deep Polish & Version Diff',
      subtitle: 'Continuous refinement with side-by-side visual diff tracking',
      badge: 'SmartBuilder Feature 3',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      targetTab: 'builder',
      targetTabName: 'SmartBuilderWizard',
      content: {
        description:
          'Leverage Gemini 2.5 to automatically polish prompts, calibrate tone, and inspect exact character-level diffs across your iteration history.',
        keyPoints: [
          {
            icon: Sparkles,
            title: 'AI Deep Polish Co-Pilot',
            desc: 'One-click enhancement that refines edge cases, sharpens constraints, and boosts instruction adherence.'
          },
          {
            icon: GitCompare,
            title: 'Side-by-Side Visual Diff',
            desc: 'Compare any previous revision against current output with color-coded additions (green) and removals (red).'
          },
          {
            icon: Database,
            title: 'Local Revision Snapshots',
            desc: 'Automatic local saves and named snapshots so you never lose high-performing prompt variants.'
          }
        ],
        tip: 'All prompt revisions are preserved in your browser local storage with zero cloud leaks.'
      }
    },
    {
      id: 'compare_arena',
      category: 'ModelCompareStudio',
      title: 'Concurrent Multi-Model Arena',
      subtitle: 'Benchmark prompts side-by-side across frontier models',
      badge: 'ModelCompare Feature 1',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      targetTab: 'compare',
      targetTabName: 'ModelCompareStudio',
      content: {
        description:
          'Stop guessing how models will respond. Execute identical prompts in parallel against Model A and Model B with real latency and token throughput tracking.',
        keyPoints: [
          {
            icon: Scale,
            title: 'Dual-Engine Concurrency',
            desc: 'Run Gemini 2.5 Flash vs Gemini 2.5 Pro (or test against Claude and GPT-4o) with synchronized execution.'
          },
          {
            icon: Zap,
            title: 'Real-Time Telemetry',
            desc: 'Accurate latency timers, generation speed, and token completion counts displayed per candidate.'
          },
          {
            icon: Play,
            title: 'Pre-Engineered Benchmarks',
            desc: 'Instant prompt presets for asynchronous Python coding, data extraction, and executive summaries.'
          }
        ],
        tip: 'Click Run Benchmark in ModelCompareStudio to trigger parallel requests simultaneously.'
      }
    },
    {
      id: 'compare_referee',
      category: 'ModelCompareStudio',
      title: 'Automated AI Referee & Rubric',
      subtitle: 'Objective 5-dimensional evaluation and victor declaration',
      badge: 'ModelCompare Feature 2',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      targetTab: 'compare',
      targetTabName: 'ModelCompareStudio',
      content: {
        description:
          'Evaluating prompt responses by eye is prone to bias. ModelCompareStudio integrates an automated AI Referee that grades outputs against a standardized scoring matrix.',
        keyPoints: [
          {
            icon: Trophy,
            title: '5-Dimensional Scoring Matrix',
            desc: 'Judged on Accuracy, Completeness, Structural Compliance, Reasoning Depth, and Production Readiness.'
          },
          {
            icon: CheckCircle2,
            title: 'Victor Declaration & Margin',
            desc: 'Determines the definitive winner with points differential and tactical commentary highlighting strengths.'
          },
          {
            icon: ShieldCheck,
            title: 'Unbiased Grounding',
            desc: 'Zero-shot impartial judge prompt isolating adherence to original task constraints.'
          }
        ],
        tip: 'The AI Referee activates automatically after both models finish emitting responses.'
      }
    },
    {
      id: 'compare_matrix',
      category: 'ModelCompareStudio',
      title: 'LLM Capability Matrix',
      subtitle: 'Empirical specs across 8 frontier architectures',
      badge: 'ModelCompare Feature 3',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      targetTab: 'compare',
      targetTabName: 'ModelCompareStudio',
      content: {
        description:
          'Directly inside ModelCompareStudio, open the LLM Capability Matrix to verify context windows, strict JSON Schema support, Python sandboxes, and pricing.',
        keyPoints: [
          {
            icon: Database,
            title: 'Context Windows up to 2M Tokens',
            desc: 'Compare Gemini 2.5 Pro (2M tokens), Gemini 2.5 Flash (1M tokens), Claude 3.7 Sonnet (200k), and GPT-4o (128k).'
          },
          {
            icon: Code2,
            title: 'Tool Calling & Code Execution',
            desc: 'Verify native Python code interpreters vs external MCP tools and 100% strict JSON schema adherence.'
          },
          {
            icon: Cpu,
            title: 'Cost & Prompt Caching Economics',
            desc: 'Evaluate token pricing per million and prompt caching discounts (up to 90% savings).'
          }
        ],
        tip: 'Click "Open Full Capability Matrix" anytime in ModelCompareStudio to view the responsive grid.'
      }
    },
    {
      id: 'complete',
      category: 'Summary',
      title: "You're Ready to Build!",
      subtitle: 'Start generating elite prompts or benchmark frontier models now',
      badge: 'Ready to Launch',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      content: {
        description:
          'You have completed the walkthrough! Where would you like to start your engineering workflow?',
        keyPoints: [
          {
            icon: Wand2,
            title: 'SmartBuilderWizard',
            desc: 'Craft production-grade prompts in Quick or Pro mode with instant multi-framework compilation.'
          },
          {
            icon: Scale,
            title: 'ModelCompareStudio',
            desc: 'Benchmark your prompts across candidate LLMs and view AI Referee evaluations.'
          },
          {
            icon: Compass,
            title: '100K Prompt Vault',
            desc: 'Search, filter, and batch export thousands of prompts across 204 specialized enterprise niches.'
          }
        ],
        tip: 'You can reopen this tour at any time from the Tour button in the top navigation bar.'
      }
    }
  ];

  const currentStep = tourSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === tourSteps.length - 1;
  const progressPercent = ((currentStepIndex + 1) / tourSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  PromptOS Interactive Feature Tour
                </h3>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${currentStep.badgeColor}`}>
                  {currentStep.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Step {currentStepIndex + 1} of {tourSteps.length} • {currentStep.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStep.targetTab && (
              <button
                onClick={() => handleGoToTool(currentStep.targetTab)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100/70 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200/80 transition-colors"
                title={`Jump directly to ${currentStep.targetTabName}`}
              >
                <span>Open {currentStep.targetTabName}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={handleFinishTour}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Close Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 space-y-6">
          {/* Step Header */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              {currentStep.category}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentStep.title}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {currentStep.subtitle}
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {currentStep.content.description}
            </p>
          </div>

          {/* Interactive Feature Demonstrations Based on Current Step */}
          {currentStep.id === 'builder_modes' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-orange-600" />
                  Interactive Input Anatomy Preview:
                </span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setInteractiveModePreview('quick')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      interactiveModePreview === 'quick'
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Quick Mode (4 Fields)
                  </button>
                  <button
                    onClick={() => setInteractiveModePreview('pro')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      interactiveModePreview === 'pro'
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pro Mode (11 Blocks)
                  </button>
                </div>
              </div>

              {interactiveModePreview === 'quick' ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">1. Niche</span>
                    <strong className="text-slate-800 text-[11px]">AI Engineering</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">2. Role</span>
                    <strong className="text-slate-800 text-[11px]">Enterprise Architect</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">3. Objective</span>
                    <strong className="text-slate-800 text-[11px] truncate block">Fault-tolerant agent</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">4. Level</span>
                    <span className="inline-block px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">
                      Expert (Tier 4)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                  {['Task Objective', 'Context Documents', 'Reference Specs', 'Effort Budget', 'Anti-Hallucination', 'Scope Guard', 'Subagent Delegate', 'Evidence Audit'].map((b, i) => (
                    <div key={b} className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[9px] text-orange-600 font-bold block uppercase">Block {i + 1}</span>
                      <strong className="text-slate-800 text-[10.5px] truncate block">{b}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep.id === 'builder_frameworks' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-orange-600" />
                  Select Framework to Inspect Output Structure:
                </span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  {(['ninestep', 'fable5', 'gepa', 'gepaplus'] as const).map((fw) => (
                    <button
                      key={fw}
                      onClick={() => setInteractiveFwPreview(fw)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] transition-all capitalize ${
                        interactiveFwPreview === fw
                          ? 'bg-orange-500 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {fw === 'ninestep' ? '9-Step' : fw === 'fable5' ? 'Fable 5' : fw === 'gepa' ? 'GEPA' : 'GEPA⁺'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {interactiveFwPreview === 'ninestep' && (
                  <div>
                    <span className="text-orange-400"># 9-STEP COGNITIVE MEDIATION ARCHITECTURE</span>
                    <br />
                    <span className="text-purple-300">## STEP 1: CAUSAL ANCHOR & SCOPE BOUNDARY</span>
                    <br />
                    <span>- Establish primary ground truth and eliminate non-verifiable hypotheses.</span>
                    <br />
                    <span className="text-purple-300">## STEP 5: COUNTERFACTUAL VERIFICATION</span>
                    <br />
                    <span>- Verify outcome state if external webhook delivery fails midway.</span>
                  </div>
                )}
                {interactiveFwPreview === 'fable5' && (
                  <div>
                    <span className="text-orange-400"># RUBEN HASSID FABLE 5 (11-BLOCK DELEGATION)</span>
                    <br />
                    <span className="text-emerald-300">[1. TASK]</span> Scale client onboarding with idempotent worker.
                    <br />
                    <span className="text-emerald-300">[5. ACT]</span> Do NOT fabricate database schemas; report raw codes.
                    <br />
                    <span className="text-emerald-300">[10. CHECKPOINT]</span> Pause only for credentials approval.
                  </div>
                )}
                {interactiveFwPreview === 'gepa' && (
                  <div>
                    <span className="text-orange-400"># GEPA CLASSIC 6-BLOCK FRAMEWORK</span>
                    <br />
                    <span className="text-blue-300">1. GOAL:</span> Implement resilient webhook consumer.
                    <br />
                    <span className="text-blue-300">2. EXPECTATION:</span> 100% adherence to idempotency keys.
                    <br />
                    <span className="text-blue-300">3. PERSONA:</span> Senior Enterprise AI Architect.
                  </div>
                )}
                {interactiveFwPreview === 'gepaplus' && (
                  <div>
                    <span className="text-orange-400"># GEPA⁺ UNIFIED ARCHITECTURE</span>
                    <br />
                    <span className="text-pink-300">&lt;cognitive_reflection&gt;</span>
                    <br />
                    <span>Analyze input constraints before emitting structured response.</span>
                    <br />
                    <span className="text-pink-300">&lt;/cognitive_reflection&gt;</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep.id === 'compare_arena' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-orange-600" />
                  Live Parallel Execution Arena Simulation:
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Synchronous Execution Complete
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Candidate A Card */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      <strong className="text-slate-900">Gemini 2.5 Flash</strong>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">385ms • 64 tokens/s</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-700 font-mono">
                    def download_urls_async(): # Fast & concise
                  </div>
                  <span className="text-[10px] text-slate-500">Latency winner (Sub-400ms)</span>
                </div>

                {/* Candidate B Card */}
                <div className="p-3.5 rounded-xl bg-white border border-red-200 ring-1 ring-red-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <strong className="text-slate-900">Gemini 2.5 Pro</strong>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">920ms • 2M Context</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-700 font-mono">
                    # Includes Semaphore(5), exponential backoff & schema typing
                  </div>
                  <span className="text-[10px] font-bold text-red-600">Depth & Edge-Case Leader</span>
                </div>
              </div>
            </div>
          )}

          {currentStep.id === 'compare_referee' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-extrabold text-purple-900">
                    Automated AI Referee Judgment Breakdown
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-600 font-medium">Select winner:</span>
                  <button
                    onClick={() => setInteractiveArenaWinner('modelB')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      interactiveArenaWinner === 'modelB'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-purple-200'
                    }`}
                  >
                    Gemini 2.5 Pro (Victor)
                  </button>
                  <button
                    onClick={() => setInteractiveArenaWinner('modelA')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      interactiveArenaWinner === 'modelA'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-purple-200'
                    }`}
                  >
                    Gemini 2.5 Flash
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {[
                  { label: 'Accuracy', a: '9/10', b: '10/10' },
                  { label: 'Completeness', a: '8/10', b: '10/10' },
                  { label: 'Structure', a: '9/10', b: '9/10' },
                  { label: 'Reasoning', a: '7/10', b: '10/10' },
                  { label: 'Readiness', a: '8/10', b: '10/10' }
                ].map((crit) => (
                  <div key={crit.label} className="p-2 rounded-xl bg-white border border-purple-100">
                    <span className="text-[10px] text-slate-500 font-bold block">{crit.label}</span>
                    <div className="font-mono text-xs font-black mt-0.5">
                      <span className="text-orange-600">{crit.a}</span> vs{' '}
                      <span className="text-purple-700">{crit.b}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-purple-900 bg-white/70 p-2.5 rounded-xl border border-purple-100">
                <strong>Referee Verdict:</strong> Model B demonstrated superior resilience against rate-limiting and strictly followed the JSON format constraint without markdown formatting leakage.
              </p>
            </div>
          )}

          {/* Key Bullet Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentStep.content.keyPoints.map((pt, i) => {
              const Icon = pt.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-orange-300 transition-all space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">{pt.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{pt.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Helpful Tip Box */}
          {currentStep.content.tip && (
            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/70 text-xs text-orange-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>
                <strong>Pro Tip:</strong> {currentStep.content.tip}
              </span>
            </div>
          )}

          {/* Launch Buttons on Final Step */}
          {isLastStep && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-red-50 border border-orange-200 space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Select your starting destination:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleGoToTool('builder')}
                  className="p-4 rounded-xl bg-white hover:bg-orange-500 hover:text-white border border-orange-200 hover:border-orange-500 transition-all text-left shadow-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-100 group-hover:bg-white text-orange-600 flex items-center justify-center mb-2">
                    <Wand2 className="w-3.5 h-3.5" />
                  </div>
                  <strong className="text-xs block text-slate-900 group-hover:text-white font-bold">
                    SmartBuilderWizard
                  </strong>
                  <span className="text-[11px] text-slate-500 group-hover:text-orange-100">
                    Synthesize prompts in 4 frameworks
                  </span>
                </button>

                <button
                  onClick={() => handleGoToTool('compare')}
                  className="p-4 rounded-xl bg-white hover:bg-red-500 hover:text-white border border-red-200 hover:border-red-500 transition-all text-left shadow-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-100 group-hover:bg-white text-red-600 flex items-center justify-center mb-2">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <strong className="text-xs block text-slate-900 group-hover:text-white font-bold">
                    ModelCompareStudio
                  </strong>
                  <span className="text-[11px] text-slate-500 group-hover:text-red-100">
                    Run arenas & AI referee evaluations
                  </span>
                </button>

                <button
                  onClick={() => handleGoToTool('library')}
                  className="p-4 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 transition-all text-left shadow-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-white text-slate-800 flex items-center justify-center mb-2">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <strong className="text-xs block text-slate-900 group-hover:text-white font-bold">
                    Prompt Library
                  </strong>
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-300">
                    Explore 100K prompts across 204 niches
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          {/* Step Dots indicator */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-orange-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to step ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-500 hover:text-slate-700">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded text-orange-600 focus:ring-orange-500 w-3.5 h-3.5"
            />
            <span>Don't show automatically on startup</span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-200/60 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {!isLastStep ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.min(prev + 1, tourSteps.length - 1))}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishTour}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Finish Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
