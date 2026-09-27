import React, { useState } from 'react';
import {
  Home,
  ChevronRight,
  Wand2,
  BookOpen,
  Flame,
  Cloud,
  Layers,
  Users2,
  Stethoscope,
  Code2,
  Scale,
  FlaskConical,
  SlidersHorizontal,
  Bot,
  Zap,
  Globe,
  FileText,
  ShoppingBag,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  Compass,
  Sliders,
  Share2
} from 'lucide-react';
import { TabType } from '../types';

interface BreadcrumbNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  builderMode?: 'quick' | 'pro';
  builderNiche?: string;
  targetSkillId?: string;
  searchQuery?: string;
  onOpenSettings?: () => void;
  onOpenTour?: () => void;
  onCopyNotice?: (msg: string) => void;
}

interface TabMeta {
  categoryId: string;
  categoryLabel: string;
  categoryIcon: any;
  label: string;
  icon: any;
  badge?: string;
  subCategoryDefault: string;
}

const TAB_METADATA: Record<TabType, TabMeta> = {
  library: {
    categoryId: 'synthesis',
    categoryLabel: 'Prompt Synthesis',
    categoryIcon: Wand2,
    label: 'Prompts Vault',
    icon: BookOpen,
    badge: '100K',
    subCategoryDefault: '204 Industry Niches'
  },
  builder: {
    categoryId: 'synthesis',
    categoryLabel: 'Prompt Synthesis',
    categoryIcon: Wand2,
    label: 'Smart Wizard',
    icon: Wand2,
    badge: 'PRO',
    subCategoryDefault: '11-Block Calibrator'
  },
  fable5: {
    categoryId: 'synthesis',
    categoryLabel: 'Prompt Synthesis',
    categoryIcon: Wand2,
    label: 'Fable 5 Anatomy',
    icon: Flame,
    badge: '11-BLOCK',
    subCategoryDefault: 'Delegation Architecture'
  },
  bedrock: {
    categoryId: 'agentic',
    categoryLabel: 'Agentic Frameworks',
    categoryIcon: Cloud,
    label: 'Bedrock Agents',
    icon: Cloud,
    badge: 'AWS',
    subCategoryDefault: 'Action Groups & OpenAPI'
  },
  langchain: {
    categoryId: 'agentic',
    categoryLabel: 'Agentic Frameworks',
    categoryIcon: Cloud,
    label: 'LangChain Studio',
    icon: Layers,
    subCategoryDefault: 'LCEL & Composable Chains'
  },
  crewai: {
    categoryId: 'agentic',
    categoryLabel: 'Agentic Frameworks',
    categoryIcon: Cloud,
    label: 'CrewAI Studio',
    icon: Users2,
    subCategoryDefault: 'Autonomous Multi-Agent Crews'
  },
  agents: {
    categoryId: 'agentic',
    categoryLabel: 'Agentic Frameworks',
    categoryIcon: Cloud,
    label: 'Agent Blueprint',
    icon: Stethoscope,
    badge: 'DNS-AID',
    subCategoryDefault: 'WebMCP & Orchestration'
  },
  skills: {
    categoryId: 'agentic',
    categoryLabel: 'Agentic Frameworks',
    categoryIcon: Cloud,
    label: 'Claude Skills',
    icon: Code2,
    subCategoryDefault: 'Custom Tools & XML Schema'
  },
  compare: {
    categoryId: 'reasoning',
    categoryLabel: 'AI Arena & Evals',
    categoryIcon: Scale,
    label: 'Model Arena',
    icon: Scale,
    badge: 'LIVE',
    subCategoryDefault: 'Concurrent LLM Benchmark'
  },
  evals: {
    categoryId: 'reasoning',
    categoryLabel: 'AI Arena & Evals',
    categoryIcon: Scale,
    label: 'Evals & Metrics',
    icon: FlaskConical,
    subCategoryDefault: 'DeepEval & Promptfoo Scoring'
  },
  finetuning: {
    categoryId: 'reasoning',
    categoryLabel: 'AI Arena & Evals',
    categoryIcon: Scale,
    label: 'Fine-Tuning Studio',
    icon: SlidersHorizontal,
    subCategoryDefault: 'Synthetic JSONL Generator'
  },
  playground: {
    categoryId: 'reasoning',
    categoryLabel: 'AI Arena & Evals',
    categoryIcon: Scale,
    label: 'Agent Playground',
    icon: Bot,
    subCategoryDefault: 'Interactive Sandbox'
  },
  automation: {
    categoryId: 'ecosystem',
    categoryLabel: 'Ecosystem & Ops',
    categoryIcon: Globe,
    label: 'Automations',
    icon: Zap,
    subCategoryDefault: 'n8n & Webhook Workflows'
  },
  community: {
    categoryId: 'ecosystem',
    categoryLabel: 'Ecosystem & Ops',
    categoryIcon: Globe,
    label: 'Community Hub',
    icon: Globe,
    subCategoryDefault: 'Shared Prompt Recipes'
  },
  knowledge: {
    categoryId: 'ecosystem',
    categoryLabel: 'Ecosystem & Ops',
    categoryIcon: Globe,
    label: 'Knowledge Portal',
    icon: FileText,
    subCategoryDefault: 'Framework Docs & Research'
  },
  store: {
    categoryId: 'ecosystem',
    categoryLabel: 'Ecosystem & Ops',
    categoryIcon: Globe,
    label: 'Prompt Store',
    icon: ShoppingBag,
    subCategoryDefault: 'Enterprise Packages'
  },
  blueprint: {
    categoryId: 'ecosystem',
    categoryLabel: 'Ecosystem & Ops',
    categoryIcon: Globe,
    label: 'Strategic Blueprint',
    icon: HelpCircle,
    subCategoryDefault: 'AI Adoption Roadmap'
  }
};

