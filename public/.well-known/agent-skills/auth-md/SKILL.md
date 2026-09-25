---
name: auth-md
description: Publish auth.md at the site root with AI agent registration instructions, combined with OAuth Protected Resource Metadata (RFC 9728) and the agent_auth block in OAuth Authorization Server Metadata (RFC 8414) for automated agent onboarding and credential issuance.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: WorkOS auth.md specification
  related_standards:
    - RFC 9728 (OAuth 2.0 Protected Resource Metadata)
    - RFC 8414 (OAuth 2.0 Authorization Server Metadata)
    - OpenID Connect Discovery 1.0
    - RFC 7591 (OAuth 2.0 Dynamic Client Registration)
  locations:
    - /auth.md
    - /.well-known/oauth-protected-resource
    - /.well-known/oauth-authorization-server
  endpoints:
    register_uri: /oauth/agent/register
    claim_uri: /oauth/agent/claim
    revocation_uri: /oauth/agent/revoke
    token_uri: /oauth/token
---

# Auth.md Agent Skill (Agent Registration & Authentication Protocol)

This skill documents how AI agents locate, parse, and execute autonomous registration and authentication against PromptOS MegaKit using **auth.md** and the **`agent_auth`** metadata specification.

## 1. Overview
The **auth.md** protocol provides a predictable URL at `https://<domain>/auth.md` containing human-readable and machine-readable instructions for AI agents to:
1. Discover supported identity types (`anonymous`, `identity_assertion`, `service_auth`).
2. Identify supported credential formats (`access_token`, `api_key`).
3. Locate registration and claim endpoints (`register_uri`, `claim_uri`, `revocation_uri`).
4. Resolve trusted authorization servers via RFC 9728 Protected Resource Metadata.

## 2. Machine-Readable Metadata Discovery

### A. Authorization Server Metadata (`/.well-known/oauth-authorization-server`)
Must include the `agent_auth` block:
```json
{
  "issuer": "https://example.com",
  "authorization_endpoint": "https://example.com/oauth/authorize",
  "token_endpoint": "https://example.com/oauth/token",
  "jwks_uri": "https://example.com/.well-known/jwks.json",
  "agent_auth": {
    "auth_md_uri": "https://example.com/auth.md",
    "register_uri": "https://example.com/oauth/agent/register",
    "claim_uri": "https://example.com/oauth/agent/claim",
    "revocation_uri": "https://example.com/oauth/agent/revoke",
    "identity_types_supported": [
      "anonymous",
      "identity_assertion",
      "service_auth"
    ],
    "credential_types_supported": [
      "access_token",
      "api_key"
    ]
  }
}
```

### B. Protected Resource Metadata (`/.well-known/oauth-protected-resource`)
Conforms to RFC 9728 and advertises the authorization server and `agent_auth` links.

## 3. Autonomous Agent Registration Flow

### Agent Registration Request
```http
POST /oauth/agent/register HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "agent_name": "AutonomousAnalyst",
  "identity_type": "identity_assertion",
  "identity_assertion": "<signed_assertion_jwt>",
  "scopes": ["api", "prompts:read"]
}
```

### Agent Registration Response
```json
{
  "client_id": "agent_cl_98a7bc12",
  "client_secret": "sec_agent_98a7bc12...",
  "identity_status": "verified",
  "token_endpoint": "/oauth/token"
}
```

## 4. Web Linking (RFC 8288)
Servers advertise `/auth.md` via HTTP Link headers:
```http
Link: </auth.md>; rel="auth-md", </.well-known/agent-skills/auth-md/SKILL.md>; rel="agent-skill"
```
And HTML entry points include:
```html
<link rel="auth-md" href="/auth.md" />
<link rel="agent-skill" href="/.well-known/agent-skills/auth-md/SKILL.md" />
```
