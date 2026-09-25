---
name: ard
description: Publish an Agentic Resource Discovery (ARD) capability manifest at /.well-known/ai-catalog.json with specVersion, host metadata, and typed entries containing urn:air identifiers, IANA media types, representativeQueries for vector indexing, and URLs for autonomous agent discovery.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: Agentic Resource Discovery (ARD)
  schema: https://raw.githubusercontent.com/ards-project/ard-spec/main/spec/schemas/ai-catalog.schema.json
  location: /.well-known/ai-catalog.json
  media_type: application/json
  specification_docs:
    - https://agenticresourcediscovery.org/
    - https://github.com/ards-project/ard-spec
    - https://github.com/Agent-Card/ai-catalog
---

# Agentic Resource Discovery (ARD) Manifest (ai-catalog.json)

This skill documents how AI agents, search crawlers, and capability registries discover PromptOS MegaKit's full agentic surface (MCP servers, A2A agents, OpenAPI specifications, and WebMCP browser tools) via the **Agentic Resource Discovery (ARD)** open standard.

## 1. Overview
The **Agentic Resource Discovery (ARD)** specification acts as the universal *sitemap.xml* for the Agentic Web. By publishing a machine-readable capability manifest at `/.well-known/ai-catalog.json`, sites declare their AI tools, agent-to-agent interfaces, and API schemas so registries can crawl, index, and build vector embeddings for semantic discovery.

## 2. Manifest Schema Requirements
The manifest is served at `/.well-known/ai-catalog.json` with:
- `Content-Type: application/json; charset=utf-8`
- `Access-Control-Allow-Origin: *`

### Required Top-Level Fields
1. **`specVersion`**: The version of the ARD / AI Catalog specification (`"1.0"`).
2. **`host`**: Object detailing the publisher/hosting entity:
   - `displayName`: Human-readable name.
   - `identifier`: Domain handle or URN identifier.
3. **`entries`**: Array of catalog entry objects, each exposing an AI capability.

### Entry Schema Requirements
Each catalog entry requires:
- **`identifier`** (and **`id`**): Structured URN following `urn:air:<domain>:<namespace>:<name>` (e.g. `urn:air:promptos.dev:mcp:megakit`).
- **`displayName`**: Human-readable name for the tool or service.
- **`type`**: IANA media type indicating the protocol (e.g., `application/mcp-server-card+json`, `application/a2a-agent-card+json`, `application/vnd.oai.openapi+json;version=3.0`, or `application/json`).
- **`url`** or **`data`**: Exactly one of a reachable URL or inline data payload.
- **`representativeQueries`**: Array of 2 to 5 representative natural-language search queries used by registries to build semantic vector embeddings.

## 3. Example Manifest Structure
```json
{
  "specVersion": "1.0",
  "host": {
    "displayName": "PromptOS MegaKit",
    "identifier": "urn:air:promptos.dev:host:root"
  },
  "entries": [
    {
      "identifier": "urn:air:promptos.dev:mcp:server-card",
      "displayName": "PromptOS MegaKit MCP Server",
      "type": "application/mcp-server-card+json",
      "url": "https://promptos.dev/.well-known/mcp/server-card.json",
      "representativeQueries": [
        "optimize prompts for reasoning models",
        "generate autonomous agent blueprints",
        "audit website for agent readiness"
      ]
    }
  ]
}
```

## 4. Web Linking (RFC 8288) & Discovery
In addition to the standard well-known location, origins advertise the ARD manifest via HTTP `Link` headers:
```http
Link: </.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"
```
And HTML `<link>` tags in the page head:
```html
<link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json" />
```
