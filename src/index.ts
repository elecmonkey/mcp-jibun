import { Hono } from 'hono'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPTransport } from '@hono/mcp'
import { z } from 'zod'

type Bindings = {
  JIBUN_INSTANCES: string
}

type Instance = {
  name: string
  url: string
}

const app = new Hono<{ Bindings: Bindings }>()

const createMcpHandler = async (c: any) => {
  const mcpServer = new McpServer({
    name: 'mcp-jibun',
    version: '1.0.0',
  })

  mcpServer.registerTool(
    'get_jibun_posts',
    {
      description: 'Get recent posts from a Jibun instance',
      inputSchema: {
        source: z.string().optional().describe('Name of the Jibun instance to fetch from. If not provided, defaults to the first configured instance.'),
        count: z.number().optional().default(10).describe('Number of posts to retrieve'),
        page: z.number().optional().default(1).describe('Page number'),
      },
    },
    async ({ source, count, page }) => {
      let instances: Instance[] = []
      try {
        const envStr = c.env?.JIBUN_INSTANCES || (typeof process !== 'undefined' ? (process as any).env?.JIBUN_INSTANCES : undefined) || '[]'
        instances = JSON.parse(envStr)
      } catch (e: any) {
        const envStr = c.env?.JIBUN_INSTANCES || (typeof process !== 'undefined' ? (process as any).env?.JIBUN_INSTANCES : undefined)
        return {
          content: [{ type: 'text', text: `Error: Failed to parse JIBUN_INSTANCES configuration. Error: ${e.message}. Raw value: ${envStr}` }],
          isError: true,
        }
      }

      if (instances.length === 0) {
        return {
          content: [{ type: 'text', text: 'Error: No Jibun instances configured.' }],
          isError: true,
        }
      }

      let targetInstance: Instance | undefined
      if (source) {
        targetInstance = instances.find((i: Instance) => i.name === source)
        if (!targetInstance) {
           return {
            content: [{ type: 'text', text: `Error: Jibun instance '${source}' not found. Available instances: ${instances.map((i: Instance) => i.name).join(', ')}` }],
            isError: true,
          }
        }
      } else {
        targetInstance = instances[0]
      }
      
      const baseUrl = targetInstance.url

      try {
        const response = await fetch(`${baseUrl}/api/echo/page`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page,
            pageSize: count,
          }),
        })

        if (!response.ok) {
          return {
            content: [{ type: 'text', text: `Error: Jibun API (${targetInstance.name}) returned ${response.status} ${response.statusText}` }],
            isError: true,
          }
        }

        const result = await response.json() as any
        
        // Jibun response structure: { code: 1, msg: "...", data: { items: [...], total: ... } }
        if (result.code !== 1) {
             return {
                content: [{ type: 'text', text: `Error from Jibun (${targetInstance.name}): ${result.msg || 'Unknown error'}` }],
                isError: true
             }
        }

        const items = result.data?.items || []
        
        // Format the output
        const formatted = items.map((item: any) => {
            return `ID: ${item.id}
Source: ${targetInstance!.name}
Date: ${item.created_at}
Content: ${item.content}
User: ${item.username}
Images: ${item.images?.map((img: any) => img.image_url).join(', ') || 'None'}
---`
        }).join('\n')

        return {
          content: [{ type: 'text', text: formatted || 'No posts found.' }],
        }

      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error fetching posts from ${targetInstance.name}: ${error.message}` }],
          isError: true,
        }
      }
    }
  )

  mcpServer.registerTool(
    'list_jibun_sources',
    {
      description: 'List all configured Jibun instances',
      inputSchema: {},
    },
    async () => {
        let instances: Instance[] = []
        try {
          const envStr = c.env?.JIBUN_INSTANCES || (typeof process !== 'undefined' ? (process as any).env?.JIBUN_INSTANCES : undefined) || '[]'
          instances = JSON.parse(envStr)
        } catch (e: any) {
          const envStr = c.env?.JIBUN_INSTANCES || (typeof process !== 'undefined' ? (process as any).env?.JIBUN_INSTANCES : undefined)
          return {
            content: [{ type: 'text', text: `Error: Failed to parse JIBUN_INSTANCES configuration. Error: ${e.message}. Raw value: ${envStr}` }],
            isError: true,
          }
        }

        const formatted = instances.map((i: Instance) => `- ${i.name} (${i.url})`).join('\n')
        return {
            content: [{ type: 'text', text: `Available Jibun Instances:\n${formatted}` }]
        }
    }
  )

  const transport = new StreamableHTTPTransport()
  await mcpServer.connect(transport)
  return transport.handleRequest(c)
}

app.all('/mcp', createMcpHandler)
app.all('/', createMcpHandler)

export default app
