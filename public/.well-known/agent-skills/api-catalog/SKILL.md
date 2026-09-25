---
name: api-catalog
description: Publish machine-readable API catalog using the RFC 9727 standard with application/linkset+json format conforming to RFC 9264, enabling automated API discovery for AI agents.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: RFC 9727
  format: RFC 9264 Linkset (application/linkset+json)
  location: /.well-known/api-catalog
  link_relations:
    - service-desc
    - service-doc
    - status
---

# API Catalog Agent Skill (RFC 9727)

This skill documents the automated API discovery implementation adhering to **RFC 9727** (`api-catalog: A Well-Known URI and Link Relation to Help Discovery of APIs`) and **RFC 9264** (`Linkset: Media Types and a Link Relation Type for Link Sets`).

## 1. Overview
Rather than forcing AI agents, crawlers, or developers to scrape web pages or search through developer portals, RFC 9727 establishes a canonical well-known endpoint at `/.well-known/api-catalog`.

It returns a structured linkset document with `Content-Type: application/linkset+json`, containing links to:
- **`service-desc`**: Machine-readable API specifications (such as OpenAPI 3.1 JSON/YAML).
- **`service-doc`**: Human/agent-readable documentation pages.
- **`status`**: Health and status check endpoints.

## 2. Media Type & Specification
- **Endpoint**: `/.well-known/api-catalog`
- **Media Type**: `application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"`
- **Schema**: RFC 9264 JSON Linkset format with a top-level `"linkset"` array.

## 3. Linkset Structure Example (RFC 9727 Appendix A)
```json
{
  "linkset": [
    {
      "anchor": "https://example.com/api",
      "service-desc": [
        {
          "href": "https://example.com/openapi.json",
          "type": "application/json"
        }
      ],
      "service-doc": [
        {
          "href": "https://example.com/docs/api",
          "type": "text/html"
        }
      ],
      "status": [
        {
          "href": "https://example.com/api/health",
          "type": "application/json"
        }
      ],
      "title": "PromptOS MegaKit Core AI API"
    }
  ]
}
```

## 4. HTTP Link Headers & Discovery
Web servers advertise the API catalog via RFC 8288 Link headers on root and entry-point responses:
```http
Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"
```
And HTML pages include:
```html
<link rel="api-catalog" type="application/linkset+json" href="/.well-known/api-catalog" />
```
