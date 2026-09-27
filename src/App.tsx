import React, { useState, useEffect } from 'react';
import { TabType, PromptItem } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromptLibrary } from './components/PromptLibrary';
import { Fable5Guide } from './components/Fable5Guide';
import { LangChainStudio } from './components/LangChainStudio';
import { CrewAIStudio } from './components/CrewAIStudio';
import { EvalsStudio } from './components/EvalsStudio';
import { FineTuningStudio } from './components/FineTuningStudio';
import { AutomationBuilder } from './components/AutomationBuilder';
import { AgentBlueprintBuilder } from './components/AgentBlueprintBuilder';
import { ClaudeSkillStudio } from './components/ClaudeSkillStudio';
import { ModelCompareStudio } from './components/ModelCompareStudio';
import { AgentPlayground } from './components/AgentPlayground';
import { CommunityHub } from './components/CommunityHub';
import { KnowledgePortal } from './components/KnowledgePortal';
import { PromptStore } from './components/PromptStore';
import { StrategicBlueprint } from './components/StrategicBlueprint';
import { SmartBuilderWizard } from './components/SmartBuilderWizard';
import { BedrockAgentStudio } from './components/BedrockAgentStudio';
import { SavedDrawers } from './components/SavedDrawers';
import { Footer } from './components/Footer';
import { OnboardingTour } from './components/OnboardingTour';
import { Sidebar } from './components/Sidebar';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { AnalyzeWebsiteModal } from './components/AnalyzeWebsiteModal';
import { SettingsModal } from './components/SettingsModal';
import { CheckCircle2, Copy } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const VALID_TABS: TabType[] = [
  'library', 'fable5', 'builder', 'bedrock', 'langchain', 'crewai',
  'evals', 'finetuning', 'automation', 'agents', 'skills', 'compare',
  'playground', 'community', 'knowledge', 'store', 'blueprint'
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const searchParam = new URLSearchParams(window.location.search).get('tab');
      if (searchParam && VALID_TABS.includes(searchParam as TabType)) {
        return searchParam as TabType;
      }
      const pathParam = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (pathParam && VALID_TABS.includes(pathParam as TabType)) {
        return pathParam as TabType;
      }
    } catch {
      // Fallback to library
    }
    return 'library';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Favorites & History state
  const [favorites, setFavorites] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_precision_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_precision_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawer state
  const [savedDrawerType, setSavedDrawerType] = useState<'favorites' | 'history' | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cross-component handoff states
  const [targetPromptForPlayground, setTargetPromptForPlayground] = useState<PromptItem | null>(null);
  const [targetSkillId, setTargetSkillId] = useState<string | undefined>(undefined);
  const [builderInitialNiche, setBuilderInitialNiche] = useState<string>('AI Engineering');
  const [builderMode, setBuilderMode] = useState<'quick' | 'pro'>('quick');

  // Global search state synced across Header and Prompt Library
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Onboarding Feature Tour Modal state
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Floating Quick Action Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyzeWebsiteOpen, setIsAnalyzeWebsiteOpen] = useState(false);

  // Sidebar state (mobile slide-over & desktop collapse)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-launch tour for first-time visitors if not yet completed
  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem('promptos_onboarding_completed');
      if (!hasCompleted) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync activeTab with URL history
  useEffect(() => {
    try {
      const currentUrl = new URL(window.location.href);
      if (activeTab === 'library') {
        currentUrl.searchParams.delete('tab');
      } else {
        currentUrl.searchParams.set('tab', activeTab);
      }
      window.history.replaceState({ tab: activeTab }, '', currentUrl.pathname + currentUrl.search);
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  // Listen to popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const searchParam = new URLSearchParams(window.location.search).get('tab');
      if (searchParam && VALID_TABS.includes(searchParam as TabType)) {
        setActiveTab(searchParam as TabType);
        return;
      }
      const pathParam = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (pathParam && VALID_TABS.includes(pathParam as TabType)) {
        setActiveTab(pathParam as TabType);
        return;
      }
      setActiveTab('library');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_precision_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_precision_history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Toast trigger
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopy = async (text: string, title: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    showToast(`Copied: ${title}`);
  };

  const toggleFavorite = (prompt: PromptItem) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === prompt.id);
      if (exists) {
        showToast(`Removed from Saved: ${prompt.title}`);
        return prev.filter((p) => p.id !== prompt.id);
      } else {
        showToast(`Saved to Favorites: ${prompt.title}`);
        return [prompt, ...prev];
      }
    });
  };

  const isFavorite = (id: string) => favorites.some((p) => p.id === id);

  const addToHistory = (prompt: PromptItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== prompt.id);
      return [prompt, ...filtered];
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Recent history cleared');
  };

  // Cross-Navigation handlers
  const handleCustomizeInBuilder = (prompt: PromptItem) => {
    setBuilderInitialNiche(prompt.niche);
    setBuilderMode('quick');
    setActiveTab('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseInAutomation = (prompt: PromptItem) => {
    setActiveTab('automation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestInPlayground = (prompt: PromptItem) => {
    setTargetPromptForPlayground(prompt);
    setActiveTab('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSkill = (skillId: string) => {
    setTargetSkillId(skillId);
    setActiveTab('skills');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col font-sans transition-colors duration-200 selection:bg-orange-500/20 selection:text-orange-900">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab as TabType);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onToggleSidebar={() => {
          if (window.innerWidth < 1024) {
            setIsSidebarOpen(!isSidebarOpen);
          } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }
        }}
        isSidebarOpen={isSidebarOpen}
        favoritesCount={favorites.length}
        historyCount={history.length}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onOpenFavorites={() => setSavedDrawerType('favorites')}
        onOpenHistory={() => setSavedDrawerType('history')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStartTour={() => setIsTourOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        onSelectPrompt={(prompt) => {
          setGlobalSearchQuery(prompt.title);
          setActiveTab('library');
          setTimeout(() => {
            const el = document.getElementById('library-search-input') || document.getElementById('prompt-library-grid');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}
        onCopy={handleCopy}
        onTestInPlayground={handleTestInPlayground}
      />

      {/* Main Content Layout with Left-Side Bar Navigation */}
      <div className="flex-1 flex w-full relative">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab as TabType);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onStartTour={() => setIsTourOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAnalyzeWebsite={() => setIsAnalyzeWebsiteOpen(true)}
          onNewAgentBlueprint={() => {
            setActiveTab('agents');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          favoritesCount={favorites.length}
          historyCount={history.length}
        />

        {/* Center / Main Content Column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Breadcrumb Navigation Trail */}
          <BreadcrumbNav
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            builderMode={builderMode}
            builderNiche={builderInitialNiche}
            targetSkillId={targetSkillId}
            searchQuery={globalSearchQuery}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenTour={() => setIsTourOpen(true)}
            onCopyNotice={(msg) => showToast(msg)}
          />

          <main className="flex-1">
            {/* Render Tab Views */}
            {activeTab === 'library' && (
              <>
                <Hero
                  onQuickStart={() => {
                    setBuilderMode('quick');
                    setActiveTab('builder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onExploreFable5={() => {
                    setActiveTab('fable5');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenTour={() => setIsTourOpen(true)}
                />
                <PromptLibrary
                  onCopy={handleCopy}
                  onSaveFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  onAddToHistory={addToHistory}
                  onCustomizeInBuilder={handleCustomizeInBuilder}
                  onUseInAutomation={handleUseInAutomation}
                  onTestInPlayground={handleTestInPlayground}
                  onSelectSkill={handleSelectSkill}
                  searchQuery={globalSearchQuery}
                  onSearchChange={setGlobalSearchQuery}
                />
              </>
            )}

            {activeTab === 'fable5' && (
              <Fable5Guide
                onOpenQuickBuild={() => {
                  setBuilderMode('quick');
                  setActiveTab('builder');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenProBuild={() => {
                  setBuilderMode('pro');
                  setActiveTab('builder');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCopy={handleCopy}
              />
            )}

            {activeTab === 'builder' && (
              <SmartBuilderWizard
                onCopy={handleCopy}
                initialNiche={builderInitialNiche}
                initialMode={builderMode}
                onOpenTour={() => setIsTourOpen(true)}
              />
            )}

            {activeTab === 'bedrock' && <BedrockAgentStudio onCopy={handleCopy} />}
            {activeTab === 'langchain' && <LangChainStudio onCopy={handleCopy} />}
            {activeTab === 'crewai' && <CrewAIStudio onCopy={handleCopy} />}
            {activeTab === 'evals' && <EvalsStudio onCopy={handleCopy} />}
            {activeTab === 'finetuning' && <FineTuningStudio onCopy={handleCopy} />}
            {activeTab === 'automation' && <AutomationBuilder onCopy={handleCopy} />}
            {activeTab === 'agents' && <AgentBlueprintBuilder onCopy={handleCopy} />}
            {activeTab === 'skills' && <ClaudeSkillStudio onCopy={handleCopy} initialSkillId={targetSkillId} />}
            {activeTab === 'compare' && (
              <ModelCompareStudio
                onCopy={handleCopy}
                onOpenTour={() => setIsTourOpen(true)}
              />
            )}
            {activeTab === 'playground' && <AgentPlayground onCopy={handleCopy} initialPrompt={targetPromptForPlayground} />}
            {activeTab === 'community' && <CommunityHub onCopy={handleCopy} />}
            {activeTab === 'knowledge' && <KnowledgePortal onCopy={handleCopy} />}
            {activeTab === 'store' && <PromptStore onCopy={handleCopy} />}
            {activeTab === 'blueprint' && <StrategicBlueprint onCopy={handleCopy} />}
          </main>

          {/* Footer */}
          <Footer onNavigate={(tab) => { setActiveTab(tab as TabType); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      </div>

      {/* Favorites & History Drawer */}
      <SavedDrawers
        isOpen={savedDrawerType !== null}
        type={savedDrawerType || 'favorites'}
        onClose={() => setSavedDrawerType(null)}
        items={savedDrawerType === 'favorites' ? favorites : history}
        onCopy={handleCopy}
        onRemoveFavorite={toggleFavorite}
        onClearHistory={handleClearHistory}
        onTestInPlayground={handleTestInPlayground}
        onCustomizeInBuilder={handleCustomizeInBuilder}
      />

      {/* Onboarding Tour Modal */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as TabType);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Analyze Website Modal (Quick Action) */}
      <AnalyzeWebsiteModal
        isOpen={isAnalyzeWebsiteOpen}
        onClose={() => setIsAnalyzeWebsiteOpen(false)}
        onCustomizeInBuilder={(prompt) => {
          handleCustomizeInBuilder({
            id: 'analyzed-website-intel',
            title: 'Website Intelligence & Reverse-Engineered Prompt',
            niche: 'Software Architecture',
            role: 'Principal Platform Architect',
            difficulty: 'Expert',
            framework: 'Ruben Fable 5',
            downloads: 1,
            price: 0,
            icon: '🌐',
            prompt
          });
        }}
        onCopy={handleCopy}
      />

      {/* Settings Modal (Quick Action) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onResetTour={() => setIsTourOpen(true)}
        onClearHistory={handleClearHistory}
        onClearFavorites={() => {
          setFavorites([]);
          try {
            localStorage.setItem('promptos_favorites_v1', '[]');
          } catch (e) {
            console.error(e);
          }
        }}
        favoritesCount={favorites.length}
        historyCount={history.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-orange-200 shadow-orange-500/10">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="truncate max-w-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}
