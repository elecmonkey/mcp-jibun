# MCP Jibun Server

English | [简体中文](README.zh-CN.md)

This is a Model Context Protocol (MCP) server that allows AI Agents to read posts from [Jibun](https://github.com/elecmonkey/jibun) instances. It is also compatible with [Ech0](https://github.com/lin-snow/Ech0) instances.

## Features

Provides the following tools for AI Agents to call:

*   `get_jibun_posts`: Get the latest posts from a Jibun (or Ech0) instance. Supports specifying source (`source`), count (`count`), and page number (`page`).
*   `list_jibun_sources`: List all configured Jibun (or Ech0) instance sources.

## Development and Deployment

### 1. Local Development and Cloudflare Workers

We use `wrangler` for local development and Cloudflare deployment.

**Configuration**:
Configure environment variables in the `vars` field of the `wrangler.jsonc` file:

```jsonc
// wrangler.jsonc
{
  "vars": {
    "JIBUN_INSTANCES": "[{\"name\":\"...\",\"url\":\"...\"}]"
  }
}
```

**Common Commands**:

*   **Start local server**:
    ```bash
    pnpm dev
    ```
*   **Deploy to Cloudflare**:
    ```bash
    pnpm run deploy
    ```

### 2. Deploy to Vercel / Netlify

This project is based on the Hono framework and can automatically adapt to Vercel and Netlify runtime environments. It can be deployed with one click by connecting to a Git repository, but please note to configure the correct environment variable in the management panel: `JIBUN_INSTANCES`.

**Format**: A JSON string containing a list of Jibun instances.

**Example**:
```json
[
  {"name": "E.m. じぶん", "url": "https://jibun.elecmonkey.com"},
  {"name": "River's Lighthouse", "url": "https://river177.com"}
]
```

## Client Configuration

MCP Server URL:
*   Cloudflare: `https://<your-worker-subdomain>.workers.dev`
*   Vercel: `https://<your-project>.vercel.app`
*   Netlify: `https://<your-site>.netlify.app`

Supports `/` or `/mcp` paths.
