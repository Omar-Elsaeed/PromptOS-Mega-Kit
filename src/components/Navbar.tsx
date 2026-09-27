import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Moon,
  Sun,
  HelpCircle,
  Settings,
  Heart,
  Clock,
  Layers,
  ChevronDown,
  Wand2,
  SlidersHorizontal,
  Bot,
  Zap,
  Code2,
  Users2,
  FlaskConical,
  BookOpen,
  ShoppingBag,
  Stethoscope,
  Cloud,
  X,
  Check,
  Copy,
  ArrowRight,
  CornerDownLeft,
  Flame,
  Play,
  Compass,
  PanelLeft
} from 'lucide-react';
import { PromptItem } from '../types';
import { searchLibraryPrompts, buildGEPAPrompt } from '../utils/promptGenerators';

export interface NavbarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenSettings?: () => void;
  onStartTour?: () => void;
  onOpenTour?: () => void;
  onOpenFavorites?: () => void;
  onOpenHistory?: () => void;
  onOpenSmartBuilder?: () => void;
  onOpenFableQuick?: () => void;
  onOpenFablePro?: () => void;
  onOpenOptimizer?: () => void;
  onOpenRoleGen?: () => void;
  onOpenChainBuilder?: () => void;
  onOpenABTester?: () => void;
  favoritesCount: number;
  historyCount: number;

  // Sidebar toggle
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;

  // Global search props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectPrompt?: (prompt: PromptItem) => void;
  onCopy?: (text: string, title: string) => void;
  onTestInPlayground?: (prompt: PromptItem) => void;
}

