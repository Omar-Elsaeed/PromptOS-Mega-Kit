---
name: dns-aid
description: Publish and discover DNS for AI Discovery (DNS-AID) records using ServiceMode SVCB/HTTPS records with alpn and endpoint parameters under _index._agents and _a2a._agents signed with DNSSEC.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: draft-mozleywilliams-dnsop-dnsaid
  rfc:
    - RFC 9460
    - RFC 8484
    - RFC 4033
    - RFC 4034
    - RFC 4035
  dnssec: true
  rrtypes:
    - SVCB
    - HTTPS
    - TXT
    - DNSKEY
    - DS
    - RRSIG
---

# DNS for AI Discovery (DNS-AID) Agent Skill

This skill defines the operational standards and discovery procedures for **DNS for AI Discovery (DNS-AID)**, an open Internet standard (IETF `draft-mozleywilliams-dnsop-dnsaid` and RFC 9460) governed by the Linux Foundation and pioneered by Infoblox.

## 1. Overview
DNS-AID turns the global, decentralized Domain Name System (DNS) into a federated directory for autonomous AI agents, Model Context Protocol (MCP) servers, and Agent-to-Agent (A2A) networks without requiring central registry intermediaries.

## 2. Well-Known Entrypoint Records
Organizations publish discovery records under the `_agents.{domain}` namespace:

### A. Agent Index Entrypoint (`_index._agents.{domain}`)
The primary directory pointer for all agents hosted by a domain:
```dns
_index._agents.example.com. 300 IN SVCB 1 example.com. (
  alpn="h2,h3"
  port="443"
  endpoint="/.well-known/api-catalog"
  key65300="path=/.well-known/api-catalog"
  mandatory="alpn"
)
_index._agents.example.com. 300 IN HTTPS 1 example.com. (
  alpn="h2,h3"
  port="443"
  endpoint="/.well-known/api-catalog"
)
_index._agents.example.com. 300 IN TXT "v=dnsaid1; type=index; catalog=https://example.com/.well-known/api-catalog; desc=PromptOS AI Discovery Index"
```

### B. Agent-to-Agent Protocol Entrypoint (`_a2a._agents.{domain}`)
Standard negotiation point for live A2A streaming and RPC interactions:
```dns
_a2a._agents.example.com. 300 IN SVCB 1 example.com. (
  alpn="h2,h3"
  port="443"
  endpoint="/api/gemini/stream"
  mandatory="alpn"
)
_a2a._agents.example.com. 300 IN HTTPS 1 example.com. (
  alpn="h2,h3"
  port="443"
  endpoint="/api/gemini/stream"
)
_a2a._agents.example.com. 300 IN TXT "v=dnsaid1; proto=a2a; endpoint=https://example.com/api/gemini/stream; alpn=h2,h3"
```

### C. Specific Agent Service (`_promptos._a2a._agents.{domain}`)
Direct binding for the PromptOS MegaKit generation agent:
```dns
_promptos._a2a._agents.example.com. 300 IN SVCB 1 example.com. (
  alpn="h2,h3"
  port="443"
  endpoint="/api/gemini/generate"
  mandatory="alpn"
)
_promptos._a2a._agents.example.com. 300 IN TXT "v=dnsaid1; name=PromptOS MegaKit; capabilities=prompt_gen,bedrock_gen,fable5,gepa,evals"
```

## 3. RFC 9460 ServiceMode SVCB Parameters
- **SvcPriority > 0**: Enables ServiceMode (SvcPriority = 1 indicates highest priority).
- **TargetName**: Specifies the host serving the agent endpoint (`.` or `@` or target FQDN).
- **alpn**: Advertises application-layer protocol negotiation tokens (`h2,h3`).
- **port**: Default transport port (`443`).
- **endpoint**: URI path to the agent entrypoint or API catalog (`/.well-known/api-catalog` or `/api/gemini/stream`).
- **mandatory**: Specifies required parameters (e.g., `alpn`).

## 4. DNSSEC Signing & Validation
To ensure that validating recursive resolvers return authenticated data (`AD=1`), the public discovery zone is signed using standard DNSSEC (RFC 4033, RFC 4034, RFC 4035) with Algorithm 13 (ECDSAP256SHA256):
- **DNSKEY**: Zone Signing Key (ZSK) and Key Signing Key (KSK).
- **DS Record**: Published at the parent delegation registrar with SHA-256 (Digest Type 2).
- **RRSIG**: Cryptographic signatures covering the SVCB, HTTPS, and TXT RRsets.

## 5. DNS-over-HTTPS (DoH) Discovery
Agents can discover DNS-AID records directly using RFC 8484 DNS-over-HTTPS at:
`https://example.com/dns-query?name=_index._agents.example.com&type=SVCB`

Or query with JSON DoH format:
`https://example.com/dns-query?name=_a2a._agents.example.com&type=SVCB` with header `Accept: application/dns-json`.
