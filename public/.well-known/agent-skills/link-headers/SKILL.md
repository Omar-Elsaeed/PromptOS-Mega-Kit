---
name: link-headers
description: Add Link response headers for agent discovery per RFC 8288 and RFC 9727 Section 3, advertising machine-readable API catalogs, specifications, documentation, and site descriptions.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: RFC 8288 (Web Linking)
  related_standards:
    - RFC 9727 (API Catalog)
    - RFC 8631 (Link Relations for API Discovery)
    - llmstxt.org (llms.txt)
  relations:
    - api-catalog
    - service-desc
    - service-doc
    - describedby
    - status
---

# Link Response Headers for Agent Discovery (RFC 8288)

This skill documents how PromptOS MegaKit implements HTTP Link response headers conforming to **RFC 8288** and **RFC 9727 Section 3** to enable automated discovery of machine-readable resources by autonomous AI agents and web crawlers.

## 1. Overview
Rather than forcing agents to parse and infer endpoints from HTML pages or guess well-known URI locations, RFC 8288 `Link` response headers explicitly advertise related resources directly in the HTTP response headers of the homepage (`/`) and other key pages.

## 2. Standard Registered Relations
The following IANA-registered link relations are published on the root and HTML responses:

- **`rel="api-catalog"`** (RFC 9727): Points to the machine-readable API catalog (`/.well-known/api-catalog`).
- **`rel="service-doc"`** (RFC 8631): Points to human and agent-readable API documentation (`/docs/api`).
- **`rel="service-desc"`** (RFC 8631): Points to machine-readable OpenAPI 3.1 definitions (`/openapi.json`).
- **`rel="describedby"`** (RFC 8288 / llmstxt.org): Points to the agent-friendly site overview (`/llms.txt`).
- **`rel="status"`**: Points to the service health check endpoint (`/api/health`).
- **`rel="dns-aid"`**: Points to DNS for AI Discovery records (`/.well-known/dns-aid`).
- **`rel="oauth-protected-resource"`** (RFC 9728): Points to OAuth protected resource metadata (`/.well-known/oauth-protected-resource`).
- **`rel="alternate"`**: Points to the markdown alternative when negotiated via `Accept: text/markdown`.

## 3. Wire Format Example
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Link: </.well-known/api-catalog>; rel="api-catalog"
Link: </docs/api>; rel="service-doc"
Link: </openapi.json>; rel="service-desc"
Link: </llms.txt>; rel="describedby"
Link: </api/health>; rel="status"
Link: </.well-known/oauth-protected-resource>; rel="oauth-protected-resource"
Link: </.well-known/dns-aid>; rel="dns-aid"
Link: </>; rel="alternate"; type="text/markdown"
```

Both individual `Link:` header fields and comma-separated header values are valid per RFC 8288 Section 3.

## 4. Verification
Inspect the homepage headers via cURL:
```bash
curl -I https://example.com/
```
Verify that `Link:` headers include `rel="api-catalog"`, `rel="service-doc"`, `rel="service-desc"`, and `rel="describedby"`.
