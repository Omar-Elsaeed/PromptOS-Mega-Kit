---
name: oauth-protected-resource
description: Publish OAuth 2.0 Protected Resource Metadata (RFC 9728) at /.well-known/oauth-protected-resource with resource identifier, authorization_servers, and scopes_supported, enabling AI agents to discover how to authenticate with protected APIs.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: RFC 9728 (OAuth 2.0 Protected Resource Metadata)
  related_standards:
    - RFC 6749 (The OAuth 2.0 Authorization Framework)
    - RFC 6750 (The OAuth 2.0 Authorization Framework: Bearer Token Usage)
    - RFC 8414 (OAuth 2.0 Authorization Server Metadata)
    - RFC 9727 (API Catalog)
  endpoint: /.well-known/oauth-protected-resource
  fields:
    - resource
    - authorization_servers
    - scopes_supported
    - bearer_methods_supported
    - resource_documentation
---

# OAuth 2.0 Protected Resource Metadata Agent Skill (RFC 9728)

This skill documents how AI agents discover authentication and authorization requirements for protected APIs hosted by PromptOS MegaKit using **RFC 9728** (`OAuth 2.0 Protected Resource Metadata`).

## 1. Overview
In a decoupled OAuth 2.0 architecture, an API (Resource Server) is often distinct from the Authorization Server (IdP / STS). Rather than requiring clients or autonomous AI agents to guess which Authorization Server issues valid tokens, **RFC 9728** standardizes the metadata format and well-known location for Protected Resources.

When an AI agent accesses a protected endpoint, it queries `/.well-known/oauth-protected-resource` (or reads the `WWW-Authenticate: Bearer resource_metadata="..."` response header) to discover:
- **`resource`**: The unique canonical URI identifying this protected resource.
- **`authorization_servers`**: The list of OAuth/OIDC issuer URLs trusted to grant tokens for this resource.
- **`scopes_supported`**: The specific scopes recognized by this API.
- **`bearer_methods_supported`**: Methods accepted for presenting bearer tokens (e.g., `["header"]`).
- **`resource_documentation`**: Human and machine-readable documentation for the API.

## 2. Standard Discovery Endpoint
Published at:
```http
GET /.well-known/oauth-protected-resource HTTP/1.1
Host: example.com
Accept: application/json
```

## 3. Metadata Document Structure (RFC 9728)
```json
{
  "resource": "https://example.com",
  "authorization_servers": [
    "https://example.com"
  ],
  "scopes_supported": [
    "openid",
    "profile",
    "email",
    "api",
    "prompts:read",
    "prompts:write",
    "agents:read",
    "agents:execute"
  ],
  "bearer_methods_supported": [
    "header"
  ],
  "resource_signing_alg_values_supported": [
    "RS256",
    "EdDSA"
  ],
  "resource_documentation": "https://example.com/docs/api"
}
```

## 4. Agent Authentication Workflow
1. **Agent Discovers Protected Resource**: Agent queries `GET /.well-known/oauth-protected-resource`.
2. **Agent Resolves Authorization Server**: Agent reads `"authorization_servers"` (e.g. `https://example.com`) and queries its RFC 8414 metadata at `/.well-known/oauth-authorization-server` or `/.well-known/openid-configuration`.
3. **Agent Requests Token**: Agent sends a `client_credentials` or token-exchange request to the discovered `token_endpoint`.
4. **Agent Accesses API**: Agent calls protected APIs (e.g. `POST /api/gemini/generate`) passing:
   ```http
   Authorization: Bearer <access_token>
   ```

## 5. Web Linking & HTTP Headers (RFC 8288)
Servers advertise the protected resource metadata via HTTP response headers:
```http
Link: </.well-known/oauth-protected-resource>; rel="oauth-protected-resource"
```
And HTML entry points include:
```html
<link rel="oauth-protected-resource" href="/.well-known/oauth-protected-resource" />
```
