---
name: ai-rules
description: Configure explicit User-agent rules in robots.txt for AI crawlers including GPTBot, OAI-SearchBot, Claude-Web, and Google-Extended, conforming to RFC 9309 and Cloudflare AI Crawl Control.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: RFC 9309 (Robots Exclusion Protocol)
  cloudflare: AI Crawl Control
  crawlers:
    - GPTBot
    - OAI-SearchBot
    - Claude-Web
    - ClaudeBot
    - Google-Extended
    - ChatGPT-User
    - PerplexityBot
    - Applebot-Extended
    - Meta-ExternalAgent
    - Amazonbot
    - Bytespider
    - Cohere-ai
    - Diffbot
---

# AI Crawler User-Agent Rules Skill (RFC 9309)

This skill documents the explicit AI crawler configuration policy for PromptOS MegaKit according to **RFC 9309** (Robots Exclusion Protocol) and **Cloudflare AI Crawl Control**.

## 1. Overview
Modern AI systems employ dedicated crawler User-Agents separated by function:
- **Search & Real-Time Agent Retrieval**: Fetches content to answer live user queries and cite sources (e.g. `OAI-SearchBot`, `Claude-Web`, `ChatGPT-User`, `PerplexityBot`).
- **Model Training & Dataset Ingestion**: Ingests public web data for foundation model pre-training (e.g. `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`).

PromptOS MegaKit maintains an **AI-Ready Open Access Policy**: all public pages, prompt libraries, agent blueprints, skills, OpenAPI specifications, and discovery endpoints are explicitly allowed for AI indexing and citations, while private backend endpoints (`/api/`) remain protected.

## 2. Explicit AI Crawler Entries
The following User-Agent directives are published in `/robots.txt`:

### OpenAI Crawlers
```robots
User-agent: GPTBot
Allow: /
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /
Disallow: /api/

User-agent: ChatGPT-User
Allow: /
Disallow: /api/
```

### Anthropic Claude Crawlers
```robots
User-agent: Claude-Web
Allow: /
Disallow: /api/

User-agent: ClaudeBot
Allow: /
Disallow: /api/

User-agent: anthropic-ai
Allow: /
Disallow: /api/
```

### Google AI Crawlers
```robots
User-agent: Google-Extended
Allow: /
Disallow: /api/
```

### Other Major AI Crawlers & Agents
```robots
User-agent: PerplexityBot
Allow: /
Disallow: /api/

User-agent: Applebot-Extended
Allow: /
Disallow: /api/

User-agent: Meta-ExternalAgent
Allow: /
Disallow: /api/

User-agent: Amazonbot
Allow: /
Disallow: /api/

User-agent: Bytespider
Allow: /
Disallow: /api/

User-agent: Cohere-ai
Allow: /
Disallow: /api/

User-agent: Diffbot
Allow: /
Disallow: /api/
```

## 3. RFC 9309 Compliance Rules
1. **Specific Before General**: Specific User-Agent records take precedence over generic `User-agent: *`.
2. **Canonical Sitemap**: Every robots.txt declares `Sitemap: https://<domain>/sitemap.xml`.
3. **Encoding & Format**: UTF-8 plain text served with `Content-Type: text/plain; charset=utf-8`.
4. **Vary Headers**: Supports HTTP caching and content negotiation.
