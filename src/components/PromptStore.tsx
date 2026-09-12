import React, { useState } from 'react';
import { ShoppingBag, Star, Download, Sparkles, Check, Copy, Heart, Search, Eye, Flame } from 'lucide-react';
import { PromptItem } from '../types';
import { getPromptByIndex } from '../utils/promptGenerators';
import { getNicheMeta } from '../data/niches';

interface PromptStoreProps {
  onCopy: (text: string, title: string) => void;
}

export const PromptStore: React.FC<PromptStoreProps> = ({ onCopy }) => {
  const [search, setSearch] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());

  // Generate 18 featured marketplace prompts
  const storeItems: PromptItem[] = Array.from({ length: 18 }, (_, i) => getPromptByIndex(i * 37 + 10));

  const filtered = storeItems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.niche.toLowerCase().includes(search.toLowerCase())
  );

  const handlePurchase = (item: PromptItem) => {
    setPurchasedIds(prev => new Set(prev).add(item.id));
    const content = item.fable || item.gepa || item.gepaplus || item.prompt || item.title;
    onCopy(content, `${item.title} — Purchased`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
            <span>🏪 Curated Prompt Marketplace & Store</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Curated Expert AI Prompts &{' '}
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
              Blueprints
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified production prompts with ratings, benchmarks, and commercial usage rights.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search store catalog..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 shadow-xs"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filtered.map((item) => {
          const meta = getNicheMeta(item.niche);
          const isUnlocked = purchasedIds.has(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                  >
                    {meta.emoji} {item.niche}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.9</span>
                    <span className="text-slate-400 text-[10px]">({item.downloads})</span>
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {item.role}: Structured output prompt with high domain fidelity.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">{item.difficulty}</span>
                  <span>•</span>
                  <span>11-Block Fable 5</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">License: </span>
                  <span className="text-xs font-black text-slate-900">Commercial</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPrompt(item)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
                    title="Preview prompt anatomy"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePurchase(item)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isUnlocked
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-sm shadow-orange-500/20'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Get Free</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Prompt Inspection</span>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-900">{selectedPrompt.title}</h3>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {selectedPrompt.fable || selectedPrompt.gepa || selectedPrompt.prompt}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPrompt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handlePurchase(selectedPrompt);
                  setSelectedPrompt(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-md shadow-orange-500/20"
              >
                Copy & Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