const SIBLING_TABS: Record<string, { id: TabType; label: string }[]> = {
  synthesis: [
    { id: 'library', label: 'Prompts Vault' },
    { id: 'builder', label: 'Smart Wizard' },
    { id: 'fable5', label: 'Fable 5 Anatomy' }
  ],
  agentic: [
    { id: 'bedrock', label: 'Bedrock Agents' },
    { id: 'langchain', label: 'LangChain Studio' },
    { id: 'crewai', label: 'CrewAI Studio' },
    { id: 'agents', label: 'Agent Blueprint' },
    { id: 'skills', label: 'Claude Skills' }
  ],
  reasoning: [
    { id: 'compare', label: 'Model Arena' },
    { id: 'evals', label: 'Evals & Metrics' },
    { id: 'finetuning', label: 'Fine-Tuning Studio' },
    { id: 'playground', label: 'Agent Playground' }
  ],
  ecosystem: [
    { id: 'automation', label: 'Automations' },
    { id: 'community', label: 'Community Hub' },
    { id: 'knowledge', label: 'Knowledge Portal' },
    { id: 'store', label: 'Prompt Store' },
    { id: 'blueprint', label: 'Strategic Blueprint' }
  ]
};

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  activeTab,
  onSelectTab,
  builderMode = 'quick',
  builderNiche = 'AI Engineering',
  targetSkillId,
  searchQuery = '',
  onOpenSettings,
  onOpenTour,
  onCopyNotice
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const meta = TAB_METADATA[activeTab] || TAB_METADATA.library;
  const CategoryIcon = meta.categoryIcon;
  const StudioIcon = meta.icon;

  // Determine dynamic sub-category based on app state
  let subCategoryText = meta.subCategoryDefault;
  if (activeTab === 'builder') {
    subCategoryText =
      builderMode === 'pro'
        ? `Pro 11-Block Calibration (${builderNiche})`
        : `Quick 4-Field Synthesis (${builderNiche})`;
  } else if (activeTab === 'library' && searchQuery.trim()) {
    subCategoryText = `Filter: "${searchQuery.slice(0, 24)}${searchQuery.length > 24 ? '...' : ''}"`;
  } else if (activeTab === 'skills' && targetSkillId) {
    subCategoryText = `Skill: ${targetSkillId}`;
  }

  const handleShareView = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    navigator.clipboard.writeText(url.toString());
    setCopiedShare(true);
    if (onCopyNotice) {
      onCopyNotice(`Copied link to ${meta.label}`);
    }
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const siblings = SIBLING_TABS[meta.categoryId] || [];

  return (
    <nav
      aria-label="Breadcrumb"
      className="sticky top-16 z-20 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-2.5 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Breadcrumb Trail */}
        <ol className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 min-w-0 overflow-x-auto no-scrollbar py-0.5">
          {/* Level 1: Home / Hub */}
          <li className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onSelectTab('library')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              title="Return to Prompts Vault Hub"
            >
              <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-bold">PromptOS</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
          </li>

          {/* Level 2: Category with Quick-Jump Dropdown */}
          <li className="relative flex items-center gap-1.5 shrink-0">
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold"
                title={`Switch studio in ${meta.categoryLabel}`}
              >
                <CategoryIcon className="w-3.5 h-3.5 text-orange-500" />
                <span className="truncate max-w-[120px] sm:max-w-none">{meta.categoryLabel}</span>
              </button>

              {/* Quick Jump Category Menu */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400">
                    {meta.categoryLabel} Studios
                  </div>
                  {siblings.map((sib) => (
                    <button
                      key={sib.id}
                      onClick={() => {
                        onSelectTab(sib.id);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        activeTab === sib.id
                          ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{sib.label}</span>
                      {activeTab === sib.id && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
          </li>

          {/* Level 3: Active Studio */}
          <li className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-50/70 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60 font-bold shadow-2xs">
              <StudioIcon className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>{meta.label}</span>
              {meta.badge && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-orange-500 text-white shadow-2xs">
                  {meta.badge}
                </span>
              )}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
          </li>

          {/* Level 4: Current Sub-Category / Workflow State */}
          <li className="shrink-0 min-w-0">
            <span
              className="text-slate-400 dark:text-slate-500 font-medium truncate inline-block max-w-[150px] sm:max-w-[260px] md:max-w-md"
              title={subCategoryText}
            >
              {subCategoryText}
            </span>
          </li>
        </ol>

        {/* Right: Quick Action Shortcuts */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Share / Copy Deep Link */}
          <button
            onClick={handleShareView}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors shadow-2xs"
            title="Copy view link"
          >
            {copiedShare ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden md:inline">{copiedShare ? 'Copied' : 'Share'}</span>
          </button>

          {/* Guided Tour Trigger */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-orange-200 dark:border-orange-800/60 bg-orange-50/50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 text-xs font-semibold hover:bg-orange-100 transition-colors shadow-2xs"
              title="Launch feature tour"
            >
              <Compass className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden lg:inline">Tour</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
