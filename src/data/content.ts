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

export const webDevelopment: Subject = {
  id: 'web-dev',
  title: 'Web development',
  accent: '#0F766E',
  tint: 'rgba(15,118,110,0.12)',
  description: 'HTML, CSS, JavaScript, and beyond.',
  nodes: [
    // ─────────────────────────────────────────────────────────────
    // Node 1 — Internet
    // ─────────────────────────────────────────────────────────────
    {
      id: 'internet',
      title: 'Internet',
      prereqs: [],
      sections: [
        {
          id: 'internet-how-it-works',
          title: 'How does the internet work?',
          lessons: [
            {
              id: 'packets-and-routers',
              title: 'Packets, routers, and protocols',
              minutes: 5,
              screens: [
                {
                  title: 'A network of networks',
                  blocks: [
                    { type: 'text', body: 'The internet is not one network. It is tens of thousands of independently run networks (ISPs, universities, companies, cloud providers) that agree to exchange traffic with each other. No single computer or company runs it.' },
                    { type: 'callout', body: 'Your laptop never talks to a website directly. It hands data to the next machine along, which hands it to the next, until it arrives.' },
                  ],
                },
                {
                  title: 'Data travels in packets',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Split', body: 'Your data is broken into small packets, each labelled with a source and destination IP address.' },
                        { title: 'Forward', body: 'Routers read the destination address and pass each packet one hop closer. Packets from one file may take different routes.' },
                        { title: 'Reassemble', body: 'The receiving computer puts packets back in order, asking for any missing ones to be resent.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'IP and TCP divide work',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'IP (Internet Protocol)', points: ['Addresses every device', 'Routes packets hop by hop', 'Best effort: packets can drop or arrive out of order', 'No idea what the data means'] },
                      right: { title: 'TCP (Transmission Control Protocol)', points: ['Opens a connection between two programs', 'Numbers packets so they can be reordered', 'Retransmits lost packets', 'Gives apps a reliable byte stream'] },
                    },
                    { type: 'text', body: 'Layering is the trick. IP only worries about getting packets closer to their destination. TCP, running on the two end computers, turns that unreliable delivery into a dependable stream that HTTP can build on.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'internet-how-it-works-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'What does a router do?',
                options: ['Forwards packets toward their destination using the IP address', 'Stores copies of websites so they load faster', 'Translates domain names into IP addresses', 'Guarantees packets arrive in the right order'],
                answer: 0,
                explanation: 'Routers make one decision per packet: which neighbour gets it closer to the destination IP. Caching is a CDN job, name lookup is DNS, and ordering is handled by TCP on the end computers.' },
              { id: 'q2', type: 'tf',
                prompt: 'Every packet of a file must follow the same path across the internet.',
                answer: false,
                explanation: 'Each packet is routed independently, so packets can take different paths and arrive out of order. TCP on the receiving machine reorders them.' },
              { id: 'q3', type: 'mc',
                prompt: 'Which protocol is responsible for resending data that got lost on the way?',
                options: ['TCP', 'IP', 'HTTP', 'DNS'],
                answer: 0,
                explanation: 'IP is deliberately best effort and never retries. TCP tracks which packets were acknowledged and retransmits the missing ones, so HTTP above it can assume a reliable stream.' },
              { id: 'q4', type: 'tf',
                prompt: 'A single central organisation routes all internet traffic.',
                answer: false,
                explanation: 'ICANN coordinates names and number allocation, but it routes nothing. Traffic flows between independently operated networks that exchange routes with each other.' },
              { id: 'q5', type: 'mc',
                prompt: 'What is an IP address used for?',
                options: ['Identifying where a packet should be delivered', 'Giving a website a human-readable name', 'Encrypting traffic between two devices', 'Permanently identifying a network card'],
                answer: 0,
                explanation: 'An IP address is the delivery address routers read. Human-readable names are domains, encryption is TLS, and the permanent hardware identifier is a MAC address, which never leaves the local network.' },
            ],
          },
        },
        {
          id: 'internet-http',
          title: 'What is HTTP?',
          lessons: [
            {
              id: 'requests-and-responses',
              title: 'Requests and responses',
              minutes: 5,
              screens: [
                {
                  title: 'A request, then a response',
                  blocks: [
                    { type: 'text', body: 'HTTP is the language browsers and servers use. The client sends a request naming a method and a path; the server answers with a status code, headers, and usually a body. HTTP/1.1 messages are plain text you can read.' },
                    { type: 'code', lang: 'http', body: `GET /index.html HTTP/1.1
Host: example.com
Accept: text/html

HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1256

<!doctype html>
<html>...</html>` },
                  ],
                },
                {
                  title: 'Methods say what you want',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'GET', points: ['Retrieves a resource', 'Parameters go in the URL query string', 'Safe and idempotent: repeating it changes nothing', 'Responses can be cached'] },
                      right: { title: 'POST', points: ['Submits data for the server to process', 'Data goes in the request body', 'Not idempotent: repeating may create duplicates', 'Not cached by default'] },
                    },
                    { type: 'text', body: 'PUT replaces a resource and DELETE removes one. Both are idempotent: sending the same request twice leaves the server in the same state as sending it once.' },
                  ],
                },
                {
                  title: 'Status codes at a glance',
                  blocks: [
                    { type: 'text', body: '1xx is informational, 2xx success (200 OK, 201 Created), 3xx redirection (301, 304), 4xx a client mistake (400, 401, 403, 404), and 5xx a server failure (500, 503). The first digit tells you whose problem it is.' },
                    { type: 'callout', body: 'HTTP is stateless: each request stands alone. Logins and carts work because cookies send state back with every request.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'internet-http-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'A server responds with status 404. What does it mean?',
                options: ['The server has no resource at that URL', 'The server crashed while handling the request', 'You must log in before viewing the page', 'The resource moved to a new URL'],
                answer: 0,
                explanation: '4xx codes blame the request. 404 means nothing exists at that path. A crash is 500, missing authentication is 401, and a move is a 3xx redirect such as 301.' },
              { id: 'q2', type: 'tf',
                prompt: 'HTTP is stateless: the server does not remember previous requests by itself.',
                answer: true,
                explanation: 'Each request is independent. Sessions are built on top, usually by the server setting a cookie that the browser sends back with every later request.' },
              { id: 'q3', type: 'mc',
                prompt: 'Which HTTP method is NOT idempotent by definition?',
                options: ['POST', 'PUT', 'DELETE', 'GET'],
                answer: 0,
                explanation: 'Idempotent means repeating a request has the same effect as sending it once. Deleting or replacing the same resource twice ends in the same state; posting a form twice can create two orders.' },
              { id: 'q4', type: 'tf',
                prompt: 'HTTPS uses different methods and status codes from HTTP.',
                answer: false,
                explanation: 'HTTPS is ordinary HTTP sent through an encrypted TLS connection. Methods, headers, and status codes are identical; only the transport is protected.' },
              { id: 'q5', type: 'mc',
                prompt: 'When a form is submitted with method="post", where does the browser put the field values?',
                options: ['In the request body', 'In the URL query string', 'In the Host header', 'In a cookie'],
                answer: 0,
                explanation: 'POST sends form data in the body, encoded as application/x-www-form-urlencoded by default. With method="get" the same values would be appended to the URL instead.' },
            ],
          },
        },
        {
          id: 'internet-domain-names',
          title: 'What is a domain name?',
          lessons: [
            {
              id: 'names-for-numbers',
              title: 'Names for numbers',
              minutes: 4,
              screens: [
                {
                  title: 'Why domain names exist',
                  blocks: [
                    { type: 'text', body: 'Computers find each other by IP address, such as 93.184.215.14. People remember names. A domain name is a human-readable label that DNS maps to IP addresses, so a site can move to new servers without changing its name.' },
                  ],
                },
                {
                  title: 'Read a domain right to left',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Top-level domain', body: 'The last label: .com, .org, .uk. Each TLD is run by a registry.' },
                        { title: 'Second-level domain', body: 'The part you register, like example in example.com.' },
                        { title: 'Subdomains', body: 'Labels to the left, like www or api. The domain owner creates as many as they like in their DNS settings.' },
                      ],
                    },
                    { type: 'callout', body: 'Domains are a hierarchy. Each level only needs to know about the level directly below it.' },
                  ],
                },
                {
                  title: 'Registries versus domain registrars',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Registry', points: ['Operates the database for one TLD', 'Example: Verisign runs .com', 'Rarely sells to the public directly'] },
                      right: { title: 'Registrar', points: ['Accredited company that sells registrations', 'Where you buy and renew a domain', 'Lets you set which nameservers it uses'] },
                    },
                    { type: 'text', body: 'You do not buy a domain outright. You register it for a period, usually one to ten years, and must renew it or it becomes available to others.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'internet-domain-names-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'In blog.example.co.uk, which part is the top-level domain?',
                options: ['uk', 'co.uk', 'example', 'blog'],
                answer: 0,
                explanation: 'The TLD is always the last label. co.uk behaves like a public suffix where people register names, but technically it is a second-level domain under .uk.' },
              { id: 'q2', type: 'tf',
                prompt: 'Registering a domain gives you permanent ownership of it.',
                answer: false,
                explanation: 'Registration lasts a fixed term. If you do not renew, the name expires and can eventually be registered by someone else.' },
              { id: 'q3', type: 'mc',
                prompt: 'Who decides what api.example.com points to?',
                options: ['Whoever controls DNS for example.com', 'The registrar that sold example.com', 'The .com registry', 'ICANN'],
                answer: 0,
                explanation: 'Subdomains are records inside the domain owner\'s own DNS zone. The registry and registrar only record which nameservers are authoritative for example.com.' },
              { id: 'q4', type: 'tf',
                prompt: 'A site can move to a server with a new IP address without changing its domain name.',
                answer: true,
                explanation: 'That is the point of the indirection. Update the DNS record and, once caches expire, visitors using the same name reach the new server.' },
              { id: 'q5', type: 'mc',
                prompt: 'What does a domain registrar do?',
                options: ['Sells and manages domain registrations for customers', 'Operates the master database for a TLD', 'Stores and serves your website files', 'Answers DNS lookups for every internet user'],
                answer: 0,
                explanation: 'Registrars are the retail layer: they take your order and pass it to the registry. The TLD database is the registry, file serving is hosting, and lookups are answered by resolvers and nameservers.' },
            ],
          },
        },
        {
          id: 'internet-hosting',
          title: 'What is hosting?',
          lessons: [
            {
              id: 'where-sites-live',
              title: 'Where websites live',
              minutes: 4,
              screens: [
                {
                  title: 'A computer that answers requests',
                  blocks: [
                    { type: 'text', body: 'Hosting means your site runs on a server that is always on, always connected, and reachable at a public IP address. Your domain\'s DNS points at that server, and it responds to every browser that asks.' },
                  ],
                },
                {
                  title: 'Static versus dynamic hosting',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Static hosting', points: ['Serves pre-built HTML, CSS, JS, and images', 'Often fronted by a CDN close to users', 'Cheap, fast, little to maintain', 'No code runs per request'] },
                      right: { title: 'Dynamic hosting', points: ['Runs server code on each request', 'Can read databases and personalise pages', 'Needs runtime updates and monitoring', 'Costs scale with traffic and compute'] },
                    },
                  ],
                },
                {
                  title: 'Shared, VPS, and serverless',
                  blocks: [
                    { type: 'text', body: 'Shared hosting puts many sites on one machine. A VPS gives you an isolated virtual machine with root access. Serverless platforms run your functions on demand and bill per use; servers still exist, but the provider manages them.' },
                    { type: 'callout', body: 'A frontend app compiled to static files can live on any static host or CDN. You need a server only when code must run per request.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'internet-hosting-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'A React app is built into static HTML, CSS, and JS files with no server rendering. What does it need to be hosted?',
                options: ['Any static file host or CDN', 'A server running Node.js', 'A database server', 'A VPS with root access'],
                answer: 0,
                explanation: 'Once built, the files are just files. The browser downloads and runs the JavaScript. Node is only needed if the server must render or compute something per request.' },
              { id: 'q2', type: 'tf',
                prompt: 'A CDN keeps copies of your files on servers near users to reduce latency.',
                answer: true,
                explanation: 'Distance costs time. A CDN caches responses at edge locations around the world so most requests never travel to your origin server.' },
              { id: 'q3', type: 'mc',
                prompt: 'What is the main advantage of a VPS over shared hosting?',
                options: ['Isolated resources and root access to configure the server', 'It is always cheaper', 'You no longer have to maintain the server', 'It includes a global CDN automatically'],
                answer: 0,
                explanation: 'A VPS gives you your own slice of a machine and full control. That control means more maintenance, not less, and it usually costs more than shared hosting.' },
              { id: 'q4', type: 'tf',
                prompt: 'Serverless means your code runs without any servers.',
                answer: false,
                explanation: 'Your code still runs on servers. "Serverless" means you do not provision or manage them; the provider starts and scales them for you.' },
              { id: 'q5', type: 'mc',
                prompt: 'What connects your domain name to your hosting server?',
                options: ['DNS records that point the name at the host', 'Uploading the domain to the server', 'The SSL certificate', 'The registrar storing your files'],
                answer: 0,
                explanation: 'An A, AAAA, or CNAME record tells resolvers where the name lives. Certificates prove identity for HTTPS but do not route anything.' },
            ],
          },
        },
        {
          id: 'internet-dns',
          title: 'DNS and how it works',
          lessons: [
            {
              id: 'name-to-address',
              title: 'How a name becomes an address',
              minutes: 5,
              screens: [
                {
                  title: 'The internet\'s distributed phone book',
                  blocks: [
                    { type: 'callout', body: 'DNS answers one question: what IP address belongs to this name? No single server knows every answer; each one knows who to ask next.' },
                    { type: 'text', body: 'Answers are cached at every level (browser, operating system, resolver) for a time set by each record\'s TTL. Caching is why DNS is fast and why changes take time to spread.' },
                  ],
                },
                {
                  title: 'Resolving a name step by step',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Check caches', body: 'The browser and operating system look for a recent answer first.' },
                        { title: 'Ask a resolver', body: 'A recursive resolver (your ISP\'s, or a public one) does the lookup on your behalf.' },
                        { title: 'Root server', body: 'Replies with a referral: "ask the .com servers".' },
                        { title: 'TLD server', body: 'Replies with the authoritative nameservers for example.com.' },
                        { title: 'Authoritative server', body: 'Returns the actual record. The resolver caches it for the TTL and hands it back.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Common DNS record types',
                  blocks: [
                    { type: 'text', body: 'A maps a name to an IPv4 address, AAAA to IPv6. CNAME makes one name an alias of another. MX names mail servers. TXT holds text, often for domain verification. You can query them yourself with dig.' },
                    { type: 'code', lang: 'bash', body: `dig example.com A +short
dig example.com AAAA +short
dig example.com MX +short
dig www.github.com CNAME +short` },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'internet-dns-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'Which server holds the definitive DNS records for example.com?',
                options: ['The authoritative nameserver for example.com', 'A root server', 'Your recursive resolver', 'The .com TLD server'],
                answer: 0,
                explanation: 'Root and TLD servers only refer you onward, and resolvers only cache. The authoritative nameserver is where the owner\'s records actually live.' },
              { id: 'q2', type: 'tf',
                prompt: 'After you change a DNS record, every user sees the new value immediately.',
                answer: false,
                explanation: 'Resolvers and devices keep cached answers until the old record\'s TTL expires. Lowering the TTL before a planned change makes the switch faster.' },
              { id: 'q3', type: 'mc',
                prompt: 'Which record type maps a name to an IPv6 address?',
                options: ['AAAA', 'A', 'CNAME', 'MX'],
                answer: 0,
                explanation: 'A is for 32-bit IPv4 addresses; AAAA is for 128-bit IPv6 addresses, four times the size, hence four As. CNAME aliases names and MX names mail servers.' },
              { id: 'q4', type: 'mc',
                prompt: 'A resolver asks a root server about www.example.com. What does the root server reply?',
                options: ['A referral to the .com TLD servers', 'The IP address of www.example.com', 'The authoritative nameservers for example.com', 'An error, because roots only answer cached names'],
                answer: 0,
                explanation: 'Root servers only know who runs each TLD. Each step narrows the search: root to TLD, TLD to authoritative server, authoritative server to the answer.' },
              { id: 'q5', type: 'tf',
                prompt: 'A CNAME record points a name at another name rather than at an IP address.',
                answer: true,
                explanation: 'A CNAME says "this name is an alias for that name". The resolver then looks up the target name to get the IP address.' },
            ],
          },
        },
        {
          id: 'internet-browsers',
          title: 'Browsers and how they work',
          lessons: [
            {
              id: 'url-to-pixels',
              title: 'From URL to pixels',
              minutes: 6,
              screens: [
                {
                  title: 'What happens after Enter',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Look up', body: 'DNS turns the hostname into an IP address.' },
                        { title: 'Connect', body: 'The browser opens a connection and, for HTTPS, negotiates TLS encryption.' },
                        { title: 'Request', body: 'It sends an HTTP GET and receives HTML.' },
                        { title: 'Parse', body: 'HTML becomes the DOM; CSS becomes the CSSOM. Further files are fetched as they are discovered.' },
                        { title: 'Render', body: 'Visible nodes and styles form a render tree, then the browser runs layout, paint, and compositing.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Parsing builds two trees',
                  blocks: [
                    { type: 'text', body: 'The DOM holds the document structure; the CSSOM holds the styles. Their combination keeps only what will be drawn, so display: none elements are left out. A plain script tag pauses HTML parsing until it downloads and runs.' },
                    { type: 'code', lang: 'html', body: `<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="styles.css">
    <!-- defer: download in parallel, run after parsing -->
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>` },
                  ],
                },
                {
                  title: 'Layout, paint, and compositing',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Layout (reflow)', points: ['Computes each box\'s size and position', 'Triggered by width, font size, adding elements', 'Can cascade through the whole page', 'The most expensive step'] },
                      right: { title: 'Paint and composite', points: ['Paint fills in colours, text, shadows', 'Triggered by colour or background changes', 'transform and opacity can skip layout and paint', 'Compositing is often done on the GPU'] },
                    },
                    { type: 'callout', body: 'For smooth animation, animate transform and opacity. They avoid recalculating layout on every frame.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'internet-browsers-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'Which element is left out of the render tree?',
                options: ['An element with display: none', 'An element with visibility: hidden', 'An element with opacity: 0', 'An element positioned off-screen'],
                answer: 0,
                explanation: 'display: none removes the element from rendering entirely. visibility: hidden and opacity: 0 still take up space and go through layout, and off-screen elements are still laid out.' },
              { id: 'q2', type: 'tf',
                prompt: 'A script tag in the head without async or defer pauses HTML parsing until the script downloads and runs.',
                answer: true,
                explanation: 'Scripts can modify the document as it is parsed, so the parser waits for classic scripts. defer and async let the download happen in parallel.' },
              { id: 'q3', type: 'mc',
                prompt: 'Changing which property is most likely to trigger layout?',
                options: ['width', 'color', 'opacity', 'transform'],
                answer: 0,
                explanation: 'Width changes the box geometry, which can push other elements around, so layout must rerun. Colour only needs a repaint; opacity and transform can usually be handled by the compositor alone.' },
              { id: 'q4', type: 'mc',
                prompt: 'What does the CSSOM represent?',
                options: ['The parsed styles that apply to the document', 'The pixels drawn on screen', 'The DOM after JavaScript has run', 'The list of files the page downloaded'],
                answer: 0,
                explanation: 'Just as HTML is parsed into the DOM, CSS is parsed into the CSSOM. The browser combines the two to work out what each visible element looks like.' },
              { id: 'q5', type: 'tf',
                prompt: 'Scripts marked defer run in document order after the HTML has been parsed.',
                answer: true,
                explanation: 'Deferred scripts download in parallel but execute in the order they appear, once parsing finishes and before DOMContentLoaded fires. async scripts run as soon as each one arrives, in any order.' },
            ],
          },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // Node 2 — HTML
    // The current roadmap.sh node has no sub-topics; sections follow
    // the sub-topics from earlier editions of the same roadmap.
    // ─────────────────────────────────────────────────────────────
    {
      id: 'html',
      title: 'HTML',
      prereqs: ['internet'],
      sections: [
        {
          id: 'html-basics',
          title: 'Learn the basics',
          lessons: [
            {
              id: 'elements-and-documents',
              title: 'Elements, tags, and documents',
              minutes: 5,
              screens: [
                {
                  title: 'Anatomy of an element',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<a href="https://developer.mozilla.org" title="MDN">Read the docs</a>

<img src="cat.jpg" alt="A ginger cat asleep on a keyboard">` },
                    { type: 'text', body: 'An element is an opening tag, optional attributes, content, and a closing tag. Attributes like href and alt add information. Void elements such as img, input, and br have no content and no closing tag.' },
                  ],
                },
                {
                  title: 'The minimal document skeleton',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, web</h1>
    <p>This is a paragraph.</p>
  </body>
</html>` },
                    { type: 'text', body: 'The doctype puts the browser in standards mode. The head holds metadata that is not displayed; the body holds everything visible. The lang attribute tells screen readers and translators which language to use.' },
                  ],
                },
                {
                  title: 'Block and inline elements',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Block by default', points: ['Starts on a new line', 'Stretches to the full available width', 'Examples: div, p, h1, ul, section'] },
                      right: { title: 'Inline by default', points: ['Flows inside a line of text', 'Only as wide as its content', 'Examples: span, a, strong, em, code'] },
                    },
                    { type: 'callout', body: 'HTML describes meaning and structure. CSS decides how things display, so any element can be made block or inline.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'html-basics-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'What does <!doctype html> do?',
                options: ['Tells the browser to render in standards mode', 'Downloads the HTML specification', 'Sets the page language to English', 'Enables JavaScript on the page'],
                answer: 0,
                explanation: 'Without a doctype, browsers fall back to quirks mode, which emulates old bugs. Language is set with the lang attribute, and JavaScript runs either way.' },
              { id: 'q2', type: 'tf',
                prompt: 'An img element needs a closing </img> tag.',
                answer: false,
                explanation: 'img is a void element: it can never have content, so it has no closing tag. The same applies to input, br, meta, and link.' },
              { id: 'q3', type: 'mc',
                prompt: 'Which element belongs inside <head>?',
                options: ['<title>', '<h1>', '<nav>', '<main>'],
                answer: 0,
                explanation: 'The head holds metadata about the document: title, meta tags, stylesheets. h1, nav, and main are visible content and belong in the body.' },
              { id: 'q4', type: 'tf',
                prompt: 'Whether an element displays as block or inline can be changed with CSS.',
                answer: true,
                explanation: 'Block and inline are default display values from the browser stylesheet. display: block on a span, or display: inline on a div, overrides them.' },
              { id: 'q5', type: 'mc',
                prompt: 'What does the viewport meta tag do?',
                options: ['Makes mobile browsers lay out at the device width', 'Sets the default font size', 'Prevents users from zooming', 'Is required for images to load on mobile'],
                answer: 0,
                explanation: 'Without it, mobile browsers lay pages out on a virtual desktop around 980px wide and shrink the result. width=device-width makes responsive CSS work as intended.' },
            ],
          },
        },
        {
          id: 'html-semantic',
          title: 'Writing semantic HTML',
          lessons: [
            {
              id: 'meaning-over-appearance',
              title: 'Meaning over appearance',
              minutes: 5,
              screens: [
                {
                  title: 'Why semantic markup matters',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Generic divs', points: ['Looks fine once styled', 'Screen readers see no structure', 'Search engines guess at what matters', 'Keyboard behaviour must be rebuilt by hand'] },
                      right: { title: 'Semantic elements', points: ['Same look once styled', 'Landmarks let users jump between regions', 'Clear signals about the main content', 'Buttons, links, and inputs work out of the box'] },
                    },
                  ],
                },
                {
                  title: 'Landmark elements in practice',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<body>
  <header>
    <nav><a href="/">Home</a> <a href="/blog">Blog</a></nav>
  </header>
  <main>
    <article>
      <h1>Learning HTML</h1>
      <p>Semantic elements describe what content is.</p>
    </article>
    <aside>Related posts</aside>
  </main>
  <footer>&copy; 2026 My site</footer>
</body>` },
                  ],
                },
                {
                  title: 'Pick the right element',
                  blocks: [
                    { type: 'callout', body: 'If clicking it goes somewhere, use <a href>. If clicking it does something on this page, use <button>.' },
                    { type: 'text', body: 'Use headings h1 to h6 to outline the page in order, without skipping levels for visual size. article is self-contained content, section is a themed group with a heading, and div is for styling when nothing else fits.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'html-semantic-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'An element opens a dropdown menu on the current page. Which should you use?',
                options: ['<button type="button">', '<a href="#">', '<div onclick="...">', '<span role="link">'],
                answer: 0,
                explanation: 'It performs an action rather than navigating, so it is a button. A button is focusable, works with Enter and Space, and is announced correctly. href="#" misleads assistive tech and changes the URL.' },
              { id: 'q2', type: 'tf',
                prompt: '<section> and <div> mean the same thing to assistive technology.',
                answer: false,
                explanation: 'div carries no meaning. section represents a thematic grouping, and when it has an accessible name, for example from a heading, it is exposed as a region landmark.' },
              { id: 'q3', type: 'mc',
                prompt: 'How many visible <main> elements should a page have?',
                options: ['One', 'One per article', 'As many as needed', 'None; main is deprecated'],
                answer: 0,
                explanation: 'main marks the dominant content of the page, so there is one visible at a time. Screen reader users jump straight to it to skip repeated navigation.' },
              { id: 'q4', type: 'tf',
                prompt: 'Semantic elements help screen reader users because landmarks can be used to jump between page regions.',
                answer: true,
                explanation: 'header, nav, main, and footer map to landmark roles. Screen readers list them so users can skip directly to the region they want.' },
              { id: 'q5', type: 'mc',
                prompt: 'What is <article> for?',
                options: ['Self-contained content that makes sense on its own', 'Any block that has a heading', 'The wrapper around all main content', 'A sidebar of related links'],
                answer: 0,
                explanation: 'An article could be syndicated by itself: a blog post, a comment, a product card. The main wrapper is main, and tangential content is aside.' },
            ],
          },
        },
        {
          id: 'html-forms',
          title: 'Forms and validations',
          lessons: [
            {
              id: 'collecting-input',
              title: 'Collecting user input',
              minutes: 5,
              screens: [
                {
                  title: 'A properly labelled form',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<form action="/signup" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="pw">Password</label>
  <input id="pw" name="password" type="password"
         minlength="8" required>

  <button type="submit">Sign up</button>
</form>` },
                    { type: 'text', body: 'name is the key sent to the server; id links the input to its label. A label\'s for attribute matches an input\'s id, so clicking the label focuses the field and screen readers announce it.' },
                  ],
                },
                {
                  title: 'Validation built into HTML',
                  blocks: [
                    { type: 'text', body: 'Attributes like required, type="email", minlength, max, and pattern let the browser check input before submitting. It blocks submission and shows a message, and you can style failures with the :invalid pseudo-class.' },
                    { type: 'callout', body: 'Client-side validation is for user experience, not security. Anyone can bypass it, so the server must validate everything again.' },
                  ],
                },
                {
                  title: 'Input types do real work',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'type="text" everywhere', points: ['Generic keyboard on phones', 'No built-in checks', 'You write all validation yourself'] },
                      right: { title: 'Specific input types', points: ['email, tel, number show suited keyboards', 'date opens a native picker', 'email and url get format checks for free'] },
                    },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'html-forms-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'Which attribute sets the key a field\'s value is submitted under?',
                options: ['name', 'id', 'for', 'value'],
                answer: 0,
                explanation: 'Form data is sent as name=value pairs. A field without a name is not submitted at all. id is for labels, CSS, and scripts.' },
              { id: 'q2', type: 'tf',
                prompt: 'If an input has required and type="email", the server does not need to validate it.',
                answer: false,
                explanation: 'Browser checks are trivially bypassed with devtools or a direct HTTP request. Always validate on the server; treat client checks as helpful feedback.' },
              { id: 'q3', type: 'mc',
                prompt: 'How do you associate a <label> with an <input>?',
                options: ['Set the label\'s for to the input\'s id', 'Give them the same name', 'Add a placeholder to the input', 'Put aria-label on the label'],
                answer: 0,
                explanation: 'for="email" connects to id="email". Wrapping the input inside the label also works. Matching names do nothing, and a placeholder is not a label.' },
              { id: 'q4', type: 'tf',
                prompt: 'A <button> inside a <form> submits the form by default.',
                answer: true,
                explanation: 'The default type of a button in a form is submit. Use type="button" for buttons that should only run JavaScript, or they will submit unexpectedly.' },
              { id: 'q5', type: 'mc',
                prompt: 'Why should a placeholder not replace a label?',
                options: ['It disappears as soon as the user starts typing', 'Placeholders are not supported on mobile', 'Placeholders break built-in validation', 'Placeholders are sent with the form data'],
                answer: 0,
                explanation: 'Once text is entered, the hint is gone, so users forget what the field wanted. Placeholder text is often low contrast too. It is never submitted and works fine on mobile.' },
            ],
          },
        },
        {
          id: 'html-accessibility',
          title: 'Accessibility',
          lessons: [
            {
              id: 'building-for-everyone',
              title: 'Building for everyone',
              minutes: 5,
              screens: [
                {
                  title: 'Who accessibility is for',
                  blocks: [
                    { type: 'text', body: 'People use the web with screen readers, keyboards only, voice control, zoom, and high contrast. Accessibility makes your site work for all of them, plus anyone with a broken trackpad or bright sunlight. WCAG is the standard most laws reference.' },
                  ],
                },
                {
                  title: 'A practical accessibility checklist',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Text alternatives', body: 'Give meaningful images alt text; use alt="" for decorative ones.' },
                        { title: 'Keyboard access', body: 'Every control is reachable with Tab and shows a visible focus style.' },
                        { title: 'Contrast', body: 'Normal text needs at least 4.5:1 contrast against its background (WCAG AA).' },
                        { title: 'Labels', body: 'Every form field has a label that is announced with it.' },
                        { title: 'Native elements', body: 'Reach for button, a, and input before building custom widgets.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Native first, ARIA second',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<!-- Needs role, tabindex, and key handlers to be usable -->
<div class="btn" onclick="save()">Save</div>

<!-- Focusable, works with Enter and Space, announced as a button -->
<button type="button" onclick="save()">Save</button>` },
                    { type: 'callout', body: 'ARIA changes what assistive tech announces, not how an element behaves. If a native element does the job, use it.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'html-accessibility-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'What alt value should a purely decorative image have?',
                options: ['alt=""', 'No alt attribute at all', 'alt="image"', 'alt="decorative"'],
                answer: 0,
                explanation: 'An empty alt tells screen readers to skip the image. Leaving alt out entirely can make them read the file name, and words like "image" add noise.' },
              { id: 'q2', type: 'tf',
                prompt: 'Adding role="button" to a div makes it fully keyboard accessible.',
                answer: false,
                explanation: 'The role only changes how it is announced. You would still need tabindex="0" and handlers for Enter and Space. A real button provides all of that for free.' },
              { id: 'q3', type: 'mc',
                prompt: 'What is the minimum WCAG AA contrast ratio for normal-sized body text?',
                options: ['4.5:1', '3:1', '7:1', '2:1'],
                answer: 0,
                explanation: '4.5:1 is AA for normal text. 3:1 applies to large text (about 24px, or 18.66px bold), and 7:1 is the stricter AAA level.' },
              { id: 'q4', type: 'tf',
                prompt: 'Removing focus outlines with outline: none, without a replacement style, harms keyboard users.',
                answer: true,
                explanation: 'The focus ring is how keyboard users know where they are. If you dislike the default, restyle it, for example with :focus-visible, rather than removing it.' },
              { id: 'q5', type: 'mc',
                prompt: 'You need an accessible toggle control. What is the best starting point?',
                options: ['A native element such as button or a checkbox input', 'A div with aria-label', 'A span with tabindex="1"', 'An element hidden from screen readers with aria-hidden'],
                answer: 0,
                explanation: 'Native controls already handle focus, keyboard, and announcements. Positive tabindex values scramble the tab order, and aria-hidden would hide the control from assistive tech entirely.' },
            ],
          },
        },
        {
          id: 'html-seo',
          title: 'SEO basics',
          lessons: [
            {
              id: 'helping-search-engines',
              title: 'Helping search engines understand',
              minutes: 4,
              screens: [
                {
                  title: 'How search engines see pages',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Crawl', body: 'Bots follow links and sitemaps to discover URLs and download them.' },
                        { title: 'Render', body: 'Google runs JavaScript to see the final page, but rendering may be delayed.' },
                        { title: 'Index', body: 'The content is analysed and stored, keyed by what it is about.' },
                        { title: 'Rank', body: 'For each search, indexed pages are ordered by relevance and quality.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'Head tags that matter',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<head>
  <title>Sourdough Starter Guide | Bake Lab</title>
  <meta name="description"
        content="Make a sourdough starter in 7 days with flour and water.">
  <link rel="canonical" href="https://example.com/sourdough-starter">
</head>` },
                    { type: 'text', body: 'The title is usually the clickable headline in results. The description may be used as the snippet. canonical names the preferred URL when the same content is reachable at several addresses.' },
                  ],
                },
                {
                  title: 'What helps and what doesn\'t',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Helps', points: ['Unique, useful content', 'One clear h1 and logical headings', 'Descriptive link text', 'Fast, mobile-friendly pages'] },
                      right: { title: 'Myths and mistakes', points: ['Meta keywords (Google ignores them)', 'Keyword stuffing', 'Hidden text for bots', 'Content only visible after a click or login'] },
                    },
                    { type: 'callout', body: 'Good SEO is mostly good HTML: clear structure that both people and machines can read.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'html-seo-quiz',
            questions: [
              { id: 'q1', type: 'tf',
                prompt: 'Google uses the meta keywords tag as a ranking signal.',
                answer: false,
                explanation: 'Google has ignored meta keywords for web ranking since at least 2009, because it was so easily abused. The words on the page itself matter instead.' },
              { id: 'q2', type: 'mc',
                prompt: 'What does <link rel="canonical"> do?',
                options: ['Tells search engines which URL is preferred among duplicates', 'Redirects visitors to another URL', 'Stops search engines from crawling the page', 'Raises the page\'s ranking directly'],
                answer: 0,
                explanation: 'It consolidates signals from duplicate URLs, like ?ref= variants, onto one. It does not redirect users (that is a 301) or block crawling (that is robots.txt).' },
              { id: 'q3', type: 'tf',
                prompt: 'The meta description is always shown as the snippet in search results.',
                answer: false,
                explanation: 'Search engines may write their own snippet from the page text when it better matches the query. A good description raises the odds it is used, but nothing guarantees it.' },
              { id: 'q4', type: 'mc',
                prompt: 'A path is disallowed in robots.txt. What happens?',
                options: ['Well-behaved crawlers skip it, but the URL can still be indexed if linked', 'The page is guaranteed to be removed from search results', 'The page becomes password protected', 'Browsers refuse to load the page'],
                answer: 0,
                explanation: 'robots.txt controls crawling, not indexing. A blocked URL can still appear in results, without a description. To keep a page out, use a noindex directive and let it be crawled.' },
              { id: 'q5', type: 'mc',
                prompt: 'Which link text helps both SEO and accessibility most?',
                options: ['Read our sourdough starter guide', 'Click here', 'More', 'https://example.com/p?id=42'],
                answer: 0,
                explanation: 'Descriptive text tells search engines what the target is about, and screen reader users browsing a list of links can understand it out of context.' },
            ],
          },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // Node 3 — CSS
    // ─────────────────────────────────────────────────────────────
    {
      id: 'css',
      title: 'CSS',
      prereqs: ['html'],
      sections: [
        {
          id: 'css-basics',
          title: 'Learn the basics',
          lessons: [
            {
              id: 'selectors-cascade-box',
              title: 'Selectors, cascade, and box model',
              minutes: 6,
              screens: [
                {
                  title: 'Anatomy of a CSS rule',
                  blocks: [
                    { type: 'code', lang: 'css', body: `/* selector { property: value; } */
p {
  color: #334155;
  line-height: 1.6;
}

.card h2 {
  font-size: 1.25rem;
}

#signup:hover {
  background: #0f766e;
}` },
                    { type: 'text', body: 'A selector picks elements; declarations style them. Type selectors match tags, .class matches classes, #id matches one id, and :hover is a pseudo-class for a state. Combining them with a space targets descendants.' },
                  ],
                },
                {
                  title: 'How the cascade picks winners',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Importance and origin', body: '!important declarations and the origin of the styles (browser, user, author) are compared first.' },
                        { title: 'Specificity', body: 'More specific selectors win: ids beat classes, attributes, and pseudo-classes, which beat type selectors.' },
                        { title: 'Source order', body: 'If everything else ties, the declaration that appears last wins.' },
                      ],
                    },
                    { type: 'text', body: 'Separately, some properties inherit. Text properties like color and font-family pass to children; box properties like margin, border, and background do not.' },
                  ],
                },
                {
                  title: 'Every element is a box',
                  blocks: [
                    { type: 'code', lang: 'css', body: `.box {
  width: 200px;
  padding: 20px;
  border: 2px solid;
  margin: 16px;
}
/* content-box (default): 200 + 40 + 4 = 244px wide */

*, *::before, *::after {
  box-sizing: border-box;
}
/* border-box: the box stays 200px wide */` },
                    { type: 'callout', body: 'Content, padding, border, margin: from the inside out. border-box makes width mean the visible box, which is why most projects set it globally.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'css-basics-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'Which selector has the highest specificity?',
                options: ['#header .link', '.nav .item .link', 'body div ul li a', 'a:hover'],
                answer: 0,
                explanation: 'Specificity compares ids first, then classes, then types. One id outranks any number of classes, so #header .link (1,1,0) beats .nav .item .link (0,3,0).' },
              { id: 'q2', type: 'tf',
                prompt: 'When two rules have equal specificity, the one that comes later wins.',
                answer: true,
                explanation: 'Source order is the final tie-breaker in the cascade. That is why the order of stylesheets and rules matters.' },
              { id: 'q3', type: 'mc',
                prompt: 'With the default box-sizing, an element has width: 100px, padding: 10px, and border: 1px solid. How wide does it render?',
                options: ['122px', '100px', '111px', '120px'],
                answer: 0,
                explanation: 'content-box adds padding and border outside the width: 100 + 10 + 10 + 1 + 1 = 122px. With border-box, it would render at exactly 100px.' },
              { id: 'q4', type: 'tf',
                prompt: 'All CSS properties are inherited by child elements.',
                answer: false,
                explanation: 'Only some are. color, font, and line-height inherit; margin, padding, border, and background do not, otherwise every nested element would get its own border.' },
              { id: 'q5', type: 'mc',
                prompt: 'A paragraph with margin-bottom: 20px sits directly above one with margin-top: 30px. How big is the gap?',
                options: ['30px', '50px', '20px', '25px'],
                answer: 0,
                explanation: 'Adjacent vertical margins between blocks collapse into the larger of the two. Horizontal margins, and margins inside flex or grid containers, do not collapse.' },
            ],
          },
        },
        {
          id: 'css-layouts',
          title: 'Making layouts',
          lessons: [
            {
              id: 'flexbox-and-grid',
              title: 'Flexbox and Grid',
              minutes: 6,
              screens: [
                {
                  title: 'One axis versus two',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Flexbox', points: ['Lays items out along one axis', 'Content decides sizes, then space is shared', 'Great for toolbars, nav bars, centring', 'Wrapped rows size independently'] },
                      right: { title: 'Grid', points: ['Controls rows and columns together', 'The container defines the tracks', 'Great for page layouts and card grids', 'Items line up across rows and columns'] },
                    },
                  ],
                },
                {
                  title: 'Flexbox in a toolbar',
                  blocks: [
                    { type: 'code', lang: 'css', body: `.toolbar {
  display: flex;
  justify-content: space-between; /* main axis */
  align-items: center;            /* cross axis */
  gap: 12px;
}

.toolbar .search {
  flex: 1; /* take the remaining space */
}` },
                    { type: 'text', body: 'justify-content works along the main axis, which is horizontal by default. align-items works on the cross axis. Set flex-direction: column and the two swap.' },
                  ],
                },
                {
                  title: 'Grid for whole layouts',
                  blocks: [
                    { type: 'code', lang: 'css', body: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "sidebar main";
}
.page .sidebar { grid-area: sidebar; }
.page .content { grid-area: main; }` },
                    { type: 'callout', body: 'The fr unit shares leftover space. minmax with auto-fill gives a responsive grid with no media queries.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'css-layouts-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'In a flex container with flex-direction: column, which way does justify-content align items?',
                options: ['Vertically', 'Horizontally', 'Both directions', 'Neither; only align-items works in columns'],
                answer: 0,
                explanation: 'justify-content always follows the main axis. In a column, the main axis runs top to bottom, so it distributes items vertically and align-items handles the horizontal.' },
              { id: 'q2', type: 'tf',
                prompt: 'In a grid, the fr unit divides up the space left after fixed-size tracks are placed.',
                answer: true,
                explanation: 'In "240px 1fr 2fr", 240px is reserved first, then the rest is split into three shares: one for the middle track, two for the last.' },
              { id: 'q3', type: 'mc',
                prompt: 'Cards must line up in both rows and columns on a dashboard. Which tool fits best?',
                options: ['CSS Grid', 'Flexbox with flex-wrap', 'Floats', 'Absolute positioning'],
                answer: 0,
                explanation: 'Wrapped flex rows are sized independently, so columns drift out of alignment. Grid defines shared tracks, so every row lines up.' },
              { id: 'q4', type: 'tf',
                prompt: 'The gap property works in Flexbox as well as Grid.',
                answer: true,
                explanation: 'gap started in Grid but is supported in flex layouts in all modern browsers, replacing margin hacks for spacing between items.' },
              { id: 'q5', type: 'mc',
                prompt: 'An element with position: absolute is positioned relative to what?',
                options: ['Its nearest positioned ancestor', 'Always its direct parent', 'Always the viewport', 'Always the body element'],
                answer: 0,
                explanation: 'It looks up for the closest ancestor with position other than static, falling back to the initial containing block. position: fixed is the one tied to the viewport.' },
            ],
          },
        },
        {
          id: 'css-responsive',
          title: 'Responsive design',
          lessons: [
            {
              id: 'layouts-that-adapt',
              title: 'Layouts that adapt',
              minutes: 5,
              screens: [
                {
                  title: 'Fluid first, breakpoints second',
                  blocks: [
                    { type: 'text', body: 'Responsive design means one page adapts to any screen. Start with flexible layouts and relative units, then add media queries only where the design breaks. It depends on the viewport meta tag being set.' },
                    { type: 'callout', body: 'Choose breakpoints where your content breaks, not where specific devices happen to be.' },
                  ],
                },
                {
                  title: 'Media queries, mobile first',
                  blocks: [
                    { type: 'code', lang: 'css', body: `.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 48rem) {
  .grid { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 64rem) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}` },
                    { type: 'text', body: 'Base styles serve the smallest screen. Each min-width query adds to them as space grows. Smaller screens download the same CSS but simply ignore rules that do not apply.' },
                  ],
                },
                {
                  title: 'Flexible units and images',
                  blocks: [
                    { type: 'code', lang: 'css', body: `img {
  max-width: 100%;
  height: auto;
}

h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
}` },
                    { type: 'text', body: 'rem is relative to the root font size, so it respects the user\'s browser settings. clamp() sets a fluid value with a floor and ceiling. Container queries let a component respond to its container rather than the viewport.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'css-responsive-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'What does mobile-first CSS mean?',
                options: ['Base styles target small screens; min-width queries add styles for larger ones', 'Build a separate site for mobile visitors', 'Write desktop styles, then override them with max-width queries', 'Hide non-essential content on phones'],
                answer: 0,
                explanation: 'You start from the simplest, narrowest layout and progressively enhance. Overriding desktop styles downward tends to produce more CSS and more conflicts.' },
              { id: 'q2', type: 'tf',
                prompt: 'Without the viewport meta tag, phones lay pages out about 980px wide and scale down, so media queries may not behave as expected.',
                answer: true,
                explanation: 'Mobile browsers assume legacy desktop sites. width=device-width tells them the page is designed for the real screen width.' },
              { id: 'q3', type: 'mc',
                prompt: 'What is 1rem equal to?',
                options: ['The font size of the root html element', 'The font size of the parent element', 'Always exactly 16px', '1% of the viewport width'],
                answer: 0,
                explanation: 'rem means root em. The default is often 16px, but users can change it, which is why rem respects accessibility settings. Parent-relative sizing is em; 1vw is 1% of the viewport width.' },
              { id: 'q4', type: 'mc',
                prompt: 'What does font-size: clamp(1rem, 2.5vw, 2rem) produce?',
                options: ['A size that tracks 2.5vw but never goes below 1rem or above 2rem', 'The average of the three values', 'Always 2.5vw', 'A random value within the range'],
                answer: 0,
                explanation: 'clamp(min, preferred, max) uses the preferred value and clamps it to the bounds, giving fluid type that stays readable on small and huge screens.' },
              { id: 'q5', type: 'tf',
                prompt: 'Container queries let a component change its styles based on its container\'s size instead of the viewport.',
                answer: true,
                explanation: 'With container-type set on a parent, @container rules respond to that parent\'s width. The same card can then adapt in a sidebar and in a wide main column.' },
            ],
          },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // Node 4 — JavaScript
    // ─────────────────────────────────────────────────────────────
    {
      id: 'javascript',
      title: 'JavaScript',
      prereqs: ['css'],
      sections: [
        {
          id: 'js-basics',
          title: 'Learn the basics',
          lessons: [
            {
              id: 'values-functions-scope',
              title: 'Values, functions, and scope',
              minutes: 6,
              screens: [
                {
                  title: 'Variables and their types',
                  blocks: [
                    { type: 'code', lang: 'js', body: `const name = 'Ada';  // cannot be reassigned
let count = 0;       // can be reassigned
count += 1;

typeof name;      // 'string'
typeof count;     // 'number'
typeof null;      // 'object' (a historic quirk)

const user = { name, langs: ['js'] };
user.langs.push('css'); // fine: const locks the binding, not the value` },
                    { type: 'text', body: 'Use const by default and let when a value must change. Both are block-scoped. Avoid var, which is function-scoped and causes surprising bugs inside loops and blocks.' },
                  ],
                },
                {
                  title: 'Functions are ordinary values',
                  blocks: [
                    { type: 'code', lang: 'js', body: `const double = (n) => n * 2;
[1, 2, 3].map(double); // [2, 4, 6]

function makeCounter() {
  let count = 0;
  return () => ++count;
}

const next = makeCounter();
next(); // 1
next(); // 2` },
                    { type: 'callout', body: 'A closure is a function that remembers the variables around where it was created, even after that outer function has returned.' },
                  ],
                },
                {
                  title: 'Equality and truthiness rules',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: '== (loose)', points: ['Converts types before comparing', "'0' == 0 is true", 'null == undefined is true', 'Rules are hard to remember'] },
                      right: { title: '=== (strict)', points: ['No type conversion', "'0' === 0 is false", 'null === undefined is false', 'Use it by default'] },
                    },
                    { type: 'text', body: 'In conditions, these values are falsy: false, 0, -0, 0n, empty string, null, undefined, and NaN. Everything else is truthy, including "0", "false", empty arrays, and empty objects.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'js-basics-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'const arr = [1]; arr.push(2); What happens?',
                options: ['arr becomes [1, 2]', 'TypeError: assignment to constant variable', 'arr stays [1]', 'SyntaxError'],
                answer: 0,
                explanation: 'const stops you reassigning the variable, as in arr = [], but the array it points to is still mutable. Object.freeze is what prevents mutation.' },
              { id: 'q2', type: 'tf',
                prompt: "'0' == 0 is true, but '0' === 0 is false.",
                answer: true,
                explanation: 'Loose equality converts the string to a number before comparing. Strict equality checks the types first, and a string is never equal to a number.' },
              { id: 'q3', type: 'mc',
                prompt: 'Which value is truthy?',
                options: ["'0'", '0', "''", 'NaN'],
                answer: 0,
                explanation: "Any non-empty string is truthy, even '0' or 'false'. The number 0, the empty string, and NaN are all on the short list of falsy values." },
              { id: 'q4', type: 'tf',
                prompt: 'let and const are block-scoped, while var is function-scoped.',
                answer: true,
                explanation: 'A let declared inside an if block does not exist outside it. A var leaks out to the whole enclosing function, a classic source of loop bugs.' },
              { id: 'q5', type: 'mc',
                prompt: 'What does a closure allow a function to do?',
                options: ['Use variables from the scope it was created in, after that scope has returned', 'Be called before it is declared', 'Run on a separate thread', 'Read every variable in every other function'],
                answer: 0,
                explanation: 'makeCounter has returned, yet the arrow function still reads and updates count. Calling functions before their declaration is hoisting, a different concept.' },
            ],
          },
        },
        {
          id: 'js-dom',
          title: 'Learn DOM manipulation',
          lessons: [
            {
              id: 'changing-the-page',
              title: 'Changing the page with JavaScript',
              minutes: 5,
              screens: [
                {
                  title: 'The DOM is a live tree',
                  blocks: [
                    { type: 'text', body: 'The browser turns HTML into a tree of objects called the DOM. JavaScript reads and changes those objects, and the browser re-renders. You are editing the live page, not the HTML file the server sent.' },
                  ],
                },
                {
                  title: 'Select, listen, then update',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<button id="like">Like</button>
<p id="count">0 likes</p>

<script>
  const button = document.querySelector('#like');
  const output = document.querySelector('#count');
  let likes = 0;

  button.addEventListener('click', () => {
    likes += 1;
    output.textContent = likes + ' likes';
  });
</script>` },
                    { type: 'text', body: 'querySelector takes any CSS selector and returns the first match, or null. addEventListener runs your function whenever the event fires. The script sits after the elements, so they exist when it runs.' },
                  ],
                },
                {
                  title: 'Adding content without XSS',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'textContent', points: ['Inserts plain text', 'Tags show up as literal characters', 'Safe for user-provided data'] },
                      right: { title: 'innerHTML', points: ['Parses a string as HTML', 'Can inject elements and attributes', 'Untrusted data here enables XSS attacks'] },
                    },
                    { type: 'code', lang: 'js', body: `const li = document.createElement('li');
li.textContent = 'Buy <b>milk</b>'; // shown literally, never parsed
document.querySelector('ul').append(li);` },
                    { type: 'callout', body: 'Events bubble up from the clicked element through its ancestors. One listener on a parent can handle clicks for every child.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'js-dom-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'What does document.querySelectorAll(".item") return?',
                options: ['A static NodeList of all matches', 'A live HTMLCollection that updates automatically', 'A regular JavaScript array', 'Only the first matching element'],
                answer: 0,
                explanation: 'querySelectorAll returns a snapshot NodeList; elements added later are not included. getElementsByClassName returns a live HTMLCollection. Neither is a true array, though NodeList has forEach.' },
              { id: 'q2', type: 'tf',
                prompt: 'Setting innerHTML to text typed by a user can open the page to cross-site scripting.',
                answer: true,
                explanation: 'The string is parsed as HTML, so something like <img src=x onerror=...> runs code. Use textContent for untrusted data, or sanitise it first.' },
              { id: 'q3', type: 'mc',
                prompt: 'Why does event delegation work?',
                options: ['Events bubble from the target up through its ancestors', 'Listeners are copied to child elements automatically', 'The browser batches all events onto the document', 'Only parent elements can receive click events'],
                answer: 0,
                explanation: 'A click on a list item also fires on the ul above it. One listener on the parent can check event.target, which also covers items added later.' },
              { id: 'q4', type: 'tf',
                prompt: 'A plain script in the head that calls document.querySelector("#like") will find a button defined later in the body.',
                answer: false,
                explanation: 'The script runs as soon as the parser reaches it, before the body exists, so it returns null. Use defer, place the script at the end of body, or wait for DOMContentLoaded.' },
              { id: 'q5', type: 'mc',
                prompt: 'What does event.preventDefault() do in a form\'s submit handler?',
                options: ['Stops the browser\'s default submission and page navigation', 'Stops the event from bubbling to parent elements', 'Removes the event listener', 'Clears every field in the form'],
                answer: 0,
                explanation: 'It cancels the built-in action so your JavaScript can send the data with fetch instead. Stopping bubbling is a separate method, stopPropagation().' },
            ],
          },
        },
        {
          id: 'js-fetch',
          title: 'Fetch API and Ajax (XHR)',
          lessons: [
            {
              id: 'talking-to-servers',
              title: 'Talking to servers',
              minutes: 6,
              screens: [
                {
                  title: 'Network requests are asynchronous',
                  blocks: [
                    { type: 'text', body: 'Network requests take time, and JavaScript runs on the page\'s main thread. Instead of freezing the page, fetch returns a Promise right away. await pauses only the surrounding async function; the page keeps responding.' },
                    {
                      type: 'compare',
                      left: { title: 'XMLHttpRequest (XHR)', points: ['The original Ajax API', 'Event and callback based', 'Verbose to set up', 'Built-in upload progress events'] },
                      right: { title: 'fetch', points: ['Modern replacement', 'Promise based, works with async/await', 'Concise request options', 'Streams response bodies'] },
                    },
                  ],
                },
                {
                  title: 'Fetching JSON and checking errors',
                  blocks: [
                    { type: 'code', lang: 'js', body: `async function loadUser(id) {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/' + id);
  if (!res.ok) {
    throw new Error('HTTP ' + res.status);
  }
  return res.json();
}

loadUser(1)
  .then((user) => console.log(user.name))
  .catch((err) => console.error(err));` },
                    { type: 'callout', body: 'fetch rejects only on network failure. A 404 or 500 still resolves, so always check res.ok.' },
                  ],
                },
                {
                  title: 'Sending JSON to servers',
                  blocks: [
                    { type: 'code', lang: 'js', body: `async function addTodo(title) {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, done: false }),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}` },
                    { type: 'text', body: 'fetch does not serialise objects for you, so convert them with JSON.stringify and set the Content-Type header. Requests to another origin also need the server to allow it with CORS headers.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'js-fetch-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'fetch() requests a URL that returns 404. What happens to the promise?',
                options: ['It resolves with a response whose ok is false', 'It rejects with an error', 'It resolves with null', 'It throws synchronously'],
                answer: 0,
                explanation: 'From fetch\'s point of view the request succeeded: a server answered. It rejects only when no response arrives, like a network failure or CORS block. Checking res.ok is your job.' },
              { id: 'q2', type: 'tf',
                prompt: 'await freezes the whole browser tab until the request finishes.',
                answer: false,
                explanation: 'await suspends only the async function it is in. The event loop keeps handling clicks, rendering, and other code, then resumes the function when the promise settles.' },
              { id: 'q3', type: 'mc',
                prompt: 'Why wrap the body in JSON.stringify when POSTing JSON with fetch?',
                options: ['fetch does not serialise plain objects; they would be sent as "[object Object]"', 'fetch only allows string bodies on GET requests', 'It encrypts the request body', 'It compresses the data before sending'],
                answer: 0,
                explanation: 'A plain object passed as body is converted with toString(), which produces "[object Object]". JSON.stringify produces the text the server expects. GET requests cannot have a body at all.' },
              { id: 'q4', type: 'tf',
                prompt: 'response.json() returns a Promise rather than the parsed data directly.',
                answer: true,
                explanation: 'The body may still be streaming in when the headers arrive. json() reads it to the end and parses it, so you need to await it too.' },
              { id: 'q5', type: 'mc',
                prompt: 'A page on https://app.example fetches https://api.other.example, and the browser blocks reading the response. What is the likely cause?',
                options: ['The API does not send CORS headers allowing app.example', 'fetch cannot make requests to other domains', 'Both sites must share the same TLS certificate', 'The browser requires XHR for cross-origin requests'],
                answer: 0,
                explanation: 'Browsers allow cross-origin requests but only expose the response if the server opts in with Access-Control-Allow-Origin. XHR is bound by exactly the same rules.' },
            ],
          },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // Node 5 — Version Control
    // ─────────────────────────────────────────────────────────────
    {
      id: 'version-control',
      title: 'Version control',
      prereqs: ['javascript'],
      sections: [
        {
          id: 'version-control-git',
          title: 'Git',
          lessons: [
            {
              id: 'snapshots-and-branches',
              title: 'Snapshots, commits, and branches',
              minutes: 6,
              screens: [
                {
                  title: 'Why use version control',
                  blocks: [
                    { type: 'text', body: 'Version control records the history of your project so you can see what changed, when, and why, undo mistakes, and work in parallel with others. Git is a distributed system: every clone holds the full history.' },
                    { type: 'callout', body: 'Each Git commit is a snapshot of the whole project. A branch is just a movable pointer to one commit.' },
                  ],
                },
                {
                  title: 'Three places changes live',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Working directory', body: 'The files you edit. Git notices changes but records nothing yet.' },
                        { title: 'Staging area', body: 'git add chooses exactly which changes go into the next commit.' },
                        { title: 'Repository', body: 'git commit saves the staged snapshot with a message, an author, and a link to its parent commit.' },
                      ],
                    },
                  ],
                },
                {
                  title: 'An everyday Git workflow',
                  blocks: [
                    { type: 'code', lang: 'bash', body: `git init
git add index.html
git commit -m "Add homepage"

git switch -c feature/nav     # create and move to a branch
# ...edit files, add, commit...

git switch main
git merge feature/nav
git log --oneline --graph` },
                    {
                      type: 'compare',
                      left: { title: 'git merge', points: ['Joins two histories with a merge commit', 'Keeps history exactly as it happened', 'Safe on shared branches'] },
                      right: { title: 'git rebase', points: ['Replays your commits on top of another branch', 'Produces a straight, linear history', 'Rewrites commit hashes; avoid on shared branches'] },
                    },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'version-control-git-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'What is a Git branch?',
                options: ['A lightweight, movable pointer to a commit', 'A full copy of every project file', 'A separate repository on the server', 'A folder inside the .git directory holding changed files'],
                answer: 0,
                explanation: 'A branch is a tiny file containing a commit hash. Each new commit moves the pointer forward, which is why branching in Git is instant and cheap.' },
              { id: 'q2', type: 'tf',
                prompt: 'Running git commit with no flags includes every modified file in your working directory.',
                answer: false,
                explanation: 'Only staged changes are committed. You choose them with git add; the -a flag stages modified tracked files automatically.' },
              { id: 'q3', type: 'mc',
                prompt: 'How does Git model each commit?',
                options: ['As a snapshot of the whole project', 'As a list of line-by-line diffs from the previous commit', 'As just the names of the files that changed', 'As an archive uploaded to a server'],
                answer: 0,
                explanation: 'A commit points to a full tree of files. Unchanged files are reused rather than copied, and storage may be compressed internally, but conceptually every commit is complete.' },
              { id: 'q4', type: 'tf',
                prompt: 'Git and GitHub are the same thing.',
                answer: false,
                explanation: 'Git is the version control tool that runs on your machine. GitHub is a hosting service for Git repositories, adding pull requests and collaboration features.' },
              { id: 'q5', type: 'mc',
                prompt: 'Why is rebasing a branch others have already pulled risky?',
                options: ['It rewrites commits with new hashes, so histories diverge', 'It deletes the remote branch', 'It merges unrelated projects together', 'It cannot be undone'],
                answer: 0,
                explanation: 'Rebased commits are new objects. Teammates still have the old ones, so their next pull produces duplicates and conflicts. A rebase can be undone locally through the reflog.' },
            ],
          },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // Stubs — remaining roadmap.sh/frontend nodes, in roadmap order
    // ─────────────────────────────────────────────────────────────
    {
      id: 'vcs-hosting',
      title: 'VCS hosting',
      prereqs: ['version-control'],
      sections: [
        { id: 'vcs-hosting-github', title: 'GitHub', lessons: [{ id: 'vcs-hosting-github-lesson', title: 'GitHub', minutes: 5, screens: [] }], quiz: { id: 'vcs-hosting-github-quiz', questions: [] } },
        { id: 'vcs-hosting-gitlab', title: 'GitLab', lessons: [{ id: 'vcs-hosting-gitlab-lesson', title: 'GitLab', minutes: 5, screens: [] }], quiz: { id: 'vcs-hosting-gitlab-quiz', questions: [] } },
      ],
    },
    {
      id: 'package-managers',
      title: 'Package managers',
      prereqs: ['javascript'],
      sections: [
        { id: 'package-managers-npm', title: 'npm', lessons: [{ id: 'package-managers-npm-lesson', title: 'npm', minutes: 5, screens: [] }], quiz: { id: 'package-managers-npm-quiz', questions: [] } },
        { id: 'package-managers-yarn', title: 'yarn', lessons: [{ id: 'package-managers-yarn-lesson', title: 'yarn', minutes: 5, screens: [] }], quiz: { id: 'package-managers-yarn-quiz', questions: [] } },
        { id: 'package-managers-pnpm', title: 'pnpm', lessons: [{ id: 'package-managers-pnpm-lesson', title: 'pnpm', minutes: 5, screens: [] }], quiz: { id: 'package-managers-pnpm-quiz', questions: [] } },
        { id: 'package-managers-bun', title: 'Bun', lessons: [{ id: 'package-managers-bun-lesson', title: 'Bun', minutes: 5, screens: [] }], quiz: { id: 'package-managers-bun-quiz', questions: [] } },
      ],
    },
    {
      id: 'css-frameworks',
      title: 'CSS frameworks',
      prereqs: ['css', 'package-managers'],
      sections: [
        { id: 'css-frameworks-tailwind', title: 'Tailwind', lessons: [{ id: 'css-frameworks-tailwind-lesson', title: 'Tailwind', minutes: 5, screens: [] }], quiz: { id: 'css-frameworks-tailwind-quiz', questions: [] } },
      ],
    },
    {
      id: 'learn-a-framework',
      title: 'Learn a framework',
      prereqs: ['javascript', 'package-managers'],
      sections: [
        { id: 'framework-react', title: 'React', lessons: [{ id: 'framework-react-lesson', title: 'React', minutes: 5, screens: [] }], quiz: { id: 'framework-react-quiz', questions: [] } },
        { id: 'framework-vue', title: 'Vue.js', lessons: [{ id: 'framework-vue-lesson', title: 'Vue.js', minutes: 5, screens: [] }], quiz: { id: 'framework-vue-quiz', questions: [] } },
        { id: 'framework-angular', title: 'Angular', lessons: [{ id: 'framework-angular-lesson', title: 'Angular', minutes: 5, screens: [] }], quiz: { id: 'framework-angular-quiz', questions: [] } },
        { id: 'framework-svelte', title: 'Svelte', lessons: [{ id: 'framework-svelte-lesson', title: 'Svelte', minutes: 5, screens: [] }], quiz: { id: 'framework-svelte-quiz', questions: [] } },
        { id: 'framework-solid', title: 'Solid JS', lessons: [{ id: 'framework-solid-lesson', title: 'Solid JS', minutes: 5, screens: [] }], quiz: { id: 'framework-solid-quiz', questions: [] } },
      ],
    },
    {
      id: 'ai-assisted-coding',
      title: 'AI assisted coding',
      prereqs: ['learn-a-framework'],
      sections: [
        { id: 'ai-how-llms-work', title: 'How LLMs work', lessons: [{ id: 'ai-how-llms-work-lesson', title: 'How LLMs work', minutes: 5, screens: [] }], quiz: { id: 'ai-how-llms-work-quiz', questions: [] } },
        { id: 'ai-vs-traditional', title: 'AI vs traditional coding', lessons: [{ id: 'ai-vs-traditional-lesson', title: 'AI vs traditional coding', minutes: 5, screens: [] }], quiz: { id: 'ai-vs-traditional-quiz', questions: [] } },
        { id: 'ai-applications', title: 'Applications', lessons: [{ id: 'ai-applications-lesson', title: 'Applications', minutes: 5, screens: [] }], quiz: { id: 'ai-applications-quiz', questions: [] } },
        { id: 'ai-code-reviews', title: 'Code reviews', lessons: [{ id: 'ai-code-reviews-lesson', title: 'Code reviews', minutes: 5, screens: [] }], quiz: { id: 'ai-code-reviews-quiz', questions: [] } },
        { id: 'ai-refactoring', title: 'Refactoring', lessons: [{ id: 'ai-refactoring-lesson', title: 'Refactoring', minutes: 5, screens: [] }], quiz: { id: 'ai-refactoring-quiz', questions: [] } },
        { id: 'ai-docs-generation', title: 'Docs generation', lessons: [{ id: 'ai-docs-generation-lesson', title: 'Docs generation', minutes: 5, screens: [] }], quiz: { id: 'ai-docs-generation-quiz', questions: [] } },
        { id: 'ai-tool-claude-code', title: 'Claude Code', lessons: [{ id: 'ai-tool-claude-code-lesson', title: 'Claude Code', minutes: 5, screens: [] }], quiz: { id: 'ai-tool-claude-code-quiz', questions: [] } },
        { id: 'ai-tool-cursor', title: 'Cursor', lessons: [{ id: 'ai-tool-cursor-lesson', title: 'Cursor', minutes: 5, screens: [] }], quiz: { id: 'ai-tool-cursor-quiz', questions: [] } },
        { id: 'ai-tool-copilot', title: 'Copilot', lessons: [{ id: 'ai-tool-copilot-lesson', title: 'Copilot', minutes: 5, screens: [] }], quiz: { id: 'ai-tool-copilot-quiz', questions: [] } },
        { id: 'ai-tool-antigravity', title: 'Antigravity', lessons: [{ id: 'ai-tool-antigravity-lesson', title: 'Antigravity', minutes: 5, screens: [] }], quiz: { id: 'ai-tool-antigravity-quiz', questions: [] } },
      ],
    },
    {
      id: 'prompting-techniques',
      title: 'Prompting techniques',
      prereqs: ['ai-assisted-coding'],
      sections: [
        { id: 'prompting-techniques-intro', title: 'Prompting techniques', lessons: [{ id: 'prompting-techniques-lesson', title: 'Prompting techniques', minutes: 5, screens: [] }], quiz: { id: 'prompting-techniques-quiz', questions: [] } },
      ],
    },
    {
      id: 'agents',
      title: 'Agents',
      prereqs: ['prompting-techniques'],
      sections: [
        { id: 'agents-intro', title: 'Agents', lessons: [{ id: 'agents-lesson', title: 'Agents', minutes: 5, screens: [] }], quiz: { id: 'agents-quiz', questions: [] } },
      ],
    },
    {
      id: 'mcp',
      title: 'MCP',
      prereqs: ['agents'],
      sections: [
        { id: 'mcp-intro', title: 'MCP', lessons: [{ id: 'mcp-lesson', title: 'MCP', minutes: 5, screens: [] }], quiz: { id: 'mcp-quiz', questions: [] } },
      ],
    },
    {
      id: 'skills',
      title: 'Skills',
      prereqs: ['agents'],
      sections: [
        { id: 'skills-intro', title: 'Skills', lessons: [{ id: 'skills-lesson', title: 'Skills', minutes: 5, screens: [] }], quiz: { id: 'skills-quiz', questions: [] } },
      ],
    },
    {
      id: 'implementing-ai',
      title: 'Implementing AI',
      prereqs: ['ai-assisted-coding'],
      sections: [
        { id: 'implementing-ai-gemini', title: 'Gemini', lessons: [{ id: 'implementing-ai-gemini-lesson', title: 'Gemini', minutes: 5, screens: [] }], quiz: { id: 'implementing-ai-gemini-quiz', questions: [] } },
        { id: 'implementing-ai-openai', title: 'OpenAI', lessons: [{ id: 'implementing-ai-openai-lesson', title: 'OpenAI', minutes: 5, screens: [] }], quiz: { id: 'implementing-ai-openai-quiz', questions: [] } },
        { id: 'implementing-ai-anthropic', title: 'Anthropic', lessons: [{ id: 'implementing-ai-anthropic-lesson', title: 'Anthropic', minutes: 5, screens: [] }], quiz: { id: 'implementing-ai-anthropic-quiz', questions: [] } },
      ],
    },
    {
      id: 'auth-strategies',
      title: 'Auth strategies',
      prereqs: ['learn-a-framework'],
      sections: [
        { id: 'auth-strategies-intro', title: 'Auth strategies', lessons: [{ id: 'auth-strategies-lesson', title: 'Auth strategies', minutes: 5, screens: [] }], quiz: { id: 'auth-strategies-quiz', questions: [] } },
      ],
    },
    {
      id: 'module-bundlers',
      title: 'Module bundlers',
      prereqs: ['package-managers'],
      sections: [
        { id: 'bundlers-vite', title: 'Vite', lessons: [{ id: 'bundlers-vite-lesson', title: 'Vite', minutes: 5, screens: [] }], quiz: { id: 'bundlers-vite-quiz', questions: [] } },
        { id: 'bundlers-swc', title: 'SWC', lessons: [{ id: 'bundlers-swc-lesson', title: 'SWC', minutes: 5, screens: [] }], quiz: { id: 'bundlers-swc-quiz', questions: [] } },
        { id: 'bundlers-esbuild', title: 'esbuild', lessons: [{ id: 'bundlers-esbuild-lesson', title: 'esbuild', minutes: 5, screens: [] }], quiz: { id: 'bundlers-esbuild-quiz', questions: [] } },
        { id: 'bundlers-rollup', title: 'Rollup', lessons: [{ id: 'bundlers-rollup-lesson', title: 'Rollup', minutes: 5, screens: [] }], quiz: { id: 'bundlers-rollup-quiz', questions: [] } },
        { id: 'bundlers-rolldown', title: 'Rolldown', lessons: [{ id: 'bundlers-rolldown-lesson', title: 'Rolldown', minutes: 5, screens: [] }], quiz: { id: 'bundlers-rolldown-quiz', questions: [] } },
        { id: 'bundlers-parcel', title: 'Parcel', lessons: [{ id: 'bundlers-parcel-lesson', title: 'Parcel', minutes: 5, screens: [] }], quiz: { id: 'bundlers-parcel-quiz', questions: [] } },
      ],
    },
    {
      id: 'linters-formatters',
      title: 'Linters and formatters',
      prereqs: ['package-managers'],
      sections: [
        { id: 'linters-biome', title: 'Biome', lessons: [{ id: 'linters-biome-lesson', title: 'Biome', minutes: 5, screens: [] }], quiz: { id: 'linters-biome-quiz', questions: [] } },
        { id: 'linters-prettier', title: 'Prettier', lessons: [{ id: 'linters-prettier-lesson', title: 'Prettier', minutes: 5, screens: [] }], quiz: { id: 'linters-prettier-quiz', questions: [] } },
        { id: 'linters-eslint', title: 'ESLint', lessons: [{ id: 'linters-eslint-lesson', title: 'ESLint', minutes: 5, screens: [] }], quiz: { id: 'linters-eslint-quiz', questions: [] } },
      ],
    },
    {
      id: 'web-security',
      title: 'Web security',
      prereqs: ['javascript'],
      sections: [
        { id: 'web-security-cors', title: 'CORS', lessons: [{ id: 'web-security-cors-lesson', title: 'CORS', minutes: 5, screens: [] }], quiz: { id: 'web-security-cors-quiz', questions: [] } },
        { id: 'web-security-https', title: 'HTTPS', lessons: [{ id: 'web-security-https-lesson', title: 'HTTPS', minutes: 5, screens: [] }], quiz: { id: 'web-security-https-quiz', questions: [] } },
        { id: 'web-security-csp', title: 'CSP', lessons: [{ id: 'web-security-csp-lesson', title: 'CSP', minutes: 5, screens: [] }], quiz: { id: 'web-security-csp-quiz', questions: [] } },
        { id: 'web-security-owasp', title: 'OWASP risks', lessons: [{ id: 'web-security-owasp-lesson', title: 'OWASP risks', minutes: 5, screens: [] }], quiz: { id: 'web-security-owasp-quiz', questions: [] } },
      ],
    },
    {
      id: 'testing',
      title: 'Testing',
      prereqs: ['learn-a-framework'],
      sections: [
        { id: 'testing-vitest', title: 'Vitest', lessons: [{ id: 'testing-vitest-lesson', title: 'Vitest', minutes: 5, screens: [] }], quiz: { id: 'testing-vitest-quiz', questions: [] } },
        { id: 'testing-playwright', title: 'Playwright', lessons: [{ id: 'testing-playwright-lesson', title: 'Playwright', minutes: 5, screens: [] }], quiz: { id: 'testing-playwright-quiz', questions: [] } },
        { id: 'testing-cypress', title: 'Cypress', lessons: [{ id: 'testing-cypress-lesson', title: 'Cypress', minutes: 5, screens: [] }], quiz: { id: 'testing-cypress-quiz', questions: [] } },
        { id: 'testing-jest', title: 'Jest', lessons: [{ id: 'testing-jest-lesson', title: 'Jest', minutes: 5, screens: [] }], quiz: { id: 'testing-jest-quiz', questions: [] } },
      ],
    },
    {
      id: 'web-apis',
      title: 'Web APIs',
      prereqs: ['javascript'],
      sections: [
        { id: 'web-apis-intro', title: 'Web APIs', lessons: [{ id: 'web-apis-lesson', title: 'Web APIs', minutes: 5, screens: [] }], quiz: { id: 'web-apis-quiz', questions: [] } },
      ],
    },
    {
      id: 'ssr',
      title: 'Server-side rendering',
      prereqs: ['learn-a-framework'],
      sections: [
        { id: 'ssr-nextjs', title: 'Next.js', lessons: [{ id: 'ssr-nextjs-lesson', title: 'Next.js', minutes: 5, screens: [] }], quiz: { id: 'ssr-nextjs-quiz', questions: [] } },
        { id: 'ssr-tanstack-start', title: 'Tanstack Start', lessons: [{ id: 'ssr-tanstack-start-lesson', title: 'Tanstack Start', minutes: 5, screens: [] }], quiz: { id: 'ssr-tanstack-start-quiz', questions: [] } },
        { id: 'ssr-react-router', title: 'react-router', lessons: [{ id: 'ssr-react-router-lesson', title: 'react-router', minutes: 5, screens: [] }], quiz: { id: 'ssr-react-router-quiz', questions: [] } },
        { id: 'ssr-astro', title: 'Astro', lessons: [{ id: 'ssr-astro-lesson', title: 'Astro', minutes: 5, screens: [] }], quiz: { id: 'ssr-astro-quiz', questions: [] } },
        { id: 'ssr-nuxt', title: 'Nuxt.js', lessons: [{ id: 'ssr-nuxt-lesson', title: 'Nuxt.js', minutes: 5, screens: [] }], quiz: { id: 'ssr-nuxt-quiz', questions: [] } },
        { id: 'ssr-sveltekit', title: 'SvelteKit', lessons: [{ id: 'ssr-sveltekit-lesson', title: 'SvelteKit', minutes: 5, screens: [] }], quiz: { id: 'ssr-sveltekit-quiz', questions: [] } },
        { id: 'ssr-angular', title: 'Angular', lessons: [{ id: 'ssr-angular-lesson', title: 'Angular', minutes: 5, screens: [] }], quiz: { id: 'ssr-angular-quiz', questions: [] } },
      ],
    },
    {
      id: 'deployment',
      title: 'Deployment',
      prereqs: ['vcs-hosting', 'module-bundlers'],
      sections: [
        { id: 'deployment-github-pages', title: 'GitHub Pages', lessons: [{ id: 'deployment-github-pages-lesson', title: 'GitHub Pages', minutes: 5, screens: [] }], quiz: { id: 'deployment-github-pages-quiz', questions: [] } },
        { id: 'deployment-vercel', title: 'Vercel', lessons: [{ id: 'deployment-vercel-lesson', title: 'Vercel', minutes: 5, screens: [] }], quiz: { id: 'deployment-vercel-quiz', questions: [] } },
        { id: 'deployment-netlify', title: 'Netlify', lessons: [{ id: 'deployment-netlify-lesson', title: 'Netlify', minutes: 5, screens: [] }], quiz: { id: 'deployment-netlify-quiz', questions: [] } },
        { id: 'deployment-cloudflare', title: 'Cloudflare', lessons: [{ id: 'deployment-cloudflare-lesson', title: 'Cloudflare', minutes: 5, screens: [] }], quiz: { id: 'deployment-cloudflare-quiz', questions: [] } },
        { id: 'deployment-railway', title: 'Railway', lessons: [{ id: 'deployment-railway-lesson', title: 'Railway', minutes: 5, screens: [] }], quiz: { id: 'deployment-railway-quiz', questions: [] } },
        { id: 'deployment-render', title: 'Render', lessons: [{ id: 'deployment-render-lesson', title: 'Render', minutes: 5, screens: [] }], quiz: { id: 'deployment-render-quiz', questions: [] } },
      ],
    },
    {
      id: 'type-checkers',
      title: 'Type checkers',
      prereqs: ['javascript'],
      sections: [
        { id: 'type-checkers-intro', title: 'Type checkers', lessons: [{ id: 'type-checkers-lesson', title: 'Type checkers', minutes: 5, screens: [] }], quiz: { id: 'type-checkers-quiz', questions: [] } },
      ],
    },
    {
      id: 'ssg',
      title: 'Static site generators',
      prereqs: ['learn-a-framework'],
      sections: [
        { id: 'ssg-astro', title: 'Astro', lessons: [{ id: 'ssg-astro-lesson', title: 'Astro', minutes: 5, screens: [] }], quiz: { id: 'ssg-astro-quiz', questions: [] } },
        { id: 'ssg-nextjs', title: 'Next.js', lessons: [{ id: 'ssg-nextjs-lesson', title: 'Next.js', minutes: 5, screens: [] }], quiz: { id: 'ssg-nextjs-quiz', questions: [] } },
        { id: 'ssg-vuepress', title: 'Vuepress', lessons: [{ id: 'ssg-vuepress-lesson', title: 'Vuepress', minutes: 5, screens: [] }], quiz: { id: 'ssg-vuepress-quiz', questions: [] } },
        { id: 'ssg-eleventy', title: 'Eleventy', lessons: [{ id: 'ssg-eleventy-lesson', title: 'Eleventy', minutes: 5, screens: [] }], quiz: { id: 'ssg-eleventy-quiz', questions: [] } },
        { id: 'ssg-nuxt', title: 'Nuxt.js', lessons: [{ id: 'ssg-nuxt-lesson', title: 'Nuxt.js', minutes: 5, screens: [] }], quiz: { id: 'ssg-nuxt-quiz', questions: [] } },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // Design systems — the roadmap.sh node has no sub-topics; sections
    // split it into foundations, tokens, and components.
    // ─────────────────────────────────────────────────────────────
    {
      id: 'design-systems',
      title: 'Design systems',
      prereqs: ['css-frameworks'],
      sections: [
        {
          id: 'design-systems-foundations',
          title: 'What is a design system?',
          lessons: [
            {
              id: 'more-than-a-library',
              title: 'More than a component library',
              minutes: 5,
              screens: [
                {
                  title: 'What a design system contains',
                  blocks: [
                    { type: 'text', body: 'A design system is the shared set of decisions, components, and guidelines that lets many people build consistent interfaces. It covers foundations like colour, type, and spacing; reusable components; documentation; and the process for changing all of it.' },
                    { type: 'callout', body: 'A design system is a product. Its users are the designers and developers who build with it.' },
                  ],
                },
                {
                  title: 'Component library versus design system',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Component library', points: ['Reusable coded UI pieces', 'Answers "how do I build this?"', 'Lives in one codebase', 'Can exist without any guidelines'] },
                      right: { title: 'Design system', points: ['Library plus tokens, guidelines, and design files', 'Also answers "when and why should I use this?"', 'Shared by design and engineering', 'Has owners and a process for change'] },
                    },
                  ],
                },
                {
                  title: 'Why teams invest in one',
                  blocks: [
                    { type: 'text', body: 'Teams stop rebuilding the same button. Fix accessibility or a brand colour once and every product picks it up on the next update. The cost is real too: a system needs owners, maintenance, and buy-in, or it drifts out of date and teams route around it.' },
                    { type: 'callout', body: 'Extract a system from patterns you already repeat. Designing one in a vacuum produces components nobody needs.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'design-systems-foundations-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'Which best describes a design system?',
                options: ['Shared decisions, components, guidelines, and a process for evolving them', 'A design file containing every screen of the product', 'A CSS framework such as Bootstrap', 'A brand guide covering logo and colour usage'],
                answer: 0,
                explanation: 'Each distractor is one ingredient at most. A system combines foundations, components, and documentation with ownership and a way to change them, so it keeps working as products grow.' },
              { id: 'q2', type: 'tf',
                prompt: 'A component library on its own is a complete design system.',
                answer: false,
                explanation: 'A library tells you how to build a component, not when to use it. Without tokens, guidelines, and governance, teams use the same pieces inconsistently.' },
              { id: 'q3', type: 'mc',
                prompt: 'A focus-style bug is fixed in the design system\'s Button. What is the main benefit?',
                options: ['Every product using the Button gets the fix when it updates', 'Designers no longer need to test for accessibility', 'Screen readers give system components priority', 'Products no longer need semantic HTML'],
                answer: 0,
                explanation: 'Centralising the component means one fix spreads everywhere it is used. Testing and semantic HTML are still needed for everything the system does not cover.' },
              { id: 'q4', type: 'tf',
                prompt: 'A design system needs ongoing ownership and maintenance to stay useful.',
                answer: true,
                explanation: 'Products and brands change. An unowned system goes stale, and teams start building their own versions instead, which brings back the inconsistency it was meant to remove.' },
              { id: 'q5', type: 'mc',
                prompt: 'When is a good time to start a design system?',
                options: ['When the same patterns are being rebuilt inconsistently across screens or teams', 'Before the first screen of the product is designed', 'Only once the company has over a hundred engineers', 'Only after a full redesign has shipped'],
                answer: 0,
                explanation: 'Repetition and inconsistency are the signal that shared components will pay off. Starting before any product exists means guessing which components are needed.' },
            ],
          },
        },
        {
          id: 'design-systems-tokens',
          title: 'Design tokens',
          lessons: [
            {
              id: 'decisions-as-data',
              title: 'Design decisions stored as data',
              minutes: 5,
              screens: [
                {
                  title: 'What a design token is',
                  blocks: [
                    { type: 'text', body: 'A design token is a named value for a design decision: a colour, a spacing step, a font size, a radius, an animation duration. Design files and code refer to the name, not the raw value, so changing the token updates everything that uses it.' },
                    { type: 'callout', body: 'Tokens are the single source of truth that keeps design tools, web, iOS, and Android in sync.' },
                  ],
                },
                {
                  title: 'Primitive tokens and semantic tokens',
                  blocks: [
                    {
                      type: 'compare',
                      left: { title: 'Primitive tokens', points: ['The raw palette and scales', 'Named for what they are: blue-600', 'Carry no usage intent', 'Rarely change'] },
                      right: { title: 'Semantic tokens', points: ['Point at primitives', 'Named for what they do: color-action', 'Components use these', 'Remapped for themes and dark mode'] },
                    },
                    { type: 'text', body: 'Spacing and type use scales, such as 4, 8, 12, 16, 24, 32. A short list of allowed steps creates visual rhythm and saves people from debating 13px versus 14px.' },
                  ],
                },
                {
                  title: 'Tokens as CSS custom properties',
                  blocks: [
                    { type: 'code', lang: 'css', body: `:root {
  --blue-600: #2563eb;
  --gray-50: #f9fafb;
  --gray-900: #111827;

  --color-bg: var(--gray-50);
  --color-text: var(--gray-900);
  --color-action: var(--blue-600);
}
[data-theme="dark"] {
  --color-bg: var(--gray-900);
  --color-text: var(--gray-50);
}
body { background: var(--color-bg); color: var(--color-text); }` },
                    { type: 'text', body: 'Components only read semantic tokens, so dark mode is just remapping them. Teams often keep tokens in JSON and generate CSS, iOS, and Android outputs with a tool like Style Dictionary. A W3C community group is standardising the JSON format.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'design-systems-tokens-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'What is a design token?',
                options: ['A named, platform-neutral value that represents a design decision', 'A reusable UI component', 'An access token for a design tool\'s API', 'A CSS utility class that applies one style'],
                answer: 0,
                explanation: 'A token is data, such as color-action = #2563eb, that can be turned into CSS variables, Swift constants, or design tool styles. Components and utility classes consume tokens.' },
              { id: 'q2', type: 'tf',
                prompt: 'Components should reference primitive tokens like blue-600 directly.',
                answer: false,
                explanation: 'If a button uses blue-600, a theme cannot change it without editing the component. Referencing color-action lets each theme map that role to a different primitive.' },
              { id: 'q3', type: 'mc',
                prompt: 'With semantic tokens in place, how is dark mode usually implemented?',
                options: ['Reassign the semantic tokens to different primitives under a theme selector', 'Duplicate every component with a dark version', 'Override each component\'s colours with !important', 'Change the values of the primitive tokens'],
                answer: 0,
                explanation: 'Only the mapping changes: color-bg points at gray-900 instead of gray-50. Changing primitives would make blue-600 no longer mean blue, breaking anything that uses it on purpose.' },
              { id: 'q4', type: 'tf',
                prompt: 'A custom property defined on :root can be redefined on a descendant to change it for that subtree only.',
                answer: true,
                explanation: 'Custom properties inherit like other inherited properties. Setting --color-bg on [data-theme="dark"] affects that element and its descendants, which is what makes scoped theming work.' },
              { id: 'q5', type: 'mc',
                prompt: 'Why use a spacing scale such as 4, 8, 12, 16, 24, 32 instead of any value?',
                options: ['A limited set of steps gives consistent rhythm and faster decisions', 'Browsers render multiples of 4 faster', 'Responsive layouts require multiples of 4', 'CSS rejects arbitrary pixel values'],
                answer: 0,
                explanation: 'The benefit is consistency for people, not performance for machines. CSS accepts any length; the scale is a deliberate constraint the team agrees on.' },
            ],
          },
        },
        {
          id: 'design-systems-components',
          title: 'Components and documentation',
          lessons: [
            {
              id: 'components-people-adopt',
              title: 'Building components people adopt',
              minutes: 6,
              screens: [
                {
                  title: 'A constrained, accessible component',
                  blocks: [
                    { type: 'code', lang: 'html', body: `<style>
  .btn {
    font: inherit;
    border: 0;
    border-radius: var(--radius-md, 6px);
    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
  }
  .btn--primary { background: var(--color-action, #2563eb); color: #fff; }
  .btn--secondary { background: transparent; box-shadow: inset 0 0 0 1px currentColor; }
  .btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
</style>

<button class="btn btn--primary">Save</button>
<button class="btn btn--secondary">Cancel</button>` },
                    { type: 'text', body: 'Good components offer a few named variants built from tokens, not unlimited styling options. They are accessible by default: a real button element and a visible focus style, so every team gets them without thinking about it.' },
                  ],
                },
                {
                  title: 'Small pieces compose into patterns',
                  blocks: [
                    {
                      type: 'steps',
                      items: [
                        { title: 'Atoms', body: 'The smallest elements: a button, an input, a label.' },
                        { title: 'Molecules', body: 'A few atoms working together, like a search field made of a label, an input, and a button.' },
                        { title: 'Organisms', body: 'Larger sections built from molecules, like a site header with logo, navigation, and search.' },
                        { title: 'Templates and pages', body: 'Organisms arranged into layouts, then filled with real content.' },
                      ],
                    },
                    { type: 'text', body: 'This model, called atomic design, comes from Brad Frost. You do not need its exact names, but the idea holds: build small, well-tested parts and compose them rather than designing every screen from scratch.' },
                  ],
                },
                {
                  title: 'Documentation and change process',
                  blocks: [
                    { type: 'text', body: 'Every component needs docs: when to use it and when not to, its variants, accessibility notes, and live examples. Tools like Storybook show components in isolation. Publish the library as a versioned package, using semantic versioning so breaking changes only land in major releases.' },
                    { type: 'callout', body: 'A system survives when teams can propose changes to it. If forking is the only option, teams will fork.' },
                  ],
                },
              ],
            },
          ],
          quiz: {
            id: 'design-systems-components-quiz',
            questions: [
              { id: 'q1', type: 'mc',
                prompt: 'Why give a Button a few named variants instead of accepting any colour as a prop?',
                options: ['Constraints keep the UI consistent and keep decisions in one place', 'Fewer props make the component render faster', 'CSS cannot apply colours passed in at runtime', 'Accessibility standards forbid custom colours'],
                answer: 0,
                explanation: 'With free-form colours, every team picks its own blue and contrast checks are lost. Named variants encode approved, tested decisions. Performance and CSS capability are not the issue.' },
              { id: 'q2', type: 'tf',
                prompt: 'In atomic design, a search field made of a label, an input, and a button is a molecule.',
                answer: true,
                explanation: 'Atoms are single elements; a molecule is a small group of atoms working as one unit. A header containing that search field would be an organism.' },
              { id: 'q3', type: 'mc',
                prompt: 'A component library at version 2.3.1 removes a prop that teams depend on. What should the next version be under semantic versioning?',
                options: ['3.0.0', '2.4.0', '2.3.2', '2.3.1-breaking'],
                answer: 0,
                explanation: 'Removing something consumers rely on is a breaking change, which requires a major bump. Minor versions add features compatibly; patch versions fix bugs.' },
              { id: 'q4', type: 'tf',
                prompt: 'Storybook is used to build and document components in isolation from the main application.',
                answer: true,
                explanation: 'Each component state is rendered as a story, so you can see variants, edge cases, and docs without running the whole app or navigating to the right screen.' },
              { id: 'q5', type: 'mc',
                prompt: 'A product team needs a button that the system does not support yet. What is the healthiest response?',
                options: ['Propose a new variant through the system\'s contribution process', 'Copy the component into their app and edit it', 'Override its styles with !important in their app', 'Skip the design system on that screen'],
                answer: 0,
                explanation: 'Copies and overrides solve today\'s problem but drift from future fixes and fragment the UI. Contributing back means the next team with the same need gets it for free.' },
            ],
          },
        },
      ],
    },
    {
      id: 'performance',
      title: 'Performance',
      prereqs: ['javascript'],
      sections: [
        { id: 'performance-lighthouse', title: 'Lighthouse', lessons: [{ id: 'performance-lighthouse-lesson', title: 'Lighthouse', minutes: 5, screens: [] }], quiz: { id: 'performance-lighthouse-quiz', questions: [] } },
        { id: 'performance-devtools', title: 'DevTools usage', lessons: [{ id: 'performance-devtools-lesson', title: 'DevTools usage', minutes: 5, screens: [] }], quiz: { id: 'performance-devtools-quiz', questions: [] } },
        { id: 'performance-service-workers', title: 'Service workers', lessons: [{ id: 'performance-service-workers-lesson', title: 'Service workers', minutes: 5, screens: [] }], quiz: { id: 'performance-service-workers-quiz', questions: [] } },
        { id: 'performance-cache-control', title: 'Cache-Control', lessons: [{ id: 'performance-cache-control-lesson', title: 'Cache-Control', minutes: 5, screens: [] }], quiz: { id: 'performance-cache-control-quiz', questions: [] } },
        { id: 'performance-streamed-responses', title: 'Streamed responses', lessons: [{ id: 'performance-streamed-responses-lesson', title: 'Streamed responses', minutes: 5, screens: [] }], quiz: { id: 'performance-streamed-responses-quiz', questions: [] } },
      ],
    },
    {
      id: 'web-components',
      title: 'Web components',
      prereqs: ['javascript'],
      sections: [
        { id: 'web-components-templates', title: 'HTML templates', lessons: [{ id: 'web-components-templates-lesson', title: 'HTML templates', minutes: 5, screens: [] }], quiz: { id: 'web-components-templates-quiz', questions: [] } },
        { id: 'web-components-custom-elements', title: 'Custom elements', lessons: [{ id: 'web-components-custom-elements-lesson', title: 'Custom elements', minutes: 5, screens: [] }], quiz: { id: 'web-components-custom-elements-quiz', questions: [] } },
        { id: 'web-components-shadow-dom', title: 'Shadow DOM', lessons: [{ id: 'web-components-shadow-dom-lesson', title: 'Shadow DOM', minutes: 5, screens: [] }], quiz: { id: 'web-components-shadow-dom-quiz', questions: [] } },
      ],
    },
    {
      id: 'graphql',
      title: 'GraphQL',
      prereqs: ['javascript'],
      sections: [
        { id: 'graphql-apollo', title: 'Apollo', lessons: [{ id: 'graphql-apollo-lesson', title: 'Apollo', minutes: 5, screens: [] }], quiz: { id: 'graphql-apollo-quiz', questions: [] } },
        { id: 'graphql-relay', title: 'Relay Modern', lessons: [{ id: 'graphql-relay-lesson', title: 'Relay Modern', minutes: 5, screens: [] }], quiz: { id: 'graphql-relay-quiz', questions: [] } },
      ],
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      prereqs: ['html'],
      sections: [
        { id: 'accessibility-intro', title: 'Accessibility', lessons: [{ id: 'accessibility-lesson', title: 'Accessibility', minutes: 5, screens: [] }], quiz: { id: 'accessibility-quiz', questions: [] } },
      ],
    },
    {
      id: 'pwas',
      title: 'PWAs',
      prereqs: ['performance'],
      sections: [
        { id: 'pwas-intro', title: 'PWAs', lessons: [{ id: 'pwas-lesson', title: 'PWAs', minutes: 5, screens: [] }], quiz: { id: 'pwas-quiz', questions: [] } },
      ],
    },
    {
      id: 'desktop-apps',
      title: 'Desktop apps',
      prereqs: ['learn-a-framework'],
      sections: [
        { id: 'desktop-apps-electron', title: 'Electron', lessons: [{ id: 'desktop-apps-electron-lesson', title: 'Electron', minutes: 5, screens: [] }], quiz: { id: 'desktop-apps-electron-quiz', questions: [] } },
        { id: 'desktop-apps-tauri', title: 'Tauri', lessons: [{ id: 'desktop-apps-tauri-lesson', title: 'Tauri', minutes: 5, screens: [] }], quiz: { id: 'desktop-apps-tauri-quiz', questions: [] } },
        { id: 'desktop-apps-flutter', title: 'Flutter', lessons: [{ id: 'desktop-apps-flutter-lesson', title: 'Flutter', minutes: 5, screens: [] }], quiz: { id: 'desktop-apps-flutter-quiz', questions: [] } },
      ],
    },
    {
      id: 'mobile-apps',
      title: 'Mobile apps',
      prereqs: ['learn-a-framework'],
      sections: [
        { id: 'mobile-apps-react-native', title: 'React Native', lessons: [{ id: 'mobile-apps-react-native-lesson', title: 'React Native', minutes: 5, screens: [] }], quiz: { id: 'mobile-apps-react-native-quiz', questions: [] } },
        { id: 'mobile-apps-flutter', title: 'Flutter', lessons: [{ id: 'mobile-apps-flutter-lesson', title: 'Flutter', minutes: 5, screens: [] }], quiz: { id: 'mobile-apps-flutter-quiz', questions: [] } },
        { id: 'mobile-apps-ionic', title: 'Ionic', lessons: [{ id: 'mobile-apps-ionic-lesson', title: 'Ionic', minutes: 5, screens: [] }], quiz: { id: 'mobile-apps-ionic-quiz', questions: [] } },
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
