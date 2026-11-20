# Amde Course Writing Guide

> Writing a course here requires the same rigour as publishing a technical book.
> Every claim must be traceable. Every example must run. Every quiz question must
> have an unambiguously correct answer. Never write from memory alone.

---

## 1. Curriculum structure — always start from roadmap.sh

The authoritative source for *what to teach* is **[roadmap.sh](https://roadmap.sh)**. Every subject should map directly to a roadmap there. Steps:

1. Open the relevant roadmap (e.g., https://roadmap.sh/ai-engineer, https://roadmap.sh/python, https://roadmap.sh/frontend)
2. Copy the full topic list as your skeleton — do not invent or reorder topics without a reason
3. Each roadmap node = one **Section** in Amde. Each sub-node = one **Lesson**
4. Write the content *after* you understand the roadmap hierarchy, not before

---

## 2. Source hierarchy — what to reference

Use sources in this order. Never cite a source you haven't actually read.

### Tier 1 — Authoritative specs and official docs
| Topic area | Source |
|---|---|
| Web platform | [MDN Web Docs](https://developer.mozilla.org) — the gold standard |
| Python | [docs.python.org](https://docs.python.org) |
| Node / JS | [nodejs.org/en/docs](https://nodejs.org/en/docs), [tc39.es](https://tc39.es) |
| SQL | [PostgreSQL docs](https://www.postgresql.org/docs/) |
| ML / AI | [PyTorch docs](https://pytorch.org/docs), [HuggingFace docs](https://huggingface.co/docs) |
| Algorithms | [NIST DADS](https://xlinux.nist.gov/dads/) |

### Tier 2 — High-quality technical writing
| Source | Why |
|---|---|
| [Toptal Engineering Blog](https://www.toptal.com/developers/blog) | Deep, peer-reviewed articles by senior engineers. Excellent for systems design, language internals, algorithms |
| [Martin Fowler's bliki](https://martinfowler.com) | Canonical definitions for software architecture patterns |
| [Bartosz Milewski's blog](https://bartoszmilewski.com) | Category theory, FP — extremely precise |
| [Julia Evans (jvns.ca)](https://jvns.ca) | Model for visual, accurate, approachable teaching |
| [High Scalability](https://highscalability.com) | Real-world systems architecture case studies |
| [The Morning Paper](https://blog.acolyer.org) | Deep dives into CS papers |

### Tier 3 — Educational reference (verify independently)
| Source | Use for |
|---|---|
| [GeeksForGeeks](https://www.geeksforgeeks.org) | Algorithm pseudocode, data structure definitions — always verify with Tier 1/2 |
| [W3Schools](https://www.w3schools.com) | Syntax quick reference — good for beginners, check MDN for correctness |
| [freeCodeCamp](https://www.freecodecamp.org/news) | Practical walkthroughs — good structure, verify technical details |
| [Baeldung](https://www.baeldung.com) | Java/Spring/JVM — unusually reliable |
| [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials) | Server/DevOps workflows |

### Never cite
- Random Medium posts (use their primary source instead)
- Stack Overflow answers (find the canonical doc it references)
- ChatGPT / AI outputs (always hallucinate specifics)
- Wikipedia as a final source (use it to find primary sources)

---

## 3. Writing a lesson — the process

### Step 1: Research first, write second
1. Read the roadmap.sh node and its linked resources
2. Find 2–3 sources from Tier 1/2 on that exact topic
3. Identify the **one core insight** of the lesson — the thing that changes how the learner thinks
4. Only then open the content file

### Step 2: Structure each screen
Every screen (mobile) / section (desktop) has:
- One `title` — the core idea in 4–6 words, stated as a noun phrase or short sentence
- Blocks that build toward the insight: start with the problem/need, then explain, then show

**Block usage guide:**

| Block type | When to use |
|---|---|
| `text` | Explain a concept in 2–4 sentences. Max 60 words. No padding text. |
| `steps` | Sequential processes (how a compiler works, how HTTP works, how gradient descent steps) |
| `compare` | Trade-offs, side-by-side differences (REST vs GraphQL, compiled vs interpreted) |
| `callout` | The single key insight of a screen — the sentence the learner should remember |
| `code` | Real, runnable code — always tested. Use Python for AI topics, JS for web. Max 15 lines. |
| `visualizer` | *(coming)* Interactive HTML/canvas component — see Section 4 |

### Step 3: Write the quiz
- 4–6 questions per section
- Mix: ~60% multiple choice, ~20% true/false, ~20% order
- Every wrong answer should be a plausible misconception, not obviously silly
- The `explanation` field teaches — it explains *why* the correct answer is right, not just what it is
- Run every multiple-choice question through this test: "Could a smart, well-read person pick the wrong answer?" If no, make the distractors harder

---

## 4. Interactive visualizers — the most important part

> **Rule:** Every conceptual process that can be animated, should be.
> A good visualizer is worth three screens of text.

Each visualizer is a self-contained React component or inline HTML snippet that the learner can interact with. It lives alongside the lesson content.

### Examples by topic

| Concept | Visualizer idea |
|---|---|
| **Compiler vs interpreter** | Step-through: type source code → watch tokenize → parse → AST → evaluate/compile, one step at a time with highlighted output |
| **LLM tokenization** | Live input field → highlight token boundaries in real time using a tokenizer (use tiktoken.js or mock) |
| **Embeddings / vector space** | Interactive 2D scatter plot (Recharts or plain SVG) — drag words, see clusters form |
| **Attention mechanism** | Colour-coded attention heatmap on a sentence — hover a token to see what it attends to |
| **Sorting algorithms** | Bar chart animation — step through bubble, merge, quick sort with complexity counter |
| **Binary search** | Array with highlighted current range, step forward/back |
| **BFS vs DFS** | Graph canvas — watch the frontier expand, toggle between strategies |
| **TCP handshake** | Animated sequence diagram — client/server messages with arrows and state labels |
| **SQL JOIN types** | Venn diagrams that highlight matching rows in two tables |
| **CSS box model** | Live element you can resize — margin/border/padding zones colour-coded |
| **Neural network forward pass** | Layer-by-layer activation flow, hover a node to see its inputs and weights |
| **Gradient descent** | 3D loss surface with a ball rolling down toward the minimum |
| **RAG pipeline** | Animated flow: document → chunk → embed → store / query → retrieve → augment → generate |
| **Hash table collision** | Insert keys and watch probing or chaining in action |
| **Regex matching** | Input + pattern → highlight matches step by step, NFA states shown |

### Implementation notes
- Keep visualizers under 150 lines. If it needs more, split it.
- Use `<canvas>` for animations, SVG for diagrams, controlled React state for step-throughs
- Always add keyboard controls (space = step/pause, arrows = prev/next)
- Include an accessible description (`aria-label` on the container, `role="img"` or `role="application"`)
- The visualizer should work without any external network request

---

## 5. Accuracy verification checklist

Run this checklist on every lesson before marking it ready. Do not ship without completing it.

### Content
- [ ] Every factual claim has a source in Tier 1 or Tier 2 — link it in a comment in the content file
- [ ] All code examples have been executed and produce the stated output
- [ ] All diagrams and comparisons have been reviewed against the official documentation
- [ ] Numbers (parameter counts, benchmark figures, year of release) have been spot-checked in a primary source
- [ ] No "it is generally believed" or "some say" hedging — either state the fact with a source or cut it

### Quiz
- [ ] Every correct answer is unambiguously correct per the primary source
- [ ] Every wrong answer is a real misconception, not a strawman
- [ ] The explanation for each question includes the source (even if just "per MDN: …")

### Visualizer
- [ ] Works in Chrome, Safari, Firefox
- [ ] Works at 390px width (mobile) and 1280px (desktop)
- [ ] Keyboard-navigable
- [ ] Runs correctly on first interaction — no broken states

---

## 6. The quality bar — what "done" looks like

Before publishing, read your lesson alongside one of these reference-quality pieces:

- [How HTTPS Works](https://howhttps.works) — exceptional visual storytelling
- [Explain the first 10 lines of Twitter's source code](https://www.toptal.com/twitter/explain-the-first-10-lines-of-twitter-source-code) (Toptal) — depth + clarity
- [The Log: What every software engineer should know](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying) (LinkedIn) — comprehensive, well-cited
- [Rebuilding Twitter's data pipeline](https://www.confluent.io/blog/apache-kafka-at-twitter/) — real-world grounding
- Any of Julia Evans' zines — the model for making hard things approachable without sacrificing accuracy

Ask: "Would a senior engineer be comfortable recommending this to a junior colleague?"
If you have any doubt, the answer is no. Find what's missing and fix it.

---

## 7. The AI Engineering course specifically

The current AI Engineering course (`src/data/content.ts`) was written as a scaffold and **needs a full rewrite** against these guidelines. When rebuilding it:

1. Use https://roadmap.sh/ai-engineer as the canonical skeleton
2. Cross-reference every section against:
   - [Andrej Karpathy's Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) — LLM fundamentals
   - [Lilian Weng's blog](https://lilianweng.github.io) — embeddings, attention, RLHF, agents
   - [Jay Alammar's blog](https://jalammar.github.io) — visualized transformer architecture
   - [Simon Willison's weblog](https://simonwillison.net) — practical LLM engineering
   - [Chip Huyen's ML Engineering](https://huyenchip.com/blog) — production ML systems
3. Each lesson about an architecture (Transformer, RAG, agent loop) needs a visualizer
4. Quiz questions about LLMs must be grounded in actual model behaviour, not speculation

---

*Last updated: 2026-11-20. Update this file whenever a new trusted source is identified or a source is found to be unreliable.*
