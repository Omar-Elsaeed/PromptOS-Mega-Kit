import React from 'react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Database, Flame, Compass } from 'lucide-react';

interface HeroProps {
  onQuickStart: () => void;
  onExploreFable5: () => void;
  onOpenTour?: () => void;
  onSelectNiche?: (niche: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickStart, onExploreFable5, onOpenTour, onSelectNiche }) => {
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

  const expansionNiches = [
    { id: 205, name: 'Autonomous AI AgentOps', icon: '🤖', badge: 'Swarm Ops' },
    { id: 206, name: 'Spatial Computing & VisionOS', icon: '🥽', badge: 'VisionOS' },
    { id: 207, name: 'Generative Video & Synthetic Media', icon: '🎬', badge: 'NeRFs & Splatting' },
    { id: 208, name: 'Fractional AI CGO & RevOps', icon: '📈', badge: 'RevOps' },
    { id: 209, name: 'Longevity & Precision Medicine', icon: '🧬', badge: 'Healthspan' },
    { id: 210, name: 'Circular Economy & Carbon Accounting', icon: '🌱', badge: 'ESG & CSRD' }
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
          <span>Ultra-Modern Edition · 105K Prompts · 210 Niches · 4 Production Frameworks</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-5">
          105,000{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Expert AI Prompts
          </span>
          <br />Engineered for Precision.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          Enterprise prompt engineering across 210 niches, 2,788 expert roles, and 4 production frameworks:{' '}
          <strong className="text-slate-900 font-bold">9-Step Cognitive Mediation</strong>,{' '}
          <strong className="text-slate-900 font-bold">GEPA 6-Block</strong>,{' '}
          <strong className="text-slate-900 font-bold">Ruben Hassid Fable 5 (11-Block)</strong>, and{' '}
          <strong className="text-slate-900 font-bold">GEPA⁺ Unified</strong>.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
          <button
            onClick={onQuickStart}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Launch Smart Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreFable5}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 text-slate-800 font-bold text-sm shadow-xs transition-all cursor-pointer"
          >
            Explore Fable 5 Anatomy
          </button>
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200/90 text-orange-800 font-bold text-sm shadow-xs transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Compass className="w-4 h-4 text-orange-600 group-hover:rotate-45 transition-transform" />
              <span>Feature Tour</span>
            </button>
          )}
        </div>

        {/* Live Key Stats in Ultra-White Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto p-3 rounded-2xl bg-white border border-orange-200/60 shadow-lg shadow-orange-500/5 mb-8">
          <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center relative group">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>105,000</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold mt-1">
              Prompts
            </div>
          </div>
          <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center relative group">
            <div className="text-2xl sm:text-3xl font-black text-orange-600 tracking-tight flex items-center justify-center gap-1.5">
              <span>210</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full tracking-normal uppercase">
                +6 NEW
              </span>
            </div>
            <div className="text-[10px] text-orange-700/80 uppercase tracking-widest font-extrabold mt-1">
              Niches
            </div>
          </div>
          <div className="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              4
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

        {/* 6 New High-Ticket Niches Quick Jump Pill Bar */}
        <div className="mb-7 p-3 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-rose-500/10 border border-orange-200/70 text-left">
          <div className="flex items-center justify-between mb-2 px-1 flex-wrap gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
              ✨ Newly Added Enterprise Niches (IDs 205–210 · 48 Complete Role Cards):
            </span>
            <span className="text-[10px] text-orange-700 font-semibold">
              Includes 4 Frameworks + Deep Modules + Global Appendix
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {expansionNiches.map((n) => (
              <button
                key={n.id}
                onClick={() => onSelectNiche?.(n.name)}
                className="flex items-center gap-2 p-2 rounded-xl bg-white border border-orange-200/80 hover:border-orange-500 hover:shadow-xs hover:bg-orange-50/50 transition-all text-left cursor-pointer group"
              >
                <span className="text-lg">{n.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-slate-800 group-hover:text-orange-600 truncate">
                    {n.badge}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    #{n.id}
                  </div>
                </div>
              </button>
            ))}
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
