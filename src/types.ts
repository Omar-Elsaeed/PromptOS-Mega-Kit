export type FrameworkType = 'GEPA Classic' | 'Ruben Fable 5' | 'GEPA⁺ Unified' | '9-Step Cognitive Mediation' | 'Vibe Coding';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type TabType =
  | 'library'
  | 'fable5'
  | 'builder'
  | 'bedrock'
  | 'langchain'
  | 'crewai'
  | 'evals'
  | 'finetuning'
  | 'automation'
  | 'agents'
  | 'skills'
  | 'compare'
  | 'playground'
  | 'community'
  | 'knowledge'
  | 'store'
  | 'blueprint';

export interface PromptItem {
  id: string;
  title: string;
  niche: string;
  role: string;
  difficulty: DifficultyLevel;
  framework: FrameworkType;
  downloads: number;
  price: number;
  icon: string;
  gepa?: string;
  fable?: string;
  gepaplus?: string;
  ninestep?: string;
  prompt?: string;
  skills?: SkillItem[];
  vibeAgent?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  icon: string;
  cat: string;
  category?: string;
  model: string;
  desc: string;
  description?: string;
  level: number;
  toolsRequired?: string[];
  steps?: string[];
  testCases?: Array<{ scenario: string; expectedOutcome: string }>;
}

export interface CapabilityItem {
  id: string;
  cat: 'output' | 'reasoning' | 'content' | 'data' | 'agent' | 'model';
  icon: string;
  color: string;
  name: string;
  desc: string;
  model: string;
  modelColor: string;
  activate: string;
  example: string;
  promptCount: number;
  copyPrompt: string;
}

export interface NicheMeta {
  name: string;
  emoji: string;
  color: string;
  roles: string[];
  topics: string[];
}

export interface HistoryItem {
  id: string;
  title: string;
  niche: string;
  timestamp: number;
}

export interface CommunityPrompt {
  id: number | string;
  title: string;
  category: string;
  prompt: string;
  votes: number;
  date: string;
}

export interface CommunityPromptItem {
  id: string;
  title: string;
  niche: string;
  role: string;
  framework: string;
  author: string;
  upvotes: number;
  createdAt: string;
  content: string;
}

export interface AutomationNode {
  num: number;
  type: 'trigger' | 'filter' | 'ai' | 'transform' | 'action' | 'error' | 'output' | 'notify' | 'store';
  icon: string;
  color: string;
  name: string;
  app: string;
  desc: string;
  config: Record<string, string>;
  isAI?: boolean;
}

export interface AutomationBlueprint {
  goal: string;
  platform: string;
  trigger: string;
  complexity: string;
  apps: string[];
  nodes: AutomationNode[];
  prompts: Array<{ title: string; model: string; node: string; prompt: string }>;
  setupSteps: Array<{ icon: string; title: string; body: string }>;
  jsonCode: string;
  aiModel: string;
  hasAI: boolean;
}

export interface AutoTemplate {
  id: string;
  icon: string;
  color: string;
  title: string;
  desc: string;
  goal: string;
  platform: string;
  trigger: string;
  complexity: string;
  apps: string;
  tags: string[];
}

export type AutomationTemplate = AutoTemplate;

export interface AgentBlueprintPreset {
  id: string;
  name: string;
  role: string;
  goal: string;
  autonomyLevel: 'Full Autonomous' | 'Semi-Autonomous (HITL)' | 'Step-Supervised';
  maxIterations: number;
  tools: string[];
  completionCriteria: string[];
  retryContract: {
    maxRetries: number;
    fallbackAction: string;
    escalationThreshold: string;
  };
  systemPrompt: string;
}

export interface PromptQualityScore {
  total: number;
  dims: {
    role: number;
    task: number;
    context: number;
    constraints: number;
    output: number;
  };
  grade: string;
  gradeColor: string;
}
