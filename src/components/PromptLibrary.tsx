import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Heart,
  X,
  Copy,
  Check,
  Download,
  Wand2,
  Zap,
  Bot,
  Layers,
  ArrowUpDown,
  Code2
} from 'lucide-react';
import { PromptItem, DifficultyLevel, FrameworkType } from '../types';
import { NICHES_LIST, getNicheMeta } from '../data/niches';
import { VIBE_AGENTS_CONFIG } from '../data/templates';
import {
  getPromptByIndex,
  buildGEPAPrompt,
  buildFable5Prompt,
  buildGEPAPlusPrompt,
  buildNineStepPrompt,
  getSkillsForNiche
} from '../utils/promptGenerators';

interface PromptLibraryProps {
  onCopy: (text: string, title: string) => void;
  onSaveFavorite: (prompt: PromptItem) => void;
  isFavorite: (id: string) => boolean;
  onAddToHistory: (prompt: PromptItem) => void;
  onCustomizeInBuilder: (prompt: PromptItem) => void;
  onUseInAutomation: (prompt: PromptItem) => void;
  onTestInPlayground: (prompt: PromptItem) => void;
  onSelectSkill: (skillId: string) => void;
}

const ITEMS_PER_PAGE = 30;
const TOTAL_VIRTUAL_PROMPTS = 100000;

