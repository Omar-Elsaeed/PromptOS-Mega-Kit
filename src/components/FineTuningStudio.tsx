import React, { useState } from 'react';
import { Cpu, Copy, Check, Download, Layers, Sparkles, Terminal, FileCode, CheckCircle2, Loader2, Bot, RefreshCw } from 'lucide-react';
import { generateAIContent } from '../utils/api';

interface FineTuningStudioProps {
  onCopy: (text: string, title: string) => void;
}

type FTTabType = 'dataset-builder' | 'dpo-pairs' | 'training-config' | 'lora-script' | 'eval-benchmark';

export const FineTuningStudio: React.FC<FineTuningStudioProps> = ({ onCopy }) => {
  const [activeTab, setActiveTab] = useState<FTTabType>('dataset-builder');

  // Form states
  const [dsDomain, setDsDomain] = useState('Medical Clinical Summary Extraction');
  const [dsFormat, setDsFormat] = useState('ChatML / OpenAI JSONL');
  const [dsCount, setDsCount] = useState(100);

  const [dpoDomain, setDpoDomain] = useState('Technical Code Reviewer');
  const [dpoCriteria, setDpoCriteria] = useState('Strict security-first focus over brevity');

  const [tcBaseModel, setTcBaseModel] = useState('unsloth/Llama-3.3-70B-Instruct');
  const [tcBatchSize, setTcBatchSize] = useState(4);
  const [tcLr, setTcLr] = useState('2e-4');
  const [tcRank, setTcRank] = useState(16);

  const [customDataset, setCustomDataset] = useState<string | null>(null);
  const [customDpo, setCustomDpo] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSynthesizeDataset = async () => {
    setIsSynthesizing(true);
    try {
      if (activeTab === 'dataset-builder') {
        const prompt = `Generate 5 realistic, high-quality, diverse synthetic training samples in ChatML / OpenAI JSONL format for fine-tuning an LLM on this specific domain:
Domain Specialty: ${dsDomain}
Target Format: ${dsFormat}

Format strictly as 5 valid JSONL lines, one valid JSON object per line with "messages" array containing system, user, and assistant turns. Do not include markdown code block backticks.`;

        const res = await generateAIContent({
          prompt,
          systemInstruction: 'You are an AI dataset engineering specialist. Output valid JSONL training pairs with no extraneous text.',
          temperature: 0.7,
        });

        if (res.text?.trim()) {
          // Strip any accidental backticks
          const cleaned = res.text.replace(/```jsonl?/g, '').replace(/```/g, '').trim();
          setCustomDataset(cleaned);
        }
      } else if (activeTab === 'dpo-pairs') {
        const prompt = `Generate 3 high-quality Direct Preference Optimization (DPO) preference pairs for fine-tuning an alignment model on:
Task/Domain: ${dpoDomain}
Ranking Criteria: ${dpoCriteria}

Format strictly as 3 valid JSONL lines, one valid JSON object per line with {"prompt": "...", "chosen": "...", "rejected": "..."}. Do not include markdown code block backticks.`;

        const res = await generateAIContent({
          prompt,
          systemInstruction: 'You are an AI alignment engineer specializing in DPO datasets. Output strict JSONL preference pairs.',
          temperature: 0.7,
        });

        if (res.text?.trim()) {
          const cleaned = res.text.replace(/```jsonl?/g, '').replace(/```/g, '').trim();
          setCustomDpo(cleaned);
        }
      }
    } catch (e) {
      console.error('Failed to synthesize dataset:', e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const generateOutput = (): { content: string; filename: string; language: string } => {
    if (activeTab === 'dataset-builder') {
      if (customDataset) {
        return {
          filename: 'dataset_training_synthetic.jsonl',
          language: 'json',
          content: customDataset,
        };
      }
      return {
        filename: 'dataset_training.jsonl',
        language: 'json',
        content: `{"messages": [{"role": "system", "content": "You are a clinical diagnostic summary specialist for ${dsDomain}."}, {"role": "user", "content": "Patient 45yo male presenting with acute retrosternal chest pain radiating to left shoulder."}, {"role": "assistant", "content": "1. Working Diagnosis: Acute Coronary Syndrome (ACS).\\n2. Triage Urgency: Level 1 - Immediate.\\n3. Key Actions: Immediate 12-lead ECG, troponin I/T assay, aspirin 325mg chewable, continuous cardiac monitoring."}]}
{"messages": [{"role": "system", "content": "You are a clinical diagnostic summary specialist for ${dsDomain}."}, {"role": "user", "content": "Type 2 diabetic patient with HbA1c 9.4% and peripheral neuropathy signs."}, {"role": "assistant", "content": "1. Working Diagnosis: Uncontrolled T2D with diabetic polyneuropathy.\\n2. Triage Urgency: Urgent outpatient follow-up.\\n3. Key Actions: Endocrine consultation, semaglutide/SGLT2i escalation evaluation, monofilament sensory testing."}]}`
      };
    }

    if (activeTab === 'dpo-pairs') {
      if (customDpo) {
        return {
          filename: 'dpo_preference_pairs_synthetic.jsonl',
          language: 'json',
          content: customDpo,
        };
      }
      return {
        filename: 'dpo_preference_pairs.jsonl',
        language: 'json',
        content: `{"prompt": "Review this SQL query for vulnerabilities: SELECT * FROM users WHERE username = '\" + input + \"'", "chosen": "CRITICAL VULNERABILITY: SQL Injection (CWE-89).\\nRisk: User input is directly concatenated into the SQL statement, allowing arbitrary database commands.\\nFix: Use parameterized queries with prepared statements:\\n\`\`\`python\\ncursor.execute('SELECT * FROM users WHERE username = %s', (input,))\\n\`\`\`", "rejected": "This query looks fine for a simple app, but you might want to sanitize the input if you have time."}
{"prompt": "Should we store API keys in frontend environment variables with VITE_ prefix?", "chosen": "CRITICAL RISK: Any key with VITE_ prefix is bundled into client JavaScript and publicly extractable via DevTools. All secret keys must remain server-side in backend API proxies.", "rejected": "Yes, putting VITE_MY_KEY in .env makes it easy to access across your React components."}`
      };
    }

    if (activeTab === 'training-config') {
      return {
        filename: 'training_config.yaml',
        language: 'yaml',
        content: `# LoRA & QLoRA Supervised Fine-Tuning Configuration
model_name_or_path: "${tcBaseModel}"
output_dir: "./fine_tuned_checkpoint"
dataset_path: "./dataset_training.jsonl"

# Hyperparameters
learning_rate: ${tcLr}
per_device_train_batch_size: ${tcBatchSize}
gradient_accumulation_steps: 4
num_train_epochs: 3
warmup_ratio: 0.05
lr_scheduler_type: "cosine"
weight_decay: 0.01

# LoRA Adapters
lora_r: ${tcRank}
lora_alpha: ${tcRank * 2}
lora_dropout: 0.05
target_modules:
  - q_proj
  - k_proj
  - v_proj
  - o_proj
  - gate_proj
  - up_proj
  - down_proj

# Optimization
fp16: false
bf16: true
`
      };
    }

    if (activeTab === 'lora-script') {
      return {
        filename: 'unsloth_train.py',
        language: 'python',
        content: `# Fast Fine-Tuning with Unsloth (2-5x Faster, 70% Less VRAM)

import torch
from unsloth import FastLanguageModel
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments

max_seq_length = 2048
dtype = None # Auto-detect Float16 / Bfloat16
load_in_4bit = True # Enable 4-bit QLoRA quantization

# 1. Load Model & Tokenizer
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="${tcBaseModel}",
    max_seq_length=max_seq_length,
    dtype=dtype,
    load_in_4bit=load_in_4bit,
)

# 2. Add LoRA Adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=${tcRank},
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=${tcRank * 2},
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
)

# 3. Format Dataset
dataset = load_dataset("json", data_files="dataset_training.jsonl", split="train")

# 4. Training Arguments
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="messages",
    max_seq_length=max_seq_length,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=${tcBatchSize},
        gradient_accumulation_steps=4,
        warmup_steps=10,
        max_steps=100,
        learning_rate=${tcLr},
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir="lora_output",
    ),
)

if __name__ == "__main__":
    print("Starting Fine-Tuning with Unsloth...")
    trainer_stats = trainer.train()
    print("Training finished! Saving LoRA weights...")
    model.save_pretrained_merged("finetuned_model_merged", tokenizer, save_method="merged_16bit")
`
      };
    }

    // Benchmark
    return {
      filename: 'eval_benchmark.py',
      language: 'python',
      content: `# Post-Training Benchmark & Perplexity Evaluation

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from datasets import load_dataset

device = "cuda" if torch.cuda.is_available() else "cpu"
model_path = "./finetuned_model_merged"

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.bfloat16).to(device)

def run_perplexity_eval():
    test_data = load_dataset("json", data_files="test_split.jsonl")["train"]
    total_loss = 0
    with torch.no_grad():
        for item in test_data[:50]:
            inputs = tokenizer(item["text"], return_tensors="pt").to(device)
            outputs = model(**inputs, labels=inputs["input_ids"])
            total_loss += outputs.loss.item()
    ppl = torch.exp(torch.tensor(total_loss / 50))
    print(f"Post-Fine-Tuning Perplexity: {ppl.item():.2f}")

if __name__ == "__main__":
    run_perplexity_eval()
`
    };
  };

  const { content, filename, language } = generateOutput();

  const handleCopy = () => {
    onCopy(content, filename);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'dataset-builder', label: '📊 JSONL Dataset Builder' },
    { id: 'dpo-pairs', label: '⚖️ DPO Preference Pairs' },
    { id: 'training-config', label: '⚙️ LoRA YAML Config' },
    { id: 'lora-script', label: '🚀 Unsloth Training Script' },
    { id: 'eval-benchmark', label: '📈 Benchmark & Perplexity' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 mb-3 shadow-2xs">
          <Cpu className="w-3.5 h-3.5 text-orange-500" />
          <span>⚡ Fine-Tuning & Distillation Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Supervised Fine-Tuning (SFT), DPO &{' '}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            LoRA Pipeline
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Generate production-grade JSONL datasets, DPO pairs, and GPU-accelerated Unsloth training scripts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FTTabType)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Dataset & Model Configuration</span>
            </h3>

            {activeTab === 'dataset-builder' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Domain Specialty</label>
                  <input
                    type="text"
                    value={dsDomain}
                    onChange={(e) => setDsDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Format</label>
                  <select
                    value={dsFormat}
                    onChange={(e) => setDsFormat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="ChatML / OpenAI JSONL">ChatML / OpenAI JSONL</option>
                    <option value="Alpaca Instruction">Alpaca Instruction Format</option>
                    <option value="Llama 3 Header Syntax">Llama 3 Header Syntax</option>
                  </select>
                </div>

                <button
                  onClick={handleSynthesizeDataset}
                  disabled={isSynthesizing || !dsDomain.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isSynthesizing ? 'Synthesizing 5 Samples with AI...' : '✨ Synthesize 5 Samples with Gemini'}</span>
                </button>
              </div>
            )}

            {(activeTab === 'training-config' || activeTab === 'lora-script') && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Model Checkpoint</label>
                  <input
                    type="text"
                    value={tcBaseModel}
                    onChange={(e) => setTcBaseModel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">LoRA Rank</label>
                    <input
                      type="number"
                      value={tcRank}
                      onChange={(e) => setTcRank(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Batch Size</label>
                    <input
                      type="number"
                      value={tcBatchSize}
                      onChange={(e) => setTcBatchSize(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Learning Rate</label>
                    <input
                      type="text"
                      value={tcLr}
                      onChange={(e) => setTcLr(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dpo-pairs' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preference Task</label>
                  <input
                    type="text"
                    value={dpoDomain}
                    onChange={(e) => setDpoDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ranking Criteria</label>
                  <input
                    type="text"
                    value={dpoCriteria}
                    onChange={(e) => setDpoCriteria(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  onClick={handleSynthesizeDataset}
                  disabled={isSynthesizing || !dpoDomain.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isSynthesizing ? 'Synthesizing DPO Pairs...' : '✨ Synthesize DPO Pairs with Gemini'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-[#0c0d12] overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2 font-medium">{filename}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="p-4 font-mono text-xs text-orange-200/90 leading-relaxed overflow-x-auto max-h-[480px] overflow-y-auto whitespace-pre">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
