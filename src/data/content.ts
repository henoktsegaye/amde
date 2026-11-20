// ─── Block types ──────────────────────────────────────────────────────────────

export interface TextBlock { type: 'text'; body: string }
export interface CalloutBlock { type: 'callout'; body: string }
export interface CodeBlock { type: 'code'; lang: string; body: string }
export interface StepsBlock {
  type: 'steps'
  items: { title: string; body: string }[]
}
export interface CompareBlock {
  type: 'compare'
  left: { title: string; points: string[] }
  right: { title: string; points: string[] }
}
export type Block = TextBlock | CalloutBlock | CodeBlock | StepsBlock | CompareBlock

// ─── Content types ────────────────────────────────────────────────────────────

export interface Screen { title: string; blocks: Block[] }
export interface Lesson { id: string; title: string; minutes: number; screens: Screen[] }

export type QuestionType = 'mc' | 'tf'
export interface MCQuestion { id: string; type: 'mc'; prompt: string; options: string[]; answer: number; explanation: string }
export interface TFQuestion { id: string; type: 'tf'; prompt: string; answer: boolean; explanation: string }
export type Question = MCQuestion | TFQuestion

export interface Quiz { id: string; questions: Question[] }
export interface Section { id: string; title: string; lessons: Lesson[]; quiz: Quiz }
export interface Node { id: string; title: string; prereqs: string[]; sections: Section[] }
export interface Subject { id: string; title: string; accent: string; tint: string; description: string; nodes: Node[] }

// ─── AI Engineering content ───────────────────────────────────────────────────
// Topology mirrors the roadmap.sh/ai-engineer path.

