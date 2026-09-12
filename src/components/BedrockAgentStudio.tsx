import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Copy,
  Check,
  Download,
  Play,
  Terminal,
  Shield,
  Database,
  Cpu,
  Code2,
  Wand2,
  FileCode,
  Zap,
  Box,
  Cloud,
  ChevronRight,
  Server,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { generateAIContent } from '../utils/api';

interface BedrockAgentStudioProps {
  onCopy: (text: string, title: string) => void;
}

type StudioTabType =
  | 'agent-architect'
  | 'action-groups'
  | 'knowledge-base'
  | 'guardrails'
  | 'iac-deploy'
  | 'trace-simulator';

interface ActionGroupItem {
  id: string;
  name: string;
  description: string;
  actionGroupType: 'LAMBDA' | 'RETURN_OF_CONTROL';
  apiPath: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters: Array<{ name: string; type: string; description: string; required: boolean }>;
  mockResponse: string;
}

interface PresetBlueprint {
  id: string;
  name: string;
  icon: string;
  tag: string;
  agentName: string;
  foundationModel: string;
  description: string;
  instructions: string;
  knowledgeBaseTopic: string;
  s3Bucket: string;
  guardrailDeniedTopic: string;
  actionGroups: ActionGroupItem[];
}

const PRESET_BLUEPRINTS: PresetBlueprint[] = [
  {
    id: 'financial-fraud',
    name: 'Financial Crime & Fraud Detection Agent',
    icon: '🏦',
    tag: 'Fintech & Banking',
    agentName: 'FinCrimeInvestigatorAgent',
    foundationModel: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
    description: 'Autonomous financial investigator analyzing suspicious transaction graphs, querying KYC databases, and preparing SAR regulatory filings.',
    instructions: `You are FinCrimeInvestigatorAgent, an elite AML/BSA compliance investigator.
Your core mission is to analyze flagged transactions, verify customer profiles against international sanctions lists, assess risk velocity, and generate structured Suspicious Activity Reports (SAR).

OPERATIONAL MANDATES:
1. Always verify the transaction ID and customer account ID before running deep graph traversals.
2. Cross-reference the transaction history against the OFAC/PEP watchlist using the screening Action Group.
3. Compute risk scores based on geographic anomalies, structuring patterns, and counterparty reputation.
4. If risk score > 80, invoke the freezeAccount Action Group immediately and draft SAR narrative.
5. Provide mathematical and logical rationale for all compliance determinations.`,
    knowledgeBaseTopic: 'AML/CFT Regulatory Frameworks, FATF Recommendations, and Bank Compliance Rulebooks',
    s3Bucket: 's3://enterprise-aml-compliance-lake-prod/knowledge-base/',
    guardrailDeniedTopic: 'Tax Evasion Techniques, Offshore Structuring Workarounds, Exploit Tutorials',
    actionGroups: [
      {
        id: 'ag-1',
        name: 'TransactionAnalyticsService',
        description: 'Retrieves multi-hop transaction graphs and account historical velocity metrics',
        actionGroupType: 'LAMBDA',
        apiPath: '/v1/transactions/{accountId}/velocity',
        httpMethod: 'GET',
        parameters: [
          { name: 'accountId', type: 'string', description: 'Target customer account ID', required: true },
          { name: 'lookbackDays', type: 'integer', description: 'Number of historical days to inspect', required: false }
        ],
        mockResponse: '{"accountId": "ACC-9921", "volume30d": 1450000.00, "velocityAnomalyScore": 92.4, "structuringPatternDetected": true}'
      },
      {
        id: 'ag-2',
        name: 'SanctionsScreeningService',
        description: 'Screens entities and counterparties against OFAC, PEP, and international sanctions lists',
        actionGroupType: 'LAMBDA',
        apiPath: '/v1/compliance/screen-entity',
        httpMethod: 'POST',
        parameters: [
          { name: 'entityName', type: 'string', description: 'Full legal name of person or corporation', required: true },
          { name: 'jurisdiction', type: 'string', description: 'Country ISO-2 code', required: true }
        ],
        mockResponse: '{"matchFound": false, "riskTier": "MEDIUM", "pepAssociation": "Indirect Tier 2", "screeningTimestamp": "2026-08-29T16:20:00Z"}'
      },
      {
        id: 'ag-3',
        name: 'AccountContainmentService',
        description: 'Imposes immediate provisional account restrictions or triggers emergency audit holds',
        actionGroupType: 'RETURN_OF_CONTROL',
        apiPath: '/v1/accounts/lock-provisional',
        httpMethod: 'POST',
        parameters: [
          { name: 'accountId', type: 'string', description: 'Customer account ID to lock', required: true },
          { name: 'justificationCode', type: 'string', description: 'Regulatory reason code (e.g., AML_VELOCITY_SPIKE)', required: true }
        ],
        mockResponse: '{"status": "LOCKED_PENDING_REVIEW", "ticketId": "SAR-2026-8831", "holdExpiration": "2026-09-05T00:00:00Z"}'
      }
    ]
  },
  {
    id: 'healthcare-navigator',
    name: 'Clinical Intake & Prior-Auth Navigator',
    icon: '🏥',
    tag: 'Healthcare & HIPAA',
    agentName: 'ClinicalIntakeNavigatorAgent',
    foundationModel: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    description: 'HIPAA-hardened clinical coordinator evaluating prior-authorization requests, mapping ICD-10/CPT codes, and checking payer medical policies.',
    instructions: `You are ClinicalIntakeNavigatorAgent, a certified clinical review specialist adhering strictly to HIPAA and CMS regulations.
Your mission is to evaluate prior-authorization documentation against insurer clinical guidelines, verify medical necessity, and flag clinical documentation deficiencies.

OPERATIONAL MANDATES:
1. Redact and protect all patient Protected Health Information (PHI) in accordance with the Bedrock Guardrail policy.
2. Query the Medical Policy Knowledge Base to extract current clinical criterion checklists for requested CPT codes.
3. Validate presence of mandatory prerequisite conservative therapy trials before approving surgical authorization.
4. Output structured recommendation summaries with exact medical guideline citations.`,
    knowledgeBaseTopic: 'CMS Clinical Guidelines, Payer Medical Policies, ICD-10 / CPT Coding Manuals',
    s3Bucket: 's3://hospital-clinical-guidelines-hipaa-prod/policies/',
    guardrailDeniedTopic: 'Direct Unverified Prescription Issuance, Invasive Treatment Self-Administration, Unlicensed Medical Advice',
    actionGroups: [
      {
        id: 'ag-h1',
        name: 'EHRRecordLookupService',
        description: 'Queries FHIR-compliant Electronic Health Records for patient medical history and lab panels',
        actionGroupType: 'LAMBDA',
        apiPath: '/fhir/r4/Patient/{patientId}/ClinicalHistory',
        httpMethod: 'GET',
        parameters: [
          { name: 'patientId', type: 'string', description: 'De-identified patient MRN or token', required: true },
          { name: 'icdCode', type: 'string', description: 'Primary diagnostic ICD-10 code', required: true }
        ],
        mockResponse: '{"mrn": "PT-77412", "primaryDiagnosis": "M54.5 Low Back Pain", "conservativeTherapyWeeks": 8, "mriCompleted": true}'
      },
      {
        id: 'ag-h2',
        name: 'PriorAuthSubmissionService',
        description: 'Generates and submits formal X12 278 prior-authorization requests to payer EDI clearinghouses',
        actionGroupType: 'RETURN_OF_CONTROL',
        apiPath: '/edi/278/prior-auth',
        httpMethod: 'POST',
        parameters: [
          { name: 'cptCode', type: 'string', description: 'Requested procedure CPT code', required: true },
          { name: 'payerId', type: 'string', description: 'Insurance payer clearinghouse ID', required: true }
        ],
        mockResponse: '{"authRequestId": "PA-2026-90021", "determination": "PENDING_CLINICAL_REVIEW", "estimatedTurnaroundHours": 24}'
      }
    ]
  },
  {
    id: 'devops-sre',
    name: 'DevOps & SRE Autonomous Remediation Agent',
    icon: '🛠️',
    tag: 'Cloud & Infrastructure',
    agentName: 'CloudOpsRemediationAgent',
    foundationModel: 'amazon.nova-pro-v1:0',
    description: 'Autonomous Site Reliability Engineer diagnosing CloudWatch alarms, analyzing Kubernetes pod crashloops, and executing safe canary rollbacks.',
    instructions: `You are CloudOpsRemediationAgent, an autonomous Site Reliability Engineering (SRE) agent.
Your objective is to triage high-severity infrastructure incidents, correlate telemetry across AWS CloudWatch and OpenTelemetry, and execute automated blast-radius-limited remediations.

OPERATIONAL MANDATES:
1. Always inspect error logs and trace anomalies before modifying any production workloads.
2. For high-severity incidents (SEV-1/SEV-2), verify the service mesh error budget and traffic draining before initiating rollbacks.
3. Use Return of Control (ROC) for any cluster-wide destructive or scaling operations.
4. Record every diagnostic step with timestamps and command outputs for the post-mortem timeline.`,
    knowledgeBaseTopic: 'Runbooks, Architecture Diagrams, Incident Post-Mortems, and AWS Service Catalogs',
    s3Bucket: 's3://enterprise-sre-runbooks-prod/knowledge-base/',
    guardrailDeniedTopic: 'Unbounded Database Drop Commands, Root Credential Exposure, Unaudited Security Group Openings',
    actionGroups: [
      {
        id: 'ag-d1',
        name: 'CloudWatchTelemetryService',
        description: 'Queries CloudWatch metrics, log insight queries, and X-Ray distributed traces',
        actionGroupType: 'LAMBDA',
        apiPath: '/observability/metrics/query',
        httpMethod: 'POST',
        parameters: [
          { name: 'serviceName', type: 'string', description: 'Name of the microservice', required: true },
          { name: 'timeWindowMinutes', type: 'integer', description: 'Lookback window in minutes', required: true }
        ],
        mockResponse: '{"service": "checkout-api", "p99LatencyMs": 4200, "errorRatePercent": 14.8, "topException": "DatabaseConnectionTimeoutException"}'
      },
      {
        id: 'ag-d2',
        name: 'CanaryRollbackService',
        description: 'Executes automated canary traffic shifting and ECS/EKS deployment revision rollbacks',
        actionGroupType: 'RETURN_OF_CONTROL',
        apiPath: '/deployments/{serviceName}/rollback',
        httpMethod: 'POST',
        parameters: [
          { name: 'serviceName', type: 'string', description: 'Target microservice name', required: true },
          { name: 'targetRevision', type: 'string', description: 'Target git commit or deployment revision', required: true }
        ],
        mockResponse: '{"status": "ROLLBACK_INITIATED", "deploymentId": "dep-88219", "trafficShiftPercent": 100, "healthyReplicaCount": 12}'
      }
    ]
  },
  {
    id: 'ecommerce-ops',
    name: 'Omnichannel E-Commerce & Order Ops Agent',
    icon: '🛒',
    tag: 'Retail & ERP',
    agentName: 'CommerceOpsMasterAgent',
    foundationModel: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    description: 'Autonomous customer resolution and supply chain agent handling order modifications, shipping carrier claims, and warehouse allocation.',
    instructions: `You are CommerceOpsMasterAgent, handling high-volume e-commerce order management and enterprise ERP integrations.
Your role is to diagnose delivery delays, process RMA returns, verify loyalty discount eligibility, and coordinate warehouse rerouting.

OPERATIONAL MANDATES:
1. Verify customer identity and order confirmation ID before issuing refunds or address modifications.
2. Check inventory levels across regional fulfillment centers (FCs) before confirming expedited reshipments.
3. Adhere strictly to the corporate return policy guidelines stored in the Knowledge Base.
4. Escalate to human tier-2 supervisor when requested claim value exceeds $500.`,
    knowledgeBaseTopic: 'Store Return Policies, Shipping SLA Contracts, Loyalty Program Rules',
    s3Bucket: 's3://global-retail-operations-prod/policies/',
    guardrailDeniedTopic: 'Coupon Exploitation Tricks, Unlimited Refund Glitches, Price Manipulation',
    actionGroups: [
      {
        id: 'ag-e1',
        name: 'OrderFulfillmentService',
        description: 'Fetches real-time status from NetSuite ERP and logistics carriers (FedEx/UPS/DHL)',
        actionGroupType: 'LAMBDA',
        apiPath: '/erp/orders/{orderId}/status',
        httpMethod: 'GET',
        parameters: [
          { name: 'orderId', type: 'string', description: 'Customer purchase order ID', required: true }
        ],
        mockResponse: '{"orderId": "ORD-55421", "status": "IN_TRANSIT", "carrier": "FedEx", "trackingNumber": "781290348821", "estimatedDelivery": "2026-08-30"}'
      },
      {
        id: 'ag-e2',
        name: 'RefundAndRMAReturnService',
        description: 'Processes credit card refunds and generates prepaid return shipping QR codes',
        actionGroupType: 'RETURN_OF_CONTROL',
        apiPath: '/erp/orders/rma/create',
        httpMethod: 'POST',
        parameters: [
          { name: 'orderId', type: 'string', description: 'Order ID to generate return for', required: true },
          { name: 'returnReason', type: 'string', description: 'Reason for return', required: true }
        ],
        mockResponse: '{"rmaId": "RMA-9921", "refundAmount": 89.99, "returnLabelUrl": "https://shipping.retail.com/label/RMA-9921.pdf"}'
      }
    ]
  }
];

