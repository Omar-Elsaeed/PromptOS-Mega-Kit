import React, { useState, useRef, useEffect } from 'react';
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
  Cloud
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenSettings?: () => void;
  onStartTour?: () => void;
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
}

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
}) => {
  const [suiteOpen, setSuiteOpen] = useState(false);
  const suiteRef = useRef<HTMLDivElement>(null);

  const handleSelectTab = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    else if (setActiveTab) setActiveTab(tab);
  };

  const isDark = theme ? theme === 'dark' : darkMode ?? false;
  const toggleDark = () => {
    if (onToggleTheme) onToggleTheme();
    else if (setDarkMode) setDarkMode(!isDark);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suiteRef.current && !suiteRef.current.contains(event.target as Node)) {
        setSuiteOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'library', label: 'Prompts' },
    { id: 'fable5', label: 'Fable 5' },
    { id: 'builder', label: 'Smart Wizard' },
    { id: 'bedrock', label: 'Bedrock ⚡' },
    { id: 'langchain', label: 'LangChain' },
    { id: 'crewai', label: 'CrewAI' },
    { id: 'evals', label: 'Evals' },
    { id: 'finetuning', label: 'Fine-tune' },
    { id: 'automation', label: 'Automation' },
    { id: 'agents', label: 'Agents 🏥' },
    { id: 'compare', label: 'Compare' },
    { id: 'skills', label: 'Skills' },
    { id: 'store', label: 'Store' },
    { id: 'community', label: 'Community' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'blueprint', label: 'Blueprint' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-500/15 bg-white/90 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand with Ultra White & Orange-Red Identity */}
        <button
          onClick={() => handleSelectTab('library')}
          className="flex items-center gap-2.5 font-black tracking-tight text-slate-900 shrink-0 hover:opacity-95 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            Prompt<span className="text-orange-600">OS</span>
          </span>
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[11px] font-bold text-orange-700">
            <span>100K Vault</span>
          </div>
        </button>

        {/* Scrollable Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 flex-1 max-w-2xl">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id || (link.id === 'fable5' && activeTab === 'fable5guide');
            return (
              <button
                key={link.id}
                onClick={() => handleSelectTab(link.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 text-orange-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-orange-50/60 hover:text-orange-600'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-50/60 border border-orange-200/60 text-[10px] text-orange-700 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>204 Niches Live</span>
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Studio Suite</span>
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