export const PromptLibrary: React.FC<PromptLibraryProps> = ({
  onCopy,
  onSaveFavorite,
  isFavorite,
  onAddToHistory,
  onCustomizeInBuilder,
  onUseInAutomation,
  onTestInPlayground,
  onSelectSkill,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedVibeAgent, setSelectedVibeAgent] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'price-asc' | 'price-desc' | 'default'>('default');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeFwTab, setActiveFwTab] = useState<Record<string, 'gepa' | 'fable5' | 'gepaplus' | 'ninestep'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('library-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth niche bar scrolling
  const scrollNiches = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Slice generation for selected niche / search filter
  // We generate a deterministic window of prompts based on filters
  const promptsPool = useMemo(() => {
    let poolSize = 3000; // ample in-memory pool for smooth rendering & searching
    const pool: PromptItem[] = [];

    const nicheIndices: number[] = selectedNiche === 'all'
      ? NICHES_LIST.map((_, i) => i)
      : [NICHES_LIST.indexOf(selectedNiche)].filter(i => i >= 0);

    let idCounter = 0;
    for (let i = 0; i < poolSize; i++) {
      const nIdx = nicheIndices[i % nicheIndices.length];
      const globalIdx = nIdx * 500 + Math.floor(i / nicheIndices.length);
      const prompt = getPromptByIndex(globalIdx);

      // Check filters
      if (selectedDifficulty !== 'all' && prompt.difficulty !== selectedDifficulty) continue;
      if (selectedFramework !== 'all' && prompt.framework !== selectedFramework) continue;
      if (showSavedOnly && !isFavorite(prompt.id)) continue;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = prompt.title.toLowerCase().includes(q) ||
                      prompt.niche.toLowerCase().includes(q) ||
                      prompt.role.toLowerCase().includes(q);
        if (!match) continue;
      }

      pool.push(prompt);
      idCounter++;
      if (idCounter >= 1200) break; // Limit pool size for instant responsive rendering
    }

    // Sort pool
    if (sortBy === 'downloads') {
      pool.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'price-asc') {
      pool.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      pool.sort((a, b) => b.price - a.price);
    }

    return pool;
  }, [selectedNiche, selectedDifficulty, selectedFramework, searchQuery, sortBy, showSavedOnly, isFavorite]);

  const totalPages = Math.max(1, Math.ceil(promptsPool.length / ITEMS_PER_PAGE));
  const currentPagePrompts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return promptsPool.slice(start, start + ITEMS_PER_PAGE);
  }, [promptsPool, currentPage]);

  const handleCardExpand = (prompt: PromptItem) => {
    const isCurrentlyOpen = expandedCardId === prompt.id;
    if (isCurrentlyOpen) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(prompt.id);
      onAddToHistory(prompt);
      if (!activeFwTab[prompt.id]) {
        setActiveFwTab(prev => ({ ...prev, [prompt.id]: 'gepa' }));
      }
    }
  };

  const handleCopyPrompt = (prompt: PromptItem, format: 'gepa' | 'fable5' | 'gepaplus' | 'ninestep') => {
    let text = '';
    if (format === 'gepa') text = buildGEPAPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);
    else if (format === 'fable5') text = buildFable5Prompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);
    else if (format === 'gepaplus') text = buildGEPAPlusPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);
    else text = buildNineStepPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);

    onCopy(text, `${prompt.title} (${format.toUpperCase()})`);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportPrompt = (prompt: PromptItem) => {
    const gepa = buildGEPAPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);
    const fable5 = buildFable5Prompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);
    const gepaplus = buildGEPAPlusPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);
    const ninestep = buildNineStepPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty);

    const fullText = `PROMPT: ${prompt.title}\nNICHE: ${prompt.niche}\nROLE: ${prompt.role}\nDIFFICULTY: ${prompt.difficulty}\n\n${'═'.repeat(50)}\nGEPA 6-BLOCK FORMAT\n${'═'.repeat(50)}\n${gepa}\n\n${'═'.repeat(50)}\nRUBEN HASSID FABLE 5 FORMAT\n${'═'.repeat(50)}\n${fable5}\n\n${'═'.repeat(50)}\nGEPA⁺ UNIFIED FRAMEWORK\n${'═'.repeat(50)}\n${gepaplus}\n\n${'═'.repeat(50)}\n9-STEP COGNITIVE MEDIATION & CAUSAL GOVERNANCE\n${'═'.repeat(50)}\n${ninestep}`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedNiche('all');
    setSelectedDifficulty('all');
    setSelectedFramework('all');
    setSelectedVibeAgent('all');
    setShowSavedOnly(false);
    setSortBy('default');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedNiche !== 'all' || selectedDifficulty !== 'all' || selectedFramework !== 'all' || showSavedOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Search & Action Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search 100,000 expert prompts... (Press Ctrl+K)"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs hover:border-orange-300"
            >
              <option value="default">Sort: Default</option>
              <option value="downloads">Most Downloads</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Framework filter */}
          <select
            value={selectedFramework}
            onChange={(e) => { setSelectedFramework(e.target.value); setCurrentPage(1); }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs hover:border-orange-300"
          >
            <option value="all">All Frameworks</option>
            <option value="9-Step Cognitive Mediation">🧠 9-Step Mediation</option>
            <option value="Ruben Fable 5">✦ Ruben Fable 5</option>
            <option value="GEPA Classic">📋 GEPA Classic</option>
            <option value="GEPA⁺ Unified">⚡ GEPA⁺ Unified</option>
          </select>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs hover:border-orange-300"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">🟢 Beginner</option>
            <option value="Intermediate">🔵 Intermediate</option>
            <option value="Advanced">🟠 Advanced</option>
            <option value="Expert">🔴 Expert</option>
          </select>

          {/* Favorites filter button */}
          <button
            onClick={() => { setShowSavedOnly(!showSavedOnly); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              showSavedOnly
                ? 'bg-gradient-to-r from-red-500 to-rose-600 border-red-500 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:text-red-600 hover:border-red-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : 'text-red-500'}`} />
            <span>Saved</span>
          </button>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* 204 Niche Navigation Bar */}
      <div className="relative flex items-center gap-2 mb-6 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => scrollNiches('left')}
          className="w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 flex items-center justify-center shrink-0 z-10 shadow-xs transition-colors"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 flex-1"
        >
          {/* All category pill */}
          <button
            onClick={() => { setSelectedNiche('all'); setCurrentPage(1); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedNiche === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xs'
                : 'border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
            }`}
          >
            <span>✦ All</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedNiche === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              100K
            </span>
          </button>

          {NICHES_LIST.map((nicheName) => {
            const meta = getNicheMeta(nicheName);
            const isSelected = selectedNiche === nicheName;
            return (
              <button
                key={nicheName}
                onClick={() => { setSelectedNiche(nicheName); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xs font-bold'
                    : 'border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{nicheName}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollNiches('right')}
          className="w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 flex items-center justify-center shrink-0 z-10 shadow-xs transition-colors"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-4 px-1">
        <div>
          Showing <strong className="text-slate-900 font-bold">{promptsPool.length.toLocaleString()}</strong> prompts
          {selectedNiche !== 'all' && <span> in <strong className="text-orange-600 font-bold">{selectedNiche}</strong></span>}
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Prompts Cards Grid */}
      {currentPagePrompts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3 text-xl border border-orange-200">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No prompts found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query, difficulty filter, or clearing filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold hover:from-orange-600 hover:to-red-600 transition-colors shadow-md shadow-orange-500/20"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {currentPagePrompts.map((prompt) => {
            const isExpanded = expandedCardId === prompt.id;
            const nicheMeta = getNicheMeta(prompt.niche);
            const activeTab = activeFwTab[prompt.id] || 'gepa';
            const skills = getSkillsForNiche(prompt.niche, prompt.difficulty, parseInt(prompt.id.replace('c', '')) || 1);

            return (
              <div
                key={prompt.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                  isExpanded
                    ? 'border-orange-500 shadow-xl ring-2 ring-orange-500/15 col-span-1 md:col-span-2 lg:col-span-3'
                    : 'border-slate-200/90 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/5'
                }`}
              >
                {/* Card Header */}
                <div
                  onClick={() => handleCardExpand(prompt)}
                  className="p-4 cursor-pointer select-none flex items-start justify-between gap-3 hover:bg-orange-50/20 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border"
                      style={{ backgroundColor: `${nicheMeta.color}15`, color: nicheMeta.color, borderColor: `${nicheMeta.color}30` }}
                    >
                      {nicheMeta.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight mb-2 truncate">
                        {prompt.title}
                      </h3>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-lg border"
                          style={{
                            backgroundColor: `${nicheMeta.color}15`,
                            color: nicheMeta.color,
                            borderColor: `${nicheMeta.color}30`
                          }}
                        >
                          {prompt.niche}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 truncate max-w-[140px]">
                          {prompt.role}
                        </span>
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                          {prompt.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Right Info */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-black text-orange-600">
                      ${prompt.price}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ↓ {prompt.downloads.toLocaleString()}
                    </span>
                    <div className={`text-slate-400 transition-transform text-xs mt-1 ${isExpanded ? 'rotate-180 text-orange-500 font-bold' : ''}`}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-orange-50/20">
                    {/* Framework Tabs Selector */}
                    <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar pt-2">
                      <button
                        onClick={() => setActiveFwTab(prev => ({ ...prev, [prompt.id]: 'ninestep' }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'ninestep'
                            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        🧠 9-Step Mediation
                      </button>
                      <button
                        onClick={() => setActiveFwTab(prev => ({ ...prev, [prompt.id]: 'gepa' }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'gepa'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        📋 GEPA 6-Block
                      </button>
                      <button
                        onClick={() => setActiveFwTab(prev => ({ ...prev, [prompt.id]: 'fable5' }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'fable5'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        ✦ Ruben Fable 5 (11-Block)
                      </button>
                      <button
                        onClick={() => setActiveFwTab(prev => ({ ...prev, [prompt.id]: 'gepaplus' }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'gepaplus'
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        ⚡ GEPA⁺ Unified
                      </button>
                    </div>

                    {/* Prompt Box */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto shadow-inner mb-3">
                      {activeTab === 'ninestep' && buildNineStepPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty)}
                      {activeTab === 'gepa' && buildGEPAPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty)}
                      {activeTab === 'fable5' && buildFable5Prompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty)}
                      {activeTab === 'gepaplus' && buildGEPAPlusPrompt(prompt.title, prompt.niche, prompt.role, prompt.difficulty)}
                    </div>

                    {/* Required Skills Section */}
                    <div className="mb-3">
                      <div className="text-[10.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 flex items-center gap-1">
                        <span>🎓 Required AI Capabilities & Skills</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {skills.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => onSelectSkill(s.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 transition-colors shadow-2xs"
                          >
                            <span>{s.icon}</span>
                            <span>{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyPrompt(prompt, activeTab)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all"
                        >
                          {copiedId === prompt.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === prompt.id ? 'Copied!' : 'Copy Prompt'}</span>
                        </button>

                        <button
                          onClick={() => onSaveFavorite(prompt)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isFavorite(prompt.id)
                              ? 'bg-red-50 border-red-300 text-red-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFavorite(prompt.id) ? 'fill-current text-red-500' : 'text-red-500'}`} />
                          <span>{isFavorite(prompt.id) ? 'Saved' : 'Save'}</span>
                        </button>

                        <button
                          onClick={() => handleExportPrompt(prompt)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-orange-400 hover:text-orange-600 flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export</span>
                        </button>
                      </div>

                      {/* Advanced Tool Shortcuts */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onCustomizeInBuilder(prompt)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:text-orange-600 hover:border-orange-300 flex items-center gap-1 transition-colors shadow-2xs"
                          title="Open in Smart Builder Wizard"
                        >
                          <Wand2 className="w-3 h-3 text-orange-500" />
                          <span>Customize</span>
                        </button>

                        <button
                          onClick={() => onUseInAutomation(prompt)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:text-emerald-600 hover:border-emerald-300 flex items-center gap-1 transition-colors shadow-2xs"
                          title="Generate n8n/Make Workflow"
                        >
                          <Zap className="w-3 h-3 text-emerald-500" />
                          <span>Automate</span>
                        </button>

                        <button
                          onClick={() => onTestInPlayground(prompt)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:text-purple-600 hover:border-purple-300 flex items-center gap-1 transition-colors shadow-2xs"
                          title="Test Live in Agent Playground"
                        >
                          <Bot className="w-3 h-3 text-purple-500" />
                          <span>Playground</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-600 transition-colors shadow-2xs"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 7) {
                if (currentPage > 4) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (6 - i);
                }
              }
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-600 transition-colors shadow-2xs"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
