---
name: agent-skills
description: Publish a skills discovery index at /.well-known/agent-skills/index.json per the Agent Skills Discovery RFC v0.2.0, with a $schema field and an array of published skills containing name, type (skill-md or archive), description, url, and sha256 digest for autonomous agent discovery.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: Agent Skills Discovery RFC v0.2.0
  schema: https://schemas.agentskills.io/discovery/0.2.0/schema.json
  location: /.well-known/agent-skills/index.json
  fields:
    - $schema
    - skills
  skill_entry_fields:
    - name
    - type
    - description
    - url
    - digest
    - sha256
---

# Agent Skills Discovery Index (Agent Skills Discovery RFC v0.2.0)

This skill documents how AI agents locate, verify, and ingest the machine-readable Agent Skills discovery catalog published by PromptOS MegaKit at `/.well-known/agent-skills/index.json`.

## 1. Overview
As specified in the **Agent Skills Discovery RFC v0.2.0** (standardized by Cloudflare and the `agentskills.io` consortium), services publish a centralized index document enabling autonomous agents to discover all capabilities in a single HTTP request.

Key specification requirements:
- **Location**: `/.well-known/agent-skills/index.json`
- **Schema Reference**: `$schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json"`
- **Skill Artifact Types**:
  - `skill-md`: Single Markdown instruction document (`SKILL.md`).
  - `archive`: Packaged tarball/zip archive containing scripts, assets, and definitions.
- **Integrity Digest**: Cryptographic SHA-256 digest (`sha256:<hex>`) allowing agents to verify content integrity before executing instructions or tools.

## 2. Standard Schema Example (RFC v0.2.0)
```json
{
  "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  "skills": [
    {
      "name": "agent-skills",
      "type": "skill-md",
      "description": "Publish a skills discovery index at /.well-known/agent-skills/index.json per Agent Skills Discovery RFC v0.2.0.",
      "url": "/.well-known/agent-skills/agent-skills/SKILL.md",
      "digest": "sha256:d41d8cd98f00b204e9800998ecf8427e...",
      "sha256": "d41d8cd98f00b204e9800998ecf8427e..."
    }
  ]
}
```

## 3. Web Linking (RFC 8288)
Servers advertise the skills index via HTTP Link headers:
```http
Link: </.well-known/agent-skills/index.json>; rel="agent-skills-index"
```
And HTML entry points include:
```html
<link rel="agent-skills-index" href="/.well-known/agent-skills/index.json" />
```
