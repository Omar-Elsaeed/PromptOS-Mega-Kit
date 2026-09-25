---
name: content-signals
description: Declare machine-readable content usage preferences for AI systems using Content-Signal directives in robots.txt and HTTP headers, adhering to draft-romm-aipref-contentsignals and contentsignals.org.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: IETF draft-romm-aipref-contentsignals
  documentation: https://contentsignals.org
  directives:
    - ai-train
    - search
    - ai-input
---

# Content Signals Agent Skill

This skill documents the **Content Signals** policy implemented by PromptOS MegaKit based on the IETF Internet-Draft `draft-romm-aipref-contentsignals` and `contentsignals.org`.

## 1. Overview
Traditional `robots.txt` directives (`Allow` and `Disallow`) only govern crawling access. They do not express nuanced intent about how content may be utilized once retrieved.

Content Signals introduce fine-grained usage preferences across three independent dimensions:
1. **`ai-train`**: Permission to use content for training, fine-tuning, or aligning AI/LLM models.
2. **`search`**: Permission to index content for search engines, display excerpts/snippets, and provide direct hyperlink citations.
3. **`ai-input`**: Permission to use content as grounding input for real-time inference, Retrieval-Augmented Generation (RAG), and agent task execution.

## 2. PromptOS MegaKit Preference Declaration
PromptOS MegaKit maintains an **AI-Ready Open Access Policy**:

```robots
Content-Signal: ai-train=yes, search=yes, ai-input=yes
```

- **`ai-train=yes`**: Open permission for AI model training on prompt library, blueprints, and templates.
- **`search=yes`**: Full search indexing and citation permission across web search engines and conversational AI engines.
- **`ai-input=yes`**: Direct permission for real-time agent execution, RAG pipelines, and query grounding.

## 3. Implementation Channels

### A. robots.txt Directive
Declared at the root of `robots.txt` and within specific User-Agent blocks:
```robots
# Content Signals (https://contentsignals.org & draft-romm-aipref-contentsignals)
Content-Signal: ai-train=yes, search=yes, ai-input=yes
```

### B. HTTP Response Headers
Every HTML, Markdown, and API response includes:
```http
Content-Signal: ai-train=yes, search=yes, ai-input=yes
```

### C. Discovery Linking
- Linked in `/.well-known/agent-skills/index.json`
- Advertised via RFC 8288 `Link: </.well-known/agent-skills/content-signals/SKILL.md>; rel="agent-skill"`
- Referenced in `/.well-known/api-catalog`
