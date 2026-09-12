import React, { useState } from 'react';
import { Users2, Copy, Check, Download, Play, Terminal, Layers, Sparkles, Wand2, ArrowRight } from 'lucide-react';

interface CrewAIStudioProps {
  onCopy: (text: string, title: string) => void;
}

type CrewTabType = 'crew-builder' | 'agent-designer' | 'task-pipeline' | 'custom-tool' | 'rag-crew' | 'flow-builder';

export const CrewAIStudio: React.FC<CrewAIStudioProps> = ({ onCopy }) => {
  const [activeTab, setActiveTab] = useState<CrewTabType>('crew-builder');

  // Form states
  const [crewGoal, setCrewGoal] = useState('Research latest advancements in AI agents and write an executive briefing');
  const [crewAgents, setCrewAgents] = useState('researcher: Find comprehensive AI breakthrough reports\nanalyst: Extract metrics and benchmark comparison data\nwriter: Synthesize findings into a high-impact executive report');
  const [crewProcess, setCrewProcess] = useState('sequential');
  const [crewMemory, setCrewMemory] = useState('True');

  const [agRole, setAgRole] = useState('Senior Enterprise Data Analyst');
  const [agGoal, setAgGoal] = useState('Analyze revenue data, identify growth leaks, and produce actionable recommendations');
  const [agBackstory, setAgBackstory] = useState('10+ years optimizing revenue metrics at Fortune 500 tech companies');
  const [agTools, setAgTools] = useState('SerperDevTool, FileReadTool, CSVSearchTool');

  const [tpTasks, setTpTasks] = useState('research_task: Discover top 5 industry benchmarks\nanalysis_task: Compare company data against benchmarks\nreport_task: Compile actionable findings into markdown');
  const [tpAgents, setTpAgents] = useState('researcher, analyst, writer');
  const [tpOutput, setTpOutput] = useState('executive_briefing.md');

  const [ctName, setCtName] = useState('GoogleSheetsReader');
  const [ctDesc, setCtDesc] = useState('Reads a Google Sheet and returns parsed JSON rows');
  const [ctInput, setCtInput] = useState('sheet_url: str');
  const [ctStyle, setCtStyle] = useState('@tool decorator');

  const [rgTopic, setRgTopic] = useState('Quarterly Corporate Financial Filings');
  const [rgSource, setRgSource] = useState('PDF files');
  const [rgStore, setRgStore] = useState('Chroma (local)');

  const [fbName, setFbName] = useState('ContentOrchestrationFlow');
  const [fbGoal, setFbGoal] = useState('Ingest keyword, research competitors, draft article, and publish');
  const [fbSteps, setFbSteps] = useState('research\ndraft_content\nreview_quality\npublish_cms');

  const [copied, setCopied] = useState(false);

  const generateCode = (): { code: string; pip: string; filename: string } => {
    if (activeTab === 'crew-builder') {
      const agentLines = crewAgents.split('\n').map(l => l.trim()).filter(Boolean);
      const agentObjs = agentLines.map(l => {
        const [name, ...goalParts] = l.split(':');
        return {
          id: (name || 'agent').trim().replace(/\s+/g, '_').toLowerCase(),
          role: (name || 'Agent').trim(),
          goal: goalParts.join(':').trim() || 'Execute assigned duties'
        };
      });

      return {
        filename: 'crew_orchestrator.py',
        pip: 'pip install crewai crewai-tools langchain-google-genai',
        code: `# CrewAI Multi-Agent System: ${crewGoal}
# Process: ${crewProcess} | Memory: ${crewMemory}

import os
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI

os.environ["GEMINI_API_KEY"] = "your-gemini-api-key"

llm = ChatGoogleGenerativeAI(
    model="gemini-3.7-flash",
    temperature=0.2
)

# ── Agent Personas ────────────────────────────
${agentObjs.map(a => `${a.id} = Agent(
    role="${a.role}",
    goal="${a.goal}",
    backstory="""Expert ${a.role} with deep verified domain mastery.""",
    verbose=True,
    memory=${crewMemory},
    llm=llm
)`).join('\n\n')}

# ── Task Definitions ──────────────────────────
tasks = [
${agentObjs.map((a, i) => `    Task(
        description="Execute core mission for ${a.role}: ${a.goal}",
        expected_output="Detailed, structured, and verified markdown report for step ${i + 1}.",
        agent=${a.id}
    )`).join(',\n')}
]

# ── Assemble Crew ─────────────────────────────
crew = Crew(
    agents=[${agentObjs.map(a => a.id).join(', ')}],
    tasks=tasks,
    process=Process.${crewProcess},
    verbose=True
)

if __name__ == "__main__":
    print("Initiating CrewAI Multi-Agent Execution...")
    result = crew.kickoff()
    print("=== FINAL CREW DELIVERABLE ===")
    print(result)
`
      };
    }

    if (activeTab === 'agent-designer') {
      return {
        filename: 'custom_agent.py',
        pip: 'pip install crewai crewai-tools langchain-google-genai',
        code: `# Autonomous Agent Blueprint: ${agRole}

from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0.1)

${agRole.toLowerCase().replace(/\s+/g, '_')} = Agent(
    role="${agRole}",
    goal="${agGoal}",
    backstory="""${agBackstory}""",
    tools=[], # Wire tools: ${agTools}
    allow_delegation=True,
    verbose=True,
    llm=llm
)
`
      };
    }

    if (activeTab === 'custom-tool') {
      return {
        filename: 'custom_crew_tool.py',
        pip: 'pip install crewai crewai-tools requests',
        code: `# Custom CrewAI Tool: ${ctName}
# Style: ${ctStyle}

from crewai.tools import tool

@tool("${ctName}")
def ${ctName.toLowerCase().replace(/\s+/g, '_')}(${ctInput}) -> str:
    """${ctDesc}"""
    print(f"Executing ${ctName} tool...")
    # Add real integration logic here
    return f"Successfully executed ${ctName} with parameters."
`
      };
    }

    // Default flow builder
    return {
      filename: 'crewai_flow.py',
      pip: 'pip install crewai crewai-tools',
      code: `# CrewAI Event-Driven Flow: ${fbName}
# Goal: ${fbGoal}

from crewai.flow.flow import Flow, start, listen

class ${fbName.replace(/\s+/g, '')}(Flow):
    
    @start()
    def initialize_workflow(self):
        print("Starting Flow: ${fbName}")
        return "Initial payload ready"

    @listen(initialize_workflow)
    def execute_pipeline_step(self, payload):
        print("Processing step with multi-agent intelligence...")
        return "Pipeline finished successfully."

if __name__ == "__main__":
    flow = ${fbName.replace(/\s+/g, '')}()
    result = flow.kickoff()
    print("Flow Result:", result)
`
    };
  };

  const { code, pip, filename } = generateCode();

  const handleCopyCode = () => {
    onCopy(code, `CrewAI Studio — ${filename}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'crew-builder', label: '👥 Crew Orchestrator', desc: 'Full multi-agent team setup' },
    { id: 'agent-designer', label: '🎯 Agent Persona', desc: 'Role, goal & backstory builder' },
    { id: 'custom-tool', label: '🛠️ Custom Tool', desc: '@tool decorator & class tools' },
    { id: 'flow-builder', label: '⚡ CrewAI Flows', desc: 'Event-driven flow decorators' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Studio Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Users2 className="w-3.5 h-3.5 text-orange-500" />
          <span>🚢 CrewAI Multi-Agent Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Multi-Agent Team & Flow{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Architecture Generator
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Build collaborative agent squads, custom tool integrations, and event-driven CrewAI Flows in Python.
        </p>
      </div>

      {/* Generator Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CrewTabType)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              <div className="text-xs font-bold truncate">{tab.label}</div>
              <div className={`text-[10.5px] mt-0.5 truncate ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Configure Crew Specifications</span>
            </h3>

            {activeTab === 'crew-builder' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crew Goal / Mission</label>
                  <input
                    type="text"
                    value={crewGoal}
                    onChange={(e) => setCrewGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Squad Agents (name: goal per line)</label>
                  <textarea
                    value={crewAgents}
                    onChange={(e) => setCrewAgents(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Process Mode</label>
                    <select
                      value={crewProcess}
                      onChange={(e) => setCrewProcess(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="sequential">Sequential</option>
                      <option value="hierarchical">Hierarchical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short-term Memory</label>
                    <select
                      value={crewMemory}
                      onChange={(e) => setCrewMemory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="True">Enabled</option>
                      <option value="False">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agent-designer' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agent Role</label>
                  <input
                    type="text"
                    value={agRole}
                    onChange={(e) => setAgRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Goal</label>
                  <input
                    type="text"
                    value={agGoal}
                    onChange={(e) => setAgGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Backstory</label>
                  <textarea
                    value={agBackstory}
                    onChange={(e) => setAgBackstory(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'custom-tool' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tool Name</label>
                  <input
                    type="text"
                    value={ctName}
                    onChange={(e) => setCtName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tool Description</label>
                  <input
                    type="text"
                    value={ctDesc}
                    onChange={(e) => setCtDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'flow-builder' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flow Name</label>
                  <input
                    type="text"
                    value={fbName}
                    onChange={(e) => setFbName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flow Mission</label>
                  <input
                    type="text"
                    value={fbGoal}
                    onChange={(e) => setFbGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Code Column */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-[#0c0d12] overflow-hidden shadow-xl">
            {/* Header bar */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2 font-medium">{filename}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .py</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs text-orange-200/90 leading-relaxed overflow-x-auto max-h-[480px] overflow-y-auto whitespace-pre">
              {code}
            </div>

            {/* Pip dependencies footer */}
            <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span className="truncate mr-2">{pip}</span>
              <button
                onClick={() => onCopy(pip, 'Pip dependencies')}
                className="text-orange-400 hover:text-orange-300 font-bold text-[11px] shrink-0"
              >
                Copy Pip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
