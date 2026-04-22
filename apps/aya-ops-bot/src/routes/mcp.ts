import type { FastifyPluginAsync } from "fastify";

import { handleAyaMcpRequest } from "../mcp/server.js";
import { handleHostingerMcpRequest } from "../mcp/hostinger.js";

export const mcpRoutes: FastifyPluginAsync = async (app) => {
  const handler = async (request: any, reply: any) => {
    const parsedBody =
      request.method === "POST" || request.method === "DELETE"
        ? request.body
        : undefined;
    reply.hijack();
    await handleAyaMcpRequest(request.raw, reply.raw, parsedBody);
  };

  const hostingerHandler = async (request: any, reply: any) => {
    const parsedBody =
      request.method === "POST" || request.method === "DELETE"
        ? request.body
        : undefined;
    reply.hijack();
    await handleHostingerMcpRequest(request.raw, reply.raw, parsedBody);
  };

  app.get("/mcp", handler);
  app.post("/mcp", handler);
  app.delete("/mcp", handler);

  app.get("/mcp/hostinger", hostingerHandler);
  app.post("/mcp/hostinger", hostingerHandler);
  app.delete("/mcp/hostinger", hostingerHandler);
};
