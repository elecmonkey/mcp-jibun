# MCP Jibun Server

[English](README.md) | 简体中文

这是一个用于让 AI Agent 读取 [Jibun](https://github.com/elecmonkey/jibun) 实例的贴文的 Model Context Protocol (MCP) 服务器，同时兼容 [Ech0](https://github.com/lin-snow/Ech0) 实例。

## 功能

提供以下工具供 AI Agent 调用：
*   `get_jibun_posts`: 获取 Jibun (或 Ech0) 实例的最新贴文。支持指定源 (`source`)、数量 (`count`) 和页码 (`page`)。
*   `list_jibun_sources`: 列出所有已配置的 Jibun (或 Ech0) 实例源。

## 配置

在 `wrangler.jsonc` 或 Cloudflare Dashboard 中配置环境变量：

- `JIBUN_INSTANCES`: JSON 字符串，包含 Jibun 实例列表。

示例：
```json
[
  {"name": "E.m. じぶん", "url": "https://jibun.elecmonkey.com"},
  {"name": "River's Lighthouse", "url": "https://river177.com"}
]
```

## 开发与部署

本地开发：
```bash
pnpm dev
```

部署到 Cloudflare Workers：
```bash
pnpm run deploy
```

## 客户端配置

MCP Server URL: `https://<your-worker-subdomain>.workers.dev`
