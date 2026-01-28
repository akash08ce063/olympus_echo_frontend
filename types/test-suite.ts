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
  id?: string;
  test_suite_id: string;
  name: string;
  goals: { text: string }[];
  evaluation_criteria: { expected: string }[];
  timeout_seconds: number;
  order_index: number;
  is_active: boolean;
  attempts: number;
  default_concurrent_calls: number;
  status?: 'pass' | 'passed' | 'running' | 'failed' | 'pending' | string;
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
  status: 'running' | 'completed' | 'aborted' | 'failed';
  results: Record<string, CaseResult>; // caseId -> Result
  startedAt: string;
  completedAt?: string;
};

// --- API Response Types ---

export interface ApiCallRecording {
  call_number: number;
  recording_url: string;
  file_id: string;
}

export interface ApiTranscriptMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ApiCallTranscript {
  request_id: string;
  id: string;
  call_transcript: ApiTranscriptMessage[];
  duration_seconds: number;
  created_at: string;
}

export interface ApiGoalAnalysis {
  goal_id: number;
  goal_description: string;
  status: 'passed' | 'failed' | 'partial';
  score: number;
  analysis: string;
  evidence: string;
}

export interface ApiCriterionEvaluated {
  criterion_id: number;
  type: string;
  expected: string;
  actual: string;
  passed: boolean;
  score: number;
  details: string;
  evidence: string;
}

export interface ApiEvaluationResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  overall_score: number;
  overall_status: 'passed' | 'failed' | 'partial';
  total_criteria: number;
  passed_criteria: number;
  goals_analysis: ApiGoalAnalysis[];
  criteria_evaluated: ApiCriterionEvaluated[];
  recommendations: string[];
  timestamp?: number;
}

export interface ApiCallDetail {
  call_number: number;
  result_id: string;
  status: string;
  error_message: string | null;
  evaluation_result: ApiEvaluationResult;
  started_at: string;
  completed_at: string | null;
  transcript: ApiTranscriptMessage[];
  recording_url: string;
}

export interface ApiTestCaseResult {
  result_id: string;
  test_case_id: string;
  concurrent_calls: number;
  status: string;
  error_message?: string | null;
  started_at?: string;
  completed_at?: string | null;
  recording_url?: string;
  call_recordings?: ApiCallRecording[];
  call_transcripts?: ApiCallTranscript[];
  transcript?: ApiTranscriptMessage[] | null;
  evaluation_result?: ApiEvaluationResult;
  calls?: ApiCallDetail[];
}

export interface ApiTestRun {
  id: string;
  test_suite_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_test_cases: number;
  passed_count: number;
  failed_count: number;
  alert_count: number;
  test_case_results: ApiTestCaseResult[];
}
