import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, DollarSign, MessageSquare, FileText, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { GLOBAL_ENTERPRISE_APPENDIX } from '../data/nichesExpansion';

interface EnterpriseAppendixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string, title: string) => void;
}

type TabType = 'outreach' | 'pricing' | 'objections' | 'contracts';

export const EnterpriseAppendixModal: React.FC<EnterpriseAppendixModalProps> = ({
  isOpen,
  onClose,
  onCopy
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('outreach');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyText = (id: string, text: string, title: string) => {
    onCopy(text, title);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-orange-200/80 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-50 via-white to-amber-50 border-b border-orange-200/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 font-black">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Global Enterprise Appendix
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  USD Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-channel outreach playbooks, psychological objection scripts, pricing frameworks, and contract blueprints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('outreach')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'outreach'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Outreach Playbooks ({GLOBAL_ENTERPRISE_APPENDIX.outreachScripts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Pricing Frameworks ({GLOBAL_ENTERPRISE_APPENDIX.pricingFrameworks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('objections')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'objections'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Objection Matrices ({GLOBAL_ENTERPRISE_APPENDIX.objectionHandlingScripts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'contracts'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Contract Blueprints ({GLOBAL_ENTERPRISE_APPENDIX.deliverableContractBlueprints?.length || 0})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: OUTREACH SCRIPTS */}
          {activeTab === 'outreach' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GLOBAL_ENTERPRISE_APPENDIX.outreachScripts.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                        {item.channel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.id}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 mb-3">
                      Target: <strong className="text-slate-700">{item.targetPersona}</strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap leading-relaxed mb-3 max-h-48 overflow-y-auto">
                      {item.script}
                    </div>

                    <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100 text-[11px] text-orange-950 font-mono whitespace-pre-wrap">
                      <span className="font-bold text-orange-800">Follow-up Sequence:</span> {item.followUpSequence}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => handleCopyText(item.id, `${item.script}\n\nFOLLOW-UP:\n${item.followUpSequence}`, item.title)}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy Script'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PRICING FRAMEWORKS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              {GLOBAL_ENTERPRISE_APPENDIX.pricingFrameworks.map((pf) => (
                <div
                  key={pf.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {pf.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {pf.name}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                      Structure: {pf.structure}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">
                    <strong>Best For:</strong> {pf.bestFor}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 font-mono text-xs text-amber-950 mb-3">
                    <span className="font-bold text-amber-900">Formula:</span> {pf.formula}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed mb-3">
                    <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider mb-1">
                      Verbatim Contract Clause:
                    </div>
                    {pf.contractClause}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopyText(pf.id, pf.contractClause, `${pf.name} Contract Clause`)}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedId === pf.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === pf.id ? 'Copied' : 'Copy Contract Clause'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: OBJECTION MATRICES */}
          {activeTab === 'objections' && (
            <div className="space-y-4">
              {GLOBAL_ENTERPRISE_APPENDIX.objectionHandlingScripts.map((obj) => (
                <div
                  key={obj.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {obj.id}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Root: {obj.psychologicalRoot}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    &ldquo;{obj.objection}&rdquo;
                  </h3>

                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 mb-3">
                    <strong className="text-indigo-900">Reframe Formula:</strong> {obj.reframeFormula}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed mb-3">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
                      Verbatim Response Script:
                    </div>
                    {obj.verbatimScript}
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-bold mb-3">
                    🎯 Closing Question: &ldquo;{obj.closingQuestion}&rdquo;
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopyText(obj.id, `${obj.verbatimScript}\n\nCLOSING QUESTION:\n"${obj.closingQuestion}"`, `Objection: ${obj.objection}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedId === obj.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === obj.id ? 'Copied' : 'Copy Script'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CONTRACT BLUEPRINTS */}
          {activeTab === 'contracts' && (
            <div className="space-y-4">
              {GLOBAL_ENTERPRISE_APPENDIX.deliverableContractBlueprints?.map((bp) => (
                <div
                  key={bp.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold">
                      {bp.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Standard Statement of Work (SOW)
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {bp.contractType}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4">
                    {bp.scopeSummary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Key Deliverables
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {bp.keyDeliverables.map((d, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-orange-600 font-bold">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Payment Milestones (USD)
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {bp.paymentMilestones.map((m, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">$</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed mb-3">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
                      IP Ownership Clause:
                    </div>
                    {bp.ipOwnershipClause}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-mono whitespace-pre-wrap leading-relaxed mb-3 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      Termination Conditions:
                    </div>
                    {bp.terminationConditions}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopyText(
                        bp.id,
                        `CONTRACT: ${bp.contractType}\n\nSCOPE:\n${bp.scopeSummary}\n\nDELIVERABLES:\n${bp.keyDeliverables.join('\n')}\n\nPAYMENT MILESTONES:\n${bp.paymentMilestones.join('\n')}\n\nIP CLAUSE:\n${bp.ipOwnershipClause}\n\nTERMINATION:\n${bp.terminationConditions}`,
                        bp.contractType
                      )}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedId === bp.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === bp.id ? 'Copied' : 'Copy Full SOW Blueprint'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Enterprise Compliance & Legal Architecture · PromptOS MegaKit</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Appendix
          </button>
        </div>
      </div>
    </div>
  );
};