const POPULAR_SEARCH_TAGS = [
  'SaaS Growth',
  'Code Architecture',
  'Risk Assessment',
  'Causal Modeling',
  'Ruben Fable 5',
  'Automations',
  'Full Stack'
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  darkMode,
  setDarkMode,
  theme,
  onToggleTheme,
  onOpenFavorites,
  onOpenHistory,
  favoritesCount,
  historyCount,
  onStartTour,
  onOpenTour,
  onToggleSidebar,
  isSidebarOpen,
  searchQuery,
  onSearchChange,
  onSelectPrompt,
  onCopy,
  onTestInPlayground,
}) => {
  const [suiteOpen, setSuiteOpen] = useState(false);
  const suiteRef = useRef<HTMLDivElement>(null);

  // Global search state
  const [internalQuery, setInternalQuery] = useState('');
  const currentQuery = searchQuery !== undefined ? searchQuery : internalQuery;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleQueryChange = (val: string) => {
    setInternalQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  // Instant real-time matching results across the 100K prompt vault
  const { results: searchResults, totalEstimatedMatches } = useMemo(() => {
    if (!currentQuery.trim()) {
      return { results: [], totalEstimatedMatches: 0 };
    }
    return searchLibraryPrompts(currentQuery, 6);
  }, [currentQuery]);

  const handleSelectTab = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    else if (setActiveTab) setActiveTab(tab);
  };

  const isDark = theme ? theme === 'dark' : darkMode ?? false;
  const toggleDark = () => {
    if (onToggleTheme) onToggleTheme();
    else if (setDarkMode) setDarkMode(!isDark);
  };

  // Global Keyboard Shortcuts (Cmd+K, Ctrl+K, '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
        return;
      }
      // '/' key when not already inside an input or textarea
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
        return;
      }
      // Escape closes search dropdown
      if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (suiteRef.current && !suiteRef.current.contains(event.target as Node)) {
        setSuiteOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectTab('library');
      setIsSearchFocused(false);
      setTimeout(() => {
        const el = document.getElementById('library-search-input') || document.getElementById('prompt-library-grid');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSelectSearchResult = (p: PromptItem) => {
    if (onSelectPrompt) {
      onSelectPrompt(p);
    } else {
      handleQueryChange(p.title);
      handleSelectTab('library');
      setTimeout(() => {
        const el = document.getElementById('library-search-input');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    setIsSearchFocused(false);
  };

  const handleCopyPrompt = (p: PromptItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = buildGEPAPrompt(p.title, p.niche, p.role, p.difficulty);
    if (onCopy) {
      onCopy(text, p.title);
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopiedPromptId(p.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleTestPrompt = (p: PromptItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchFocused(false);
    if (onTestInPlayground) {
      onTestInPlayground(p);
    } else {
      handleSelectTab('playground');
    }
  };

  // Helper to highlight matching text in title
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const cleanQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQuery})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <span key={i} className="bg-orange-100 text-orange-950 font-bold px-0.5 rounded">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-500/15 bg-white/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="w-full px-3 sm:px-6 h-16 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Sidebar Toggle + Brand Identity */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl text-slate-600 hover:text-slate-900 border transition-all shrink-0 ${
                isSidebarOpen
                  ? 'bg-orange-500/10 text-orange-600 border-orange-500/30'
                  : 'bg-white hover:bg-orange-50/70 border-slate-200/80 hover:border-orange-200'
              }`}
              title={isSidebarOpen ? 'Collapse navigation sidebar' : 'Open navigation sidebar'}
              aria-label="Toggle navigation sidebar"
            >
              <PanelLeft className="w-4 h-4 text-slate-700" />
            </button>
          )}

          <button
            onClick={() => handleSelectTab('library')}
            className="flex items-center gap-2 font-black tracking-tight text-slate-900 shrink-0 hover:opacity-95 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              Prompt<span className="text-orange-600">OS</span>
            </span>
            <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[10px] font-bold text-orange-700">
              <span>100K Vault</span>
            </div>
          </button>
        </div>

        {/* Global Real-Time Search Bar (Centered and Generously Sized) */}
        <div className="relative flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-1 sm:mx-3 shrink-0" ref={searchContainerRef}>
          <div
            className={`relative flex items-center transition-all duration-150 rounded-xl border ${
              isSearchFocused
                ? 'border-orange-500 bg-white ring-2 ring-orange-500/20 shadow-xs'
                : 'border-slate-200/90 bg-slate-50/80 hover:bg-white hover:border-slate-300'
            }`}
          >
            <Search className={`w-3.5 h-3.5 ml-2.5 shrink-0 transition-colors ${isSearchFocused ? 'text-orange-600' : 'text-slate-400'}`} />
            <input
              ref={searchInputRef}
              type="text"
              value={currentQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search 100K prompts... (Ctrl+K)"
              className="w-full py-1.5 pl-2 pr-7 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
            />

            {currentQuery ? (
              <button
                onClick={() => {
                  handleQueryChange('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2 p-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
                title="Clear global search"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <div className="absolute right-2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/70 text-[9px] font-bold text-slate-500 pointer-events-none">
                <span>⌘K</span>
              </div>
            )}
          </div>

          {/* Real-Time Live Search Dropdown */}
          {isSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 w-[320px] sm:w-[420px] md:w-[480px] bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              {currentQuery.trim() ? (
                <>
                  {/* Results Header */}
                  <div className="p-3 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800">
                        {totalEstimatedMatches.toLocaleString()} matching prompts found
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Press <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 font-mono text-[9px]">Enter ↵</kbd> to filter library
                    </span>
                  </div>

                  {/* Results List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((p) => {
                        const isCopied = copiedPromptId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSelectSearchResult(p)}
                            className="p-2.5 rounded-xl hover:bg-orange-50/60 cursor-pointer transition-colors group flex items-start justify-between gap-2.5"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className="text-base shrink-0 p-1 rounded-lg bg-slate-100/80 group-hover:bg-white border border-slate-200/60 group-hover:border-orange-200">
                                {p.icon}
                              </span>
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                                  {highlightMatch(p.title, currentQuery)}
                                </h5>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap text-[10.5px]">
                                  <span className="font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/70">
                                    {p.niche}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-500 truncate">{p.role}</span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-600 font-medium">{p.difficulty}</span>
                                </div>
                              </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleCopyPrompt(p, e)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 transition-colors"
                                title="Copy prompt text"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={(e) => handleTestPrompt(p, e)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 transition-colors"
                                title="Test in Agent Playground"
                              >
                                <Play className="w-3 h-3 text-orange-500 fill-orange-500/20" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-slate-500">
                        <p className="text-xs font-medium">No prompts directly matched "{currentQuery}" in title.</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Try searching for keywords like "Growth", "Architecture", "Audit", or press Enter to filter across all niches.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Results Footer Action */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        handleSelectTab('library');
                        setIsSearchFocused(false);
                      }}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Show all filtered prompts in Library</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-400">100,000 Prompts Indexed</span>
                  </div>
                </>
              ) : (
                /* Empty / Suggestions state */
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-orange-500" />
                      Popular Real-Time Filters
                    </span>
                    <span className="text-[10px] text-slate-400">Press / to search anytime</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          handleQueryChange(tag);
                          searchInputRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-orange-50/50 border border-orange-100 text-[11px] text-slate-600">
                    💡 <strong>Real-time filter:</strong> Type any keyword (e.g. <em>"Funnel"</em>, <em>"Audit"</em>, <em>"API"</em>) to instantaneously filter the entire prompt database.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Tools: Status, Saved, Tour, Theme Toggle, Suite */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Active Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50/60 border border-orange-200/60 text-[10px] text-orange-700 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>204 Niches</span>
          </div>

          {/* Favorites Button */}
          {onOpenFavorites && (
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 text-slate-600 hover:text-red-500 transition-colors shadow-2xs"
              title="Saved Prompts"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* History Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 text-slate-600 hover:text-orange-600 transition-colors shadow-2xs"
              title="Recent Activity"
            >
              <Clock className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {historyCount > 99 ? '99+' : historyCount}
                </span>
              )}
            </button>
          )}

          {/* Onboarding Feature Tour Button */}
          {(onStartTour || onOpenTour) && (
            <button
              onClick={onStartTour || onOpenTour}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200/90 text-orange-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs group shrink-0"
              title="Take Interactive Feature Tour (SmartBuilder & ModelCompare)"
            >
              <Compass className="w-3.5 h-3.5 text-orange-600 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Tour</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 text-slate-600 hover:text-orange-600 transition-colors shadow-2xs"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-orange-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* AI Private Suite Dropdown */}
          <div className="relative" ref={suiteRef}>
            <button
              onClick={() => setSuiteOpen(!suiteOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suite</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${suiteOpen ? 'rotate-180' : ''}`} />
            </button>

            {suiteOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-orange-500" />
                      AI Studio Engines
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">16 specialized engineering modules</p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    Pro v17
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto pr-1">
                  {(onStartTour || onOpenTour) && (
                    <button
                      onClick={() => { (onStartTour || onOpenTour)?.(); setSuiteOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left bg-orange-50/60 hover:bg-orange-100/70 border border-orange-200/70 transition-colors group mb-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600 flex items-center gap-1.5">
                          <span>Interactive Feature Tour</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-200/80 text-orange-900">TOUR</span>
                        </div>
                        <div className="text-[10.5px] text-slate-600">SmartBuilder & ModelCompare guide</div>
                      </div>
                    </button>
                  )}

                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1.5 mt-1">
                    Prompt Synthesis
                  </div>

                  <button
                    onClick={() => { handleSelectTab('builder'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-orange-600">
                        AI Smart Builder (5-Step)
                      </div>
                      <div className="text-[10.5px] text-slate-500">Interactive step-by-step wizard</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleSelectTab('fable5'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-red-600 flex items-center justify-between">
                        <span>Fable 5 Anatomy</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-50 text-red-600 border border-red-200">11-BLOCK</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500">Ruben Hassid Fable 5 guide</div>
                    </div>
                  </button>

                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1.5 mt-2">
                    Code & Agent Frameworks
                  </div>

                  <button
                    onClick={() => { handleSelectTab('bedrock'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Cloud className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-orange-600 flex items-center justify-between">
                        <span>Amazon Bedrock AgentCore</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700 border border-orange-200">HOT</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500">Boto3, OpenAPI, RAG & IaC</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleSelectTab('agents'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-rose-600 flex items-center justify-between">
                        <span>Healthcare & Enterprise Agents</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-200">NEW</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500">12 Autonomous architectures</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleSelectTab('langchain'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-orange-600">
                        LangChain & LangGraph
                      </div>
                      <div className="text-[10.5px] text-slate-500">LCEL & state machine generator</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleSelectTab('crewai'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                      <Users2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-red-600">
                        CrewAI Studio
                      </div>
                      <div className="text-[10.5px] text-slate-500">Multi-agent team orchestrator</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleSelectTab('automation'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-amber-600">
                        n8n & Make Automations
                      </div>
                      <div className="text-[10.5px] text-slate-500">18 JSON production workflows</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleSelectTab('evals'); setSuiteOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-orange-50/70 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-rose-600">
                        Evals & Observability
                      </div>
                      <div className="text-[10.5px] text-slate-500">DeepEval & Promptfoo scoring</div>
                    </div>
                  </button>
                </div>

                <div className="p-2.5 border-t border-slate-100 mt-1 bg-orange-50/40 rounded-xl flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 font-medium">Google Gemini & Claude APIs</span>
                  <button
                    onClick={() => { handleSelectTab('builder'); setSuiteOpen(false); }}
                    className="text-xs font-bold text-orange-600 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <span>Open Studio</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
