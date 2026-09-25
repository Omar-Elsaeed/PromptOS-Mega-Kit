---
name: mcp-server-card
description: Publish an MCP Server Card (SEP-1649 / SEP-2127) at /.well-known/mcp/server-card.json and /.well-known/mcp.json with serverInfo (name, version), transport endpoint, and capabilities for automated AI client and agent discovery.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: SEP-1649 (Model Context Protocol HTTP Server Discovery)
  related_standards:
    - SEP-2127 (Model Context Protocol Server Discovery)
    - JSON-RPC 2.0
    - RFC 8288 (Web Linking)
    - RFC 9727 (API Catalog)
  endpoints:
    - /.well-known/mcp/server-card.json
    - /.well-known/mcp.json
    - /mcp
  schema: https://modelcontextprotocol.io/schemas/server-card/v1.0
---

# MCP Server Card Agent Skill (SEP-1649 & SEP-2127)

This skill documents how AI agents, host applications (such as Claude Desktop, Cursor, and autonomous agent runtimes), and scanners discover and connect to PromptOS MegaKit's **Model Context Protocol (MCP)** server via **SEP-1649** and **SEP-2127**.

## 1. Overview
The Model Context Protocol (MCP) standardizes how AI applications connect with external tools and contextual resources. Rather than requiring developers to manually write JSON configuration files with custom CLI scripts, **SEP-1649** defines an automated discovery standard:
- Web servers publish their metadata at `/.well-known/mcp/server-card.json` (and `/.well-known/mcp.json`).
- Clients query this well-known URI to extract:
  - **`serverInfo`**: Identification including `name`, `version`, `title`, and `description`.
  - **`transport`**: Remote connection type (`streamable-http` or `sse`) and `endpoint` URL.
  - **`capabilities`**: Enabled features such as `tools`, `prompts`, `resources`, and `logging`.
  - **`tools`**: (Optional / Extension) Pre-advertised tool signatures for quick client evaluation.

## 2. Standard Discovery Endpoints

### A. SEP-1649 Server Card URI
```http
GET /.well-known/mcp/server-card.json HTTP/1.1
Host: example.com
Accept: application/json
```

### B. SEP-2127 Standardized Alias
```http
GET /.well-known/mcp.json HTTP/1.1
Host: example.com
Accept: application/json
```

## 3. Server Card Schema (v1.0)
```json
{
  "$schema": "https://modelcontextprotocol.io/schemas/server-card/v1.0",
  "protocolVersion": "2024-11-05",
  "serverInfo": {
    "name": "promptos-megakit",
    "title": "PromptOS MegaKit MCP Server",
    "version": "1.0.0",
    "description": "Enterprise Model Context Protocol (MCP) server for prompt engineering, agent blueprint generation, and agent-readiness auditing."
  },
  "transport": {
    "type": "streamable-http",
    "endpoint": "https://example.com/mcp"
  },
  "capabilities": {
    "tools": {
      "listChanged": false
    },
    "prompts": {
      "listChanged": false
    },
    "resources": {
      "subscribe": false,
      "listChanged": false
    },
    "logging": {}
  }
}
```

## 4. MCP JSON-RPC 2.0 Transport Handshake
Clients connect to the declared `transport.endpoint` (`/mcp`):
1. **Initialize Request**:
   ```json
   {
     "jsonrpc": "2.0",
     "id": 1,
     "method": "initialize",
     "params": {
       "protocolVersion": "2024-11-05",
       "capabilities": {},
       "clientInfo": { "name": "AgentClient", "version": "1.0.0" }
     }
   }
   ```
2. **Tools Discovery (`tools/list`)**:
   ```json
   {
     "jsonrpc": "2.0",
     "id": 2,
     "method": "tools/list",
     "params": {}
   }
   ```
3. **Tool Execution (`tools/call`)**:
   ```json
   {
     "jsonrpc": "2.0",
     "id": 3,
     "method": "tools/call",
     "params": {
       "name": "optimize_prompt",
       "arguments": {
         "prompt": "Summarize this research paper in 3 bullets"
       }
     }
   }
   ```

## 5. Web Linking & HTTP Headers (RFC 8288)
Servers advertise the MCP Server Card via HTTP response headers:
```http
Link: </.well-known/mcp/server-card.json>; rel="mcp-server-card", </.well-known/agent-skills/mcp-server-card/SKILL.md>; rel="agent-skill"
```
And HTML entry points include:
```html
<link rel="mcp-server-card" href="/.well-known/mcp/server-card.json" />
<link rel="agent-skill" href="/.well-known/agent-skills/mcp-server-card/SKILL.md" />
```
