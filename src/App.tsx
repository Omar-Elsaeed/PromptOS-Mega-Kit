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
import { CheckCircle2, Copy } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('library');
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

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
        favoritesCount={favorites.length}
        historyCount={history.length}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onOpenFavorites={() => setSavedDrawerType('favorites')}
        onOpenHistory={() => setSavedDrawerType('history')}
      />

      {/* Main Content Area */}
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
        {activeTab === 'compare' && <ModelCompareStudio onCopy={handleCopy} />}
        {activeTab === 'playground' && <AgentPlayground onCopy={handleCopy} initialPrompt={targetPromptForPlayground} />}
        {activeTab === 'community' && <CommunityHub onCopy={handleCopy} />}
        {activeTab === 'knowledge' && <KnowledgePortal onCopy={handleCopy} />}
        {activeTab === 'store' && <PromptStore onCopy={handleCopy} />}
        {activeTab === 'blueprint' && <StrategicBlueprint onCopy={handleCopy} />}
      </main>

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

      {/* Footer */}
      <Footer onNavigate={(tab) => { setActiveTab(tab as TabType); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

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
