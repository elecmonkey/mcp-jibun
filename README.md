# MCP Jibun Server

English | [简体中文](README.zh-CN.md)

This is a Model Context Protocol (MCP) server that allows AI Agents to read posts from [Jibun](https://github.com/elecmonkey/jibun) instances, and it is also compatible with [Ech0](https://github.com/lin-snow/Ech0) instances.

## Features

Provides the following tools for AI Agents:

*   `get_jibun_posts`: Get the latest posts from a Jibun (or Ech0) instance. Supports specifying the `source`, `count`, and `page`.
*   `list_jibun_sources`: List all configured Jibun (or Ech0) instance sources.

## Configuration

Configure environment variables in `wrangler.jsonc` or the Cloudflare Dashboard:

*   `JIBUN_INSTANCES`: A JSON string containing a list of Jibun instances.

Example:
```json
[
  {"name": "E.m. じぶん", "url": "https://jibun.elecmonkey.com"},
  {"name": "River's Lighthouse", "url": "https://river177.com"}
]
```

## Development and Deployment

Local development:
```bash
pnpm dev
```

Deploy to Cloudflare Workers:
```bash
pnpm run deploy
```

## Client Configuration

MCP Server URL: `https://<your-worker-subdomain>.workers.dev` (Supports `/` or `/mcp` paths)
