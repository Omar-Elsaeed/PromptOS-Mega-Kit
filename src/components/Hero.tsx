import React from 'react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Database, Flame } from 'lucide-react';

interface HeroProps {
  onQuickStart: () => void;
  onExploreFable5: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickStart, onExploreFable5 }) => {
  const fableBlocks = [
    { num: '①', name: 'Task' },
    { num: '②', name: 'Context' },
    { num: '③', name: 'Reference' },
    { num: '④', name: 'Effort' },
    { num: '⑤', name: 'Act' },
    { num: '⑥', name: 'Scope' },
    { num: '⑦', name: 'Delegate' },
    { num: '⑧', name: 'Evidence' },
    { num: '⑨', name: 'Memory' },
    { num: '⑩', name: 'Checkpoint' },
    { num: '⑪', name: 'Report' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white border-b border-orange-500/10 py-14 sm:py-18 px-4 sm:px-6">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-tr from-orange-300/20 via-red-300/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-orange-200/80 shadow-xs text-xs font-bold text-orange-700 mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
          <span>Ultra-Modern Edition · 100K Prompts · 204 Niches · Fable 5 & GEPA⁺</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-5">
          100,000{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Expert AI Prompts
          </span>
          <br />Engineered for Precision.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          Enterprise prompt engineering across 204 niches, 2,740 expert roles, and 3 production frameworks:{' '}
          <strong className="text-slate-900 font-bold">GEPA 6-Block</strong>,{' '}
          <strong className="text-slate-900 font-bold">Ruben Hassid Fable 5 (11-Block)</strong>, and{' '}
          <strong className="text-slate-900 font-bold">GEPA⁺ Unified</strong>.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
          <button
            onClick={onQuickStart}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Launch Smart Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreFable5}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 text-slate-800 font-bold text-sm shadow-xs transition-all"
          >
            Explore Fable 5 Anatomy
          </button>
        </div>

        {/* Live Key Stats in Ultra-White Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto p-3 rounded-2xl bg-white border border-orange-200/60 shadow-lg shadow-orange-500/5 mb-8">
          <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              100,000
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold mt-1">
              Prompts
            </div>
          </div>
          <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-orange-600 tracking-tight">
              204
            </div>
            <div className="text-[10px] text-orange-700/80 uppercase tracking-widest font-extrabold mt-1">
              Niches
            </div>
          </div>
          <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              3
            </div>
            <div className="text-[10px] text-red-700/80 uppercase tracking-widest font-extrabold mt-1">
              Frameworks
            </div>
          </div>
          <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              16
            </div>
            <div className="text-[10px] text-rose-700/80 uppercase tracking-widest font-extrabold mt-1">
              AI Tools
            </div>
          </div>
        </div>

        {/* 11 Fable 5 Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mr-1">
            Fable 5 Anatomy:
          </span>
          {fableBlocks.map((b) => (
            <span
              key={b.name}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white text-orange-800 border border-orange-200/80 shadow-2xs hover:bg-orange-50 transition-colors"
            >
              {b.num} {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
