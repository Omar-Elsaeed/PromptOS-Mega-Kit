---
name: web-bot-auth
description: Enable bot and agent identification via Web Bot Auth. Publishes an Ed25519 JWKS at /.well-known/http-message-signatures-directory so receiving servers can cryptographically verify HTTP Message Signatures (RFC 9421) attached to outgoing requests.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standard: IETF Web Bot Auth (draft-meunier-http-message-signatures-directory)
  rfc: RFC 9421
  key_type: Ed25519
  jwks_path: /.well-known/http-message-signatures-directory
  content_type: application/http-message-signatures-directory+json
---

# Web Bot Auth Agent Skill

This skill defines the operational standards, key publication procedures, and verification protocols for **Web Bot Auth** (IETF `webbotauth` Working Group, `draft-meunier-http-message-signatures-directory`, and Cloudflare Verified Bots).

## 1. Overview
Web Bot Auth replaces forgeable User-Agent strings and brittle IP allowlists with cryptographic certainty. When PromptOS MegaKit or its autonomous agents issue HTTP requests, they attach cryptographic HTTP Message Signatures (RFC 9421) signed by an Ed25519 private key.

Receiving servers verify the signature by retrieving the public key from the authoritative directory:
`/.well-known/http-message-signatures-directory`

## 2. Public Key Directory Specification
- **URI**: `/.well-known/http-message-signatures-directory`
- **Content-Type**: `application/http-message-signatures-directory+json; charset=utf-8` (or `application/json`)
- **Format**: JSON Web Key Set (JWKS, RFC 7517)
- **Key Algorithm**: `Ed25519` (`kty: "OKP"`, `crv: "Ed25519"`, `alg: "ed25519"`, `use: "sig"`)
- **Key Identification (`kid`)**: Base64url-encoded RFC 7638 SHA-256 JWK thumbprint

### Directory Example
```json
{
  "keys": [
    {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "D8TWqxR6pH9DKPi-cxRcH-OTfSHKiAgq_caFMTdsTUk",
      "kid": "RIP8_Fasx5iR_Hif-jQ_TH2jwMLVJZipbcDMrN2HYZw",
      "alg": "ed25519",
      "use": "sig"
    }
  ]
}
```

## 3. Request Signing Protocol (RFC 9421)
When issuing automated bot/agent requests to external APIs or partners, the bot attaches three headers:

```http
POST /api/webhook HTTP/1.1
Host: partner.example.com
Signature-Agent: https://example.com/.well-known/http-message-signatures-directory
Signature-Input: sig1=("@method" "@path" "@authority");created=1727230000;expires=1727230060;keyid="RIP8_Fasx5iR_Hif-jQ_TH2jwMLVJZipbcDMrN2HYZw";tag="web-bot-auth"
Signature: sig1=:k8a...base64_signature...:
```

### Parameters
- **`Signature-Agent`**: Canonical URL pointing to the JWKS directory (or origin host).
- **`tag="web-bot-auth"`**: Mandatory tag identifying the signature as adhering to Web Bot Auth.
- **`created` & `expires`**: Unix epoch timestamps (Cloudflare recommends ~60s validity to prevent replay attacks).
- **`keyid`**: Matching the `kid` published in the JWKS directory.

## 4. Verification Workflow
1. Receiver extracts `Signature-Agent`, `Signature-Input`, and `Signature`.
2. Receiver fetches the JWKS from `/.well-known/http-message-signatures-directory` of the `Signature-Agent` origin.
3. Receiver locates the matching `kid` in the key set.
4. Receiver verifies the Ed25519 signature over the reconstructed signature base (`"@method"`, `"@path"`, `"@authority"`).
5. If valid, the request is marked as an authenticated bot without requiring IP allowlisting.
