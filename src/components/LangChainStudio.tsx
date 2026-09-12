import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Sparkles, Terminal, Play, FileCode, CheckCircle2, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface LangChainStudioProps {
  onCopy: (text: string, title: string) => void;
}

type LCType = 'prompt-template' | 'state-machine' | 'rag' | 'multi-agent' | 'memory-chain' | 'tool-agent';

export const LangChainStudio: React.FC<LangChainStudioProps> = ({ onCopy }) => {
  const [activeType, setActiveType] = useState<LCType>('prompt-template');

  // Form states
  const [ptTask, setPtTask] = useState('Summarize a product review and extract sentiment, key pros, and cons');
  const [ptVars, setPtVars] = useState('product_name, review_text, language');
  const [ptModel, setPtModel] = useState('gemini-3.7-flash');
  const [ptParser, setPtParser] = useState('JsonOutputParser');

  const [smGoal, setSmGoal] = useState('Research a topic, write a report, and fact-check claims');
  const [smNodes, setSmNodes] = useState('researcher, writer, fact_checker, publisher');
  const [smRouting, setSmRouting] = useState('conditional');
  const [smMemory, setSmMemory] = useState('MemorySaver');

  const [ragSource, setRagSource] = useState('PDF');
  const [ragVector, setRagVector] = useState('Chroma');
  const [ragEmbed, setRagEmbed] = useState('gemini-embedding-2-preview');
  const [ragLLM, setRagLLM] = useState('gemini-3.7-flash');
  const [ragDomain, setRagDomain] = useState('Internal HR & Legal Policies');

  const [maGoal, setMaGoal] = useState('Monitor competitors and generate weekly strategic reports');
  const [maAgents, setMaAgents] = useState('researcher: web research and data gathering\nwriter: content generation and formatting\nreviewer: quality control and fact verification');

  const [mcPersona, setMcPersona] = useState('Senior Enterprise Sales Coach with 20 years experience');
  const [mcMemory, setMcMemory] = useState('ConversationBufferMemory');
  const [mcBackend, setMcBackend] = useState('In-Memory (default)');

  const [taGoal, setTaGoal] = useState('Research competitor pricing and compile market comparisons');
  const [taTools, setTaTools] = useState('web_search + python_repl + file_io');
  const [taHitl, setTaHitl] = useState('Yes — before tool calls');

  const [copied, setCopied] = useState(false);

  // Python Code Generation
  const generateCode = (): { code: string; pip: string; filename: string } => {
    if (activeType === 'prompt-template') {
      const varsArray = ptVars.split(',').map(v => v.trim()).filter(Boolean);
      const varPlaceholders = varsArray.map(v => `    "${v}": "your_${v}_value"`).join(',\n');
      const varStream = varsArray.map(v => `"${v}": "stream_${v}"`).join(', ');

      return {
        filename: 'lcel_chain.py',
        pip: 'pip install langchain langchain-google-genai langchain-core',
        code: `# LangChain Expression Language (LCEL) Chain
# Task: ${ptTask}

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import ${ptParser}
from langchain_google_genai import ChatGoogleGenerativeAI
import os

os.environ["GEMINI_API_KEY"] = "your-gemini-api-key"

# ── Model Initialization ──────────────────────
llm = ChatGoogleGenerativeAI(
    model="${ptModel}",
    temperature=0.2
)

# ── Prompt Template ───────────────────────────
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert specialist.
Task: ${ptTask}
Deliver a structured, precise, and verified response."""),
    ("human", "${varsArray.map(v => `{${v}}`).join(' | ')}")
])

# ── Output Parser & LCEL Pipeline ─────────────
parser = ${ptParser}()
chain = prompt | llm | parser

# ── Execute Chain (Single Run) ────────────────
if __name__ == "__main__":
    result = chain.invoke({
${varPlaceholders}
    })
    print("=== RESULT ===")
    print(result)

    # ── Streaming Example ─────────────────────
    print("\\n=== STREAMING OUTPUT ===")
    for chunk in chain.stream({${varStream}}):
        print(chunk, end="", flush=True)
`
      };
    }

    if (activeType === 'state-machine') {
      const nodeList = smNodes.split(',').map(n => n.trim()).filter(Boolean);
      return {
        filename: 'langgraph_state_machine.py',
        pip: 'pip install langgraph langchain-google-genai langchain-core',
        code: `# LangGraph State Machine
# Goal: ${smGoal}

from typing import TypedDict, Annotated, Sequence
import operator
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import ${smMemory}
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI

# ── Define State Schema ───────────────────────
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    current_step: str
    intermediate_data: dict

# ── Initialize LLM ────────────────────────────
llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0.1)

# ── Define Graph Nodes ────────────────────────
${nodeList.map(n => `def ${n}_node(state: AgentState) -> dict:
    print(f"Executing step: ${n}")
    # Node logic for ${n}
    response = llm.invoke([
        HumanMessage(content=f"Execute task: ${smGoal} | Step: ${n}")
    ])
    return {
        "messages": [AIMessage(content=f"[${n}]: " + response.content)],
        "current_step": "${n}"
    }`).join('\n\n')}

# ── Routing Logic ─────────────────────────────
def route_next_step(state: AgentState):
    current = state.get("current_step", "")
    if current == "${nodeList[nodeList.length - 1] || 'done'}":
        return END
    return "next"

# ── Compile Workflow Graph ────────────────────
workflow = StateGraph(AgentState)

${nodeList.map(n => `workflow.add_node("${n}", ${n}_node)`).join('\n')}

workflow.set_entry_point("${nodeList[0] || 'start'}")

${nodeList.slice(0, -1).map((n, i) => `workflow.add_edge("${n}", "${nodeList[i + 1]}")`).join('\n')}
workflow.add_edge("${nodeList[nodeList.length - 1]}", END)

memory = ${smMemory}()
app = workflow.compile(checkpointer=memory)

if __name__ == "__main__":
    initial_state = {
        "messages": [HumanMessage(content="Initialize agent mission: ${smGoal}")],
        "current_step": "init",
        "intermediate_data": {}
    }
    config = {"configurable": {"thread_id": "thread-001"}}
    for output in app.stream(initial_state, config=config):
        print(output)
`
      };
    }

    if (activeType === 'rag') {
      return {
        filename: 'rag_pipeline.py',
        pip: 'pip install langchain langchain-google-genai chromadb langchain-community pypdf',
        code: `# Production RAG Pipeline: ${ragDomain}
# VectorStore: ${ragVector} | Embeddings: ${ragEmbed}

import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import ${ragVector}
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

os.environ["GEMINI_API_KEY"] = "your-gemini-api-key"

# ── Document Chunking ─────────────────────────
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\\n\\n", "\\n", " ", ""]
)

# ── Embeddings & Vector Index ─────────────────
embeddings = GoogleGenerativeAIEmbeddings(model="${ragEmbed}")
vectorstore = ${ragVector}(
    collection_name="rag_knowledge_base",
    embedding_function=embeddings
)
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# ── QA RAG Chain ──────────────────────────────
prompt = ChatPromptTemplate.from_template("""You are an expert specialist on ${ragDomain}.
Answer the user's question using ONLY the provided context excerpts.
If the answer cannot be verified from the context, state clearly: "I cannot find sufficient evidence in the provided documents."

Context:
{context}

Question: {question}

Answer with precise bullet points and citations:""")

llm = ChatGoogleGenerativeAI(model="${ragLLM}", temperature=0.0)

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

if __name__ == "__main__":
    query = "What is the policy regarding travel reimbursement limits?"
    response = rag_chain.invoke(query)
    print("=== RAG Response ===")
    print(response)
`
      };
    }

    if (activeType === 'multi-agent') {
      const agentLines = maAgents.split('\n').map(l => l.trim()).filter(Boolean);
      return {
        filename: 'multi_agent_supervisor.py',
        pip: 'pip install langgraph langchain-google-genai langchain-core',
        code: `# Multi-Agent Supervisor Pattern
# Mission: ${maGoal}

from typing import TypedDict, Literal
from langchain_core.messages import HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END

members = [${agentLines.map(l => `"${l.split(':')[0].trim()}"`).join(', ')}]
options = ["FINISH"] + members

system_prompt = (
    "You are a supervisor tasked with managing a conversation between the"
    f" following workers: {members}. Given the user request,"
    " respond with the worker to act next. Each worker will perform a"
    " task and respond with their results and status. When finished,"
    " respond with FINISH."
)

class Router(TypedDict):
    """Worker to route to next. If no further work needed, route to FINISH."""
    next: Literal[*options]

llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0)

def supervisor_node(state):
    # Route logic to next specialist
    messages = state["messages"]
    print("Supervisor evaluating conversation state...")
    return {"next": members[0]}

# ── Assemble Graph ────────────────────────────
workflow = StateGraph(dict)
workflow.add_node("supervisor", supervisor_node)
${agentLines.map(l => {
  const name = l.split(':')[0].trim();
  return `def ${name}_node(state):
    print("Executing worker: ${name}")
    return {"messages": [AIMessage(content="[${name}]: Task completed successfully.")]}
workflow.add_node("${name}", ${name}_node)
workflow.add_edge("${name}", "supervisor")`;
}).join('\n')}

workflow.set_entry_point("supervisor")
app = workflow.compile()

if __name__ == "__main__":
    res = app.invoke({"messages": [HumanMessage(content="Begin mission: ${maGoal}")]})
    print("Final Multi-Agent Result:", res)
`
      };
    }

    if (activeType === 'memory-chain') {
      return {
        filename: 'memory_chat_chain.py',
        pip: 'pip install langchain langchain-google-genai langchain-community',
        code: `# RunnableWithMessageHistory & Session State
# Persona: ${mcPersona}

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_google_genai import ChatGoogleGenerativeAI

store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert: ${mcPersona}. Maintain persistent recall across turns."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0.4)
chain = prompt | llm

chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

if __name__ == "__main__":
    config = {"configurable": {"session_id": "session_user_001"}}
    resp1 = chain_with_history.invoke({"input": "Hello, my name is Alex and I lead a 15-person sales team."}, config=config)
    print("Turn 1:", resp1.content)

    resp2 = chain_with_history.invoke({"input": "What is my name and what is my team size?"}, config=config)
    print("Turn 2 (Memory Recall):", resp2.content)
`
      };
    }

    // Tool calling agent
    return {
      filename: 'tool_calling_agent.py',
      pip: 'pip install langchain langchain-google-genai langchain-community duckduckgo-search',
      code: `# ReAct Tool-Calling Agent
# Goal: ${taGoal}

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# ── Define Domain Tools ───────────────────────
@tool
def calculate_growth_metric(current_val: float, previous_val: float) -> str:
    """Calculates percentage growth between two numbers."""
    diff = current_val - previous_val
    pct = (diff / previous_val) * 100
    return f"Growth: {pct:.2f}% (delta: {diff:+.2f})"

@tool
def search_market_data(query: str) -> str:
    """Simulates market lookup for sector metrics."""
    return f"Market telemetry for query: '{query}' -> Status: High Demand, CAGR 24.5%"

tools = [calculate_growth_metric, search_market_data]

# ── Model & Agent Wiring ──────────────────────
llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0.1)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an autonomous intelligence agent with real-time tool execution capabilities."),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

if __name__ == "__main__":
    result = agent_executor.invoke({"input": "${taGoal}"})
    print("Agent Result:", result["output"])
`
    };
  };

  const { code, pip, filename } = generateCode();

  const handleCopyCode = () => {
    onCopy(code, `LangChain Studio — ${filename}`);
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

  const tabOptions = [
    { id: 'prompt-template', label: '📝 LCEL Chain', desc: 'Pipe prompt, model, & parser' },
    { id: 'state-machine', label: '🕸️ LangGraph Graph', desc: 'StateGraph with nodes & memory' },
    { id: 'rag', label: '🔍 RAG Pipeline', desc: 'VectorStore, embeddings, & retriever' },
    { id: 'multi-agent', label: '🤖 Multi-Agent Supervisor', desc: 'Hierarchical supervisor routing' },
    { id: 'memory-chain', label: '🧠 Session Memory', desc: 'RunnableWithMessageHistory' },
    { id: 'tool-agent', label: '🛠️ Tool-Calling Agent', desc: 'ReAct agent with custom tools' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Studio Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Code2 className="w-3.5 h-3.5 text-orange-500" />
          <span>🦜 LangChain & LangGraph Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Production AI Agent & Pipeline{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Code Generator
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Generate clean, typed, and runnable Python LangChain and LangGraph code for any agentic pipeline.
        </p>
      </div>

      {/* Generator Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        {tabOptions.map((tab) => {
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id as LCType)}
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

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Configure Pipeline Parameters</span>
            </h3>

            {activeType === 'prompt-template' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Description</label>
                  <textarea
                    value={ptTask}
                    onChange={(e) => setPtTask(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Input Variables (comma separated)</label>
                  <input
                    type="text"
                    value={ptVars}
                    onChange={(e) => setPtVars(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Model Target</label>
                    <select
                      value={ptModel}
                      onChange={(e) => setPtModel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="gemini-3.7-flash">Gemini 3.7 Flash</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                      <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Output Parser</label>
                    <select
                      value={ptParser}
                      onChange={(e) => setPtParser(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="JsonOutputParser">JsonOutputParser</option>
                      <option value="StrOutputParser">StrOutputParser</option>
                      <option value="CommaSeparatedListOutputParser">ListOutputParser</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeType === 'state-machine' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State Machine Goal</label>
                  <input
                    type="text"
                    value={smGoal}
                    onChange={(e) => setSmGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Node Names (comma separated)</label>
                  <input
                    type="text"
                    value={smNodes}
                    onChange={(e) => setSmNodes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Routing Mode</label>
                    <select
                      value={smRouting}
                      onChange={(e) => setSmRouting(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="conditional">Conditional Router</option>
                      <option value="linear">Linear Sequential</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Checkpointing</label>
                    <select
                      value={smMemory}
                      onChange={(e) => setSmMemory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="MemorySaver">MemorySaver (In-Memory)</option>
                      <option value="SQLiteSaver">SQLiteSaver (Persistent)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeType === 'rag' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Knowledge Domain</label>
                  <input
                    type="text"
                    value={ragDomain}
                    onChange={(e) => setRagDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doc Source</label>
                    <select
                      value={ragSource}
                      onChange={(e) => setRagSource(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="PDF">PDF Documents</option>
                      <option value="Web">Web Pages</option>
                      <option value="CSV">CSV / Tabular Data</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vector Store</label>
                    <select
                      value={ragVector}
                      onChange={(e) => setRagVector(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Chroma">Chroma DB (Local)</option>
                      <option value="FAISS">FAISS (In-Memory)</option>
                      <option value="Pinecone">Pinecone Cloud</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeType === 'multi-agent' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">System Mission / Goal</label>
                  <input
                    type="text"
                    value={maGoal}
                    onChange={(e) => setMaGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Worker Agents (name: role per line)</label>
                  <textarea
                    value={maAgents}
                    onChange={(e) => setMaAgents(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {activeType === 'memory-chain' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agent Persona</label>
                  <input
                    type="text"
                    value={mcPersona}
                    onChange={(e) => setMcPersona(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Memory Backend</label>
                  <select
                    value={mcBackend}
                    onChange={(e) => setMcBackend(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="In-Memory (default)">In-Memory Session Store</option>
                    <option value="Redis">Redis Message History</option>
                    <option value="SQLite">SQLite Database</option>
                  </select>
                </div>
              </div>
            )}

            {activeType === 'tool-agent' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agent Goal</label>
                  <input
                    type="text"
                    value={taGoal}
                    onChange={(e) => setTaGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tools to Wire</label>
                  <input
                    type="text"
                    value={taTools}
                    onChange={(e) => setTaTools(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
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
