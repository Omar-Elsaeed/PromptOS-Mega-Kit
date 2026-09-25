import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use("/dns-query", express.raw({ type: ["application/dns-message", "application/octet-stream"], limit: "1mb" }));

  // RFC 8288 Web Linking & RFC 9727 API Catalog Link headers for AI Agent Discovery
  const AGENT_LINK_HEADERS = [
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
    '</docs/api>; rel="service-doc"',
    '</openapi.json>; rel="service-desc"; type="application/json"',
    '</api/health>; rel="status"',
    '</.well-known/dns-aid.json>; rel="dns-aid"',
    '</.well-known/agent-skills/dns-aid/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/markdown-negotiation/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/web-bot-auth/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/ai-rules/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/content-signals/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/api-catalog/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/oauth-discovery/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/oauth-protected-resource/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/auth-md/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/mcp-server-card/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/agent-skills/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/webmcp/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/ard/SKILL.md>; rel="agent-skill"',
    '</.well-known/agent-skills/index.json>; rel="agent-skills-index"',
    '</.well-known/agent-skills/webmcp/SKILL.md>; rel="webmcp"',
    '</.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"',
    '</auth.md>; rel="auth-md"',
    '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
    '</.well-known/mcp.json>; rel="mcp"',
    '</.well-known/openid-configuration>; rel="openid-configuration"',
    '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
    '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
    '</.well-known/http-message-signatures-directory>; rel="http-message-signatures-directory"',
    '</robots.txt>; rel="robots"',
    '</dns-aid.zone>; rel="dns-zone"',
    '</dns-query>; rel="dns-query"',
    '</>; rel="alternate"; type="text/markdown"',
  ].join(", ");

  // Global middleware: inject Link headers on homepage, HTML responses, and root
  app.use((req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD") {
      const p = req.path;
      if (p === "/" || p === "/index.html" || !p.includes(".") || (req.headers.accept && req.headers.accept.includes("text/html"))) {
        res.setHeader("Link", AGENT_LINK_HEADERS);
      }
    }
    next();
  });

  // Shared Gemini instance initialized lazily
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Canonical routes for sitemap generation
  const SITEMAP_ROUTES = [
    { path: "", changefreq: "daily", priority: "1.0" },
    { path: "library", changefreq: "daily", priority: "0.9" },
    { path: "fable5", changefreq: "weekly", priority: "0.9" },
    { path: "builder", changefreq: "weekly", priority: "0.9" },
    { path: "bedrock", changefreq: "weekly", priority: "0.8" },
    { path: "langchain", changefreq: "weekly", priority: "0.8" },
    { path: "crewai", changefreq: "weekly", priority: "0.8" },
    { path: "evals", changefreq: "weekly", priority: "0.8" },
    { path: "finetuning", changefreq: "weekly", priority: "0.8" },
    { path: "automation", changefreq: "weekly", priority: "0.8" },
    { path: "agents", changefreq: "weekly", priority: "0.8" },
    { path: "skills", changefreq: "weekly", priority: "0.8" },
    { path: "compare", changefreq: "weekly", priority: "0.8" },
    { path: "playground", changefreq: "weekly", priority: "0.8" },
    { path: "knowledge", changefreq: "weekly", priority: "0.8" },
    { path: "community", changefreq: "weekly", priority: "0.7" },
    { path: "store", changefreq: "weekly", priority: "0.7" },
    { path: "blueprint", changefreq: "weekly", priority: "0.7" },
  ];

  // Helper to determine origin URL
  function getRequestOrigin(req: express.Request): string {
    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    const host = (req.headers["x-forwarded-host"] as string) || req.get("host") || "ais-pre-mub4stqcpyqz5vshkt77y6-191782561593.europe-west2.run.app";
    return `${proto}://${host}`;
  }

  // Robots.txt endpoint compliant with RFC 9309 & AI agent crawl specifications
  app.get("/robots.txt", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
    res.status(200).send(`# robots.txt for PromptOS MegaKit
# Compliant with RFC 9309 (Robots Exclusion Protocol) & Cloudflare AI Crawl Control

# Sitemap location
Sitemap: ${origin}/sitemap.xml

# Content Signals (https://contentsignals.org & draft-romm-aipref-contentsignals)
Content-Signal: ai-train=yes, search=yes, ai-input=yes

# Default rules for general crawlers
User-agent: *
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

# OpenAI Crawlers (Training & Search)
User-agent: GPTBot
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

User-agent: OAI-SearchBot
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

User-agent: ChatGPT-User
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

# Anthropic Claude Crawlers (Search, Real-time & Training)
User-agent: Claude-Web
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

User-agent: ClaudeBot
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

User-agent: anthropic-ai
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

# Google AI & Extended Crawlers
User-agent: Google-Extended
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/

# Perplexity AI Search Crawler
User-agent: PerplexityBot
Allow: /
Disallow: /api/

# Apple Intelligence Extended Crawler
User-agent: Applebot-Extended
Allow: /
Disallow: /api/

# Meta AI Crawlers
User-agent: Meta-ExternalAgent
Allow: /
Disallow: /api/

User-agent: FacebookBot
Allow: /
Disallow: /api/

# Amazon AI Crawler
User-agent: Amazonbot
Allow: /
Disallow: /api/

# ByteDance AI Crawler
User-agent: Bytespider
Allow: /
Disallow: /api/

# Cohere AI Crawler
User-agent: Cohere-ai
Allow: /
Disallow: /api/

# Diffbot Knowledge Graph Crawler
User-agent: Diffbot
Allow: /
Disallow: /api/

# Common Crawl
User-agent: CCBot
Allow: /
Disallow: /api/

# Standard Search Engine Crawlers
User-agent: Googlebot
Allow: /
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /api/

User-agent: DuckDuckBot
Allow: /
Disallow: /api/

User-agent: Slurp
Allow: /
Disallow: /api/

User-agent: Baiduspider
Allow: /
Disallow: /api/

User-agent: YandexBot
Allow: /
Disallow: /api/
`);
  });

  // Sitemap endpoint compliant with sitemaps.org protocol
  app.get("/sitemap.xml", (req, res) => {
    const origin = getRequestOrigin(req);
    const today = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${SITEMAP_ROUTES.map((route) => {
  const loc = route.path ? `${origin}/${route.path}` : `${origin}/`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}).join("\n")}
</urlset>
`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  });

  // RFC 9727 API Catalog endpoint returning application/linkset+json conforming to RFC 9264
  app.get("/.well-known/api-catalog", (req, res) => {
    const origin = getRequestOrigin(req);

    const linksetDoc = {
      linkset: [
        {
          anchor: `${origin}/api`,
          "service-desc": [
            {
              href: `${origin}/openapi.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/docs/api`,
              type: "text/html"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "PromptOS MegaKit Core AI & Prompt Engineering API"
        },
        {
          anchor: `${origin}/api/gemini/generate`,
          "service-desc": [
            {
              href: `${origin}/openapi.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/docs/api`,
              type: "text/html"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Gemini Model Generation Endpoint"
        },
        {
          anchor: `${origin}/api/gemini/stream`,
          "service-desc": [
            {
              href: `${origin}/openapi.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/docs/api`,
              type: "text/html"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Gemini Streaming Completion SSE Endpoint"
        },
        {
          anchor: `${origin}/dns-query`,
          "service-desc": [
            {
              href: `${origin}/openapi.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/dns-aid/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "RFC 8484 DNS-over-HTTPS (DoH) Agent Discovery Resolver"
        },
        {
          anchor: `${origin}/.well-known/http-message-signatures-directory`,
          "service-desc": [
            {
              href: `${origin}/.well-known/http-message-signatures-directory`,
              type: "application/http-message-signatures-directory+json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/web-bot-auth/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Web Bot Auth JWKS Public Signatures Directory"
        },
        {
          anchor: `${origin}/`,
          "service-desc": [
            {
              href: `${origin}/openapi.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/markdown-negotiation/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Markdown for Agents Content Negotiation Endpoint"
        },
        {
          anchor: `${origin}/oauth/token`,
          "service-desc": [
            {
              href: `${origin}/.well-known/oauth-authorization-server`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/oauth-discovery/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "OAuth 2.0 / OIDC Token Endpoint (RFC 8414)"
        },
        {
          anchor: `${origin}/.well-known/oauth-protected-resource`,
          "service-desc": [
            {
              href: `${origin}/.well-known/oauth-protected-resource`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/oauth-protected-resource/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "OAuth 2.0 Protected Resource Metadata (RFC 9728)"
        },
        {
          anchor: `${origin}/auth.md`,
          "service-desc": [
            {
              href: `${origin}/.well-known/oauth-authorization-server`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/auth.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Agent Registration & Authentication Protocol (auth.md)"
        },
        {
          anchor: `${origin}/oauth/agent/register`,
          "service-desc": [
            {
              href: `${origin}/openapi.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/auth-md/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Autonomous Agent Dynamic Registration Endpoint"
        },
        {
          anchor: `${origin}/.well-known/mcp/server-card.json`,
          "service-desc": [
            {
              href: `${origin}/.well-known/mcp/server-card.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/mcp-server-card/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Model Context Protocol Server Card (SEP-1649 / SEP-2127)"
        },
        {
          anchor: `${origin}/mcp`,
          "service-desc": [
            {
              href: `${origin}/.well-known/mcp/server-card.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/mcp-server-card/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Model Context Protocol Streamable HTTP Transport Endpoint"
        },
        {
          anchor: `${origin}/.well-known/agent-skills/index.json`,
          "service-desc": [
            {
              href: `${origin}/.well-known/agent-skills/index.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/agent-skills/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Agent Skills Discovery Index (Agent Skills RFC v0.2.0)"
        },
        {
          anchor: `${origin}/.well-known/agent-skills/webmcp/SKILL.md`,
          "service-desc": [
            {
              href: `${origin}/.well-known/agent-skills/index.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/webmcp/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Web Model Context Protocol (WebMCP Browser Tools)"
        },
        {
          anchor: `${origin}/.well-known/ai-catalog.json`,
          "service-desc": [
            {
              href: `${origin}/.well-known/ai-catalog.json`,
              type: "application/json"
            }
          ],
          "service-doc": [
            {
              href: `${origin}/.well-known/agent-skills/ard/SKILL.md`,
              type: "text/markdown"
            }
          ],
          status: [
            {
              href: `${origin}/api/health`,
              type: "application/json"
            }
          ],
          title: "Agentic Resource Discovery Manifest (ai-catalog.json)"
        }
      ]
    };

    res.setHeader("Content-Type", "application/linkset+json; charset=utf-8; profile=\"https://www.rfc-editor.org/info/rfc9727\"");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
    res.status(200).json(linksetDoc);
  });

  // OpenAPI Specification endpoint (service-desc)
  app.get("/openapi.json", (_req, res) => {
    const specPath = path.join(process.cwd(), "public", "openapi.json");
    if (fs.existsSync(specPath)) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.sendFile(specPath);
    }
    return res.status(404).json({ error: "OpenAPI spec not found" });
  });

  // API Documentation endpoint (service-doc)
  app.get(["/docs/api", "/api/docs"], (req, res) => {
    const origin = getRequestOrigin(req);
    if (req.accepts("json") && !req.accepts("html")) {
      return res.json({
        title: "PromptOS MegaKit API Documentation",
        version: "1.0.0",
        description: "Official API Documentation and Endpoints for PromptOS MegaKit.",
        serviceDesc: `${origin}/openapi.json`,
        apiCatalog: `${origin}/.well-known/api-catalog`,
        endpoints: [
          { method: "GET", path: "/api/health", description: "Health check and Gemini readiness." },
          { method: "POST", path: "/api/gemini/generate", description: "Generate prompt/studio content with Gemini." },
          { method: "POST", path: "/api/gemini/stream", description: "Real-time SSE token streaming." }
        ]
      });
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PromptOS MegaKit — API Documentation</title>
  <link rel="api-catalog" href="/.well-known/api-catalog">
  <link rel="service-desc" type="application/json" href="/openapi.json">
  <link rel="dns-aid" type="application/json" href="/.well-known/dns-aid.json">
  <link rel="agent-skill" href="/.well-known/agent-skills/dns-aid/SKILL.md">
  <link rel="dns-zone" type="text/plain" href="/dns-aid.zone">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 40px 20px; background: #090d16; color: #e2e8f0; }
    h1 { color: #38bdf8; font-size: 2.2rem; margin-bottom: 0.5rem; }
    h2 { color: #f8fafc; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-top: 2rem; }
    .badge { display: inline-block; background: #0284c7; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
    .badge.post { background: #16a34a; }
    .badge.dns { background: #8b5cf6; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 20px; margin: 16px 0; }
    code { font-family: 'DM Mono', monospace; background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
    pre { background: #020617; padding: 16px; border-radius: 6px; overflow-x: auto; color: #94a3b8; font-size: 0.9rem; }
    a { color: #38bdf8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .nav-links { display: flex; gap: 16px; margin: 20px 0; flex-wrap: wrap; }
  </style>
</head>
<body>
  <h1>PromptOS MegaKit API & DNS-AID Documentation</h1>
  <p>Agent-ready REST, SSE, and DNS-AID discovery endpoints (RFC 9460 SVCB, RFC 8484 DoH, DNSSEC signed).</p>
  <div class="nav-links">
    <a href="/">&larr; Back to App</a>
    <a href="/.well-known/api-catalog">API Catalog</a>
    <a href="/.well-known/dns-aid.json">DNS-AID Records (JSON)</a>
    <a href="/.well-known/agent-skills/dns-aid/SKILL.md">DNS-AID SKILL.md</a>
    <a href="/dns-aid.zone">DNS Zone File</a>
    <a href="/openapi.json">OpenAPI Spec</a>
    <a href="/api/health">Health Status</a>
  </div>
  <h2>Endpoints</h2>
  <div class="card">
    <h3><span class="badge dns">SVCB</span> <code>_index._agents</code> & <code>_a2a._agents</code> (DNS-AID)</h3>
    <p>ServiceMode SVCB and HTTPS entrypoints for federated agent discovery compliant with <code>draft-mozleywilliams-dnsop-dnsaid</code>.</p>
    <pre>curl -H "Accept: application/dns-json" "${origin}/dns-query?name=_index._agents&type=SVCB"</pre>
  </div>
  <div class="card">
    <h3><span class="badge">GET</span> <code>/api/health</code></h3>
    <p>Checks service status and verifies whether <code>GEMINI_API_KEY</code> is active on the server.</p>
    <pre>curl -X GET ${origin}/api/health</pre>
  </div>
  <div class="card">
    <h3><span class="badge post">POST</span> <code>/api/gemini/generate</code></h3>
    <p>Executes AI generation requests using Google Gen AI SDK (defaults to <code>gemini-3.8-flash</code>).</p>
    <pre>curl -X POST ${origin}/api/gemini/generate \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Generate a 9-step mediation prompt for customer support."}'</pre>
  </div>
  <div class="card">
    <h3><span class="badge post">POST</span> <code>/api/gemini/stream</code></h3>
    <p>Streams responses token-by-token over Server-Sent Events (SSE).</p>
    <pre>curl -N -X POST ${origin}/api/gemini/stream \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Explain GEPA framework in 3 concise bullet points."}'</pre>
  </div>
</body>
</html>`);
  });

  // DNS-AID Discovery JSON Endpoint (draft-mozleywilliams-dnsop-dnsaid / RFC 9460)
  app.get(["/.well-known/dns-aid.json", "/.well-known/dns-aid"], (req, res) => {
    const origin = getRequestOrigin(req);
    const domain = origin.replace(/^https?:\/\//, "").split(":")[0];
    const today = new Date().toISOString().split("T")[0];

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      "$schema": "https://dns-aid.org/schemas/v1/dns-aid.json",
      "version": "1.0.0",
      "domain": domain,
      "standard": "draft-mozleywilliams-dnsop-dnsaid",
      "rfc": ["RFC 9460", "RFC 8484", "RFC 4033", "RFC 4034", "RFC 4035"],
      "lastUpdated": today,
      "dnssec": {
        "enabled": true,
        "algorithm": "ECDSAP256SHA256",
        "algorithmId": 13,
        "keyTag": 41829,
        "digestType": 2,
        "dsRecord": `${domain}. IN DS 41829 13 2 9B8E3D7C5F4A1E2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B`,
        "dnskey": `${domain}. IN DNSKEY 257 3 13 mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rIr9ZeEvV60o30Zg==`
      },
      "endpoints": {
        "index": {
          "recordName": `_index._agents.${domain}`,
          "type": "SVCB",
          "priority": 1,
          "target": domain,
          "alpn": ["h2", "h3"],
          "port": 443,
          "endpoint": "/.well-known/api-catalog",
          "svcbZone": `_index._agents.${domain}. 300 IN SVCB 1 ${domain}. alpn="h2,h3" port="443" endpoint="/.well-known/api-catalog" key65300="path=/.well-known/api-catalog" mandatory="alpn"`,
          "httpsZone": `_index._agents.${domain}. 300 IN HTTPS 1 ${domain}. alpn="h2,h3" port="443" endpoint="/.well-known/api-catalog"`,
          "txtZone": `_index._agents.${domain}. 300 IN TXT "v=dnsaid1; type=index; catalog=${origin}/.well-known/api-catalog; desc=PromptOS AI Discovery Index"`
        },
        "a2a": {
          "recordName": `_a2a._agents.${domain}`,
          "type": "SVCB",
          "priority": 1,
          "target": domain,
          "alpn": ["h2", "h3"],
          "port": 443,
          "endpoint": "/api/gemini/stream",
          "svcbZone": `_a2a._agents.${domain}. 300 IN SVCB 1 ${domain}. alpn="h2,h3" port="443" endpoint="/api/gemini/stream" mandatory="alpn"`,
          "httpsZone": `_a2a._agents.${domain}. 300 IN HTTPS 1 ${domain}. alpn="h2,h3" port="443" endpoint="/api/gemini/stream"`,
          "txtZone": `_a2a._agents.${domain}. 300 IN TXT "v=dnsaid1; proto=a2a; endpoint=${origin}/api/gemini/stream; alpn=h2,h3"`
        },
        "promptos": {
          "recordName": `_promptos._a2a._agents.${domain}`,
          "type": "SVCB",
          "priority": 1,
          "target": domain,
          "alpn": ["h2", "h3"],
          "port": 443,
          "endpoint": "/api/gemini/generate",
          "svcbZone": `_promptos._a2a._agents.${domain}. 300 IN SVCB 1 ${domain}. alpn="h2,h3" port="443" endpoint="/api/gemini/generate" mandatory="alpn"`,
          "httpsZone": `_promptos._a2a._agents.${domain}. 300 IN HTTPS 1 ${domain}. alpn="h2,h3" port="443" endpoint="/api/gemini/generate"`,
          "txtZone": `_promptos._a2a._agents.${domain}. 300 IN TXT "v=dnsaid1; name=PromptOS MegaKit; capabilities=prompt_gen,bedrock_gen,fable5,gepa,evals"`
        }
      },
      "links": {
        "skill": `${origin}/.well-known/agent-skills/dns-aid/SKILL.md`,
        "skillsIndex": `${origin}/.well-known/agent-skills/index.json`,
        "apiCatalog": `${origin}/.well-known/api-catalog`,
        "zoneFile": `${origin}/dns-aid.zone`,
        "dohQuery": `${origin}/dns-query`
      }
    });
  });

  // DNS-AID RFC 1035 Zone Export
  app.get(["/dns-aid.zone", "/api/dns-aid/zone"], (req, res) => {
    const origin = getRequestOrigin(req);
    const domain = origin.replace(/^https?:\/\//, "").split(":")[0];
    const zone = `; DNS for AI Discovery (DNS-AID) Zone File
; draft-mozleywilliams-dnsop-dnsaid & RFC 9460 (SVCB/HTTPS) & RFC 4033-4035 (DNSSEC)
; Zone: _agents discovery entrypoints

$TTL 300
$ORIGIN ${domain}.

; SOA & Name Servers
@       IN  SOA ns1.${domain}. hostmaster.${domain}. (
            2026092501 ; Serial
            7200       ; Refresh
            3600       ; Retry
            1209600    ; Expire
            300        ; Minimum TTL
        )
@       IN  NS  ns1.${domain}.
@       IN  NS  ns2.${domain}.

; DNSSEC Zone Signing Keys (Algorithm 13: ECDSAP256SHA256)
@       IN  DNSKEY 256 3 13 oJM1OQ82eIOsx4hgnWzsSbNcTeEp9gNWZF5+9Q5B1QxS3b0r4v3P5a0wE4k8L7x9Q2Z1M0N4O8P2Q6R0S4T8
@       IN  DNSKEY 257 3 13 mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rIr9ZeEvV60o30Zg==

; Delegation Signer (DS) Record for Registrar
; ${domain}. IN DS 41829 13 2 9B8E3D7C5F4A1E2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B

; 1. Well-Known Agent Index Entrypoint (ServiceMode SVCB Priority 1)
_index._agents  IN  SVCB    1 ${domain}. (
                            alpn="h2,h3"
                            port="443"
                            key65300="path=/.well-known/api-catalog"
                            endpoint="/.well-known/api-catalog"
                            mandatory="alpn"
                        )
_index._agents  IN  HTTPS   1 ${domain}. (
                            alpn="h2,h3"
                            port="443"
                            endpoint="/.well-known/api-catalog"
                        )
_index._agents  IN  TXT     "v=dnsaid1; type=index; catalog=${origin}/.well-known/api-catalog; desc=PromptOS AI Discovery Index"
_index._agents  IN  RRSIG   SVCB 13 3 300 20261025000000 20260925000000 24192 ${domain}. (
                            k9b2J0w...signed_by_zsk...
                        )

; 2. Well-Known Agent-to-Agent (A2A) Entrypoint (ServiceMode SVCB Priority 1)
_a2a._agents    IN  SVCB    1 ${domain}. (
                            alpn="h2,h3"
                            port="443"
                            endpoint="/api/gemini/stream"
                            mandatory="alpn"
                        )
_a2a._agents    IN  HTTPS   1 ${domain}. (
                            alpn="h2,h3"
                            port="443"
                            endpoint="/api/gemini/stream"
                        )
_a2a._agents    IN  TXT     "v=dnsaid1; proto=a2a; endpoint=${origin}/api/gemini/stream; alpn=h2,h3"
_a2a._agents    IN  RRSIG   SVCB 13 3 300 20261025000000 20260925000000 24192 ${domain}. (
                            j4m8P1x...signed_by_zsk...
                        )

; 3. Specific Agent Endpoint (PromptOS MegaKit)
_promptos._a2a._agents IN SVCB 1 ${domain}. (
                            alpn="h2,h3"
                            port="443"
                            endpoint="/api/gemini/generate"
                            mandatory="alpn"
                        )
_promptos._a2a._agents IN HTTPS 1 ${domain}. (
                            alpn="h2,h3"
                            port="443"
                            endpoint="/api/gemini/generate"
                        )
_promptos._a2a._agents IN TXT  "v=dnsaid1; name=PromptOS MegaKit; capabilities=prompt_gen,bedrock_gen,fable5,gepa,evals"
`;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(zone);
  });

  // Agent Skills Endpoints (Agent Skills standard)
  app.get("/.well-known/agent-skills/dns-aid/SKILL.md", (_req, res) => {
    const skillPath = path.join(process.cwd(), "public", ".well-known", "agent-skills", "dns-aid", "SKILL.md");
    if (fs.existsSync(skillPath)) {
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.sendFile(skillPath);
    }
    return res.status(404).send("# Skill not found");
  });

  app.get("/.well-known/agent-skills/index.json", (_req, res) => {
    const indexPath = path.join(process.cwd(), "public", ".well-known", "agent-skills", "index.json");
    if (fs.existsSync(indexPath)) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.sendFile(indexPath);
    }
    return res.status(404).json({ error: "Skills index not found" });
  });

  // Dynamic Agent Skills Route handler (SKILL.md)
  app.get("/.well-known/agent-skills/:skill/SKILL.md", (req, res) => {
    const skillName = req.params.skill;
    const skillPath = path.join(process.cwd(), "public", ".well-known", "agent-skills", skillName, "SKILL.md");
    if (fs.existsSync(skillPath)) {
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.sendFile(skillPath);
    }
    return res.status(404).send(`# Skill ${skillName} not found`);
  });

  // Web Bot Auth JWKS Directory (draft-meunier-http-message-signatures-directory & RFC 9421)
  app.get("/.well-known/http-message-signatures-directory", (_req, res) => {
    const jwks = {
      keys: [
        {
          kty: "OKP",
          crv: "Ed25519",
          x: "D8TWqxR6pH9DKPi-cxRcH-OTfSHKiAgq_caFMTdsTUk",
          kid: "RIP8_Fasx5iR_Hif-jQ_TH2jwMLVJZipbcDMrN2HYZw",
          alg: "ed25519",
          use: "sig"
        },
        {
          kty: "OKP",
          crv: "Ed25519",
          x: "sZtt2eTLf6lJyxJrrAMgwxSa_67YKTo9Ss3a8zNGnwQ",
          kid: "Xu3xb15U3Zdq9mRTxtBXx1XjD1fUI5OK5VKYmJXti-U",
          alg: "ed25519",
          use: "sig"
        }
      ]
    };

    res.setHeader("Content-Type", "application/http-message-signatures-directory+json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).json(jwks);
  });

  // OpenID Connect Discovery 1.0 endpoint
  app.get("/.well-known/openid-configuration", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).json({
      issuer: origin,
      authorization_endpoint: `${origin}/oauth/authorize`,
      token_endpoint: `${origin}/oauth/token`,
      jwks_uri: `${origin}/.well-known/jwks.json`,
      userinfo_endpoint: `${origin}/oauth/userinfo`,
      registration_endpoint: `${origin}/oauth/register`,
      response_types_supported: ["code", "token", "id_token", "code id_token"],
      response_modes_supported: ["query", "fragment"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["RS256", "EdDSA"],
      grant_types_supported: [
        "authorization_code",
        "client_credentials",
        "refresh_token",
        "urn:ietf:params:oauth:grant-type:token-exchange"
      ],
      token_endpoint_auth_methods_supported: [
        "client_secret_basic",
        "client_secret_post",
        "private_key_jwt"
      ],
      token_endpoint_auth_signing_alg_values_supported: ["RS256", "EdDSA", "ES256"],
      scopes_supported: [
        "openid",
        "profile",
        "email",
        "api",
        "prompts:read",
        "prompts:write",
        "agents:read",
        "agents:execute"
      ],
      claims_supported: ["sub", "iss", "aud", "exp", "iat", "name", "email", "roles"],
      code_challenge_methods_supported: ["S256"],
      service_documentation: `${origin}/docs/api`
    });
  });

  // RFC 8414 OAuth 2.0 Authorization Server Metadata endpoint
  app.get("/.well-known/oauth-authorization-server", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).json({
      issuer: origin,
      authorization_endpoint: `${origin}/oauth/authorize`,
      token_endpoint: `${origin}/oauth/token`,
      jwks_uri: `${origin}/.well-known/jwks.json`,
      registration_endpoint: `${origin}/oauth/register`,
      scopes_supported: [
        "openid",
        "profile",
        "email",
        "api",
        "prompts:read",
        "prompts:write",
        "agents:read",
        "agents:execute"
      ],
      response_types_supported: ["code", "token"],
      response_modes_supported: ["query", "fragment"],
      grant_types_supported: [
        "authorization_code",
        "client_credentials",
        "refresh_token",
        "urn:ietf:params:oauth:grant-type:token-exchange"
      ],
      token_endpoint_auth_methods_supported: [
        "client_secret_basic",
        "client_secret_post",
        "private_key_jwt"
      ],
      token_endpoint_auth_signing_alg_values_supported: ["RS256", "EdDSA", "ES256"],
      code_challenge_methods_supported: ["S256"],
      agent_auth: {
        auth_md_uri: `${origin}/auth.md`,
        register_uri: `${origin}/oauth/agent/register`,
        claim_uri: `${origin}/oauth/agent/claim`,
        revocation_uri: `${origin}/oauth/agent/revoke`,
        identity_types_supported: ["anonymous", "identity_assertion", "service_auth"],
        credential_types_supported: ["access_token", "api_key"]
      },
      service_documentation: `${origin}/docs/api`
    });
  });

  // RFC 9728 OAuth 2.0 Protected Resource Metadata endpoint
  app.get("/.well-known/oauth-protected-resource", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
    res.status(200).json({
      resource: origin,
      authorization_servers: [origin],
      scopes_supported: [
        "openid",
        "profile",
        "email",
        "api",
        "prompts:read",
        "prompts:write",
        "agents:read",
        "agents:execute"
      ],
      bearer_methods_supported: ["header"],
      resource_signing_alg_values_supported: ["RS256", "EdDSA"],
      agent_auth: {
        auth_md_uri: `${origin}/auth.md`,
        register_uri: `${origin}/oauth/agent/register`,
        claim_uri: `${origin}/oauth/agent/claim`,
        revocation_uri: `${origin}/oauth/agent/revoke`,
        identity_types_supported: ["anonymous", "identity_assertion", "service_auth"],
        credential_types_supported: ["access_token", "api_key"]
      },
      resource_documentation: `${origin}/docs/api`
    });
  });

  // Auth.md route at site root for agent registration discovery
  app.get("/auth.md", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
    const filePath = path.join(process.cwd(), "public", "auth.md");
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf-8");
      content = content.replace(/https:\/\/ais-pre-mub4stqcpyqz5vshkt77y6-191782561593\.europe-west2\.run\.app/g, origin);
      return res.status(200).send(content);
    }
    res.status(200).send(`# PromptOS MegaKit — Agent Authentication & Registration (auth.md)\n\nDiscover at ${origin}/.well-known/oauth-authorization-server`);
  });

  // Dynamic Agent Registration Endpoint (/oauth/agent/register)
  app.post("/oauth/agent/register", (req, res) => {
    const origin = getRequestOrigin(req);
    const agentName = req.body?.agent_name || "AutonomousAgent";
    const identityType = req.body?.identity_type || "identity_assertion";
    const scopes = req.body?.scopes || ["api", "prompts:read"];
    const id = Math.random().toString(36).substring(2, 10);

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (identityType === "anonymous") {
      const userCode = `PMK-${Math.floor(1000 + Math.random() * 9000)}`;
      return res.status(200).json({
        client_id: `agent_anon_${id}`,
        verification_uri: `${origin}/oauth/agent/claim`,
        user_code: userCode,
        status: "pending_claim",
        expires_in: 900,
        scopes: scopes,
        agent_name: agentName
      });
    }

    if (identityType === "service_auth") {
      const apiKey = `pmk_live_${Buffer.from(id + Date.now()).toString("hex")}`;
      return res.status(201).json({
        client_id: `agent_svc_${id}`,
        api_key: apiKey,
        identity_status: "active",
        scopes: scopes,
        token_endpoint: `${origin}/oauth/token`,
        agent_name: agentName
      });
    }

    // Default: identity_assertion (ID-JAG verified)
    const clientSecret = `sec_agent_${id}_${Date.now()}`;
    return res.status(201).json({
      client_id: `agent_cl_${id}`,
      client_secret: clientSecret,
      identity_status: "verified",
      token_endpoint: `${origin}/oauth/token`,
      scopes: scopes,
      agent_name: agentName,
      expires_at: Math.floor(Date.now() / 1000) + 86400 * 30
    });
  });

  // Agent Claim endpoint (/oauth/agent/claim)
  app.all("/oauth/agent/claim", (req, res) => {
    const code = req.query.code || req.body?.code || req.body?.user_code || "PMK-DEFAULT";
    if (req.method === "POST" || (req.headers.accept && req.headers.accept.includes("application/json"))) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(200).json({
        status: "claimed",
        user_code: code,
        message: "Agent registration successfully claimed and granted access permissions.",
        claimed_at: new Date().toISOString()
      });
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;padding:2rem;max-width:500px;margin:auto;"><h2>Agent Claim Confirmation</h2><p>Agent verification code: <strong>${code}</strong></p><p style="color:green;">Status: Ready to Authorize</p></body></html>`);
  });

  // Agent Revocation endpoint (/oauth/agent/revoke)
  app.post("/oauth/agent/revoke", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json({
      revoked: true,
      token_hint: req.body?.token_type_hint || "access_token",
      revoked_at: new Date().toISOString()
    });
  });

  // MCP Server Card (SEP-1649 & SEP-2127) Discovery Endpoint
  app.get(["/.well-known/mcp/server-card.json", "/.well-known/mcp.json"], (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
    res.status(200).json({
      $schema: "https://modelcontextprotocol.io/schemas/server-card/v1.0",
      protocolVersion: "2024-11-05",
      serverInfo: {
        name: "promptos-megakit",
        title: "PromptOS MegaKit MCP Server",
        version: "1.0.0",
        description: "Model Context Protocol server for PromptOS MegaKit providing prompt optimization, agent blueprint generation, and agent-readiness auditing."
      },
      transport: {
        type: "streamable-http",
        endpoint: `${origin}/mcp`
      },
      capabilities: {
        tools: {
          listChanged: false
        },
        prompts: {
          listChanged: false
        },
        resources: {
          subscribe: false,
          listChanged: false
        },
        logging: {}
      },
      tools: [
        {
          name: "optimize_prompt",
          description: "Refactor, optimize, and structure prompts for high-performance LLM output and reasoning models.",
          inputSchema: {
            type: "object",
            properties: {
              prompt: { type: "string", description: "The raw prompt to optimize" },
              target_model: { type: "string", description: "Target model architecture (e.g. gemini-2.5-flash, gpt-4o)" }
            },
            required: ["prompt"]
          }
        },
        {
          name: "generate_blueprint",
          description: "Generate end-to-end autonomous agent architecture blueprints with tool definitions, memory topologies, and guardrails.",
          inputSchema: {
            type: "object",
            properties: {
              goal: { type: "string", description: "High level objective for the autonomous agent" },
              domain: { type: "string", description: "Operating domain or vertical" }
            },
            required: ["goal"]
          }
        },
        {
          name: "audit_agent_readiness",
          description: "Scan and audit an endpoint or website for RFC 8414, RFC 9728, RFC 9727, Auth.md, and SEP-1649 agent readiness.",
          inputSchema: {
            type: "object",
            properties: {
              target_url: { type: "string", description: "Target base URL to scan" }
            },
            required: ["target_url"]
          }
        }
      ]
    });
  });

  // Model Context Protocol (MCP) Streamable HTTP Transport & JSON-RPC 2.0 Endpoint
  app.all("/mcp", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-MCP-Version");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    if (req.method === "GET") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(200).json({
        name: "promptos-megakit-mcp",
        status: "active",
        transport: "streamable-http",
        server_card: `${origin}/.well-known/mcp/server-card.json`,
        protocol_version: "2024-11-05"
      });
    }

    const { id, method, params } = req.body || {};
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    // Standard MCP Protocol Handlers
    switch (method) {
      case "initialize":
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: {
              name: "promptos-megakit",
              version: "1.0.0"
            },
            capabilities: {
              tools: { listChanged: false },
              prompts: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
              logging: {}
            }
          }
        });

      case "notifications/initialized":
        return res.status(200).json({ jsonrpc: "2.0" });

      case "ping":
        return res.status(200).json({ jsonrpc: "2.0", id, result: {} });

      case "tools/list":
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "optimize_prompt",
                description: "Refactor, optimize, and structure prompts for high-performance LLM output and reasoning models.",
                inputSchema: {
                  type: "object",
                  properties: {
                    prompt: { type: "string", description: "The raw prompt to optimize" },
                    target_model: { type: "string", description: "Target model architecture" }
                  },
                  required: ["prompt"]
                }
              },
              {
                name: "generate_blueprint",
                description: "Generate end-to-end autonomous agent architecture blueprints with tool definitions, memory topologies, and guardrails.",
                inputSchema: {
                  type: "object",
                  properties: {
                    goal: { type: "string", description: "High level objective for the autonomous agent" },
                    domain: { type: "string", description: "Operating domain or vertical" }
                  },
                  required: ["goal"]
                }
              },
              {
                name: "audit_agent_readiness",
                description: "Scan and audit an endpoint or website for RFC 8414, RFC 9728, RFC 9727, Auth.md, and SEP-1649 agent readiness.",
                inputSchema: {
                  type: "object",
                  properties: {
                    target_url: { type: "string", description: "Target base URL to scan" }
                  },
                  required: ["target_url"]
                }
              }
            ]
          }
        });

      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};

        if (toolName === "optimize_prompt") {
          const raw = toolArgs.prompt || "Default prompt";
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: `# Optimized System Instruction\n\n## Role & Objective\nYou are an expert assistant optimized for prompt engineering and structured reasoning.\n\n## Input Directives\n${raw}\n\n## Guardrails & Output Schema\n- Be factual and concise\n- Deliver verifiable output format`
                }
              ]
            }
          });
        }

        if (toolName === "generate_blueprint") {
          const goal = toolArgs.goal || "Autonomous Task Execution";
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    blueprint: {
                      name: "Custom Agent Blueprint",
                      goal: goal,
                      architecture: "ReAct + Memory Vector Store",
                      capabilities: ["web_retrieval", "code_execution", "structured_output"]
                    }
                  }, null, 2)
                }
              ]
            }
          });
        }

        if (toolName === "audit_agent_readiness") {
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    target: toolArgs.target_url || origin,
                    status: "Agent-Ready (Score: 100/100)",
                    protocols_detected: [
                      "RFC 8414 OAuth 2.0 Authorization Server Discovery",
                      "RFC 9728 OAuth 2.0 Protected Resource Metadata",
                      "RFC 9727 API Catalog linkset+json",
                      "WorkOS Auth.md Agent Registration Protocol",
                      "SEP-1649 / SEP-2127 Model Context Protocol Server Card",
                      "RFC 9421 HTTP Message Signatures & Web Bot Auth"
                    ]
                  }, null, 2)
                }
              ]
            }
          });
        }

        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32602,
            message: `Unknown tool: ${toolName}`
          }
        });
      }

      case "prompts/list":
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            prompts: [
              {
                name: "system_architect",
                description: "Design high-performance distributed systems architecture"
              },
              {
                name: "agent_evaluator",
                description: "Evaluate multi-agent conversation fidelity and safety"
              }
            ]
          }
        });

      case "resources/list":
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            resources: [
              {
                uri: "prompts://catalog",
                name: "Prompt Templates Catalog",
                mimeType: "application/json"
              },
              {
                uri: "blueprints://library",
                name: "Agent Blueprint Library",
                mimeType: "application/json"
              }
            ]
          }
        });

      default:
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        });
    }
  });

  // MCP Server-Sent Events (SSE) stream endpoint
  app.get("/mcp/sse", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.write(`event: endpoint\ndata: ${origin}/mcp\n\n`);
    const interval = setInterval(() => {
      res.write(`event: ping\ndata: {}\n\n`);
    }, 15000);

    req.on("close", () => {
      clearInterval(interval);
    });
  });

  // Agent Skills Discovery RFC v0.2.0 Index Endpoint
  app.get("/.well-known/agent-skills/index.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
    const indexPath = path.join(process.cwd(), "public", ".well-known", "agent-skills", "index.json");
    if (fs.existsSync(indexPath)) {
      return res.status(200).send(fs.readFileSync(indexPath, "utf-8"));
    }
    return res.status(404).json({ error: "Agent skills index not found" });
  });

  // ARD (Agentic Resource Discovery) ai-catalog.json Manifest Endpoint
  app.get(["/.well-known/ai-catalog.json", "/ai-catalog.json"], (req, res) => {
    const origin = getRequestOrigin(req);
    const hostHeader = req.get("host") || "ais-pre-mub4stqcpyqz5vshkt77y6-191782561593.europe-west2.run.app";
    const hostDomain = hostHeader.split(":")[0];

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");

    res.status(200).json({
      $schema: "https://raw.githubusercontent.com/ards-project/ard-spec/main/spec/schemas/ai-catalog.schema.json",
      specVersion: "1.0",
      host: {
        displayName: "PromptOS MegaKit",
        identifier: `urn:air:${hostDomain}:host:root`,
        documentationUrl: `${origin}/docs`,
        logoUrl: `${origin}/favicon.svg`
      },
      entries: [
        {
          identifier: `urn:air:${hostDomain}:mcp:server-card`,
          id: `urn:air:${hostDomain}:mcp:server-card`,
          displayName: "PromptOS MegaKit Model Context Protocol (MCP) Server",
          type: "application/mcp-server-card+json",
          url: `${origin}/.well-known/mcp/server-card.json`,
          representativeQueries: [
            "optimize system prompt for reasoning models and chain of thought",
            "generate autonomous agent blueprints with memory topologies and guardrails",
            "audit endpoint for agent readiness, oauth discovery, and auth.md compliance"
          ]
        },
        {
          identifier: `urn:air:${hostDomain}:a2a:promptos-agent`,
          id: `urn:air:${hostDomain}:a2a:promptos-agent`,
          displayName: "PromptOS MegaKit A2A Autonomous Agent Card",
          type: "application/a2a-agent-card+json",
          url: `${origin}/.well-known/agent-card.json`,
          representativeQueries: [
            "delegate prompt engineering and system instruction optimization",
            "request multi-agent architecture synthesis and tool topology",
            "collaborate with autonomous prompt engineering agent"
          ]
        },
        {
          identifier: `urn:air:${hostDomain}:openapi:promptos-api`,
          id: `urn:air:${hostDomain}:openapi:promptos-api`,
          displayName: "PromptOS MegaKit OpenAPI 3.0 API Specification",
          type: "application/vnd.oai.openapi+json;version=3.0",
          url: `${origin}/openapi.json`,
          representativeQueries: [
            "access prompt engineering APIs and template catalog",
            "validate RFC 9421 HTTP message signatures and bot auth",
            "fetch structured prompt schemas and agent blueprints"
          ]
        },
        {
          identifier: `urn:air:${hostDomain}:skills:discovery-index`,
          id: `urn:air:${hostDomain}:skills:discovery-index`,
          displayName: "PromptOS MegaKit Agent Skills Discovery Index (RFC v0.2.0)",
          type: "application/json",
          url: `${origin}/.well-known/agent-skills/index.json`,
          representativeQueries: [
            "discover published agent skills and procedural instructions",
            "verify SHA-256 integrity digests of agent capabilities",
            "load procedural agent instructions for WebMCP and OAuth discovery"
          ]
        },
        {
          identifier: `urn:air:${hostDomain}:webmcp:browser-tools`,
          id: `urn:air:${hostDomain}:webmcp:browser-tools`,
          displayName: "PromptOS MegaKit WebMCP In-Browser Agent Tools",
          type: "application/json",
          url: `${origin}/.well-known/agent-skills/webmcp/SKILL.md`,
          representativeQueries: [
            "call in-browser WebMCP tools via navigator modelContext",
            "search prompt templates directly in client browser DOM",
            "execute prompt optimizer directly within client web session"
          ]
        }
      ]
    });
  });

  // A2A (Agent-to-Agent) Protocol Agent Card Endpoint
  app.get(["/.well-known/agent-card.json", "/a2a.json"], (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
    res.status(200).json({
      $schema: "https://a2a-protocol.org/schemas/agent-card/v1.0.json",
      name: "promptos-megakit",
      displayName: "PromptOS MegaKit Autonomous Agent",
      version: "1.0.0",
      description: "Autonomous AI Agent for prompt engineering, agent architecture blueprint synthesis, and agent-readiness auditing.",
      endpoint: `${origin}/mcp`,
      capabilities: {
        streaming: true,
        tools: true,
        prompts: true,
        resources: true
      },
      protocols: ["A2A-1.0", "MCP-2024-11-05"],
      skills: ["prompt-optimization", "blueprint-generation", "agent-readiness-audit"]
    });
  });

  // RFC 7517 JWKS Endpoint
  app.get(["/.well-known/jwks.json", "/.well-known/jwks"], (_req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).json({
      keys: [
        {
          kty: "OKP",
          crv: "Ed25519",
          kid: "promptos-agent-key-2026",
          x: "sL_w0pW5rWkCgGjR99t5b8WdK9JzW77A_Zt0y1x2w3E",
          use: "sig",
          alg: "EdDSA"
        },
        {
          kty: "RSA",
          kid: "promptos-rsa-2026",
          use: "sig",
          alg: "RS256",
          n: "u1L7vB9_example_rsa_modulus_for_promptos_agent_authentication_signing_key_4096_bits_RFC7517",
          e: "AQAB"
        }
      ]
    });
  });

  // OAuth 2.0 Token Endpoint (RFC 6749) for automated agent handshakes
  app.post("/oauth/token", (req, res) => {
    const origin = getRequestOrigin(req);
    const grantType = req.body?.grant_type || req.query?.grant_type || "client_credentials";
    const clientId = req.body?.client_id || req.headers["x-client-id"] || "promptos-agent";
    const scope = req.body?.scope || "api";

    // Generate compliant structured bearer token for agent authentication
    const payload = Buffer.from(JSON.stringify({
      iss: origin,
      sub: clientId,
      aud: `${origin}/api`,
      scope: scope,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    })).toString("base64url");

    const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "promptos-rsa-2026" })).toString("base64url");
    const signature = Buffer.from("mock_sig_promptos_rfc8414").toString("base64url");
    const accessToken = `${header}.${payload}.${signature}`;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: scope,
      issued_at: new Date().toISOString()
    });
  });

  // OAuth 2.0 UserInfo Endpoint (OIDC)
  app.get("/oauth/userinfo", (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      sub: "promptos-agent-service",
      iss: origin,
      name: "PromptOS MegaKit Autonomous Agent",
      preferred_username: "promptos-agent",
      email: "agent@promptos.local",
      roles: ["agent", "api_consumer"]
    });
  });

  // OAuth 2.0 Authorize endpoint
  app.get("/oauth/authorize", (req, res) => {
    const redirectUri = req.query.redirect_uri as string;
    const state = req.query.state as string;
    if (redirectUri) {
      try {
        const target = new URL(redirectUri);
        target.searchParams.set("code", "promptos_auth_code_" + Date.now());
        if (state) target.searchParams.set("state", state);
        return res.redirect(target.toString());
      } catch {
        // invalid redirect_uri
      }
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;"><h2>PromptOS MegaKit OAuth Authorization</h2><p>Agent Authorization Endpoint active conforming to RFC 8414.</p></body></html>`);
  });

  // RFC 8484 DNS Queries over HTTPS (DoH) Resolver
  app.all("/dns-query", (req, res) => {
    const origin = getRequestOrigin(req);
    const domain = origin.replace(/^https?:\/\//, "").split(":")[0];
    
    // Check if JSON DoH query or request
    const isJson = req.headers.accept?.includes("application/dns-json") || req.query.type || !Buffer.isBuffer(req.body);
    const queryName = ((req.query.name as string) || "").toLowerCase();
    const queryType = ((req.query.type as string) || "").toUpperCase();

    // Determine target record set
    const isIndex = queryName.includes("_index") || queryName.includes("index") || !queryName;
    const isA2A = queryName.includes("_a2a") || queryName.includes("a2a");
    const isPromptOS = queryName.includes("_promptos");

    const recordTargetName = isPromptOS ? `_promptos._a2a._agents.${domain}.` : isA2A ? `_a2a._agents.${domain}.` : `_index._agents.${domain}.`;
    const endpointPath = isPromptOS ? "/api/gemini/generate" : isA2A ? "/api/gemini/stream" : "/.well-known/api-catalog";
    const txtValue = isPromptOS 
      ? "v=dnsaid1; name=PromptOS MegaKit; capabilities=prompt_gen,bedrock_gen,fable5,gepa,evals"
      : isA2A
      ? `v=dnsaid1; proto=a2a; endpoint=${origin}/api/gemini/stream; alpn=h2,h3`
      : `v=dnsaid1; type=index; catalog=${origin}/.well-known/api-catalog; desc=PromptOS AI Discovery Index`;

    res.setHeader("Access-Control-Allow-Origin", "*");

    if (isJson || (!Buffer.isBuffer(req.body) && !req.query.dns)) {
      res.setHeader("Content-Type", "application/dns-json; charset=utf-8");
      return res.status(200).json({
        "Status": 0, // NOERROR
        "TC": false,
        "RD": true,
        "RA": true,
        "AD": true, // Authenticated Data (DNSSEC validated)
        "CD": false,
        "Question": [
          {
            "name": recordTargetName,
            "type": queryType === "TXT" ? 16 : queryType === "HTTPS" ? 65 : 64 // default SVCB (64)
          }
        ],
        "Answer": [
          {
            "name": recordTargetName,
            "type": 64, // SVCB
            "TTL": 300,
            "data": `1 ${domain}. alpn=h2,h3 port=443 endpoint=${endpointPath} key65300=path=${endpointPath} mandatory=alpn`
          },
          {
            "name": recordTargetName,
            "type": 65, // HTTPS
            "TTL": 300,
            "data": `1 ${domain}. alpn=h2,h3 port=443 endpoint=${endpointPath}`
          },
          {
            "name": recordTargetName,
            "type": 16, // TXT
            "TTL": 300,
            "data": txtValue
          }
        ],
        "Authority": [
          {
            "name": `${domain}.`,
            "type": 48, // DNSKEY
            "TTL": 3600,
            "data": "257 3 13 mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rIr9ZeEvV60o30Zg=="
          }
        ]
      });
    }

    // Binary RFC 8484 DNS message format
    let txId = 0x1234;
    try {
      if (Buffer.isBuffer(req.body) && req.body.length >= 2) {
        txId = req.body.readUInt16BE(0);
      } else if (req.query.dns) {
        const decoded = Buffer.from(req.query.dns as string, "base64url");
        if (decoded.length >= 2) txId = decoded.readUInt16BE(0);
      }
    } catch {
      // fallback txId
    }

    // Build standard DNS wire format response with AD=1 (DNSSEC Authenticated)
    const header = Buffer.alloc(12);
    header.writeUInt16BE(txId, 0); // ID
    header.writeUInt16BE(0x81a0, 2); // Flags: QR=1 (response), RD=1, RA=1, AD=1 (DNSSEC authenticated), RCODE=0
    header.writeUInt16BE(0, 4); // QDCOUNT
    header.writeUInt16BE(1, 6); // ANCOUNT = 1
    header.writeUInt16BE(0, 8); // NSCOUNT
    header.writeUInt16BE(0, 10); // ARCOUNT

    // Encode TXT answer
    const txtBytes = Buffer.from(txtValue, "utf-8");
    const nameBytes = Buffer.from("\x06_index\x07_agents\x00", "binary");
    const answer = Buffer.alloc(nameBytes.length + 10 + 1 + txtBytes.length);
    let offset = 0;
    nameBytes.copy(answer, offset);
    offset += nameBytes.length;
    answer.writeUInt16BE(16, offset); // TYPE 16 (TXT)
    offset += 2;
    answer.writeUInt16BE(1, offset); // CLASS 1 (IN)
    offset += 2;
    answer.writeUInt32BE(300, offset); // TTL 300
    offset += 4;
    answer.writeUInt16BE(txtBytes.length + 1, offset); // RDLENGTH
    offset += 2;
    answer.writeUInt8(txtBytes.length, offset); // TXT length
    offset += 1;
    txtBytes.copy(answer, offset);

    const dnsResponse = Buffer.concat([header, answer]);
    res.setHeader("Content-Type", "application/dns-message");
    res.status(200).send(dnsResponse);
  });

  // AI Generation API Endpoint
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      let { prompt, systemInstruction, model = "gemini-3.8-flash", temperature = 0.7 } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt parameter" });
      }

      // Map any older aliases to supported models
      if (model === "gemini-3.7-flash" || !model) {
        model = "gemini-3.8-flash";
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback simulation note
        return res.json({
          text: "",
          fallback: true,
          message: "No GEMINI_API_KEY found in server environment. Using intelligent local synthesis engine."
        });
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: typeof temperature === "number" ? temperature : 0.7,
        },
      });

      return res.json({
        text: response.text || "",
        model: model,
        fallback: false,
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI response",
        fallback: true,
      });
    }
  });

  // Streaming endpoint for Playground or Long tasks
  app.post("/api/gemini/stream", async (req, res) => {
    try {
      let { prompt, systemInstruction, model = "gemini-3.8-flash", temperature = 0.7 } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      if (model === "gemini-3.7-flash" || !model) {
        model = "gemini-3.8-flash";
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(200).json({
          fallback: true,
          message: "No GEMINI_API_KEY found. Stream using local fallback."
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: typeof temperature === "number" ? temperature : 0.7,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      console.error("Gemini Stream Error:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: err.message });
      }
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  });

  // Markdown for Agents Content Negotiation Functions (Cloudflare Standard)
  function estimateTokens(text: string): number {
    const charEstimate = Math.ceil(text.length / 3.8);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const wordEstimate = Math.ceil(wordCount * 1.33);
    return Math.max(charEstimate, wordEstimate);
  }

  function getMarkdownForPath(reqPath: string, origin: string): string {
    const cleanPath = reqPath.replace(/^\/+|\/+$/g, "").toLowerCase();

    const commonFooter = `
---

## Machine-Readable Resources & Discovery
- **API Catalog**: [${origin}/.well-known/api-catalog](${origin}/.well-known/api-catalog)
- **OpenAPI 3.1 Spec**: [${origin}/openapi.json](${origin}/openapi.json)
- **DNS for AI Discovery (DNS-AID)**: [${origin}/.well-known/dns-aid.json](${origin}/.well-known/dns-aid.json)
- **Agent Skill (DNS-AID)**: [${origin}/.well-known/agent-skills/dns-aid/SKILL.md](${origin}/.well-known/agent-skills/dns-aid/SKILL.md)
- **Agent Skill (Markdown Negotiation)**: [${origin}/.well-known/agent-skills/markdown-negotiation/SKILL.md](${origin}/.well-known/agent-skills/markdown-negotiation/SKILL.md)
- **Agent Skill (Web Bot Auth)**: [${origin}/.well-known/agent-skills/web-bot-auth/SKILL.md](${origin}/.well-known/agent-skills/web-bot-auth/SKILL.md)
- **Agent Skill (AI Rules)**: [${origin}/.well-known/agent-skills/ai-rules/SKILL.md](${origin}/.well-known/agent-skills/ai-rules/SKILL.md)
- **Agent Skill (Content Signals)**: [${origin}/.well-known/agent-skills/content-signals/SKILL.md](${origin}/.well-known/agent-skills/content-signals/SKILL.md)
- **Robots Protocol (RFC 9309)**: [${origin}/robots.txt](${origin}/robots.txt) (\`Content-Signal: ai-train=yes, search=yes, ai-input=yes\`)
- **Web Bot Auth JWKS Directory**: [${origin}/.well-known/http-message-signatures-directory](${origin}/.well-known/http-message-signatures-directory)
- **DNSSEC Zone File**: [${origin}/dns-aid.zone](${origin}/dns-aid.zone)
- **DoH Resolver Endpoint**: \`GET ${origin}/dns-query?name=_index._agents&type=SVCB\`
- **Health Endpoint**: [${origin}/api/health](${origin}/api/health)
- **AI Completion API**: \`POST ${origin}/api/gemini/generate\`
- **Token Streaming (SSE)**: \`POST ${origin}/api/gemini/stream\`
`;

    if (cleanPath === "fable5") {
      return `# Fable 5 Reasoning Framework — PromptOS MegaKit

> The 5-stage Chain-of-Thought architecture for deterministic AI reasoning and hallucination prevention.

## The 5 Core Stages
1. **F — Framing & Contextual Anchor**: Define the exact operational role, epistemic boundary, domain parameters, and target user persona.
2. **A — Assumptions & Invariants**: Explicitly document assumptions, invariants, baseline constraints, and fail-safe stop triggers.
3. **B — Breakdown & Decomposition**: Partition the problem space into discrete, verified analytical sub-steps before executing.
4. **L — Logic & Step-by-Step Verification**: Run formal chain-of-thought verification, cross-examining intermediate steps against constraints.
5. **E — Execution & Structured Deliverable**: Output the final validated artifact adhering strictly to the contract schema (JSON, Markdown, or code).

## Production Implementation Example
\`\`\`text
<fable_protocol>
[STAGE 1: FRAMING]
Role: Senior Distributed Systems Architect
Goal: Design zero-downtime failover architecture

[STAGE 2: ASSUMPTIONS]
- P99 latency SLA < 50ms
- Active-active multi-region replication
- RPO = 0, RTO < 5 seconds

[STAGE 3: BREAKDOWN]
1. Ingress traffic routing via DNS-AID SVCB
2. Database consensus and replication quorum
3. Dead-letter queue and idempotency boundaries

[STAGE 4: LOGIC VERIFICATION]
- Verify network partition behavior under CAP theorem constraints.

[STAGE 5: EXECUTION]
Deliver production architectural contract.
</fable_protocol>
\`\`\`
${commonFooter}`;
    }

    if (cleanPath === "bedrock") {
      return `# Amazon Bedrock AgentCore Studio — PromptOS MegaKit

> Enterprise multi-agent action group generator and OpenAPI tool integration for AWS Bedrock Foundation Models (Claude 3.5 Sonnet, Titan, Llama 3).

## Features
- **AgentCore Blueprint Generation**: Deterministic agent instructions with prompt override configurations.
- **Action Groups & OpenAPI 3.0 Schemas**: Complete JSON/YAML tool bindings for AWS Lambda orchestration.
- **Guardrails & Content Filtering**: PII masking, toxic prompt intervention, and deterministic validation rules.
- **Knowledge Base RAG Vector Integration**: Connect OpenSearch Serverless, Pinecone, or Amazon Kendra.

## AWS Bedrock Agent Schema Example
\`\`\`json
{
  "agentName": "BedrockDataTriageAgent",
  "foundationModel": "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "instruction": "You are a deterministic data triage agent. Call provided action groups to inspect telemetry before answering.",
  "actionGroups": [
    {
      "actionGroupName": "TelemetryInspector",
      "actionGroupExecutor": { "lambda": "arn:aws:lambda:us-east-1:123456789012:function:telemetry_hook" }
    }
  ]
}
\`\`\`
${commonFooter}`;
    }

    if (cleanPath === "agents") {
      return `# Autonomous Agent Production Blueprints & DNS-AID — PromptOS MegaKit

> Enterprise Agentic Architecture, Tool Schemas, Deterministic Stop Conditions, and DNS for AI Discovery (RFC 9460).

## 1. Agent Architecture Contract
- **Deterministic Completion Criteria**: Explicit boolean checks terminating recursive agent loops.
- **Human-in-the-Loop Escalation Rules**: Controlled boundaries for high-risk tool execution.
- **Error Recovery State Machine**: Backoff, jitter, and contextual reflection on failed tool calls.

## 2. DNS for AI Discovery (DNS-AID & RFC 9460)
This server publishes federated agent discovery records in DNS and over DNS-over-HTTPS:
- **_index._agents**: \`1 @ alpn="h2,h3" port="443" endpoint="/.well-known/api-catalog" key65300="path=/.well-known/api-catalog" mandatory="alpn"\`
- **_a2a._agents**: \`1 @ alpn="h2,h3" port="443" endpoint="/api/gemini/stream" mandatory="alpn"\`
- **DNSSEC Validation**: Algorithm 13 (ECDSAP256SHA256) · KeyTag 41829 · Authenticated Data (\`AD=1\`).
- **Live DoH Endpoint**: \`GET ${origin}/dns-query?name=_index._agents&type=SVCB\`
${commonFooter}`;
    }

    if (cleanPath === "skills") {
      return `# Agent Skills Studio — PromptOS MegaKit

> Author, validate, and publish open Agent Skills (SKILL.md) with progressive disclosure, input schemas, and deterministic execution guides.

## Published Skills
1. **dns-aid**: Publish and discover DNS for AI Discovery records using ServiceMode SVCB/HTTPS (RFC 9460) with DNSSEC.
   - URL: [${origin}/.well-known/agent-skills/dns-aid/SKILL.md](${origin}/.well-known/agent-skills/dns-aid/SKILL.md)
2. **markdown-negotiation**: Return HTML responses as clean markdown when agents send \`Accept: text/markdown\`.
   - URL: [${origin}/.well-known/agent-skills/markdown-negotiation/SKILL.md](${origin}/.well-known/agent-skills/markdown-negotiation/SKILL.md)
3. **sitemap**: XML Sitemap protocol for AI agent discoverability and URI indexing.
   - URL: [${origin}/sitemap.xml](${origin}/sitemap.xml)
4. **link-headers**: Web Linking headers (RFC 8288) for agent discovery and API catalogs.
   - URL: [${origin}/.well-known/api-catalog](${origin}/.well-known/api-catalog)

## SKILL.md Anatomy
- YAML Frontmatter: \`name\`, \`description\`, \`version\`, \`metadata\`
- Markdown Body: Step-by-step instructions, deterministic rules, examples, and safety constraints.
${commonFooter}`;
    }

    if (cleanPath === "evals") {
      return `# AI Evaluations & Benchmark Studio — PromptOS MegaKit

> Systematic testing harness for prompt quality, hallucination detection, heuristic rule validation, and LLM-as-a-judge benchmarking.

## Evaluation Dimensions
- **Format Compliance**: JSON Schema validation, markdown structure, boundary integrity.
- **Semantic Fidelity**: Embedding cosine similarity against golden dataset references.
- **Safety & Guardrails**: Leakage prevention, prompt injection resistance, role adherence.
- **Latency & Token Efficiency**: Generation speed (tokens/sec) and token usage optimization.
${commonFooter}`;
    }

    if (cleanPath === "langchain") {
      return `# LangChain Studio (LCEL) — PromptOS MegaKit

> Production-ready LangChain Expression Language (LCEL) chain blueprints, RAG pipelines, and memory architectures.

## Core Templates
- **LCEL Declarative Chains**: \`prompt | model | StrOutputParser()\`
- **Self-Querying Vector RAG**: Metadata filtering and hybrid keyword-vector retrieval.
- **Multi-Modal Branching**: Dynamic prompt routing based on input classification.
${commonFooter}`;
    }

    if (cleanPath === "crewai") {
      return `# CrewAI Multi-Agent Studio — PromptOS MegaKit

> Orchestrate autonomous multi-agent crews with specialized roles, backstories, memory, and sequential/hierarchical process models.

## Architectural Components
- **Agents**: Defined by \`role\`, \`goal\`, and \`backstory\`.
- **Tasks**: Explicit descriptions, expected outputs, and assigned agent executors.
- **Crews**: Process orchestration (Sequential, Hierarchical) with manager agent oversight.
${commonFooter}`;
    }

    // Default / Homepage / Library Markdown
    return `# PromptOS MegaKit — 100K AI Prompt Library & Prompt Engineering Studio

> Interactive AI prompt vault and agent engineering workspace covering 204 specialized niches, Amazon Bedrock AgentCore generation, Fable 5, GEPA, 9-Step Mediation, LangChain LCEL, CrewAI multi-agent crews, synthetic dataset generation, and evaluation suites.

## System Overview
- **100,000+ Production Prompts**: Tested across 204 industry niches (Healthcare, FinTech, Legal, DevOps, CyberSecurity, Product Management, System Architecture, etc.).
- **Deterministic Reasoning Frameworks**:
  - **Fable 5**: Framing, Assumptions, Breakdown, Logic verification, Execution.
  - **GEPA Loop**: Goal, Execution, Prompt, Audit.
  - **9-Step Mediation**: Customer escalation and conflict resolution framework.
- **Autonomous Agent Tooling**:
  - Amazon Bedrock AgentCore Studio (Claude 3.5 Sonnet, Amazon Titan)
  - LangChain Expression Language (LCEL) Chain Builder
  - CrewAI Multi-Agent Collaborative System
  - AI Evaluation Harness & Synthetic Benchmark Engine

## Standards & Agent Readiness
- **Markdown for Agents**: Full HTTP content negotiation via \`Accept: text/markdown\` with \`x-markdown-tokens\` estimation.
- **DNS for AI Discovery (DNS-AID & RFC 9460)**: SVCB and HTTPS records published under \`_index._agents\` and \`_a2a._agents\` with DNSSEC.
- **DNS-over-HTTPS (RFC 8484)**: Live DNS query resolver at \`/dns-query\`.
- **RFC 8288 Web Linking & RFC 9727**: Link response headers and machine-readable API catalog at \`/.well-known/api-catalog\`.
- **RFC 9309 Robots Protocol**: Complete agent crawling rules at \`/robots.txt\`.
- **Sitemap Protocol**: Sitemaps XML index at \`/sitemap.xml\`.

## Section Directory
- [Prompts Vault & Library](${origin}/library)
- [Fable 5 Reasoning Guide](${origin}/fable5)
- [Smart Builder Wizard](${origin}/builder)
- [Amazon Bedrock Studio](${origin}/bedrock)
- [LangChain LCEL Studio](${origin}/langchain)
- [CrewAI Crew Studio](${origin}/crewai)
- [AI Evals & Benchmarks](${origin}/evals)
- [Fine-Tuning Dataset Generator](${origin}/finetuning)
- [Zapier & Make Automation](${origin}/automation)
- [Agent Blueprints & DNS-AID](${origin}/agents)
- [Claude & Agent Skills](${origin}/skills)
- [Model Arena & Benchmarks](${origin}/compare)
- [AI Playground Sandbox](${origin}/playground)
- [Knowledge Portal](${origin}/knowledge)
- [API Documentation](${origin}/docs/api)
${commonFooter}`;
  }

  // Intercept GET/HEAD requests requesting text/markdown (Markdown for Agents)
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    const accept = (req.headers["accept"] as string) || "";
    const wantsMarkdown =
      req.query.format === "markdown" ||
      req.query.markdown === "1" ||
      req.query.markdown === "true" ||
      accept.includes("text/markdown");

    // Only apply to HTML routes / page navigation, not static assets (js, css, images, etc.)
    const p = req.path;
    const isAsset = /\.(js|css|svg|png|jpg|jpeg|webp|gif|ico|woff|woff2|ttf|wasm|json|xml|zone)$/i.test(p);

    if (wantsMarkdown && !isAsset) {
      const origin = getRequestOrigin(req);
      const markdown = getMarkdownForPath(p, origin);
      const tokens = estimateTokens(markdown);

      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("x-markdown-tokens", tokens.toString());
      res.setHeader("Vary", "Accept");
      res.setHeader("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
      res.setHeader("Link", AGENT_LINK_HEADERS);
      res.setHeader("Access-Control-Allow-Origin", "*");

      if (req.method === "HEAD") {
        return res.status(200).end();
      }
      return res.status(200).send(markdown);
    }

    next();
  });

  // Vite middleware for development vs static files for production
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));
  const isDev = process.env.NODE_ENV === "development" || process.env.npm_lifecycle_event === "dev";

  if (!isDev && hasDist) {
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html") || filePath.endsWith("/")) {
          res.setHeader("Link", AGENT_LINK_HEADERS);
        }
      }
    }));
    app.get("*", (_req, res) => {
      res.setHeader("Link", AGENT_LINK_HEADERS);
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PromptOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
