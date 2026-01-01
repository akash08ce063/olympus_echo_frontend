export type Persona = {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  voiceId?: string;
};

export type RubricType = 'exact_match' | 'contains_keywords' | 'llm_eval' | 'latency' | 'interruption_rate';

export type RubricItem = {
  id: string;
  criteria: string; // Description of success, e.g. "Agent apologized"
  type: RubricType;
  keywords?: string[]; // For exact/contains match
  threshold?: number; // For latency (ms) or logic
};

export type TestCase = {
  id: string;
  title: string;
  scenario: string; // Description for the human/dashboard
  testerPersona: Persona; // The "User" agent configuration
  script: string; // Specific instructions/script for the Tester Agent
  rubric: RubricItem[];
};

export type TargetAgent = {
  id: string;
  name: string;
  type: 'vapi' | 'websocket' | 'phone';
  config: {
    url?: string;
    authHeader?: string;
    phoneNumber?: string;
    assistantId?: string; // e.g. Vapi Assistant ID
  };
};

export type Dataset = {
  id: string;
  name: string;
  description?: string;
  cases: TestCase[];
  targetAgentId: string; // Reference to the agent being tested
  created_at: string;
};

export type MessageRole = 'user' | 'assistant' | 'system';

export type TestMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  latency?: number;
};

export type RubricResult = {
  rubricId: string;
  passed: boolean;
  score?: number; // 0-1 confidence
  reason?: string;
};

export type CaseResult = {
  caseId: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  transcript: TestMessage[];
  rubricResults: RubricResult[];
  duration: number;
  audioUrl?: string;
};

export type Experiment = {
  id: string;
  datasetId: string;
  status: 'running' | 'completed' | 'aborted';
  results: Record<string, CaseResult>; // caseId -> Result
  startedAt: string;
  completedAt?: string;
};
