---
name: oauth-discovery
description: Publish OAuth 2.0 Authorization Server Metadata (RFC 8414) and OpenID Connect Discovery 1.0 metadata at /.well-known/oauth-authorization-server and /.well-known/openid-configuration for automated AI agent authentication.
version: 1.0.0
author: PromptOS MegaKit
metadata:
  standards:
    - RFC 8414 (OAuth 2.0 Authorization Server Metadata)
    - OpenID Connect Discovery 1.0
    - RFC 7517 (JSON Web Key Set)
    - RFC 6749 (The OAuth 2.0 Authorization Framework)
    - RFC 7519 (JSON Web Token)
  endpoints:
    - /.well-known/openid-configuration
    - /.well-known/oauth-authorization-server
    - /.well-known/jwks.json
    - /oauth/token
    - /oauth/authorize
    - /oauth/userinfo
---

# OAuth / OIDC Discovery Agent Skill (RFC 8414 & OpenID Connect)

This skill documents how AI agents programmatically discover authentication capabilities, token endpoints, and cryptographic key material for PromptOS MegaKit via **RFC 8414** and **OpenID Connect Discovery 1.0**.

## 1. Overview
When AI agents interact with protected APIs, hardcoded credentials or manual developer configurations cause brittle workflows. Instead, agents query standardized discovery documents to obtain:
- **`token_endpoint`**: The URI to obtain OAuth 2.0 bearer access tokens (`/oauth/token`).
- **`authorization_endpoint`**: User consent/delegation endpoint (`/oauth/authorize`).
- **`jwks_uri`**: Public keys (JSON Web Key Set) used to sign and verify ID tokens and assertions (`/.well-known/jwks.json`).
- **`grant_types_supported`**: Machine-to-machine grants (`client_credentials`), user delegation (`authorization_code`), and token exchange (`urn:ietf:params:oauth:grant-type:token-exchange`).
- **`scopes_supported`**: Granular permissions (e.g. `openid`, `api`, `prompts:read`, `prompts:write`, `agents:execute`).

## 2. Standard Discovery URIs

### A. OpenID Connect Discovery 1.0
Published at:
```http
GET /.well-known/openid-configuration HTTP/1.1
Host: example.com
Accept: application/json
```

### B. OAuth 2.0 Authorization Server Metadata (RFC 8414)
Published at:
```http
GET /.well-known/oauth-authorization-server HTTP/1.1
Host: example.com
Accept: application/json
```

## 3. Metadata Schema Example
```json
{
  "issuer": "https://example.com",
  "authorization_endpoint": "https://example.com/oauth/authorize",
  "token_endpoint": "https://example.com/oauth/token",
  "jwks_uri": "https://example.com/.well-known/jwks.json",
  "userinfo_endpoint": "https://example.com/oauth/userinfo",
  "response_types_supported": [
    "code",
    "token",
    "id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256",
    "EdDSA"
  ],
  "grant_types_supported": [
    "authorization_code",
    "client_credentials",
    "refresh_token",
    "urn:ietf:params:oauth:grant-type:token-exchange"
  ],
  "token_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "private_key_jwt"
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
  "code_challenge_methods_supported": [
    "S256"
  ],
  "service_documentation": "https://example.com/docs/api"
}
```

## 4. Automated Agent Authentication Handshake

### Machine-to-Machine (`client_credentials` grant)
1. Agent queries `GET /.well-known/openid-configuration`.
2. Agent extracts `"token_endpoint"`.
3. Agent sends request:
```http
POST /oauth/token HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=agent_client_id&client_secret=agent_secret&scope=api
```
4. Server responds:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "api"
}
```
5. Agent includes `Authorization: Bearer <access_token>` on API requests.

## 5. Web Linking & Discovery Headers (RFC 8288)
Servers advertise discovery documents via HTTP Link headers:
```http
Link: </.well-known/openid-configuration>; rel="openid-configuration", </.well-known/oauth-authorization-server>; rel="oauth-authorization-server"
```
And HTML pages include:
```html
<link rel="openid-configuration" href="/.well-known/openid-configuration" />
<link rel="oauth-authorization-server" href="/.well-known/oauth-authorization-server" />
```
