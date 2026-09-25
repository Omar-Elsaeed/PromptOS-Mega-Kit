---
name: webmcp
description: Support WebMCP (Web Model Context Protocol) to expose site tools and key actions directly to AI agents in the browser via navigator.modelContext.provideContext() with tool definitions, JSON schemas, and execute handlers.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: W3C Web Machine Learning Community Group (WebMCP)
  related_standards:
    - Model Context Protocol (MCP)
    - JSON Schema (Draft 7 / 2020-12)
    - Chrome Early Preview Program WebMCP
  interface: navigator.modelContext.provideContext()
  tools_exposed:
    - search_prompts
    - optimize_prompt
    - generate_agent_blueprint
    - audit_agent_readiness
---

# WebMCP Agent Skill (Web Model Context Protocol)

This skill documents how AI agents, in-browser assistants, and agent runtimes discover, inspect, and invoke client-side tools exposed by PromptOS MegaKit using the **WebMCP API** (`navigator.modelContext.provideContext()`).

## 1. Overview
The Web Model Context Protocol (WebMCP) is a browser standard co-developed by Google, Microsoft, and community members in the W3C Web Machine Learning Community Group. It allows web applications to expose structured, callable JavaScript tools directly to AI agents inside the browser environment.

Instead of relying on fragile DOM scraping or simulated UI clicks, agents inspect registered WebMCP tools and execute them deterministically.

## 2. Browser Interface (`navigator.modelContext.provideContext`)

Web pages call `navigator.modelContext.provideContext()` on page load with a `tools` array:

```javascript
navigator.modelContext.provideContext({
  tools: [
    {
      name: "optimize_prompt",
      description: "Refactor, optimize, and structure raw user prompts into high-performance LLM system instructions.",
      inputSchema: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Raw prompt to optimize" },
          target_model: { type: "string", description: "Target model architecture" }
        },
        required: ["prompt"]
      },
      execute: async ({ prompt, target_model }) => {
        // Deterministic client execution
        return {
          status: "success",
          optimized_prompt: `# Role: Expert AI Assistant\n\n${prompt}`
        };
      }
    }
  ]
});
```

## 3. Registered PromptOS MegaKit Tools

1. **`search_prompts`**: Search enterprise prompts, templates, and categories in PromptOS MegaKit.
2. **`optimize_prompt`**: Optimize, refactor, and structure raw user prompts into high-performance LLM instructions.
3. **`generate_agent_blueprint`**: Generate end-to-end autonomous agent architecture blueprints with memory topologies and guardrails.
4. **`audit_agent_readiness`**: Audit a target URL or current website for agent-readiness standards (RFC 8414, RFC 9728, SEP-1649, WebMCP, Auth.md).

## 4. Discovery & Web Linking (RFC 8288)

Servers advertise WebMCP support and skill documentation via HTTP headers:
```http
Link: </.well-known/agent-skills/webmcp/SKILL.md>; rel="agent-skill"
```
And HTML entry points include:
```html
<link rel="agent-skill" href="/.well-known/agent-skills/webmcp/SKILL.md" />
```
