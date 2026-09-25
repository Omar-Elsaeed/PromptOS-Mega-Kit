# PromptOS MegaKit — Agent Authentication & Registration (auth.md)

This document provides autonomous AI agents with instructions and machine-readable metadata to register, authenticate, and obtain scoped credentials to interact with PromptOS MegaKit APIs.

---

## 1. Service Overview & Discovery
- **Service Name**: PromptOS MegaKit
- **Service Documentation**: [/docs/api](/docs/api)
- **OpenAPI 3.1 Specification**: [/openapi.json](/openapi.json)
- **API Catalog (RFC 9727)**: [/.well-known/api-catalog](/.well-known/api-catalog)
- **Protected Resource Metadata (RFC 9728)**: [/.well-known/oauth-protected-resource](/.well-known/oauth-protected-resource)
- **OAuth Authorization Server Metadata (RFC 8414)**: [/.well-known/oauth-authorization-server](/.well-known/oauth-authorization-server)
- **OpenID Connect Discovery 1.0**: [/.well-known/openid-configuration](/.well-known/openid-configuration)
- **Cryptographic Key Set (RFC 7517)**: [/.well-known/jwks.json](/.well-known/jwks.json)

---

## 2. Authentication Metadata (agent_auth)

```json
{
  "auth_md_uri": "/auth.md",
  "register_uri": "/oauth/agent/register",
  "claim_uri": "/oauth/agent/claim",
  "revocation_uri": "/oauth/agent/revoke",
  "token_uri": "/oauth/token",
  "identity_types_supported": [
    "anonymous",
    "identity_assertion",
    "service_auth"
  ],
  "credential_types_supported": [
    "access_token",
    "api_key"
  ],
  "scopes_supported": [
    "api",
    "prompts:read",
    "prompts:write",
    "agents:read",
    "agents:execute"
  ]
}
```

---

## 3. Registration Flows

PromptOS MegaKit supports three autonomous registration pathways for AI agents:

### Flow A: Agent-Verified Flow (ID-JAG / Identity Assertion)
When an agent acts on behalf of a known user and can present an Identity Assertion (JWT signed by a recognized agent provider or IdP):
1. **Send Registration Request**:
   ```http
   POST /oauth/agent/register HTTP/1.1
   Host: <origin>
   Content-Type: application/json

   {
     "agent_name": "Claude-PromptEngineer",
     "identity_type": "identity_assertion",
     "identity_assertion": "<id_jag_or_jwt>",
     "scopes": ["api", "prompts:read", "prompts:write"]
   }
   ```
2. **Response**:
   ```json
   {
     "client_id": "agent_cl_98a7bc12",
     "client_secret": "sec_agent_98a7bc12...",
     "identity_status": "verified",
     "token_endpoint": "/oauth/token",
     "expires_at": 1790395200
   }
   ```

---

### Flow B: User-Claimed Flow (Autonomous with Verification Ceremony)
When an agent self-provisions anonymously and asks the human operator to claim the session:
1. **Register Pre-Claimed Agent**:
   ```http
   POST /oauth/agent/register HTTP/1.1
   Host: <origin>
   Content-Type: application/json

   {
     "agent_name": "AutonomousResearcher",
     "identity_type": "anonymous",
     "scopes": ["api", "prompts:read"]
   }
   ```
2. **Response with Verification Code**:
   ```json
   {
     "client_id": "agent_anon_4387",
     "verification_uri": "/oauth/agent/claim",
     "user_code": "PMK-8291",
     "status": "pending_claim",
     "expires_in": 900
   }
   ```
3. **Claim Confirmation**:
   The user visits `/oauth/agent/claim?code=PMK-8291` to grant permissions to the agent.

---

### Flow C: Direct Machine-to-Machine (RFC 6749 Client Credentials)
If pre-provisioned or utilizing existing application credentials:
```http
POST /oauth/token HTTP/1.1
Host: <origin>
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=<client_id>&client_secret=<client_secret>&scope=api
```
Response:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "api"
}
```

---

## 4. API Request Authentication
Include the Bearer access token on all API requests:
```http
POST /api/gemini/generate HTTP/1.1
Host: <origin>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "prompt": "Optimize this system instruction for reasoning models"
}
```

---

## 5. Credential Revocation
Agents or identity providers can revoke issued credentials:
```http
POST /oauth/agent/revoke HTTP/1.1
Host: <origin>
Content-Type: application/json

{
  "token": "<access_token_or_client_secret>",
  "token_type_hint": "access_token"
}
```
Response: `200 OK`
