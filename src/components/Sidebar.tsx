import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Wand2,
  Sparkles,
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
  ShoppingBag,
  HelpCircle,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  Flame,
  Globe,
  Settings,
  ArrowUpRight,
  Star,
  Search,
  Activity,
  CheckCircle2,
  Radio,
  Pin,
  TrendingUp,
  Terminal
} from 'lucide-react';
import { TabType } from '../types';

export interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean; // Mobile open state
  onClose: () => void; // Mobile close callback
  isCollapsed?: boolean; // Desktop collapsed state
  onToggleCollapse?: () => void;
  onStartTour?: () => void;
  onOpenSettings?: () => void;
  onOpenAnalyzeWebsite?: () => void;
  onNewAgentBlueprint?: () => void;
  favoritesCount?: number;
  historyCount?: number;
}

interface NavItem {
  id: TabType;
  label: string;
  description: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  isHot?: boolean;
}

interface NavCategory {
  id: string;
  title: string;
  icon?: any;
  items: NavItem[];
}

const ALL_NAV_CATEGORIES: NavCategory[] = [
  {
    id: 'synthesis',
    title: 'Prompt Synthesis',
    icon: Wand2,
    items: [
      {
        id: 'library',
        label: 'Prompts Vault',
        description: '100,000 verified prompts',
        icon: BookOpen,
        badge: '100K',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
      },
      {
        id: 'builder',
        label: 'Smart Wizard',
        description: '4-field & 11-block calibrator',
        icon: Wand2,
        badge: 'PRO',
        badgeColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
        isHot: true
      },
      {
        id: 'fable5',
        label: 'Fable 5 Anatomy',
        description: '11-block delegation architecture',
        icon: Flame,
        badge: '11-BLOCK',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
      }
    ]
  },
  {
    id: 'agentic',
    title: 'Agentic Frameworks',
    icon: Cloud,
    items: [
      {
        id: 'bedrock',
        label: 'Bedrock Agents',
        description: 'AWS Bedrock action groups',
        icon: Cloud,
        badge: 'AWS',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
      },
      {
        id: 'langchain',
        label: 'LangChain Studio',
        description: 'LCEL & composable chains',
        icon: Layers
      },
      {
        id: 'crewai',
        label: 'CrewAI Studio',
        description: 'Autonomous multi-agent crews',
        icon: Users2
      },
      {
        id: 'agents',
        label: 'Agent Blueprint',
        description: 'Multi-agent orchestration & WebMCP',
        icon: Stethoscope,
        badge: 'DNS-AID',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
      },
      {
        id: 'skills',
        label: 'Claude Skills',
        description: 'Custom tools & XML definitions',
        icon: Code2
      }
    ]
  },
  {
    id: 'reasoning',
    title: 'AI Arena & Evals',
    icon: Scale,
    items: [
      {
        id: 'compare',
        label: 'Model Arena',
        description: 'Side-by-side LLM benchmark',
        icon: Scale,
        badge: 'LIVE',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        isHot: true
      },
      {
        id: 'evals',
        label: 'Evals & Metrics',
        description: 'DeepEval & Promptfoo scoring',
        icon: FlaskConical
      },
      {
        id: 'finetuning',
        label: 'Fine-Tuning Studio',
        description: 'Synthetic JSONL datasets',
        icon: SlidersHorizontal
      },
      {
        id: 'playground',
        label: 'Agent Playground',
        description: 'Interactive execution sandbox',
        icon: Bot
      }
    ]
  },
  {
    id: 'ecosystem',
    title: 'Ecosystem & Ops',
    icon: Globe,
    items: [
      {
        id: 'automation',
        label: 'Automations',
        description: 'n8n & Make webhook workflows',
        icon: Zap
      },
      {
        id: 'community',
        label: 'Community Hub',
        description: 'Shared prompt recipes',
        icon: Globe
      },
      {
        id: 'knowledge',
        label: 'Knowledge Portal',
        description: 'Framework docs & research',
        icon: FileText
      },
      {
        id: 'store',
        label: 'Prompt Store',
        description: 'Enterprise workflow packages',
        icon: ShoppingBag
      },
      {
        id: 'blueprint',
        label: 'Strategic Blueprint',
        description: 'Executive AI adoption roadmap',
        icon: HelpCircle
      }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  onStartTour,
  onOpenSettings,
  onOpenAnalyzeWebsite,
  onNewAgentBlueprint
}) => {
  // Floating Quick Actions menu state
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // In-Sidebar search/filter state
  const [filterQuery, setFilterQuery] = useState('');
  const filterInputRef = useRef<HTMLInputElement>(null);

  // Category collapse state
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Pinned favorites in sidebar
  const [pinnedTabs, setPinnedTabs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('promptos_pinned_tabs_v2');
      return saved ? JSON.parse(saved) : ['library', 'builder', 'bedrock', 'compare'];
    } catch {
      return ['library', 'builder', 'bedrock', 'compare'];
    }
  });

  // Save pinned tabs to localStorage
  const togglePin = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedTabs((prev) => {
      const updated = prev.includes(tabId) ? prev.filter((id) => id !== tabId) : [...prev, tabId];
      try {
        localStorage.setItem('promptos_pinned_tabs_v2', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Close Quick Actions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        setQuickActionsOpen((prev) => !prev);
      } else if (event.key === 'Escape') {
        if (quickActionsOpen) setQuickActionsOpen(false);
        if (filterQuery) setFilterQuery('');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickActionsOpen, filterQuery]);

  const handleItemClick = (tabId: string) => {
    onSelectTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Map of all items for pinned lookup
  const allItemsMap = useMemo(() => {
    const map = new Map<string, NavItem>();
    ALL_NAV_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => map.set(item.id, item));
    });
    return map;
  }, []);

  // Filtered categories based on filterQuery
  const filteredCategories = useMemo(() => {
    if (!filterQuery.trim()) return ALL_NAV_CATEGORIES;
    const clean = filterQuery.toLowerCase().trim();
    return ALL_NAV_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(clean) ||
          item.description.toLowerCase().includes(clean) ||
          item.id.toLowerCase().includes(clean)
      )
    })).filter((cat) => cat.items.length > 0);
  }, [filterQuery]);

  const pinnedItems = useMemo(() => {
    return pinnedTabs
      .map((id) => allItemsMap.get(id))
      .filter((item): item is NavItem => item !== undefined);
  }, [pinnedTabs, allItemsMap]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-orange-500/15 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 shadow-xs ${
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } ${
          isOpen ? 'translate-x-0 w-72 left-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 left-0'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
                PromptOS Hub
              </span>
              <p className="text-[10px] text-slate-400 font-medium">16 AI Engineering Studios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* In-Sidebar Quick Filter (when expanded) */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1 border-b border-slate-100/80 dark:border-slate-800/80">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <input
                ref={filterInputRef}
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter studios... (e.g. eval, bedrock)"
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all font-medium"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-700 p-0.5 rounded"
                  title="Clear filter"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 custom-scrollbar">
          {/* Pinned & Quick Access Section (Visible when no search filter active) */}
          {!filterQuery && pinnedItems.length > 0 && (
            <div className="space-y-1 pb-2 border-b border-slate-100/90 dark:border-slate-800/90">
              {!isCollapsed ? (
                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500/40" />
                    <span>Quick Access (Pinned)</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {pinnedItems.length}
                  </span>
                </div>
              ) : (
                <div className="w-full flex justify-center py-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                </div>
              )}

              <div className="space-y-0.5">
                {pinnedItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <div
                      key={`pinned-${item.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleItemClick(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleItemClick(item.id);
                        }
                      }}
                      title={isCollapsed ? `${item.label} (Pinned) — ${item.description}` : undefined}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left transition-all duration-150 group relative cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500/12 via-red-500/8 to-orange-500/4 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/30 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-orange-50/60 dark:hover:bg-slate-800/70'
                      } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-orange-500 to-red-500 shadow-xs shadow-orange-500/50" />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 ${
                            isActive
                              ? 'bg-gradient-to-tr from-orange-500 to-red-500 text-white shadow-xs'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:bg-orange-500 group-hover:text-white'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                        </div>

                        {!isCollapsed && (
                          <div className="min-w-0">
                            <div className="text-xs truncate tracking-tight font-semibold flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {item.badge && (
                                <span
                                  className={`text-[8px] font-extrabold px-1 py-0.2 rounded border shrink-0 ${
                                    item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {!isCollapsed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(item.id, e);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity"
                          title="Unpin from Quick Access"
                          aria-label={`Unpin ${item.label}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Categorized Sections with Interactive Collapse & Motions */}
          {filteredCategories.map((category) => {
            const isCategoryCollapsed = Boolean(collapsedCategories[category.id]);
            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="space-y-1">
                {/* Category Header with Interactive Accordion Toggle */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      {CategoryIcon && (
                        <CategoryIcon className="w-3 h-3 text-slate-400 group-hover:text-orange-500 transition-colors" />
                      )}
                      <span>{category.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 transition-colors">
                        {category.items.length}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                          isCategoryCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                      />
                    </div>
                  </button>
                ) : (
                  <div className="w-full flex justify-center py-1">
                    <div className="w-5 h-[1.5px] bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                )}

                {/* Items in Category */}
                {!isCategoryCollapsed && (
                  <div className="space-y-0.5 animate-in fade-in duration-200">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        activeTab === item.id ||
                        (item.id === 'fable5' && activeTab === 'fable5guide');
                      const isPinned = pinnedTabs.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleItemClick(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleItemClick(item.id);
                            }
                          }}
                          title={isCollapsed ? `${item.label} — ${item.description}` : undefined}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-150 group relative cursor-pointer select-none ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-500/12 via-red-500/8 to-orange-500/4 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/30 shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-orange-50/50 dark:hover:bg-slate-800/60'
                          } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                        >
                          {/* Active Left Indicator Bar */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-orange-500 to-red-500 shadow-xs shadow-orange-500/50" />
                          )}

                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 ${
                                isActive
                                  ? 'bg-gradient-to-tr from-orange-500 to-red-500 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/60 group-hover:text-orange-600'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>

                            {!isCollapsed && (
                              <div className="min-w-0">
                                <div className="text-xs truncate tracking-tight font-medium flex items-center gap-1.5">
                                  <span className={isActive ? 'font-bold' : ''}>{item.label}</span>
                                  {item.isHot && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-normal">
                                  {item.description}
                                </div>
                              </div>
                            )}
                          </div>

                          {!isCollapsed && (
                            <div className="flex items-center gap-1 shrink-0">
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                                    item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}

                              {/* Interactive Pin Toggle Button on hover */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(item.id, e);
                                }}
                                className={`p-1 rounded transition-opacity ${
                                  isPinned
                                    ? 'opacity-80 text-amber-500'
                                    : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-500'
                                }`}
                                title={isPinned ? 'Unpin from Quick Access' : 'Pin to Quick Access'}
                                aria-label={isPinned ? `Unpin ${item.label}` : `Pin ${item.label}`}
                              >
                                <Star
                                  className={`w-3 h-3 ${isPinned ? 'fill-amber-500' : ''}`}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-400">
              No studios found matching "{filterQuery}".
            </div>
          )}

          {/* Interactive Live Telemetry / System Health Widget */}
          {!isCollapsed && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-slate-800/50 dark:to-slate-900 border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Engine Cluster
                  </span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80">
                  Healthy
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-[9px] font-medium text-slate-400">Vault Prompts</div>
                  <div className="font-black text-slate-900 dark:text-white">100,000</div>
                </div>
                <div className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-[9px] font-medium text-slate-400">Avg Latency</div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400">340ms</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80 space-y-2">
          {/* Floating Quick Actions Trigger & Menu */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className={`w-full flex items-center gap-2 py-2 px-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-orange-500/25 active:scale-[0.98] group ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
              title="Quick Actions Menu (Ctrl+J)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Zap className="w-3.5 h-3.5 fill-white shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {!isCollapsed && <span>Quick Actions</span>}
              </div>
              {!isCollapsed ? (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-white/90">
                  ⌘J
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>

            {/* Floating Menu Popover */}
            {quickActionsOpen && (
              <div
                className={`absolute z-50 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                  isCollapsed
                    ? 'left-full ml-3 bottom-0'
                    : 'left-0 sm:left-full sm:ml-2 bottom-full sm:bottom-0 mb-2 sm:mb-0'
                }`}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Quick Workflows
                    </h4>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                    One-Click
                  </span>
                </div>

                <div className="space-y-1">
                  {/* 1. New Agent Blueprint */}
                  <button
                    onClick={() => {
                      if (onNewAgentBlueprint) {
                        onNewAgentBlueprint();
                      } else {
                        handleItemClick('agents');
                      }
                      setQuickActionsOpen(false);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-orange-50/70 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition-colors truncate">
                          New Agent Blueprint
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          Multi-agent architecture & WebMCP
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />
                  </button>

                  {/* 2. Analyze Website */}
                  <button
                    onClick={() => {
                      onOpenAnalyzeWebsite?.();
                      setQuickActionsOpen(false);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors truncate">
                          Analyze Website
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          Reverse-engineer prompt & voice
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>

                  {/* 3. Open Settings */}
                  <button
                    onClick={() => {
                      onOpenSettings?.();
                      setQuickActionsOpen(false);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                          Open Settings
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          Model defaults, telemetry & backups
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  {/* 4. Smart Prompt Wizard */}
                  <button
                    onClick={() => {
                      handleItemClick('builder');
                      setQuickActionsOpen(false);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-orange-50/70 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Wand2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition-colors truncate">
                          Smart Wizard (Pro)
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          Fable 5 & 9-Step Synthesizer
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />
                  </button>

                  {/* 5. Compare Models */}
                  <button
                    onClick={() => {
                      handleItemClick('compare');
                      setQuickActionsOpen(false);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-red-50/70 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors truncate">
                          Compare Model Arena
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          Parallel execution & AI Referee
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tour Launcher */}
          {onStartTour && (
            <button
              onClick={() => {
                onStartTour();
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center gap-2 py-2 px-2.5 rounded-xl bg-orange-50/80 hover:bg-orange-100/90 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 border border-orange-200/80 dark:border-orange-800/80 text-orange-800 dark:text-orange-200 text-xs font-bold transition-all shadow-2xs group active:scale-[0.98] ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
              title="Launch Guided Feature Tour"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Compass className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
                {!isCollapsed && <span>Interactive Tour</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100">
                  8 Steps
                </span>
              )}
            </button>
          )}

          {/* Desktop Collapse / Expand Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex w-full items-center gap-2 py-1.5 px-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium transition-colors ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {!isCollapsed && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                  Collapse Sidebar
                </span>
              )}
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
