import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Copy, Shield, BookOpen, Layers, Flame } from 'lucide-react';

interface Fable5GuideProps {
  onOpenQuickBuild: () => void;
  onOpenProBuild: () => void;
  onCopy: (text: string, title: string) => void;
}

export const Fable5Guide: React.FC<Fable5GuideProps> = ({
  onOpenQuickBuild,
  onOpenProBuild,
  onCopy,
}) => {
  const blocks = [
    {
      num: '01',
      name: 'TASK',
      rule: 'Start with why, NOT what.',
      desc: 'Connect the dots by framing the goal first. Lead with purpose, audience, and what the output enables — then give the specific task.',
      template: '"I\'m working on [goal] for [who it\'s for]. They need [what the output enables]. With that in mind: [task]."',
      badge: 'Intent Anchor'
    },
    {
      num: '02',
      name: 'CONTEXT FILES',
      rule: 'Upload your expertise. Stop explaining in prompts.',
      desc: 'The file is the brain. Attach your domain knowledge and reference it. This compounds with every single iteration.',
      template: '"Read these files completely before responding: [filename.md] — [what it contains]."',
      badge: 'Knowledge Base'
    },
    {
      num: '03',
      name: 'REFERENCE',
      rule: 'Show the model what good looks like.',
      desc: 'One concrete example beats ten vague instructions. Paste a benchmark output that represents the quality, structure, and depth you expect.',
      template: '"Reference for what I want to achieve: [paste example]."',
      badge: 'Quality Standard'
    },
    {
      num: '04',
      name: 'EFFORT',
      rule: 'Give the model your hardest problem.',
      desc: 'Teams testing on easy tasks undersell it. Classify difficulty so the model knows how deep to go: routine, hard, or hardest-unsolved.',
      template: '"This is a [routine / hard / hardest-unsolved] problem. Scope it like it\'s at the top of your range."',
      badge: 'Depth Calibrator'
    },
    {
      num: '05',
      name: 'ACT',
      rule: 'Decide and move. Do not re-litigate decisions.',
      desc: 'Tell the model when to act vs when to ask. Add the rule to not re-litigate your established decisions and to give recommendations when weighing choices.',
      template: '"When you have enough to act, act. Don\'t re-litigate my decisions. While weighing a choice, give a recommendation."',
      badge: 'Autonomy Rule'
    },
    {
      num: '06',
      name: 'SCOPE',
      rule: 'Frontier models over-deliver by default. Control it.',
      desc: 'Define the minimal viable output — no extra features, unsolicited refactors, or unnecessary abstractions.',
      template: '"Do the simplest thing that works well. No extra features, refactors, or abstractions. If describing a problem, deliver your assessment."',
      badge: 'Anti-Bloat'
    },
    {
      num: '07',
      name: 'DELEGATE',
      rule: 'One agent is no longer the limit.',
      desc: 'The model is a team lead. It can spawn subagents for parallel execution. Instruct it to delegate and verify with fresh-context agents.',
      template: '"Split independent subtasks across subagents & keep working while they run. Verify with a fresh-context subagent."',
      badge: 'Multi-Agent'
    },
    {
      num: '08',
      name: 'EVIDENCE',
      rule: 'Never accept claims without receipts.',
      desc: 'Mandate that the model shows its work, cites documentation, and provides concrete diffs or logs for every single statement.',
      template: '"For every recommendation, cite specific evidence, benchmarks, or reproducible test results. No unverified claims."',
      badge: 'Fact-Check'
    },
    {
      num: '09',
      name: 'MEMORY',
      rule: 'Carry forward state and constraints.',
      desc: 'Preserve architectural decisions and guidelines across turns so multi-agent workflows maintain coherence.',
      template: '"Retain these core architecture principles across all generated code: [list key invariants]."',
      badge: 'Context Sync'
    },
    {
      num: '10',
      name: 'CHECKPOINT',
      rule: 'Pause and verify before irreversible steps.',
      desc: 'Define validation checkpoints where execution must stop and verify before committing critical changes.',
      template: '"Stop and verify after step [X]. Confirm test pass rate before proceeding to deployment phase."',
      badge: 'Safe Guard'
    },
    {
      num: '11',
      name: 'REPORT',
      rule: 'Deliver actionable, scannable executive outcomes.',
      desc: 'Open with the outcome: the clear TLDR you would ask for. Complete sentences. Clarity over brevity.',
      template: '"Open with the outcome — the executive TLDR. Use high-contrast bulleted structure with clear next actions."',
      badge: 'Executive Output'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-4 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
          <span>Ruben Hassid · Fable 5 Framework</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
          The Anatomy of an{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            11-Block Precision Prompt
          </span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          The 11-block framework created by AI educator <strong className="text-slate-900 font-bold">Ruben Hassid</strong>.
          Every block solves a specific, documented failure mode in frontier AI models.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onOpenQuickBuild}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <span>✦ Quick Builder (4 Fields)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenProBuild}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:border-orange-400 hover:text-orange-600 transition-all shadow-2xs"
          >
            ◈ Pro Builder (All 11 Blocks)
          </button>
        </div>
      </div>

      {/* 11 Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {blocks.map((block) => (
          <div
            key={block.num}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-black text-orange-600">
                  {block.num}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                  {block.badge}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                {block.name}
              </h3>
              <p className="text-xs font-semibold italic text-red-600 mb-2">
                {block.rule}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {block.desc}
              </p>
            </div>

            <div className="mt-auto">
              <div className="p-3 rounded-xl bg-orange-50/40 border border-orange-100 font-mono text-[11px] text-slate-800 leading-relaxed mb-2">
                {block.template}
              </div>
              <button
                onClick={() => onCopy(block.template, `Fable 5 Block ${block.num}: ${block.name}`)}
                className="w-full py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Block Syntax</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ruben Hassid Credit Banner */}
      <div className="p-6 rounded-2xl bg-white border border-orange-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md shadow-orange-500/20">
            👨‍💻
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Ruben Hassid · Framework Originator
            </h4>
            <p className="text-xs text-slate-600 max-w-xl">
              Pioneer in prompt engineering and structured LLM steering. His research demonstrated this 11-block architecture eliminates hallucinations and keeps AI assistants on track for hours.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuickBuild}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold whitespace-nowrap shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-red-600 transition-all"
        >
          Build a Fable 5 Prompt →
        </button>
      </div>
    </div>
  );
};
