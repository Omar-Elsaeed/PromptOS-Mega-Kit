import React from 'react';
import { Sparkles, Heart, Shield, Code2, Flame, Zap } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-orange-500/15 bg-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-red-500 to-rose-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/25">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Prompt<span className="text-orange-600">OS</span> Vault
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              The premier prompt engineering workspace with 100,000 expert prompts, 204 niches, Ruben Hassid's 11-block Fable 5 anatomy, and agentic Python code generators.
            </p>
            <div className="text-[11px] text-slate-400 font-medium">
              Built with precision for engineers, prompt architects, and AI founders.
            </div>
          </div>

          {/* Frameworks Col */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Frameworks
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li><button onClick={() => onNavigate('fable5')} className="hover:text-orange-600 transition-colors">Ruben Hassid Fable 5</button></li>
              <li><button onClick={() => onNavigate('library')} className="hover:text-orange-600 transition-colors">GEPA 6-Block Standard</button></li>
              <li><button onClick={() => onNavigate('library')} className="hover:text-orange-600 transition-colors">GEPA⁺ Unified</button></li>
              <li><button onClick={() => onNavigate('builder')} className="hover:text-orange-600 transition-colors">Smart Prompt Wizard</button></li>
            </ul>
          </div>

          {/* Agentic Tools Col */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Agentic Engineering
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li><button onClick={() => onNavigate('bedrock')} className="hover:text-orange-600 font-bold text-orange-600 transition-colors">Amazon Bedrock AgentCore</button></li>
              <li><button onClick={() => onNavigate('agents')} className="hover:text-red-600 transition-colors">Healthcare & Pro Agents</button></li>
              <li><button onClick={() => onNavigate('langchain')} className="hover:text-orange-600 transition-colors">LangChain & LangGraph</button></li>
              <li><button onClick={() => onNavigate('crewai')} className="hover:text-red-600 transition-colors">CrewAI Team Orchestrator</button></li>
              <li><button onClick={() => onNavigate('evals')} className="hover:text-rose-600 transition-colors">Evals & Observability</button></li>
              <li><button onClick={() => onNavigate('automation')} className="hover:text-amber-600 transition-colors">n8n / Make Automations</button></li>
            </ul>
          </div>

          {/* Ecosystem Col */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Ecosystem
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li><button onClick={() => onNavigate('store')} className="hover:text-emerald-600 transition-colors">Prompt Marketplace</button></li>
              <li><button onClick={() => onNavigate('community')} className="hover:text-rose-600 transition-colors">Community Hub</button></li>
              <li><button onClick={() => onNavigate('knowledge')} className="hover:text-orange-600 transition-colors">Knowledge Base</button></li>
              <li><button onClick={() => onNavigate('blueprint')} className="hover:text-amber-600 transition-colors">$50K Strategic Plan</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 PromptOS Vault. 100,000 Prompts · 204 Niches · All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero-Exposure Key Architecture</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
