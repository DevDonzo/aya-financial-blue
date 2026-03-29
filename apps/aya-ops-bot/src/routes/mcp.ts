import type { FastifyPluginAsync } from "fastify";

import { handleAyaMcpRequest } from "../mcp/server.js";

export const mcpRoutes: FastifyPluginAsync = async (app) => {
  const handler = async (request: Parameters<typeof app.route>[0]["handler"] extends never ? never : any, reply: any) => {
    const parsedBody =
      request.method === "POST" || request.method === "DELETE"
        ? request.body
        : undefined;
    reply.hijack();
    await handleAyaMcpRequest(request.raw, reply.raw, parsedBody);
  };

  app.get("/mcp", handler);
  app.post("/mcp", handler);
  app.delete("/mcp", handler);
};
