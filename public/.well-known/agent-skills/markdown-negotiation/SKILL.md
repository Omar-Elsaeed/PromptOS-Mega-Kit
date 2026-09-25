---
name: markdown-negotiation
description: Return HTML responses as clean, structured Markdown when AI agents request Accept text/markdown while maintaining HTML as default for web browsers. Includes token count estimates and Vary Accept caching headers.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: Cloudflare Markdown for Agents
  content_type: text/markdown
  vary: Accept
  token_header: x-markdown-tokens
---

# Markdown for Agents Negotiation Skill

This skill documents the **Markdown for Agents** content negotiation standard implemented by PromptOS MegaKit based on Cloudflare's specification.

## 1. Overview
AI agents and large language models (LLMs) operate with finite context windows and pay latency/cost penalties when crawling verbose HTML, CSS, and client-side JavaScript bundles. 

By supporting HTTP content negotiation via `Accept: text/markdown`, PromptOS MegaKit delivers high-signal, clean Markdown representations of every route at its canonical URL, saving up to 80–90% of token usage.

## 2. Request Protocol
AI agents request the Markdown representation by sending the standard `Accept` header:

```http
GET / HTTP/1.1
Host: example.com
Accept: text/markdown
```

## 3. Server Response Format
The server responds with:
- **Status**: `200 OK`
- **Content-Type**: `text/markdown; charset=utf-8`
- **Vary**: `Accept` (ensures intermediate caches do not serve markdown to browsers or HTML to agents)
- **x-markdown-tokens**: Estimated token count for context window budgeting
- **Content-Signal**: `ai-train=yes, search=yes, ai-input=yes`
- **Link**: RFC 8288 agent discovery headers

### Example Response
```http
HTTP/1.1 200 OK
Content-Type: text/markdown; charset=utf-8
Vary: Accept
x-markdown-tokens: 642
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Link: </.well-known/api-catalog>; rel="api-catalog", </.well-known/dns-aid.json>; rel="dns-aid"

# PromptOS MegaKit — 100K AI Prompt Library
...
```

## 4. Supported Canonical Paths
Content negotiation is enabled for all primary application routes:
- `/` & `/library` — 100,000+ prompt catalog across 204 niches
- `/fable5` — Fable 5 5-stage chain-of-thought framework
- `/builder` — Smart Prompt Builder wizard
- `/bedrock` — Amazon Bedrock AgentCore generator
- `/langchain` — LangChain LCEL architectures
- `/crewai` — CrewAI multi-agent crews
- `/evals` — AI evaluation harness & scoring
- `/finetuning` — Fine-tuning dataset synthesizer
- `/automation` — Zapier & Make AI automation schemas
- `/agents` — Autonomous Agent Blueprint & DNS-AID records
- `/skills` — Claude & Agent Skills studio
- `/docs/api` — Interactive API documentation

## 5. Browser Default Behavior
When requested without `Accept: text/markdown` (e.g., standard browser requests with `Accept: text/html`), the server serves the full responsive React single-page application.