export const aiEngineering: Subject = {
  id: 'ai-engineering',
  title: 'AI Engineering',
  accent: '#6A5AE0',
  tint: 'rgba(106,90,224,0.12)',
  description: 'Build production AI systems — from LLM fundamentals to RAG, agents, fine-tuning, and deployment.',
  nodes: [
    // ══════════════════════════════════════════════════════════════════════════
    // NODE 1: LLM Foundations
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 'foundations',
      title: 'LLM Foundations',
      prereqs: [],
      sections: [
        // ── Section 1: What are LLMs ──────────────────────────────────────────
        {
          id: 'llm-basics',
          title: 'What are LLMs',
          lessons: [
            {
              id: 'prediction-machine',
              title: 'The prediction machine',
              minutes: 4,
              screens: [
                {
                  title: 'One token at a time',
                  blocks: [
                    { type: 'text', body: 'A large language model generates text by predicting the next most-likely token given everything that came before it. That\'s the whole trick — applied billions of times.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Tokenize input', body: 'Your text is split into tokens — roughly 0.75 words each.' },
                        { title: 'Compute probabilities', body: 'The model outputs a probability for every token in its vocabulary (~100k entries).' },
                        { title: 'Sample next token', body: 'One token is chosen, often by weighted random sampling (temperature controls randomness).' },
                        { title: 'Append and repeat', body: 'The new token is added to the context, and the loop runs again.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Scale changes everything',
                  blocks: [
                    { type: 'text', body: 'LLM capability doesn\'t scale linearly — it jumps non-linearly as parameter count and training data grow. Emergent abilities (arithmetic, translation, reasoning) appear at thresholds that couldn\'t be predicted from smaller models.' },
                    {
                      type: 'compare',
                      left: { title: 'GPT-2 (2019)', points: ['1.5 B parameters', 'WebText (~40 GB)', 'Coherent paragraphs', 'No instruction following'] },
                      right: { title: 'GPT-4 (2023)', points: ['~1 T parameters (est.)', 'Trillions of tokens', 'Passes bar exam (90th %ile)', 'Follows complex instructions'] },
                    },
                  ],
                },
                {
                  title: 'What LLMs actually know',
                  blocks: [
                    { type: 'callout', body: 'LLMs don\'t look things up — they compress statistical patterns from training data into weights. Knowledge is baked in at training time.' },
                    { type: 'text', body: 'This means they\'re confidently wrong about recent events, niche facts, and anything outside training. The fix is retrieval (RAG) — giving the model relevant documents at query time rather than relying on memorised facts.' },
                  ],
                },
              ],
            },
            {
              id: 'tokens-context',
              title: 'Tokens & context',
              minutes: 5,
              screens: [
                {
                  title: 'Text is not characters',
                  blocks: [
                    { type: 'text', body: 'Models never see raw text. The first step is always tokenization — splitting text into sub-word units that balance vocabulary size against rare-word coverage.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Tokenize', body: 'BPE or SentencePiece splits text into tokens (avg ~0.75 words). "unhappiness" → ["un", "happiness"].' },
                        { title: 'Map to IDs', body: 'Each token gets a unique integer from the vocabulary (e.g., "happiness" → 23481).' },
                        { title: 'Embed', body: 'Each ID looks up a learned vector (e.g., 4096 dimensions) from the embedding matrix.' },
                        { title: 'Process', body: 'The transformer stack processes these vectors through attention layers.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'The context window',
                  blocks: [
                    { type: 'text', body: 'The context window is the total number of tokens the model can see at once — both input (prompt) and output (completion) count toward the limit.' },
                    {
                      type: 'compare',
                      left: { title: 'GPT-3.5', points: ['4 096 tokens', '~3 000 words', 'Fits a short article', 'Loses early context first'] },
                      right: { title: 'Claude 3 Opus', points: ['200 000 tokens', '~150 000 words', 'Fits a full novel', 'Still loses middle context'] },
                    },
                  ],
                },
                {
                  title: 'Why token count matters',
                  blocks: [
                    { type: 'callout', body: 'Long contexts cost more, run slower, and suffer from "lost in the middle" — the model pays less attention to tokens in the middle of a long prompt.' },
                    { type: 'text', body: 'Count tokens before you send. The tiktoken library is the standard for OpenAI-compatible models.' },
                    { type: 'code', lang: 'python', body: 'import tiktoken\n\nenc = tiktoken.get_encoding("cl100k_base")\ntokens = enc.encode("Hello, world!")\nprint(len(tokens))  # → 4\nprint(tokens)       # → [9906, 11, 1917, 0]' },
                  ],
                },
              ],
            },
            {
              id: 'transformers-plain',
              title: 'Transformers in plain English',
              minutes: 6,
              screens: [
                {
                  title: 'Attention is all you need',
                  blocks: [
                    { type: 'text', body: 'Before transformers (2017), models processed tokens sequentially — RNNs forgot early context, CNNs had fixed receptive fields. The transformer solved both: every token looks at every other token simultaneously via self-attention.' },
                    { type: 'callout', body: '"Attention" means weighting how much each token should influence the representation of every other token. High weight = strong influence.' },
                  ],
                },
                {
                  title: 'How attention works',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Q, K, V projections', body: 'Each token creates three vectors: Query (what am I looking for?), Key (what do I contain?), Value (what should I return?).' },
                        { title: 'Attention scores', body: 'Dot-product every Q against every K, divide by √d_k to stabilise gradients.' },
                        { title: 'Softmax', body: 'Scores become probabilities — each token "attends" to others with weights summing to 1.' },
                        { title: 'Weighted sum', body: 'Multiply weights by Values and sum. This is the new representation for that token.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Layers of understanding',
                  blocks: [
                    { type: 'text', body: 'GPT-4 stacks ~96 transformer layers. Each layer refines the token representations, building from surface patterns to deep reasoning.' },
                    {
                      type: 'compare',
                      left: { title: 'Early layers (1–12)', points: ['Spelling & punctuation', 'Common n-grams', 'Part-of-speech', 'Named entities'] },
                      right: { title: 'Late layers (60+)', points: ['Factual recall', 'Multi-step reasoning', 'Code logic', 'Analogical inference'] },
                    },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'llm-basics-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'What does an LLM predict?', options: ['The next token', 'The next sentence', 'A database row', 'An image label'], answer: 0, explanation: 'LLMs generate one token at a time — the probability distribution over the vocabulary at each step.' },
              { id: 'q2', type: 'tf', prompt: 'LLMs look answers up in a knowledge base at inference time.', answer: false, explanation: 'They generate from compressed statistical patterns in weights. Retrieval (RAG) is the separate technique that adds live lookups.' },
              { id: 'q3', type: 'mc', prompt: 'What is a context window?', options: ['All tokens the model can process at once', 'The model\'s training dataset', 'A cache of previous sessions', 'The GPU memory limit'], answer: 0, explanation: 'The context window is the total token budget (input + output) for a single call.' },
              { id: 'q4', type: 'mc', prompt: 'What mechanism lets every token attend to every other simultaneously?', options: ['Self-attention', 'Recurrence', 'Convolution', 'Pooling'], answer: 0, explanation: 'Self-attention computes Q·K dot products for all token pairs in one parallelised pass.' },
              { id: 'q5', type: 'tf', prompt: 'Adding more transformer layers always increases context window size.', answer: false, explanation: 'Context window size is set by positional encoding design and memory, not layer count.' },
            ],
          },
        },

        // ── Section 2: Training & Fine-tuning ─────────────────────────────────
        {
          id: 'training',
          title: 'Training & Fine-tuning',
          lessons: [
            {
              id: 'pre-training',
              title: 'Pre-training',
              minutes: 5,
              screens: [
                {
                  title: 'Next-token prediction at scale',
                  blocks: [
                    { type: 'text', body: 'Pre-training is the first — and most expensive — phase. The model is trained on trillions of tokens of text from the web, books, and code with a single objective: predict the next token.' },
                    { type: 'callout', body: 'This simple objective forces the model to learn grammar, facts, reasoning, coding conventions, and much more — because all of it is useful for predicting text.' },
                  ],
                },
                {
                  title: 'What gets learned',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Layers 1–4 (syntactic)', body: 'Punctuation, spelling, common phrases, POS tags.' },
                        { title: 'Layers 5–12 (semantic)', body: 'Word relationships, factual associations, coreference.' },
                        { title: 'Layers 13–24 (reasoning)', body: 'Multi-step logic, analogy, code flow.' },
                        { title: 'Deep layers (60+)', body: 'Abstract concepts, complex instruction following.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'The cost of training',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Train from scratch (70B)', points: ['$5M+ compute', 'Weeks of GPU time', 'Petabytes of data', 'Requires ML research team'] },
                      right: { title: 'Fine-tune (7B)', points: ['< $1 000', 'Hours on a single GPU', 'Thousands of examples', 'One engineer, one weekend'] },
                    },
                    { type: 'text', body: 'For most applications, start from an open-weight base model (Llama, Mistral, Qwen) and fine-tune — don\'t pre-train.' },
                  ],
                },
              ],
            },
            {
              id: 'instruction-rlhf',
              title: 'Instruction tuning & RLHF',
              minutes: 5,
              screens: [
                {
                  title: 'Base model vs assistant',
                  blocks: [
                    { type: 'text', body: 'A base model just completes text. It has no concept of "being helpful", "refusing harm", or "following a format". That\'s learned in post-training.' },
                    {
                      type: 'compare',
                      left: { title: 'Base model', points: ['Completes any text', 'Ignores instructions', 'No safety guardrails', 'Rambles off-topic'] },
                      right: { title: 'Instruction-tuned', points: ['Follows directives', 'Respects format requests', 'Refuses harmful content', 'Stays on task'] },
                    },
                  ],
                },
                {
                  title: 'SFT + RLHF pipeline',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Supervised Fine-Tuning (SFT)', body: 'Train on (prompt, ideal-response) pairs written or curated by humans. Teaches the format of a helpful assistant.' },
                        { title: 'Reward model', body: 'Show human labellers pairs of responses; they pick the better one. Train a model to predict these preferences.' },
                        { title: 'RL with PPO', body: 'Use the reward model as a signal to push the policy (the LLM) toward higher-scoring responses via proximal policy optimisation.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'LoRA: fine-tuning on a budget',
                  blocks: [
                    { type: 'text', body: 'Full fine-tuning updates all parameters — prohibitively expensive for large models. LoRA (Low-Rank Adaptation) injects small trainable matrices into attention layers, updating only 0.1–1% of parameters with comparable results.' },
                    { type: 'code', lang: 'python', body: 'from peft import LoraConfig, get_peft_model\n\nconfig = LoraConfig(\n    r=16,              # rank of the update matrices\n    lora_alpha=32,     # scaling factor\n    target_modules=["q_proj", "v_proj"],\n    lora_dropout=0.05,\n    bias="none",\n    task_type="CAUSAL_LM",\n)\nmodel = get_peft_model(base_model, config)\nmodel.print_trainable_parameters()\n# trainable params: 4,194,304 / 7,241,732,096 → 0.058%' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'training-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'What is the training objective during pre-training?', options: ['Predict the next token', 'Classify sentiment', 'Rank search results', 'Compress images'], answer: 0, explanation: 'Next-token prediction (causal language modelling) is the universal pre-training objective for decoder-only LLMs.' },
              { id: 'q2', type: 'mc', prompt: 'Which step in RLHF uses human preference labels?', options: ['Training the reward model', 'Supervised Fine-Tuning', 'PPO optimisation', 'Tokenization'], answer: 0, explanation: 'Human labellers compare response pairs; these comparisons train the reward model.' },
              { id: 'q3', type: 'tf', prompt: 'LoRA updates all model weights during fine-tuning.', answer: false, explanation: 'LoRA adds low-rank matrices to specific layers, leaving original weights frozen.' },
              { id: 'q4', type: 'mc', prompt: 'Which technique best adapts a model to a specific writing style without full re-training?', options: ['LoRA fine-tuning', 'RAG', 'Lowering temperature', 'Increasing the context window'], answer: 0, explanation: 'LoRA bakes stylistic patterns into the weights. RAG injects facts at query time — it cannot change how the model writes.' },
              { id: 'q5', type: 'tf', prompt: 'SFT alone is sufficient to produce a safe, aligned assistant model.', answer: false, explanation: 'SFT teaches response format but does not reliably instil safety. RLHF (or DPO) is additionally needed to align the model with human preferences, including refusing harmful content.' },
            ],
          },
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // NODE 2: Prompt Engineering
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 'prompting',
      title: 'Prompt Engineering',
      prereqs: ['foundations'],
      sections: [
        {
          id: 'prompt-fundamentals',
          title: 'Prompt fundamentals',
          lessons: [
            {
              id: 'system-prompts',
              title: 'System prompts',
              minutes: 4,
              screens: [
                {
                  title: 'The two-message structure',
                  blocks: [
                    { type: 'text', body: 'Most LLM APIs separate the conversation into at least two roles: the system message (your instructions as the developer) and the user message (the end-user\'s input). The model treats system instructions with higher authority.' },
                    { type: 'code', lang: 'python', body: 'messages = [\n    {\n        "role": "system",\n        "content": "You are a concise technical assistant. "\n                   "Reply in plain English. No markdown."\n    },\n    {\n        "role": "user",\n        "content": "What is a transformer?"\n    }\n]' },
                  ],
                },
                {
                  title: 'What belongs in a system prompt',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Persona', body: 'Who the model is — tone, expertise level, communication style.' },
                        { title: 'Task scope', body: 'What it should and shouldn\'t help with.' },
                        { title: 'Output format', body: 'JSON, markdown, plain text, specific field names.' },
                        { title: 'Constraints', body: 'Length limits, language, what to do when unsure.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Prompt injection risk',
                  blocks: [
                    { type: 'callout', body: 'User input can attempt to override your system prompt ("Ignore previous instructions and…"). Never trust user input that claims to modify system-level behaviour.' },
                    { type: 'text', body: 'Mitigations: clearly separate system and user content, validate outputs against expected schemas, and use structured output (JSON mode) so jailbreaks can\'t produce prose.' },
                  ],
                },
              ],
            },
            {
              id: 'few-shot',
              title: 'Few-shot prompting',
              minutes: 4,
              screens: [
                {
                  title: 'In-context examples',
                  blocks: [
                    { type: 'text', body: 'Few-shot prompting gives the model 2–8 worked examples (input → output) before the actual query. The model infers the task format and style from the examples without any weight updates.' },
                    { type: 'code', lang: 'python', body: 'prompt = """\nClassify sentiment as positive or negative.\n\nText: I love this product!\nSentiment: positive\n\nText: The delivery was terrible.\nSentiment: negative\n\nText: {user_text}\nSentiment:"""' },
                  ],
                },
                {
                  title: 'What makes examples good',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Representative', body: 'Cover the range of inputs you expect, including edge cases.' },
                        { title: 'Correctly labelled', body: 'Wrong examples actively hurt — the model mimics them.' },
                        { title: 'Format-consistent', body: 'The model pattern-matches your format, so be exact.' },
                        { title: 'Ordered sensibly', body: 'Put most similar example last, closest to the query.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'When to use few-shot',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Use few-shot when…', points: ['Task format is unusual', 'Output schema is strict', 'Model keeps getting style wrong', 'Zero-shot accuracy is too low'] },
                      right: { title: 'Skip it when…', points: ['Examples eat context budget', 'Task is well-known (summarise, translate)', 'You have <10 good examples', 'Latency is critical'] },
                    },
                  ],
                },
              ],
            },
            {
              id: 'chain-of-thought',
              title: 'Chain of thought',
              minutes: 5,
              screens: [
                {
                  title: 'Reasoning before answering',
                  blocks: [
                    { type: 'text', body: 'Chain-of-thought (CoT) prompting asks the model to show its reasoning steps before giving a final answer. For multi-step tasks — maths, logic, planning — CoT substantially improves accuracy.' },
                    { type: 'callout', body: 'The simplest CoT trigger: append "Let\'s think step by step." to the prompt. This alone can double accuracy on arithmetic benchmarks.' },
                  ],
                },
                {
                  title: 'Zero-shot vs few-shot CoT',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Zero-shot CoT', points: ['"Think step by step"', 'No examples needed', 'Lower overhead', 'Works on GPT-4-class models'] },
                      right: { title: 'Few-shot CoT', points: ['Provide worked reasoning', 'More reliable', 'More tokens consumed', 'Better on weaker models'] },
                    },
                  ],
                },
                {
                  title: 'When CoT helps — and when it doesn\'t',
                  blocks: [
                    { type: 'text', body: 'CoT helps when the answer requires multiple reasoning steps. It hurts (wastes tokens) for simple fact lookups or classification tasks where the model already answers correctly.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Multi-step maths', body: 'Word problems, unit conversion, symbolic manipulation.' },
                        { title: 'Logical deduction', body: 'Syllogisms, constraint satisfaction, eligibility checks.' },
                        { title: 'Code debugging', body: 'Tracing execution, identifying root cause.' },
                        { title: 'NOT: simple recall', body: '"What is the capital of France?" — CoT wastes tokens.' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'prompt-fundamentals-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'Which role in the OpenAI API carries developer-level instructions?', options: ['system', 'user', 'assistant', 'function'], answer: 0, explanation: 'The system role is processed before user messages and carries your application-level instructions.' },
              { id: 'q2', type: 'tf', prompt: 'Few-shot examples update the model\'s weights.', answer: false, explanation: 'Few-shot is in-context learning — the model infers the task from examples without any gradient updates.' },
              { id: 'q3', type: 'mc', prompt: 'Which technique most improves multi-step arithmetic accuracy?', options: ['Chain-of-thought', 'Lowering temperature', 'Increasing max_tokens', 'Using a system prompt'], answer: 0, explanation: 'CoT asks the model to reason step-by-step before answering, dramatically improving multi-step accuracy.' },
              { id: 'q4', type: 'mc', prompt: 'What is zero-shot prompting?', options: ['Asking the model without providing worked examples', 'Setting temperature to 0', 'Using no system prompt', 'Sending an empty user message'], answer: 0, explanation: 'Zero-shot means the model is given only the task description — no examples — and must generalise from pre-training alone. Temperature 0 is a separate concept (sampling strategy).' },
              { id: 'q5', type: 'tf', prompt: 'Chain-of-thought prompting improves accuracy on simple factual recall questions.', answer: false, explanation: 'CoT helps with multi-step reasoning tasks. For simple recall ("What year did WWII end?") it wastes tokens without improving accuracy — the model already knows the answer.' },
            ],
          },
        },
        {
          id: 'advanced-prompting',
          title: 'Advanced techniques',
          lessons: [
            {
              id: 'react-tool-use',
              title: 'ReAct & tool use',
              minutes: 5,
              screens: [
                {
                  title: 'Reason + Act',
                  blocks: [
                    { type: 'text', body: 'ReAct (Reason + Act) interleaves reasoning traces with actions — the model thinks out loud, calls a tool, observes the result, and continues reasoning. This lets a single LLM call a calculator, search the web, or run code.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Thought', body: 'Model reasons about what it needs ("I need the current stock price of AAPL").' },
                        { title: 'Action', body: 'Model emits a structured tool call: get_price(ticker="AAPL").' },
                        { title: 'Observation', body: 'Tool result is injected back: "$189.30".' },
                        { title: 'Thought → Answer', body: 'Model continues with the new information.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Function calling API',
                  blocks: [
                    { type: 'text', body: 'Modern APIs implement ReAct via function/tool calling: you define tools with JSON schemas, the model outputs structured calls when needed, your code executes them, and you feed results back.' },
                    { type: 'code', lang: 'python', body: 'tools = [{\n    "type": "function",\n    "function": {\n        "name": "get_weather",\n        "description": "Get current weather for a city",\n        "parameters": {\n            "type": "object",\n            "properties": {\n                "city": {"type": "string"}\n            },\n            "required": ["city"]\n        }\n    }\n}]\n\nresponse = client.chat.completions.create(\n    model="gpt-4o",\n    messages=messages,\n    tools=tools,\n)' },
                  ],
                },
                {
                  title: 'Tool design principles',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Clear description', body: 'The model selects tools by description — be precise about what the tool does and doesn\'t do.' },
                        { title: 'Atomic scope', body: 'One tool, one job. Avoid multi-purpose tools that confuse the model.' },
                        { title: 'Defensive execution', body: 'Validate all model-generated arguments before running. Never execute arbitrary code.' },
                        { title: 'Error feedback', body: 'Return structured error messages — the model can retry with corrected arguments.' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'structured-output',
              title: 'Structured output',
              minutes: 4,
              screens: [
                {
                  title: 'Why structured output matters',
                  blocks: [
                    { type: 'text', body: 'Parsing free-text LLM output in production is fragile. JSON mode and schema-constrained generation force the model to output valid, predictable structures you can safely parse.' },
                    {
                      type: 'compare',
                      left: { title: 'Free text output', points: ['Requires brittle regex', 'Format drifts across calls', 'Jailbreaks can inject prose', 'Hard to validate'] },
                      right: { title: 'Structured output', points: ['Always valid JSON', 'Schema enforced server-side', 'Resistant to injection', 'Pydantic validates in one line'] },
                    },
                  ],
                },
                {
                  title: 'Pydantic + instructor',
                  blocks: [
                    { type: 'code', lang: 'python', body: 'import instructor\nfrom pydantic import BaseModel\nfrom openai import OpenAI\nfrom typing import Literal\n\nclient = instructor.from_openai(OpenAI())\n\nclass Sentiment(BaseModel):\n    label: Literal["positive", "negative", "neutral"]\n    confidence: float  # 0–1\n    reason: str\n\nresult = client.chat.completions.create(\n    model="gpt-4o-mini",\n    response_model=Sentiment,\n    messages=[{"role": "user",\n               "content": "I love this, mostly."}],\n)\nprint(result.label)       # → "positive"\nprint(result.confidence)  # → 0.78' },
                  ],
                },
                {
                  title: 'When to use each approach',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'JSON mode', body: 'Lightweight guarantee of valid JSON. No schema enforcement — you still need to validate fields.' },
                        { title: 'Structured outputs (OpenAI)', body: 'Schema enforced server-side via constrained decoding. 100% schema compliance.' },
                        { title: 'instructor / outlines', body: 'Library wrappers that add retry logic, Pydantic validation, and schema generation.' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'advanced-prompting-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'In ReAct, what is an "observation"?', options: ['The result returned by a tool', 'The model\'s reasoning trace', 'The user\'s input', 'A system prompt instruction'], answer: 0, explanation: 'After the model emits an Action, your code runs the tool and injects the result as an Observation.' },
              { id: 'q2', type: 'tf', prompt: 'JSON mode guarantees that all required fields are present.', answer: false, explanation: 'JSON mode only guarantees syntactically valid JSON. Field validation requires schema-constrained generation or a library like instructor.' },
              { id: 'q3', type: 'mc', prompt: 'What prevents prompt injection in function calling?', options: ['Validating tool arguments before execution', 'Using a larger model', 'Setting temperature to 0', 'Disabling system prompts'], answer: 0, explanation: 'You should always validate model-generated arguments against expected types/ranges before running any tool.' },
              { id: 'q4', type: 'mc', prompt: 'What advantage do OpenAI Structured Outputs have over JSON mode?', options: ['Schema compliance is enforced server-side, not just syntax', 'Faster inference speed', 'Cheaper token pricing', 'Larger context window'], answer: 0, explanation: 'JSON mode guarantees syntactically valid JSON only. Structured Outputs use constrained decoding to guarantee the response matches your exact schema — missing or extra fields are impossible.' },
              { id: 'q5', type: 'tf', prompt: 'The LLM decides whether to call a tool or answer directly.', answer: true, explanation: 'Given tool definitions, the model autonomously decides whether a tool call is needed, which tool to use, and what arguments to pass — or whether to respond directly without any tool.' },
            ],
          },
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // NODE 3: Embeddings & Vector Search
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 'embeddings-search',
      title: 'Embeddings & Search',
      prereqs: ['foundations'],
      sections: [
        {
          id: 'embeddings',
          title: 'Embeddings',
          lessons: [
            {
              id: 'text-becomes-vectors',
              title: 'Text becomes vectors',
              minutes: 4,
              screens: [
                {
                  title: 'Dense representations',
                  blocks: [
                    { type: 'text', body: 'An embedding model encodes text as a dense vector — a list of floating-point numbers (typically 768–3 072 dimensions). Every point in this high-dimensional space represents a piece of text.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Input text', body: 'Any string: word, sentence, paragraph, or document.' },
                        { title: 'Tokenize', body: 'Same tokenization as generative models.' },
                        { title: 'Transformer encoder', body: 'Bidirectional attention (BERT-style) processes all tokens.' },
                        { title: '[CLS] pooling', body: 'The first token\'s output (or mean-pool) is the embedding vector.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Embedding models to know',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'OpenAI text-embedding-3', points: ['1 536 or 3 072 dims', 'API-only, no local', '~0.02¢ / 1 K tokens', 'Best all-round quality'] },
                      right: { title: 'BGE-M3 (open-weight)', points: ['1 024 dims', 'Runs locally on CPU/GPU', 'Free, 8 192 token context', 'Multilingual support'] },
                    },
                  ],
                },
                {
                  title: 'Embedding do\'s and don\'ts',
                  blocks: [
                    { type: 'callout', body: 'Never mix embeddings from different models in the same vector index. The spaces are incompatible — similarity scores will be meaningless.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Chunk before embedding', body: 'Embed 256–512 token chunks, not full documents. Long inputs dilute signal.' },
                        { title: 'Normalise vectors', body: 'L2-normalise so cosine similarity = dot product — faster at query time.' },
                        { title: 'Version your model', body: 'If you upgrade embedding models, re-embed everything.' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'meaning-as-distance',
              title: 'Meaning as distance',
              minutes: 5,
              screens: [
                {
                  title: 'Similar meaning, nearby vectors',
                  blocks: [
                    { type: 'text', body: 'Embedding models are trained so that semantically similar texts cluster together in vector space. "dog" and "puppy" land near each other; "dog" and "database" do not.' },
                    { type: 'callout', body: 'Distance between vectors stands in for difference in meaning. This lets us turn "find similar things" into a geometry problem.' },
                  ],
                },
                {
                  title: 'Similarity metrics',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Cosine similarity', points: ['Measures angle, ignores magnitude', 'Range: –1 to +1', 'Standard for text', 'Fast with normalised vectors'] },
                      right: { title: 'Dot product', points: ['Magnitude-sensitive', 'Range: unbounded', 'Used in some retrieval models', 'Faster than cosine if unnormalised'] },
                    },
                  ],
                },
                {
                  title: 'Keyword vs semantic search',
                  blocks: [
                    { type: 'text', body: 'Keyword search matches exact words. Search "dog" and "puppy" returns nothing. Semantic search finds "puppy" when you search "dog" because their vectors are close.' },
                    {
                      type: 'compare',
                      left: { title: 'Keyword (BM25)', points: ['Exact word match', 'Fast, no model needed', 'Misses synonyms', 'Great for proper nouns'] },
                      right: { title: 'Semantic (ANN)', points: ['Meaning-based match', 'Requires embedding model', 'Handles paraphrases', 'Slower at large scale'] },
                    },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'embeddings-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'What does an embedding model output for a piece of text?', options: ['A fixed-length vector', 'A probability distribution', 'A compressed string', 'A list of tokens'], answer: 0, explanation: 'Embedding models map text to dense float vectors of fixed dimensionality (e.g., 1 536).' },
              { id: 'q2', type: 'tf', prompt: 'You can mix embeddings from different models in the same index.', answer: false, explanation: 'Different embedding models produce incompatible vector spaces. Always use one model per index.' },
              { id: 'q3', type: 'mc', prompt: 'Which similarity metric is standard for normalised text embeddings?', options: ['Cosine similarity', 'Euclidean distance', 'Manhattan distance', 'Jaccard index'], answer: 0, explanation: 'Cosine similarity measures the angle between vectors, ignoring magnitude — ideal for normalised embeddings.' },
              { id: 'q4', type: 'mc', prompt: 'Why should documents be chunked before embedding?', options: ['Long inputs dilute the embedding signal across too many topics', 'Embedding models only accept short text', 'Chunking reduces token costs', 'Vector databases enforce size limits per entry'], answer: 0, explanation: 'Embedding a full document averages over all its topics, making similarity matching imprecise. Shorter chunks produce sharper, more focused vectors for retrieval.' },
              { id: 'q5', type: 'tf', prompt: 'L2-normalising vectors means cosine similarity equals their dot product.', answer: true, explanation: 'For unit-length vectors, the dot product and cosine similarity are mathematically identical. Normalising upfront eliminates the magnitude division at query time — faster search.' },
            ],
          },
        },
        {
          id: 'vector-databases',
          title: 'Vector databases',
          lessons: [
            {
              id: 'why-vector-dbs',
              title: 'Why vector databases?',
              minutes: 4,
              screens: [
                {
                  title: 'The scale problem',
                  blocks: [
                    { type: 'text', body: 'Brute-force nearest-neighbour search compares a query vector against every stored vector — O(n·d). At 10 million docs × 1 536 dims, that\'s ~15 billion operations per query. Vector databases solve this with Approximate Nearest Neighbour (ANN) indexes.' },
                    { type: 'callout', body: 'ANN trades a tiny accuracy loss (~1%) for 100–1000× speed-up by pre-building an index structure that narrows the search space.' },
                  ],
                },
                {
                  title: 'HNSW: the dominant index',
                  blocks: [
                    { type: 'text', body: 'HNSW (Hierarchical Navigable Small World) builds a multi-layer graph. At query time it enters at the top (coarse, few nodes) and descends, greedy-searching toward the query vector at each layer.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Insert', body: 'Each new vector is linked to its k-nearest neighbours at multiple layers.' },
                        { title: 'Query entry', body: 'Start at top layer, find the closest node.' },
                        { title: 'Descend', body: 'Move to lower layers (more nodes, finer granularity).' },
                        { title: 'Return candidates', body: 'Bottom layer returns ef_search nearest candidates.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Which vector store?',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'pgvector (Postgres)', points: ['SQL joins with vectors', 'No new infra', 'HNSW or IVFFlat index', 'Best for <10M vectors'] },
                      right: { title: 'Pinecone / Weaviate', points: ['Fully managed', 'Scales to billions', 'Metadata filtering', 'Higher cost + latency'] },
                    },
                  ],
                },
              ],
            },
            {
              id: 'semantic-search-code',
              title: 'Build a semantic search',
              minutes: 5,
              screens: [
                {
                  title: 'Ingest: embed and store',
                  blocks: [
                    { type: 'code', lang: 'python', body: 'from openai import OpenAI\nimport psycopg2\n\nclient = OpenAI()\n\ndef embed(text: str) -> list[float]:\n    r = client.embeddings.create(\n        model="text-embedding-3-small",\n        input=text,\n    )\n    return r.data[0].embedding\n\n# Store in pgvector\ncursor.execute(\n    "INSERT INTO docs (content, embedding) VALUES (%s, %s)",\n    (chunk_text, embed(chunk_text)),\n)' },
                  ],
                },
                {
                  title: 'Query: find similar chunks',
                  blocks: [
                    { type: 'code', lang: 'python', body: 'def search(query: str, top_k: int = 5):\n    q_vec = embed(query)\n    # <-> is cosine distance in pgvector\n    cursor.execute("""\n        SELECT content, 1 - (embedding <=> %s) AS score\n        FROM docs\n        ORDER BY embedding <=> %s\n        LIMIT %s\n    """, (q_vec, q_vec, top_k))\n    return cursor.fetchall()\n\nresults = search("How does attention work?")\nfor content, score in results:\n    print(f"{score:.3f}  {content[:80]}")' },
                  ],
                },
                {
                  title: 'Hybrid search',
                  blocks: [
                    { type: 'text', body: 'Pure semantic search misses exact keyword matches (names, codes, IDs). Hybrid search combines BM25 keyword scores with vector similarity, then fuses them with Reciprocal Rank Fusion (RRF).' },
                    { type: 'callout', body: 'Rule of thumb: start with semantic-only. Add BM25 hybrid when users search for proper nouns, product codes, or technical terms the embedding model struggles with.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'vector-dbs-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'Why is brute-force search impractical at millions of vectors?', options: ['O(n·d) complexity per query', 'Vectors can\'t be stored in RAM', 'Cosine similarity isn\'t commutative', 'Postgres doesn\'t support floats'], answer: 0, explanation: 'Comparing a query against every vector scales linearly with both n (docs) and d (dimensions).' },
              { id: 'q2', type: 'mc', prompt: 'What does ANN trade for speed?', options: ['A small loss in recall accuracy', 'Vector dimensionality', 'Storage space', 'Query latency'], answer: 0, explanation: 'ANN indexes sacrifice a small fraction of recall (~1–5%) to achieve orders-of-magnitude faster search.' },
              { id: 'q3', type: 'tf', prompt: 'pgvector supports HNSW indexes.', answer: true, explanation: 'pgvector added HNSW support in v0.5.0, alongside IVFFlat.' },
              { id: 'q4', type: 'mc', prompt: 'What is hybrid search?', options: ['Combining BM25 keyword scores with vector similarity scores', 'Searching two separate vector databases in parallel', 'Using two different embedding models for the same query', 'Combining HNSW and IVFFlat indexes'], answer: 0, explanation: 'Hybrid search fuses keyword (BM25) and semantic (ANN) retrieval, usually via Reciprocal Rank Fusion (RRF). This handles both proper nouns and paraphrase-based queries.' },
              { id: 'q5', type: 'tf', prompt: 'pgvector is a good fit for vector collections exceeding one billion entries.', answer: false, explanation: 'pgvector performs well up to roughly 10M vectors. At billion-scale, fully managed solutions like Pinecone or Weaviate are more appropriate — pgvector\'s HNSW build time and memory usage become prohibitive.' },
            ],
          },
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // NODE 4: RAG
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 'rag',
      title: 'Retrieval-Augmented Generation',
      prereqs: ['embeddings-search'],
      sections: [
        {
          id: 'rag-basics',
          title: 'RAG basics',
          lessons: [
            {
              id: 'why-rag',
              title: 'Why RAG?',
              minutes: 4,
              screens: [
                {
                  title: 'The knowledge problem',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'LLM alone', points: ['Knowledge frozen at training cutoff', 'Hallucinations on specific facts', 'Can\'t cite sources', 'Retraining is expensive'] },
                      right: { title: 'LLM + RAG', points: ['Knowledge updated by adding docs', 'Grounded in retrieved evidence', 'Returns sources for verification', 'No retraining required'] },
                    },
                  ],
                },
                {
                  title: 'The RAG intuition',
                  blocks: [
                    { type: 'callout', body: 'RAG is open-book exam vs closed-book. The LLM alone must recall from memory. With RAG, it looks up the relevant pages first, then writes the answer.' },
                    { type: 'text', body: 'This is why RAG dramatically reduces hallucination for factual queries — the model is reading, not remembering.' },
                  ],
                },
                {
                  title: 'When NOT to use RAG',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Reasoning-heavy tasks', body: 'If the task is logic, code, or maths — not factual recall — RAG adds latency for no gain.' },
                        { title: 'Very small knowledge bases', body: 'If the full corpus fits in one context window, just include it all.' },
                        { title: 'Real-time data', body: 'If you need live data (prices, weather), use a tool call instead of a static index.' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'rag-architecture',
              title: 'RAG architecture',
              minutes: 5,
              screens: [
                {
                  title: 'Ingest pipeline',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Load documents', body: 'PDFs, HTML, Notion, Confluence — any source of text.' },
                        { title: 'Chunk', body: 'Split into overlapping ~512-token chunks with metadata (source, page, date).' },
                        { title: 'Embed', body: 'Run each chunk through an embedding model → vector.' },
                        { title: 'Store', body: 'Insert (vector, metadata, text) into a vector database.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Query pipeline',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Embed query', body: 'Run the user\'s question through the same embedding model.' },
                        { title: 'Retrieve', body: 'ANN search returns top-k most similar chunks (k=5–20).' },
                        { title: 'Augment prompt', body: 'Insert retrieved chunks into the prompt as context.' },
                        { title: 'Generate', body: 'LLM synthesises an answer from the provided context.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'The augmented prompt',
                  blocks: [
                    { type: 'code', lang: 'python', body: 'def rag_prompt(query: str, chunks: list[str]) -> str:\n    context = "\\n\\n---\\n\\n".join(chunks)\n    return f"""Answer based only on the context below.\nIf the answer is not in the context, say "I don\'t know."\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"""' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'rag-basics-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'What problem does RAG primarily solve?', options: ['Stale knowledge and hallucination on specific facts', 'Slow inference speed', 'High training cost', 'Context window limits'], answer: 0, explanation: 'RAG grounds the LLM in retrieved documents, preventing fabrication of facts not in its training data.' },
              { id: 'q2', type: 'mc', prompt: 'Which component must be the same in ingest and query pipelines?', options: ['The embedding model', 'The LLM', 'The chunk size', 'The vector database'], answer: 0, explanation: 'Query and document embeddings must come from the same model — otherwise the vector spaces are incompatible.' },
              { id: 'q3', type: 'tf', prompt: 'RAG is better than a tool call for retrieving live stock prices.', answer: false, explanation: 'RAG uses a static index. Live data requires a tool call (API) at query time.' },
              { id: 'q4', type: 'mc', prompt: 'What should a RAG prompt instruct the model to say when the answer is not in the retrieved context?', options: ['"I don\'t know"', 'Its best guess from pre-training', 'Nothing — stop generating', 'A generic legal disclaimer'], answer: 0, explanation: 'Explicitly instructing the model to admit uncertainty prevents it from hallucinating content not present in the retrieved chunks — the main risk in RAG systems.' },
              { id: 'q5', type: 'tf', prompt: 'The LLM and embedding model in a RAG pipeline can be upgraded independently.', answer: true, explanation: 'The embedding model owns retrieval; the LLM owns generation — they are separate components. Upgrading the LLM does not require re-embedding your document corpus, and vice versa.' },
            ],
          },
        },
        {
          id: 'advanced-rag',
          title: 'Advanced RAG',
          lessons: [
            {
              id: 'chunking-strategies',
              title: 'Chunking strategies',
              minutes: 4,
              screens: [
                {
                  title: 'Why chunking matters',
                  blocks: [
                    { type: 'text', body: 'Chunk size is the single biggest lever in RAG quality. Too small: each chunk lacks context. Too large: the embedding averages over too much text and retrieval becomes imprecise.' },
                    { type: 'callout', body: 'Start with 512 tokens, 50-token overlap. Measure retrieval recall before optimising further.' },
                  ],
                },
                {
                  title: 'Chunking approaches',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Fixed-size', body: 'Split every N tokens regardless of structure. Fast, predictable, but cuts sentences mid-thought.' },
                        { title: 'Sentence / paragraph', body: 'Split on natural boundaries. Better coherence, variable size.' },
                        { title: 'Semantic chunking', body: 'Embed sentences; split where embedding similarity drops. Best quality, most expensive.' },
                        { title: 'Document-aware', body: 'Respect headings, sections, tables. Requires parsing (Unstructured, Docling).' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Parent-child chunking',
                  blocks: [
                    { type: 'text', body: 'Store small chunks (128 tokens) for precise retrieval, but return the parent chunk (512+ tokens) to the LLM. Small = better recall. Big = better context for generation.' },
                    { type: 'code', lang: 'python', body: '# Store child → parent mapping\nfor parent_chunk in split(doc, size=512):\n    for child in split(parent_chunk, size=128):\n        db.insert(\n            embedding=embed(child),\n            metadata={"parent_id": parent_chunk.id,\n                      "parent_text": parent_chunk.text}\n        )\n\n# At query time, retrieve child, return parent\nresults = db.search(query_vec, top_k=10)\nparent_texts = [r.metadata["parent_text"] for r in results]' },
                  ],
                },
              ],
            },
            {
              id: 'reranking',
              title: 'Re-ranking',
              minutes: 4,
              screens: [
                {
                  title: 'The two-stage retrieval pattern',
                  blocks: [
                    { type: 'text', body: 'ANN retrieval is fast but imprecise — it uses embedding similarity as a proxy for relevance. Re-ranking adds a second, slower model that scores (query, chunk) pairs directly for relevance.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Stage 1: ANN recall', body: 'Retrieve top 50–100 candidates fast with vector search.' },
                        { title: 'Stage 2: re-rank', body: 'Cross-encoder scores each (query, candidate) pair. Return top 5–10.' },
                        { title: 'Augment', body: 'Pass re-ranked results to LLM.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Cross-encoders vs bi-encoders',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Bi-encoder (ANN stage)', points: ['Query and doc encoded separately', 'Pre-computed doc vectors', 'Milliseconds per query', 'Lower accuracy'] },
                      right: { title: 'Cross-encoder (re-rank)', points: ['Query + doc fed jointly', 'No pre-computation', '100ms+ per candidate', 'Much higher accuracy'] },
                    },
                  ],
                },
                {
                  title: 'Cohere Rerank in practice',
                  blocks: [
                    { type: 'code', lang: 'python', body: 'import cohere\n\nco = cohere.Client(api_key)\n\n# Rerank 50 candidates from ANN search\nreranked = co.rerank(\n    model="rerank-english-v3.0",\n    query=user_query,\n    documents=[r.text for r in ann_results],\n    top_n=5,\n)\n\ntop_chunks = [\n    ann_results[r.index].text\n    for r in reranked.results\n]\n# Pass top_chunks to LLM' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'advanced-rag-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'What is the main advantage of parent-child chunking?', options: ['Small chunks for precise retrieval, large context returned to LLM', 'Faster indexing', 'Smaller vector index', 'Lower embedding costs'], answer: 0, explanation: 'Child chunks give precise ANN matches; returning the parent chunk provides more context for the LLM to generate a complete answer.' },
              { id: 'q2', type: 'mc', prompt: 'What does a cross-encoder do that a bi-encoder cannot?', options: ['Score query and document jointly in one pass', 'Pre-compute document embeddings', 'Perform ANN search', 'Generate summaries'], answer: 0, explanation: 'Cross-encoders concatenate query and document as one input, allowing deep cross-attention and much more accurate relevance scoring.' },
              { id: 'q3', type: 'tf', prompt: 'Re-ranking replaces ANN search in a two-stage pipeline.', answer: false, explanation: 'Re-ranking is stage 2 — it refines the top-k from ANN (stage 1). Both are needed: ANN for speed, re-ranking for accuracy.' },
              { id: 'q4', type: 'mc', prompt: 'What is Reciprocal Rank Fusion (RRF)?', options: ['A method to merge ranked lists from multiple retrieval systems', 'A type of cross-encoder re-ranking model', 'A vector index algorithm', 'An embedding normalisation technique'], answer: 0, explanation: 'RRF combines rank positions from multiple retrieval systems (e.g., BM25 and ANN) into one fused list without needing to normalise raw scores across systems.' },
              { id: 'q5', type: 'tf', prompt: 'Semantic chunking is cheaper than fixed-size chunking.', answer: false, explanation: 'Semantic chunking embeds every sentence and measures similarity drops, requiring many embedding calls. Fixed-size chunking requires no model at all — it is the cheapest strategy.' },
            ],
          },
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // NODE 5: AI Agents
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: 'agents',
      title: 'AI Agents',
      prereqs: ['prompting'],
      sections: [
        // ── Section 1: Agent fundamentals ────────────────────────────────────
        {
          id: 'agent-fundamentals',
          title: 'Agent fundamentals',
          lessons: [
            {
              id: 'agent-loop',
              title: 'The agent loop',
              minutes: 5,
              screens: [
                {
                  title: 'Chatbot vs agent',
                  blocks: [
                    { type: 'text', body: 'A chatbot takes one input and returns one output. An agent takes a goal and iterates — calling tools, observing results, and deciding what to do next — until the goal is met or it hits a step limit.' },
                    {
                      type: 'compare',
                      left: { title: 'Chatbot', points: ['One turn: input → output', 'No external actions', 'No working memory', 'Response is always final'] },
                      right: { title: 'Agent', points: ['Multi-turn loop until done', 'Calls tools and APIs', 'Maintains step-by-step state', 'Acts, then re-evaluates'] },
                    },
                  ],
                },
                {
                  title: 'Observe → think → act',
                  blocks: [
                    { type: 'callout', body: 'The core loop: Observe (task + tool results) → Think (LLM decides what to do) → Act (call tool or answer) → Observe the new result → repeat.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Observe', body: 'Receive the task plus any tool results from the previous step.' },
                        { title: 'Think', body: 'The LLM reasons about the next action — call a tool, or produce a final answer.' },
                        { title: 'Act', body: 'Execute the chosen tool. The result becomes the next observation.' },
                        { title: 'Terminate', body: 'The loop exits when the LLM produces a final answer, hits the step limit, or encounters a fatal error.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Controlling the loop',
                  blocks: [
                    { type: 'text', body: 'Unconstrained agent loops are expensive and dangerous. Always cap iterations and handle tool failures explicitly — the model must be able to reason about errors, not just crash.' },
                    { type: 'code', lang: 'python', body: 'def run_agent(task: str, tools: list, max_steps: int = 10) -> str:\n    messages = [{"role": "user", "content": task}]\n    for _ in range(max_steps):\n        resp = client.chat.completions.create(\n            model="gpt-4o", messages=messages, tools=tools\n        )\n        msg = resp.choices[0].message\n        if not msg.tool_calls:   # LLM chose to answer directly\n            return msg.content\n        for tc in msg.tool_calls:  # execute and feed result back\n            result = execute_tool(tc)\n            messages.append(tool_result_msg(tc, result))\n    return "Agent reached step limit without an answer."' },
                  ],
                },
              ],
            },
            {
              id: 'agent-memory',
              title: 'Agent memory',
              minutes: 4,
              screens: [
                {
                  title: 'Four types of memory',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Working (in-context)', body: 'The conversation and tool call history within the current session. Cheap to access, lost when the session ends.' },
                        { title: 'Episodic (external)', body: 'Past conversations stored in a database. Retrieved by similarity at the start of a new session.' },
                        { title: 'Semantic (knowledge)', body: 'Persistent facts about the user or domain — a curated vector store the agent queries at any time.' },
                        { title: 'Procedural (system prompt)', body: 'The agent\'s instructions and tool definitions baked into the system prompt at startup.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'In-context vs external memory',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'In-context (working)', points: ['Always visible — no retrieval step', 'Costs tokens on every request', 'Lost after session ends', 'Bounded by context window'] },
                      right: { title: 'External (persistent)', points: ['Persists across sessions', 'Only retrieved content costs tokens', 'Retrieval adds ~50ms latency', 'Scales to unlimited history'] },
                    },
                  ],
                },
                {
                  title: 'Memory in practice',
                  blocks: [
                    { type: 'callout', body: 'Start with in-context memory. Add external memory only when you need persistence across sessions or the context window fills up.' },
                    { type: 'code', lang: 'python', body: 'def recall(query: str, top_k: int = 3) -> list[str]:\n    q_vec = embed(query)\n    return [r.text for r in memory_db.search(q_vec, top_k)]\n\ndef save_to_memory(text: str):\n    memory_db.insert({"text": text, "embedding": embed(text)})\n\n# Inject relevant past context into the system prompt\npast = recall(user_message)\ncontext = "\\n".join(past)\nsystem = f"Relevant past context:\\n{context}\\n\\nYou are a helpful assistant."' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'agent-fundamentals-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'What distinguishes an agent from a single-turn LLM call?', options: ['Agents iterate in a loop, taking actions until a goal is met', 'Agents use a larger model', 'Agents require fine-tuning', 'Agents do not use a system prompt'], answer: 0, explanation: 'An agent runs an observe-think-act loop — it can call tools and re-evaluate until it reaches a final answer. A single LLM call is one turn with no loop.' },
              { id: 'q2', type: 'tf', prompt: 'An agent loop should run indefinitely until the task is fully complete.', answer: false, explanation: 'Always cap iterations with a max_steps limit. Unbounded loops burn tokens, can get stuck in cycles, and are expensive to debug in production.' },
              { id: 'q3', type: 'mc', prompt: 'Which memory type persists across separate user sessions?', options: ['External (episodic) memory in a database', 'In-context (working) memory', 'The system prompt', 'Tool call history'], answer: 0, explanation: 'Working memory is lost when the session ends. External memory stored in a vector database persists indefinitely and is retrieved at the start of future sessions.' },
              { id: 'q4', type: 'tf', prompt: 'The system prompt is a form of agent memory.', answer: true, explanation: 'The system prompt is "procedural memory" — it encodes the agent\'s instructions and tool definitions. It is loaded at startup and shapes every response in the session.' },
              { id: 'q5', type: 'mc', prompt: 'At what point does the agent loop terminate successfully?', options: ['When the LLM produces a response with no tool calls', 'When all available tools have been called at least once', 'When the context window is full', 'When temperature drops below 0.5'], answer: 0, explanation: 'The loop runs as long as the LLM emits tool calls. When it produces a plain response (no tool call), that is the final answer and the loop exits cleanly.' },
            ],
          },
        },

        // ── Section 2: Building agents ─────────────────────────────────────
        {
          id: 'building-agents',
          title: 'Building agents',
          lessons: [
            {
              id: 'tool-design',
              title: 'Designing tools',
              minutes: 4,
              screens: [
                {
                  title: 'What makes a good tool',
                  blocks: [
                    { type: 'text', body: 'The LLM selects tools by reading their descriptions. A vague or multi-purpose tool will be misused or ignored. Good tools are atomic, well-scoped, and return structured data the model can reason over.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'One job', body: 'Each tool does one thing. Multi-purpose tools confuse the model about when to use them.' },
                        { title: 'Clear description', body: 'State what it does, what it returns, and explicitly when NOT to use it.' },
                        { title: 'Structured returns', body: 'Return JSON or a clear string. Avoid unstructured prose the model must parse.' },
                        { title: 'Fail safely', body: 'Return structured error messages — the model can read them and retry with corrected arguments.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Writing tool schemas',
                  blocks: [
                    { type: 'code', lang: 'python', body: 'tools = [{\n    "type": "function",\n    "function": {\n        "name": "search_docs",\n        "description": "Search the internal knowledge base. "\n                       "Use for factual questions only. "\n                       "Do NOT use for maths or code tasks.",\n        "parameters": {\n            "type": "object",\n            "properties": {\n                "query": {\n                    "type": "string",\n                    "description": "Plain-English search query"\n                }\n            },\n            "required": ["query"]\n        }\n    }\n}]' },
                  ],
                },
                {
                  title: 'Handling tool errors',
                  blocks: [
                    { type: 'callout', body: 'Never let an exception silently kill the agent loop. Return a structured error string — the model can read it, retry, pick a different tool, or tell the user what failed.' },
                    { type: 'code', lang: 'python', body: 'def execute_tool(tool_call) -> str:\n    try:\n        name = tool_call.function.name\n        args = json.loads(tool_call.function.arguments)\n        if name not in TOOLS:\n            return f"Error: unknown tool \'{name}\'"\n        return TOOLS[name](**args)\n    except TypeError as e:\n        return f"Error: invalid arguments — {e}"\n    except Exception as e:\n        return f"Error: tool failed — {e}"' },
                  ],
                },
              ],
            },
            {
              id: 'multi-agent',
              title: 'Multi-agent systems',
              minutes: 5,
              screens: [
                {
                  title: 'Why split into agents',
                  blocks: [
                    { type: 'text', body: 'A single agent with many tools and a long context degrades — the LLM loses track of earlier reasoning and picks tools poorly. Splitting by responsibility gives each agent a focused context and tool set.' },
                    {
                      type: 'compare',
                      left: { title: 'Single agent', points: ['Simple to build', 'One context window', 'All tools in one place', 'Degrades as complexity grows'] },
                      right: { title: 'Multi-agent', points: ['Parallel work streams', 'Specialised context per agent', 'Easier to test each part', 'More orchestration overhead'] },
                    },
                  ],
                },
                {
                  title: 'Orchestrator-worker pattern',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Orchestrator', body: 'Receives the top-level task, plans sub-tasks, and delegates to specialised worker agents.' },
                        { title: 'Workers', body: 'Each worker handles one domain (research, coding, database queries) with its own tool set and system prompt.' },
                        { title: 'Aggregation', body: 'Orchestrator collects worker outputs and synthesises the final answer.' },
                        { title: 'Validation', body: 'Orchestrator validates worker outputs — workers can hallucinate, and errors propagate up.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Single vs multi-agent',
                  blocks: [
                    { type: 'callout', body: 'Default to a single agent. Add multi-agent only when a single agent consistently fails due to too many tools, unbounded context, or genuinely parallel sub-tasks.' },
                    {
                      type: 'steps',
                      items: [
                        { title: 'Stay single when', body: 'The task is linear, context stays short, and 5 or fewer tools are needed.' },
                        { title: 'Split when', body: 'Sub-tasks are independent (parallelism wins), or context grows without bound.' },
                        { title: 'Watch for', body: 'Error amplification: a worker mistake reaches the orchestrator and compounds through the pipeline.' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'building-agents-quiz',
            questions: [
              { id: 'q1', type: 'mc', prompt: 'What should a tool description include beyond what the tool does?', options: ['When NOT to use it', 'The model\'s temperature setting', 'The tool\'s token cost', 'The tool\'s source code'], answer: 0, explanation: 'Explicitly stating when NOT to use a tool prevents the model from misapplying it. The model selects tools solely by reading their descriptions — precision here directly affects tool selection quality.' },
              { id: 'q2', type: 'tf', prompt: 'Tool execution errors should raise Python exceptions to halt the agent loop.', answer: false, explanation: 'Exceptions should be caught and returned as structured error strings. The model can then read the error and decide whether to retry, try a different tool, or report failure.' },
              { id: 'q3', type: 'mc', prompt: 'What is the main advantage of multi-agent systems over a single agent?', options: ['Sub-tasks can run in parallel with specialised context per agent', 'Lower latency per request', 'No need for a system prompt', 'Better tool selection on simple tasks'], answer: 0, explanation: 'Parallelism and specialisation are the key wins. Independent sub-tasks (e.g., research + code writing simultaneously) justify the orchestration overhead.' },
              { id: 'q4', type: 'mc', prompt: 'What risk does the orchestrator-worker pattern introduce?', options: ['Error amplification from worker mistakes propagating up', 'Incompatible tool schemas across agents', 'Higher model inference latency', 'Requirement for model fine-tuning'], answer: 0, explanation: 'Worker errors propagate to the orchestrator and can cascade through the pipeline. The orchestrator must validate worker outputs rather than passing them through blindly.' },
              { id: 'q5', type: 'tf', prompt: 'Adding more tools to a single agent always improves task performance.', answer: false, explanation: 'More tools increase the decision space. Too many tools in one context leads the model to pick poorly or ignore tools entirely. Fewer, well-scoped tools per agent typically performs better.' },
            ],
          },
        },
      ],
    },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLesson(nodeId: string, sectionId: string, lessonId: string): Lesson | undefined {
  for (const node of aiEngineering.nodes) {
    if (node.id !== nodeId) continue
    for (const section of node.sections) {
      if (section.id !== sectionId) continue
      return section.lessons.find((l) => l.id === lessonId)
    }
  }
}

export function getSection(nodeId: string, sectionId: string) {
  const node = aiEngineering.nodes.find((n) => n.id === nodeId)
  return node?.sections.find((s) => s.id === sectionId)
}

export function getNode(nodeId: string) {
  return aiEngineering.nodes.find((n) => n.id === nodeId)
}

// A node unlocks when every section of every prerequisite node is complete.
export function nodeIsUnlocked(nodeId: string, completedSections: string[]): boolean {
  const node = getNode(nodeId)
  if (!node) return false
  return node.prereqs.every((prereqNodeId) => {
    const prereqNode = getNode(prereqNodeId)
    if (!prereqNode) return false
    return prereqNode.sections.every((s) => completedSections.includes(s.id))
  })
}

export function subjectProgress(completedSections: string[]): number {
  const total = aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)
  if (total === 0) return 0
  return Math.round((completedSections.length / total) * 100)
}
