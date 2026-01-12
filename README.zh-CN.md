# MCP Jibun Server

[English](README.md) | 简体中文

这是一个用于让 AI Agent 读取 [Jibun](https://github.com/elecmonkey/jibun) 实例的贴文的 Model Context Protocol (MCP) 服务器，同时兼容 [Ech0](https://github.com/lin-snow/Ech0) 实例。

## 功能

提供以下工具供 AI Agent 调用：

*   `get_jibun_posts`: 获取 Jibun (或 Ech0) 实例的最新贴文。支持指定源 (`source`)、数量 (`count`) 和页码 (`page`)。
*   `list_jibun_sources`: 列出所有已配置的 Jibun (或 Ech0) 实例源。

## 开发与部署

### 1. 本地开发与 Cloudflare Workers

我们使用 `wrangler` 进行本地开发和 Cloudflare 部署。

**配置**:
在 `wrangler.jsonc` 文件的 `vars` 字段中配置环境变量：

```jsonc
// wrangler.jsonc
{
  "vars": {
    "JIBUN_INSTANCES": "[{\"name\":\"...\",\"url\":\"...\"}]"
  }
}
```

**常用命令**:

*   **启动本地服务器**:
    ```bash
    pnpm dev
    ```
*   **部署到 Cloudflare**:
    ```bash
    pnpm run deploy
    ```

### 2. 部署到 Vercel / Netlify

本项目基于 Hono 框架，能够自动适配 Vercel 和 Netlify 的运行环境。通过连接到 Git 仓库可以一键部署，不过请注意在管理面板中配置正确的环境变量：`JIBUN_INSTANCES`。

**格式**: 包含 Jibun 实例列表的 JSON 字符串。

**示例**:
```json
[
  {"name": "E.m. じぶん", "url": "https://jibun.elecmonkey.com"},
  {"name": "River's Lighthouse", "url": "https://river177.com"}
]
```

## 客户端配置

MCP Server URL:
*   Cloudflare: `https://<your-worker-subdomain>.workers.dev`
*   Vercel: `https://<your-project>.vercel.app`
*   Netlify: `https://<your-site>.netlify.app`

支持 `/` 或 `/mcp` 路径。
