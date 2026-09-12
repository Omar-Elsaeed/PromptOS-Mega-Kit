import React, { useState } from 'react';
import { Heart, Clock, Search, Trash2, Copy, Sparkles, ExternalLink, ArrowRight, X, Play, Wand2, Download } from 'lucide-react';
import { PromptItem } from '../types';

interface SavedDrawersProps {
  isOpen: boolean;
  type: 'favorites' | 'history';
  onClose: () => void;
  items: PromptItem[];
  onCopy: (text: string, title: string) => void;
  onRemoveFavorite?: (prompt: PromptItem) => void;
  onClearHistory?: () => void;
  onTestInPlayground?: (prompt: PromptItem) => void;
  onCustomizeInBuilder?: (prompt: PromptItem) => void;
}

export const SavedDrawers: React.FC<SavedDrawersProps> = ({
  isOpen,
  type,
  onClose,
  items,
  onCopy,
  onRemoveFavorite,
  onClearHistory,
  onTestInPlayground,
  onCustomizeInBuilder
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const isFav = type === 'favorites';
  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.niche.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${type}_prompts_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs ${
                  isFav
                    ? 'bg-gradient-to-tr from-red-500 to-rose-600'
                    : 'bg-gradient-to-tr from-orange-500 to-amber-600'
                }`}
              >
                {isFav ? <Heart className="w-5 h-5 fill-white/20" /> : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {isFav ? 'Saved Favorites' : 'Recent Activity History'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {items.length} {items.length === 1 ? 'prompt' : 'prompts'} stored locally
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Actions Bar */}
          <div className="p-4 border-b border-slate-100 bg-white space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${isFav ? 'favorites' : 'history'}...`}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              {items.length > 0 && (
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              )}

              {!isFav && onClearHistory && items.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-bold flex items-center gap-1.5 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
                  {isFav ? <Heart className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <p className="text-sm font-bold text-slate-700">No {isFav ? 'favorites' : 'history items'} found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {isFav
                    ? 'Click the heart icon on any prompt card to save it for quick access anytime.'
                    : 'Prompts you copy, customize, or test will automatically appear in your recent history.'}
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 shadow-2xs transition-all space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-[10.5px] font-bold text-orange-700 mb-1">
                        {item.niche}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        Role: {item.role}
                      </p>
                    </div>

                    {isFav && onRemoveFavorite && (
                      <button
                        onClick={() => onRemoveFavorite(item)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-red-500" />
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onCopy(item.fable || item.gepa || item.prompt, item.title)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>

                    {onTestInPlayground && (
                      <button
                        onClick={() => {
                          onTestInPlayground(item);
                          onClose();
                        }}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                        title="Test in Agent Playground"
                      >
                        <Play className="w-3 h-3" />
                        <span>Test</span>
                      </button>
                    )}

                    {onCustomizeInBuilder && (
                      <button
                        onClick={() => {
                          onCustomizeInBuilder(item);
                          onClose();
                        }}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                        title="Customize in Smart Wizard"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Builder</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