export const BedrockAgentStudio: React.FC<BedrockAgentStudioProps> = ({ onCopy }) => {
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTabType>('agent-architect');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('financial-fraud');

  // Agent Architect State
  const [agentName, setAgentName] = useState('FinCrimeInvestigatorAgent');
  const [foundationModel, setFoundationModel] = useState('anthropic.claude-3-7-sonnet-20250219-v1:0');
  const [agentDescription, setAgentDescription] = useState(
    'Autonomous financial investigator analyzing suspicious transaction graphs, querying KYC databases, and preparing SAR regulatory filings.'
  );
  const [idleSessionTTL, setIdleSessionTTL] = useState<number>(1800);
  const [instructions, setInstructions] = useState(PRESET_BLUEPRINTS[0].instructions);
  const [enableMemory, setEnableMemory] = useState<boolean>(true);
  const [memoryWindowDays, setMemoryWindowDays] = useState<number>(30);

  // Knowledge Base State
  const [kbName, setKbName] = useState('EnterpriseComplianceKnowledgeBase');
  const [kbTopic, setKbTopic] = useState('AML/CFT Regulatory Frameworks, FATF Recommendations, and Bank Compliance Rulebooks');
  const [kbS3Uri, setKbS3Uri] = useState('s3://enterprise-aml-compliance-lake-prod/knowledge-base/');
  const [embeddingModel, setEmbeddingModel] = useState('amazon.titan-embed-text-v2:0');
  const [vectorStoreType, setVectorStoreType] = useState<'OPENSEARCH_SERVERLESS' | 'AURORA_POSTGRES' | 'PINECONE'>('OPENSEARCH_SERVERLESS');
  const [chunkingStrategy, setChunkingStrategy] = useState<'HIERARCHICAL' | 'SEMANTIC' | 'FIXED_SIZE'>('HIERARCHICAL');
  const [searchType, setSearchType] = useState<'HYBRID' | 'SEMANTIC'>('HYBRID');

  // Action Groups State
  const [actionGroups, setActionGroups] = useState<ActionGroupItem[]>(PRESET_BLUEPRINTS[0].actionGroups);

  // Guardrails State
  const [guardrailName, setGuardrailName] = useState('EnterprisePIIAndSafetyGuardrail');
  const [deniedTopics, setDeniedTopics] = useState(PRESET_BLUEPRINTS[0].guardrailDeniedTopic);
  const [piiEntities, setPiiEntities] = useState<string[]>([
    'US_SOCIAL_SECURITY_NUMBER',
    'CREDIT_DEBIT_CARD_NUMBER',
    'EMAIL',
    'NAME',
    'PHONE',
    'US_BANK_ACCOUNT_NUMBER'
  ]);
  const [contentFilterLevel, setContentFilterLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [enableContextualGrounding, setEnableContextualGrounding] = useState<boolean>(true);
  const [groundingThreshold, setGroundingThreshold] = useState<number>(0.85);

  // Code Gen & IaC View State
  const [iacFormat, setIacFormat] = useState<'boto3' | 'cdk' | 'terraform' | 'cloudformation' | 'openapi' | 'lambda'>('boto3');
  const [copied, setCopied] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);

  // Trace Simulator State
  const [simQuery, setSimQuery] = useState(
    'Audit account ACC-9921 for transaction velocity anomalies and screen counterparty "Vanguard Global Trade Ltd" for sanctions.'
  );
  const [simState, setSimState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [simTraces, setSimTraces] = useState<Array<{ step: string; category: string; duration: string; content: string }>>([]);
  const [simFinalResponse, setSimFinalResponse] = useState<string>('');

  // Handle Preset Selection
  const applyPreset = (presetId: string) => {
    const preset = PRESET_BLUEPRINTS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setAgentName(preset.agentName);
    setFoundationModel(preset.foundationModel);
    setAgentDescription(preset.description);
    setInstructions(preset.instructions);
    setKbTopic(preset.knowledgeBaseTopic);
    setKbS3Uri(preset.s3Bucket);
    setDeniedTopics(preset.guardrailDeniedTopic);
    setActionGroups(preset.actionGroups);
    setSimState('idle');
  };

  // AI Prompt Polish with Gemini backend
  const handleAIOptimizeInstructions = async () => {
    setIsPolishing(true);
    try {
      const prompt = `You are an AWS Certified Solutions Architect and Principal Generative AI Engineer specializing in Amazon Bedrock Agents.
Harden, optimize, and structure the following instruction set for an Amazon Bedrock Agent named "${agentName}" using model "${foundationModel}".

Current draft instructions:
${instructions}

Knowledge Base: ${kbTopic}
Action Groups: ${actionGroups.map((a) => `${a.name} (${a.apiPath})`).join(', ')}

Please output a comprehensive, enterprise-grade system prompt with:
1. <role_and_objective> with unambiguous boundaries
2. <operational_mandates> step-by-step reasoning protocol
3. <tool_use_guidelines> when and how to call each Action Group and Knowledge Base
4. <guardrails_and_safety> edge-case handling, PII constraints, and refusal rules
5. <response_formatting> markdown standards, tables, and executive summary rules.`;

      const res = await generateAIContent({ prompt, temperature: 0.2 });
      if (res && res.text && res.text.trim().length > 50) {
        setInstructions(res.text.trim());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  // Run Simulator
  const handleRunSimulator = () => {
    setSimState('running');
    setSimTraces([]);
    setSimFinalResponse('');

    const traces = [
      {
        step: '1. PRE_PROCESSING',
        category: 'Guardrail & Intent Check',
        duration: '112ms',
        content: `Evaluated input against Guardrail "${guardrailName}".
• PII Redaction: 0 tokens masked.
• Content Filter: SAFE (Hate: 0.01, Violence: 0.00, Insults: 0.00).
• Intent Classification: Target domain mapped to [FINANCIAL_COMPLIANCE_INVESTIGATION].`
      },
      {
        step: '2. ORCHESTRATION',
        category: 'Model Reasoning & Planning',
        duration: '380ms',
        content: `<thinking>
The user is requesting an audit of account ACC-9921 and sanctions screening on "Vanguard Global Trade Ltd".
1. First, invoke TransactionAnalyticsService at /v1/transactions/{accountId}/velocity with accountId="ACC-9921".
2. Concurrently or sequentially, invoke SanctionsScreeningService with entityName="Vanguard Global Trade Ltd".
3. Check Knowledge Base for structuring thresholds and SAR filing triggers.
</thinking>
ACTION SELECTED: TransactionAnalyticsService -> GET /v1/transactions/ACC-9921/velocity`
      },
      {
        step: '3. ACTION_GROUP_INVOCATION',
        category: 'AWS Lambda Execution',
        duration: '240ms',
        content: `Invoked Lambda ARN: arn:aws:lambda:us-east-1:123456789012:function:TransactionAnalyticsLambda
Payload: {"accountId": "ACC-9921", "lookbackDays": 30}
Response: {"accountId": "ACC-9921", "volume30d": 1450000.00, "velocityAnomalyScore": 92.4, "structuringPatternDetected": true}`
      },
      {
        step: '4. KNOWLEDGE_BASE_LOOKUP',
        category: 'Vector RAG Query',
        duration: '195ms',
        content: `Search Query: "structuring transaction velocity threshold for mandatory SAR filing"
Embeddings: amazon.titan-embed-text-v2:0 (1024 dims)
Retrieved 2 Citations from s3://enterprise-aml-compliance-lake-prod/knowledge-base/BSA_Chapter_4_SAR_Triggers.pdf:
- "Passage 1 (Score 0.89): Transactions exceeding $10,000 in aggregate with velocity score > 85 require provisional hold and SAR generation within 30 days."`
      },
      {
        step: '5. ACTION_GROUP_INVOCATION (2)',
        category: 'AWS Lambda Execution',
        duration: '210ms',
        content: `Invoked SanctionsScreeningService -> POST /v1/compliance/screen-entity
Payload: {"entityName": "Vanguard Global Trade Ltd", "jurisdiction": "US"}
Response: {"matchFound": false, "riskTier": "MEDIUM", "pepAssociation": "Indirect Tier 2"}`
      },
      {
        step: '6. POST_PROCESSING',
        category: 'Output Synthesis & Guardrail Pass',
        duration: '290ms',
        content: `Contextual Grounding Score: 0.94 (Passed threshold 0.85).
Harmful Output Filter: SAFE.
Synthesizing final executive compliance briefing.`
      }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < traces.length) {
        setSimTraces((prev) => [...prev, traces[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setSimState('completed');
        setSimFinalResponse(`### 📋 Executive Financial Crime Investigation Report

**Target Account:** \`ACC-9921\`  
**Investigation Timestamp:** ${new Date().toISOString()}  
**Lead Agent:** \`${agentName}\` (Model: \`${foundationModel}\`)

---

#### 1. 🚨 Velocity & Transaction Anomaly Findings
- **30-Day Cumulative Volume:** **$1,450,000.00 USD** across 48 automated settlement batches.
- **Velocity Anomaly Score:** **92.4 / 100** *(Critical Threshold > 85.0 breached)*.
- **Structuring Detection:** Confirmed multiple sub-$10,000 threshold transactions indicating potential smurfing.

#### 2. 🔍 Watchlist & Sanctions Screening
- **Screened Counterparty:** *Vanguard Global Trade Ltd*
- **OFAC/PEP Result:** No direct match found; categorized as **MEDIUM risk** due to indirect Tier-2 political PEP linkage in jurisdictional filings.

#### 3. ⚖️ Regulatory Determination & Required Actions
Under **BSA Chapter 4 / FinCEN Advisory Guidelines**:
1. **Trigger Provisional Hold:** Initiating Return of Control (ROC) call to \`/v1/accounts/lock-provisional\` to safeguard remaining balance.
2. **Mandatory SAR Filing:** Escalating case dossier to Compliance Officer for filing Form 111 (SAR-DI) within 24 hours.`);
      }
    }, 600);
  };

  // Generate Code Output
  const generateArtifacts = () => {
    // 1. Python Boto3 Agent Creator
    const boto3Code = `"""
Amazon Bedrock AgentCore Provisioning & Invocation Script
Agent Name: ${agentName}
Model: ${foundationModel}
Generated by PromptOS MegaKit Bedrock AgentCore Studio
"""

import boto3
import json
import time

# Initialize AWS Clients
bedrock_agent = boto3.client('bedrock-agent', region_name='us-east-1')
bedrock_agent_runtime = boto3.client('bedrock-agent-runtime', region_name='us-east-1')

AGENT_NAME = "${agentName}"
FOUNDATION_MODEL = "${foundationModel}"
AGENT_ROLE_ARN = "arn:aws:iam::123456789012:role/service-role/AmazonBedrockExecutionRoleForAgents_${agentName}"
IDLE_TTL = ${idleSessionTTL}

INSTRUCTION_PROMPT = """${instructions.replace(/"""/g, '\\"\\"\\"')}"""

def create_or_update_bedrock_agent():
    print(f"[*] Provisioning Bedrock Agent: {AGENT_NAME}...")
    
    # 1. Create Base Agent
    agent_response = bedrock_agent.create_agent(
        agentName=AGENT_NAME,
        agentResourceRoleArn=AGENT_ROLE_ARN,
        foundationModel=FOUNDATION_MODEL,
        instruction=INSTRUCTION_PROMPT,
        description="${agentDescription.replace(/"/g, '\\"')}",
        idleSessionTTLInSeconds=IDLE_TTL,
        promptOverrideConfiguration={
            'promptConfigurations': [
                {
                    'promptType': 'ORCHESTRATION',
                    'promptCreationMode': 'DEFAULT',
                    'promptState': 'ENABLED'
                }
            ]
        }
    )
    agent_id = agent_response['agent']['agentId']
    print(f"[+] Agent Created Successfully! Agent ID: {agent_id}")

    # 2. Attach Action Groups
${actionGroups
  .map(
    (ag) => `    # Action Group: ${ag.name}
    print(f"[*] Attaching Action Group: ${ag.name}...")
    bedrock_agent.create_agent_action_group(
        agentId=agent_id,
        agentVersion='DRAFT',
        actionGroupName='${ag.name}',
        description='${ag.description.replace(/'/g, "\\'")}',
        actionGroupExecutor={
            ${
              ag.actionGroupType === 'LAMBDA'
                ? `'lambda': 'arn:aws:lambda:us-east-1:123456789012:function:${ag.name}Lambda'`
                : `'customControl': 'RETURN_CONTROL'`
            }
        },
        apiSchema={
            'payload': json.dumps(${JSON.stringify(
              {
                openapi: '3.0.0',
                info: { title: ag.name, version: '1.0.0' },
                paths: {
                  [ag.apiPath]: {
                    [ag.httpMethod.toLowerCase()]: {
                      summary: ag.description,
                      operationId: ag.name,
                      parameters: ag.parameters.map((p) => ({
                        name: p.name,
                        in: 'query',
                        required: p.required,
                        schema: { type: p.type }
                      }))
                    }
                  }
                }
              },
              null,
              2
            )})
        },
        actionGroupState='ENABLED'
    )`
  )
  .join('\n\n')}

    # 3. Associate Knowledge Base
    print(f"[*] Associating Knowledge Base: ${kbName}...")
    # bedrock_agent.associate_agent_knowledge_base(
    #     agentId=agent_id,
    #     agentVersion='DRAFT',
    #     knowledgeBaseId='KB1234567890',
    #     description='${kbTopic.replace(/'/g, "\\'")}',
    #     knowledgeBaseState='ENABLED'
    # )

    # 4. Prepare Agent (Compile DRAFT into executable runtime state)
    print("[*] Preparing Bedrock Agent runtime...")
    prepare_resp = bedrock_agent.prepare_agent(agentId=agent_id)
    time.sleep(3)
    
    # 5. Create Deployment Alias
    alias_resp = bedrock_agent.create_agent_alias(
        agentId=agent_id,
        agentAliasName='prod',
        description='Production Alias deployed via PromptOS MegaKit'
    )
    alias_id = alias_resp['agentAlias']['agentAliasId']
    print(f"[✔] Bedrock Agent Ready for Production! AgentId: {agent_id}, AliasId: {alias_id}")
    return agent_id, alias_id

def invoke_agent_streaming(agent_id, alias_id, session_id, user_prompt):
    print(f"\\n--- Invoking Agent ({agent_id}) with Prompt: '{user_prompt}' ---")
    response = bedrock_agent_runtime.invoke_agent(
        agentId=agent_id,
        agentAliasId=alias_id,
        sessionId=session_id,
        inputText=user_prompt,
        enableTrace=True
    )
    
    event_stream = response.get('completion')
    for event in event_stream:
        if 'chunk' in event:
            chunk = event['chunk']
            print(chunk['bytes'].decode('utf-8'), end='', flush=True)
        elif 'trace' in event:
            trace = event['trace']
            # Inspect orchestration and reasoning trace events
            if 'trace' in trace and 'orchestrationTrace' in trace['trace']:
                orch = trace['trace']['orchestrationTrace']
                if 'rationale' in orch:
                    print(f"\\n[TRACE RATIONALE]: {orch['rationale'].get('text', '')}")

if __name__ == '__main__':
    agent_id, alias_id = create_or_update_bedrock_agent()
    invoke_agent_streaming(
        agent_id=agent_id,
        alias_id=alias_id,
        session_id='session-dev-001',
        user_prompt='${simQuery.replace(/'/g, "\\'")}'
    )
`;

    // 2. AWS CDK TypeScript
    const cdkCode = `import * as cdk from 'aws-cdk-lib';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class BedrockAgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. IAM Role for Bedrock Agent
    const agentRole = new iam.Role(this, 'BedrockAgentRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      description: 'Execution role for Amazon Bedrock Agent: ${agentName}',
    });

    agentRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['bedrock:InvokeModel'],
        resources: [
          \`arn:aws:bedrock:\${this.region}::foundation-model/${foundationModel}\`,
        ],
      })
    );

    // 2. Lambda Action Group Handlers
${actionGroups
  .filter((ag) => ag.actionGroupType === 'LAMBDA')
  .map(
    (ag) => `    const ${ag.name}Function = new lambda.Function(this, '${ag.name}Function', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'index.lambda_handler',
      code: lambda.Code.fromInline(\`
def lambda_handler(event, context):
    print("Received Bedrock Event:", event)
    api_path = event.get('apiPath')
    return {
        'messageVersion': '1.0',
        'response': {
            'actionGroup': event.get('actionGroup'),
            'apiPath': api_path,
            'httpMethod': event.get('httpMethod'),
            'httpStatusCode': 200,
            'responseBody': {
                'application/json': {
                    'body': ${JSON.stringify(ag.mockResponse)}
                }
            }
        }
    }
      \`),
    });

    ${ag.name}Function.grantInvoke(new iam.ServicePrincipal('bedrock.amazonaws.com'));`
  )
  .join('\n\n')}

    // 3. Bedrock Agent Construct (L1 CfnAgent)
    const agent = new bedrock.CfnAgent(this, '${agentName}', {
      agentName: '${agentName}',
      foundationModel: '${foundationModel}',
      instruction: \`${instructions.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
      agentResourceRoleArn: agentRole.roleArn,
      description: '${agentDescription.replace(/'/g, "\\'")}',
      idleSessionTtlInSeconds: ${idleSessionTTL},
      actionGroups: [
${actionGroups
  .map(
    (ag) => `        {
          actionGroupName: '${ag.name}',
          description: '${ag.description.replace(/'/g, "\\'")}',
          ${
            ag.actionGroupType === 'LAMBDA'
              ? `actionGroupExecutor: { lambda: ${ag.name}Function.functionArn },`
              : `actionGroupExecutor: { customControl: 'RETURN_CONTROL' },`
          }
          apiSchema: {
            payload: JSON.stringify({
              openapi: '3.0.0',
              info: { title: '${ag.name}', version: '1.0.0' },
              paths: {
                '${ag.apiPath}': {
                  '${ag.httpMethod.toLowerCase()}': {
                    summary: '${ag.description}',
                    operationId: '${ag.name}',
                    parameters: ${JSON.stringify(
                      ag.parameters.map((p) => ({
                        name: p.name,
                        in: 'query',
                        required: p.required,
                        schema: { type: p.type }
                      }))
                    )}
                  }
                }
              }
            })
          },
          actionGroupState: 'ENABLED'
        }`
  )
  .join(',\n')}
      ],
    });

    // 4. Production Alias
    new bedrock.CfnAgentAlias(this, 'BedrockAgentAliasProd', {
      agentId: agent.attrAgentId,
      agentAliasName: 'production',
      description: 'Production alias deployed with CDK',
    });
  }
}`;

    // 3. Terraform HCL
    const terraformCode = `# Terraform Configuration for Amazon Bedrock Agent
# Provider requirements: aws >= 5.40.0

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}

variable "aws_region" {
  default = "us-east-1"
}

provider "aws" {
  region = var.aws_region
}

# IAM Role for Bedrock Agent
resource "aws_iam_role" "bedrock_agent_role" {
  name = "BedrockAgentExecutionRole_${agentName}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "bedrock.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "bedrock_agent_policy" {
  name = "BedrockAgentModelAccess"
  role = aws_iam_role.bedrock_agent_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["bedrock:InvokeModel"]
        Effect   = "Allow"
        Resource = "arn:aws:bedrock:\${var.aws_region}::foundation-model/${foundationModel}"
      }
    ]
  })
}

# Bedrock Agent Resource
resource "aws_bedrockagent_agent" "main_agent" {
  agent_name                  = "${agentName}"
  agent_resource_role_arn     = aws_iam_role.bedrock_agent_role.arn
  foundation_model            = "${foundationModel}"
  idle_session_ttl_in_seconds = ${idleSessionTTL}
  description                 = "${agentDescription.replace(/"/g, '\\"')}"
  instruction                 = <<-EOT
${instructions}
  EOT
}

# Action Groups
${actionGroups
  .map(
    (ag) => `resource "aws_bedrockagent_agent_action_group" "${ag.name.toLowerCase()}_ag" {
  action_group_name          = "${ag.name}"
  agent_id                   = aws_bedrockagent_agent.main_agent.id
  agent_version              = "DRAFT"
  description                = "${ag.description.replace(/"/g, '\\"')}"
  action_group_state         = "ENABLED"
  
  action_group_executor {
    ${ag.actionGroupType === 'LAMBDA' ? `lambda = "arn:aws:lambda:\${var.aws_region}:123456789012:function:${ag.name}Lambda"` : `custom_control = "RETURN_CONTROL"`}
  }

  api_schema {
    payload = jsonencode({
      openapi = "3.0.0"
      info = {
        title   = "${ag.name}"
        version = "1.0.0"
      }
      paths = {
        "${ag.apiPath}" = {
          "${ag.httpMethod.toLowerCase()}" = {
            summary     = "${ag.description}"
            operationId = "${ag.name}"
            parameters  = [
              ${ag.parameters.map((p) => `{ name = "${p.name}", in = "query", required = ${p.required}, schema = { type = "${p.type}" } }`).join(',\n              ')}
            ]
          }
        }
      }
    })
  }
}`
  )
  .join('\n\n')}

# Production Alias
resource "aws_bedrockagent_agent_alias" "prod_alias" {
  agent_alias_name = "production"
  agent_id         = aws_bedrockagent_agent.main_agent.id
  description      = "Deployed via PromptOS MegaKit"
}

output "agent_id" {
  value = aws_bedrockagent_agent.main_agent.id
}

output "agent_alias_id" {
  value = aws_bedrockagent_agent_alias.prod_alias.agent_alias_id
}
`;

    // 4. OpenAPI 3.0 Schema
    const openapiSchema = {
      openapi: '3.0.0',
      info: {
        title: `${agentName} Action Group APIs`,
        version: '1.0.0',
        description: agentDescription
      },
      paths: actionGroups.reduce((acc, ag) => {
        acc[ag.apiPath] = {
          [ag.httpMethod.toLowerCase()]: {
            summary: ag.description,
            operationId: ag.name,
            parameters: ag.parameters.map((p) => ({
              name: p.name,
              in: 'query',
              required: p.required,
              description: p.description,
              schema: { type: p.type }
            })),
            responses: {
              '200': {
                description: 'Successful invocation',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      example: JSON.parse(ag.mockResponse || '{}')
                    }
                  }
                }
              }
            }
          }
        };
        return acc;
      }, {} as Record<string, any>)
    };

    // 5. Python Lambda Handler
    const lambdaPyCode = `"""
AWS Lambda Action Group Handler for Amazon Bedrock Agent
Agent: ${agentName}
"""

import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Received Bedrock Agent Event: %s", json.dumps(event))
    
    action_group = event.get('actionGroup', '')
    api_path = event.get('apiPath', '')
    http_method = event.get('httpMethod', '')
    parameters = {p['name']: p['value'] for p in event.get('parameters', [])}
    request_body = event.get('requestBody', {}).get('content', {}).get('application/json', {}).get('properties', [])

    logger.info(f"Executing Action Group: {action_group} -> {http_method} {api_path}")

    # Route execution by Action Group / API Path
${actionGroups
  .map(
    (ag) => `    if api_path == "${ag.apiPath}":
        # Parameters available in: parameters dictionary
        response_data = ${ag.mockResponse}
        status_code = 200`
  )
  .join('\n    el')}
    else:
        response_data = {"error": f"Unhandled API path: {api_path}"}
        status_code = 404

    # Format response in Amazon Bedrock Agent protocol
    action_response = {
        'actionGroup': action_group,
        'apiPath': api_path,
        'httpMethod': http_method,
        'httpStatusCode': status_code,
        'responseBody': {
            'application/json': {
                'body': json.dumps(response_data)
            }
        }
    }

    return {
        'messageVersion': '1.0',
        'response': action_response
    }
`;

    // 6. CloudFormation YAML
    const cfYamlCode = `AWSTemplateFormatVersion: '2010-09-09'
Description: Amazon Bedrock AgentCore Stack for ${agentName}

Resources:
  BedrockAgentRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: BedrockAgentRole-${agentName}
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: bedrock.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: BedrockInvokeModelPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: bedrock:InvokeModel
                Resource: !Sub 'arn:aws:bedrock:\${AWS::Region}::foundation-model/${foundationModel}'

  BedrockAgent:
    Type: AWS::Bedrock::Agent
    Properties:
      AgentName: ${agentName}
      FoundationModel: ${foundationModel}
      Instruction: |
${instructions
  .split('\n')
  .map((l) => `        ${l}`)
  .join('\n')}
      AgentResourceRoleArn: !GetAtt BedrockAgentRole.Arn
      IdleSessionTTLInSeconds: ${idleSessionTTL}
      Description: ${agentDescription}

  BedrockAgentAlias:
    Type: AWS::Bedrock::AgentAlias
    Properties:
      AgentId: !GetAtt BedrockAgent.AgentId
      AgentAliasName: production
      Description: Production alias created by PromptOS MegaKit
`;

    return {
      boto3: boto3Code,
      cdk: cdkCode,
      terraform: terraformCode,
      openapi: JSON.stringify(openapiSchema, null, 2),
      lambda: lambdaPyCode,
      cloudformation: cfYamlCode
    };
  };

  const artifacts = generateArtifacts();

  const handleDownload = () => {
    const code = artifacts[iacFormat];
    const extensions: Record<string, string> = {
      boto3: 'py',
      cdk: 'ts',
      terraform: 'tf',
      openapi: 'json',
      lambda: 'py',
      cloudformation: 'yaml'
    };
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bedrock_agent_${agentName.toLowerCase()}.${extensions[iacFormat] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddActionGroup = () => {
    const newAg: ActionGroupItem = {
      id: `ag-${Date.now()}`,
      name: 'CustomServiceAPI',
      description: 'Executes enterprise business logic via custom Lambda or ROC',
      actionGroupType: 'LAMBDA',
      apiPath: `/v1/services/custom-action`,
      httpMethod: 'POST',
      parameters: [{ name: 'paramKey', type: 'string', description: 'Input parameter token', required: true }],
      mockResponse: '{"status": "SUCCESS", "executionTimestamp": "2026-08-29T16:30:00Z"}'
    };
    setActionGroups([...actionGroups, newAg]);
  };

  const handleRemoveActionGroup = (id: string) => {
    setActionGroups(actionGroups.filter((ag) => ag.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-orange-950/40 to-slate-950 text-white border border-orange-500/20 shadow-2xl overflow-hidden mb-8">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-4 opacity-10 pointer-events-none">
          <Cloud className="w-64 h-64 text-orange-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              AWS Bedrock AgentCore v2
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-semibold">
              Claude 3.7 & Nova Pro
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-semibold">
              OpenSearch RAG
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-semibold">
              Return-of-Control (ROC)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-semibold">
              CDK & Terraform IaC
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            Amazon Bedrock <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-red-400">AgentCore Generator</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed mb-6 font-medium">
            Architect, harden, and deploy production-grade autonomous Bedrock Agents. Includes full Boto3 SDK orchestrator pipelines, OpenAPI 3.0 Action Groups, OpenSearch Serverless Knowledge Bases, Return-of-Control (ROC) routing, Bedrock Guardrails, and 1-click CDK / Terraform infrastructure.
          </p>

          {/* Preset Selector Carousel */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-300 mb-2 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-orange-400" />
              Load Enterprise Industry Blueprint:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESET_BLUEPRINTS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-400 text-white shadow-lg shadow-orange-500/20 ring-1 ring-orange-400/50'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-xs font-bold truncate text-white">{preset.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-orange-300 font-semibold">{preset.tag}</span>
                      <span>{preset.actionGroups.length} Action Groups</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 border-b border-slate-200">
        {[
          { id: 'agent-architect', label: '1. Agent Architect', icon: Cpu },
          { id: 'action-groups', label: '2. Action Groups (OpenAPI/Lambda)', icon: Code2 },
          { id: 'knowledge-base', label: '3. Knowledge Base (RAG)', icon: Database },
          { id: 'guardrails', label: '4. Bedrock Guardrails', icon: Shield },
          { id: 'iac-deploy', label: '5. IaC Exporter (Boto3 / CDK / TF)', icon: FileCode },
          { id: 'trace-simulator', label: '6. Live Trace Simulator', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStudioTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStudioTab(tab.id as StudioTabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Agent Architect */}
      {activeStudioTab === 'agent-architect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            {/* General Properties */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-500" />
                Bedrock Agent Identity & Foundation Model
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Agent Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Foundation Model</label>
                  <select
                    value={foundationModel}
                    onChange={(e) => setFoundationModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-orange-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="anthropic.claude-3-7-sonnet-20250219-v1:0">Anthropic Claude 3.7 Sonnet (Hybrid Reasoning)</option>
                    <option value="anthropic.claude-3-5-sonnet-20241022-v2:0">Anthropic Claude 3.5 Sonnet v2 (Recommended)</option>
                    <option value="anthropic.claude-3-5-haiku-20241022-v1:0">Anthropic Claude 3.5 Haiku (High Velocity)</option>
                    <option value="amazon.nova-pro-v1:0">Amazon Nova Pro (Multimodal & Fast)</option>
                    <option value="amazon.nova-lite-v1:0">Amazon Nova Lite (Ultra Low Cost)</option>
                    <option value="meta.llama3-3-70b-instruct-v1:0">Meta Llama 3.3 70B Instruct</option>
                    <option value="mistral.mistral-large-2407-v1:0">Mistral Large 2 (128k context)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Agent Functional Purpose & Description</label>
                <input
                  type="text"
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Idle Session TTL (seconds)</label>
                  <input
                    type="number"
                    value={idleSessionTTL}
                    onChange={(e) => setIdleSessionTTL(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-orange-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Default: 1800s (30 minutes session memory lifetime)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Memory Retention Window</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="memCheck"
                      checked={enableMemory}
                      onChange={(e) => setEnableMemory(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="memCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Enable Multi-Turn Memory ({memoryWindowDays} days)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Set */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-orange-500" />
                    Agent Orchestration Instructions & Prompts
                  </h3>
                  <p className="text-[11px] text-slate-500">Defines the reasoning chain, operational guardrails, and tool dispatch logic</p>
                </div>

                <button
                  onClick={handleAIOptimizeInstructions}
                  disabled={isPolishing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 transition-colors disabled:opacity-50"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isPolishing ? 'animate-spin' : ''}`} />
                  <span>{isPolishing ? 'Optimizing...' : 'AI Auto-Harden'}</span>
                </button>
              </div>

              <textarea
                rows={12}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Summary Specs */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Bedrock Runtime Topology</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold">AWS SDK v2</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Agent Name:</span>
                  <span className="font-mono text-white font-bold">{agentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Model ARN:</span>
                  <span className="font-mono text-amber-300 font-semibold truncate max-w-[200px]">{foundationModel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Action Groups Attached:</span>
                  <span className="font-bold text-white">{actionGroups.length} Groups</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Knowledge Base RAG:</span>
                  <span className="font-bold text-emerald-400">{vectorStoreType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Guardrails Filter:</span>
                  <span className="font-bold text-red-400">{contentFilterLevel} Level + PII</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveStudioTab('trace-simulator')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Launch Live Trace Simulator</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2.5">
              <h4 className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-600" />
                Bedrock AgentCore Architecture Tips
              </h4>
              <ul className="text-[11px] text-orange-800/90 space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
                <li>Use explicit XML tags like <code className="bg-orange-100 px-1 py-0.5 rounded font-mono">&lt;thinking&gt;</code> in instructions to force transparent step-by-step reasoning.</li>
                <li>Assign distinct Action Groups for read operations vs. mutating operations (use Return of Control for financial/destructive actions).</li>
                <li>Set prompt overrides on Orchestration and Pre-Processing to enforce corporate response formatting standards.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Action Groups */}
      {activeStudioTab === 'action-groups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-orange-500" />
                Action Groups & Tool Executions
              </h3>
              <p className="text-xs text-slate-500">Defines the OpenAPI 3.0 schema endpoints and Lambda / Return of Control (ROC) actions</p>
            </div>

            <button
              onClick={handleAddActionGroup}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Action Group</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {actionGroups.map((ag, index) => (
              <div key={ag.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={ag.name}
                      onChange={(e) => {
                        const updated = [...actionGroups];
                        updated[index].name = e.target.value;
                        setActionGroups(updated);
                      }}
                      className="text-sm font-bold text-slate-900 border-b border-dashed border-slate-300 focus:border-orange-500 focus:outline-none px-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={ag.actionGroupType}
                      onChange={(e) => {
                        const updated = [...actionGroups];
                        updated[index].actionGroupType = e.target.value as 'LAMBDA' | 'RETURN_OF_CONTROL';
                        setActionGroups(updated);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                        ag.actionGroupType === 'LAMBDA'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      <option value="LAMBDA">AWS Lambda Executor</option>
                      <option value="RETURN_OF_CONTROL">Return of Control (ROC)</option>
                    </select>

                    <button
                      onClick={() => handleRemoveActionGroup(ag.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Action Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">HTTP Method & API Path</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={ag.httpMethod}
                        onChange={(e) => {
                          const updated = [...actionGroups];
                          updated[index].httpMethod = e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE';
                          setActionGroups(updated);
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                      <input
                        type="text"
                        value={ag.apiPath}
                        onChange={(e) => {
                          const updated = [...actionGroups];
                          updated[index].apiPath = e.target.value;
                          setActionGroups(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-8">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">API Operation Description</label>
                    <input
                      type="text"
                      value={ag.description}
                      onChange={(e) => {
                        const updated = [...actionGroups];
                        updated[index].description = e.target.value;
                        setActionGroups(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Parameters list */}
                <div>
                  <div className="text-[11px] font-bold text-slate-700 mb-2">Input Parameters (OpenAPI Schema):</div>
                  <div className="space-y-2">
                    {ag.parameters.map((param, pIdx) => (
                      <div key={pIdx} className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                        <span className="font-mono font-bold text-slate-800">{param.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-600 font-mono">
                          {param.type}
                        </span>
                        <span className="text-slate-500 text-[11px] flex-1">{param.description}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            param.required ? 'bg-red-50 text-red-600' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {param.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock Response Payload */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Sample Response Payload (application/json)</label>
                  <textarea
                    rows={2}
                    value={ag.mockResponse}
                    onChange={(e) => {
                      const updated = [...actionGroups];
                      updated[index].mockResponse = e.target.value;
                      setActionGroups(updated);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Knowledge Base (RAG) */}
      {activeStudioTab === 'knowledge-base' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-500" />
                Bedrock Knowledge Base & Vector Store Setup
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Knowledge Base Name</label>
                  <input
                    type="text"
                    value={kbName}
                    onChange={(e) => setKbName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Vector Store Provider</label>
                  <select
                    value={vectorStoreType}
                    onChange={(e) => setVectorStoreType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-orange-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="OPENSEARCH_SERVERLESS">Amazon OpenSearch Serverless (Serverless Vector Index)</option>
                    <option value="AURORA_POSTGRES">Amazon Aurora PostgreSQL (pgvector extension)</option>
                    <option value="PINECONE">Pinecone Serverless</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">S3 Data Lake Source URI</label>
                <input
                  type="text"
                  value={kbS3Uri}
                  onChange={(e) => setKbS3Uri(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Domain Topics & Content Scope</label>
                <textarea
                  rows={3}
                  value={kbTopic}
                  onChange={(e) => setKbTopic(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Embedding Model</label>
                  <select
                    value={embeddingModel}
                    onChange={(e) => setEmbeddingModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="amazon.titan-embed-text-v2:0">Titan Text Embeddings v2 (1024-dim)</option>
                    <option value="cohere.embed-english-v3">Cohere Embed English v3</option>
                    <option value="cohere.embed-multilingual-v3">Cohere Embed Multilingual v3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Chunking Strategy</label>
                  <select
                    value={chunkingStrategy}
                    onChange={(e) => setChunkingStrategy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="HIERARCHICAL">Hierarchical (Parent-Child Chunks)</option>
                    <option value="SEMANTIC">Semantic Chunking (Topic Splitting)</option>
                    <option value="FIXED_SIZE">Fixed-Size (300 tokens, 20% overlap)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Query Type</label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="HYBRID">Hybrid (Vector + BM25 Lexical)</option>
                    <option value="SEMANTIC">Semantic (Dense Vector only)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                RAG Ingestion Pipeline Checklist
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>S3 Sync Trigger EventBridge Rule</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Hierarchical Token Chunking parser</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Titan Embeddings v2 Ingestion job</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>OpenSearch Serverless AOSS Collection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Guardrails */}
      {activeStudioTab === 'guardrails' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500" />
                Bedrock Guardrail Safety & Compliance Policies
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Guardrail Identifier</label>
                <input
                  type="text"
                  value={guardrailName}
                  onChange={(e) => setGuardrailName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Denied Topics & Boundary Triggers</label>
                <textarea
                  rows={3}
                  value={deniedTopics}
                  onChange={(e) => setDeniedTopics(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* PII Redaction Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Automated PII Redaction Entities</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'US_SOCIAL_SECURITY_NUMBER',
                    'CREDIT_DEBIT_CARD_NUMBER',
                    'EMAIL',
                    'NAME',
                    'PHONE',
                    'US_BANK_ACCOUNT_NUMBER',
                    'US_PASSPORT_NUMBER',
                    'IP_ADDRESS',
                    'DRIVER_ID'
                  ].map((pii) => {
                    const isSelected = piiEntities.includes(pii);
                    return (
                      <button
                        key={pii}
                        onClick={() => {
                          if (isSelected) setPiiEntities(piiEntities.filter((p) => p !== pii));
                          else setPiiEntities([...piiEntities, pii]);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {pii}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contextual Grounding & Content Filtering */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Content Filtering Rigor</label>
                  <select
                    value={contentFilterLevel}
                    onChange={(e) => setContentFilterLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="HIGH">HIGH (Strict Enterprise Zero-Tolerance)</option>
                    <option value="MEDIUM">MEDIUM (Balanced Standard)</option>
                    <option value="LOW">LOW (Permissive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contextual Grounding Threshold ({groundingThreshold})
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.05"
                    value={groundingThreshold}
                    onChange={(e) => setGroundingThreshold(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Detects and rejects ungrounded hallucinations against the Knowledge Base
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200 space-y-2.5">
              <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Zero-Trust Compliance Rules
              </h4>
              <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                Bedrock Guardrails evaluate input prompts <strong>pre-execution</strong> and agent answers <strong>post-execution</strong>. Any attempt to query denied topics triggers an immediate standard refusal response without invoking downstream Lambdas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: IaC Exporter */}
      {activeStudioTab === 'iac-deploy' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'boto3', label: 'Python (Boto3 SDK)' },
                { id: 'cdk', label: 'AWS CDK (TypeScript)' },
                { id: 'terraform', label: 'Terraform (HCL)' },
                { id: 'cloudformation', label: 'CloudFormation (YAML)' },
                { id: 'openapi', label: 'OpenAPI 3.0 Schema' },
                { id: 'lambda', label: 'Lambda Handler (Py)' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setIacFormat(fmt.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    iacFormat === fmt.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onCopy(artifacts[iacFormat], `${agentName} - ${iacFormat.toUpperCase()}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Download File</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto shadow-2xl border border-slate-800 max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre">{artifacts[iacFormat]}</pre>
          </div>
        </div>
      )}

      {/* Tab 6: Live Trace Simulator */}
      {activeStudioTab === 'trace-simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-500" />
                Agent Invocation Test Console
              </h3>
              <p className="text-xs text-slate-500">Simulate a multi-turn prompt and inspect raw Bedrock reasoning traces</p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">User Prompt Query</label>
                <textarea
                  rows={4}
                  value={simQuery}
                  onChange={(e) => setSimQuery(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleRunSimulator}
                disabled={simState === 'running'}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all"
              >
                {simState === 'running' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Bedrock Reasoning Chain...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Invoke Agent ({agentName})</span>
                  </>
                )}
              </button>
            </div>

            {/* Final Formatted Response */}
            {simFinalResponse && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Agent Final Synthesized Response
                  </span>
                  <button
                    onClick={() => onCopy(simFinalResponse, 'Agent Response')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Copy Answer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
                  {simFinalResponse}
                </div>
              </div>
            )}
          </div>

          {/* Trace Feed */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl text-white space-y-3 min-h-[400px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-200">Bedrock Agent Trace Telemetry</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Model: {foundationModel}</span>
              </div>

              {simTraces.length === 0 && simState === 'idle' && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Click "Invoke Agent" to observe real-time orchestration traces, RAG lookups, and Lambda dispatches.</p>
                </div>
              )}

              <div className="space-y-3">
                {simTraces.map((trace, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-orange-400">{trace.step}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {trace.category}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">{trace.duration}</span>
                      </div>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {trace.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
