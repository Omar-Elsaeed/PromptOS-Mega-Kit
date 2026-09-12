import React, { useState } from 'react';
import { Share2, ThumbsUp, MessageSquare, Plus, Search, Sparkles, Copy, Check, Filter, Flame, Loader2 } from 'lucide-react';
import { PromptItem } from '../types';
import { getPromptByIndex } from '../utils/promptGenerators';
import { generateAIContent } from '../utils/api';

interface CommunityHubProps {
  onCopy: (text: string, title: string) => void;
  onSelectPrompt?: (prompt: PromptItem) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ onCopy, onSelectPrompt }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // User submission state
  const [newTitle, setNewTitle] = useState('');
  const [newNiche, setNewNiche] = useState('SaaS & Tech Startups');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const handleAiPolishPrompt = async () => {
    if (!newPrompt.trim()) return;
    setIsPolishing(true);
    try {
      const prompt = `You are a Principal Prompt Engineer and Framework Designer.
Enhance and structure this raw prompt into an exceptional, production-grade AI prompt following standard architectural anatomy:
RAW PROMPT / IDEA:
"${newPrompt}"

Output strict JSON only:
{
  "title": "Clean, descriptive 4-7 word title",
  "niche": "Primary domain (e.g. Software Engineering, Marketing, Finance)",
  "polishedPrompt": "Fully structured prompt with [ROLE], [MISSION], [CONTEXT], [CONSTRAINTS], [EXECUTION STEPS], and [VERIFICATION CRITERIA]"
}`;

      const res = await generateAIContent({
        prompt,
        systemInstruction: 'You are a master prompt engineering systems architect. Output strictly valid JSON without code fences or commentary.',
        temperature: 0.2
      });

      const cleaned = res.text?.replace(/```json?/g, '').replace(/```/g, '').trim();
      const match = cleaned?.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.title && !newTitle.trim()) setNewTitle(parsed.title);
        if (parsed.niche && (!newNiche.trim() || newNiche === 'SaaS & Tech Startups')) setNewNiche(parsed.niche);
        if (parsed.polishedPrompt) setNewPrompt(parsed.polishedPrompt);
      }
      onCopy('', 'Prompt Polished with AI');
    } catch (e) {
      console.error('Failed to polish prompt:', e);
    } finally {
      setIsPolishing(false);
    }
  };

  // Generate initial community items
  const [communityItems, setCommunityItems] = useState([
    {
      id: 'comm-1',
      title: 'Full-Stack TypeScript SaaS Architecture Planner',
      niche: 'Software Engineering',
      author: 'Alex Rivera (@alex_dev)',
      likes: 342,
      comments: 28,
      prompt: `[ROLE]: Principal Cloud Architect & TypeScript Lead.
[TASK]: Design the complete technical architecture for a multi-tenant B2B SaaS platform.
[STACK]: React 19 + Node.js Express + Tailwind CSS + PostgreSQL.
[REQUIREMENTS]:
1. Database Schema with multi-tenant row-level security (RLS).
2. End-to-End Authentication flow with OAuth2 and JWT session renewal.
3. Stripe Subscription billing lifecycle handling webhooks and usage meters.`
    },
    {
      id: 'comm-2',
      title: 'High-Converting B2B Cold Email Sequence (4 Steps)',
      niche: 'B2B Sales & Outbound',
      author: 'Sarah Chen (@growth_sarah)',
      likes: 512,
      comments: 45,
      prompt: `[ROLE]: VP of Outbound Sales Strategy.
[TASK]: Write a 4-touch cold email sequence targeting CTOs of mid-market fintech companies.
[VALUE PROP]: 40% reduction in cloud latency through edge compute caching.
[RULES]:
- Touch 1: Short pain-point opener (under 75 words).
- Touch 2: Social proof / 1-sentence case study.
- Touch 3: High-value framework/cheat sheet asset offer.
- Touch 4: Polite break-up email with soft permission-based CTA.`
    },
    {
      id: 'comm-3',
      title: 'SEO Topical Authority Map & Content Cluster Engine',
      niche: 'SEO & Organic Growth',
      author: 'Marcus Vance (@seo_master)',
      likes: 289,
      comments: 19,
      prompt: `[ROLE]: Enterprise SEO Strategist & Semantic Search Specialist.
[TASK]: Build a 30-day topical authority cluster for a cybersecurity SaaS targeting "Zero Trust Architecture".
[OUTPUT FORMAT]:
1. Core Pillar Page Outline (Target Keyword + Search Intent).
2. 8 Supporting Cluster Articles with primary/secondary keywords and internal linking hierarchy.
3. Schema markup recommendations (FAQPage + Article schema).`
    }
  ]);

  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleToggleLike = (id: string) => {
    setLikedMap(prev => {
      const isCurrentlyLiked = !!prev[id];
      setCommunityItems(items =>
        items.map(item =>
          item.id === id
            ? { ...item, likes: item.likes + (isCurrentlyLiked ? -1 : 1) }
            : item
        )
      );
      return { ...prev, [id]: !isCurrentlyLiked };
    });
  };

  const handleAddSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrompt) return;

    const newItem = {
      id: `comm-user-${Date.now()}`,
      title: newTitle,
      niche: newNiche,
      author: newAuthor.trim() ? newAuthor : 'Anonymous Creator',
      likes: 1,
      comments: 0,
      prompt: newPrompt
    };

    setCommunityItems([newItem, ...communityItems]);
    setIsSubmitModalOpen(false);
    setNewTitle('');
    setNewPrompt('');
    setNewAuthor('');
  };

  const tags = ['All', 'Software Engineering', 'B2B Sales & Outbound', 'SEO & Organic Growth', 'Marketing'];

  const filtered = communityItems.filter(item => {
    const matchesTag = selectedTag === 'All' || item.niche === selectedTag;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.prompt.toLowerCase().includes(search.toLowerCase()) ||
                          item.author.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
            <span>🌐 Community Prompt Exchange</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discover & Share{' '}
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
              Community Blueprints
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse top community submissions, upvote high-performing workflows, or publish your own prompt framework.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Blueprint</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-orange-500 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search community prompts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Prompt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isLiked = !!likedMap[item.id];
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-[11px] font-bold text-orange-700">
                    {item.niche}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.author}</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 mb-3">{item.title}</h3>

                <pre className="p-3.5 rounded-xl bg-slate-900 text-orange-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {item.prompt}
                </pre>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      isLiked
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-orange-500 text-orange-500' : ''}`} />
                    <span>{item.likes}</span>
                  </button>

                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{item.comments}</span>
                  </span>
                </div>

                <button
                  onClick={() => onCopy(item.prompt, item.title)}
                  className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Publish to Community Exchange</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blueprint Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Enterprise Kubernetes Incident Post-Mortem Generator"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Niche / Domain</label>
                  <input
                    type="text"
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Handle</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <label className="block text-xs font-bold text-slate-700">Full Prompt Content</label>
                  <button
                    type="button"
                    onClick={handleAiPolishPrompt}
                    disabled={isPolishing || !newPrompt.trim()}
                    className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    {isPolishing ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Polishing Prompt...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>✨ AI Polish & Structure</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  required
                  rows={5}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Paste your prompt draft, notes, or concept here, then click AI Polish..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-orange-500/25"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
