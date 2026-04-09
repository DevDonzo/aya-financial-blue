import type { FastifyPluginAsync } from "fastify";

import {
  handleInboundMessage,
  type InboundMessagePayload,
  planInboundMessage,
} from "../messages/handle-message.js";
import { messageBodySchema } from "../types/api.js";
import { parseWithSchema } from "../app/plugins/zod.js";
import { AuthError } from "../app/errors.js";
import { normalizeBlueRequestAuth } from "../modules/blue/request-auth.js";

export const messageRoutes: FastifyPluginAsync = async (app) => {
  app.post("/intent-test", async (request) => {
    const payload = applyHeadersToPayload(
      parseWithSchema(messageBodySchema, request.body),
      request.headers,
      null,
      "/intent-test",
    );
    return await handleInboundMessage(payload);
  });

  app.post(
    "/messages/plan",
    { preHandler: [app.authenticateOptionalSession] },
    async (request) => {
      const payload = applyHeadersToPayload(
        parseWithSchema(messageBodySchema, request.body),
        request.headers,
        request.employee,
        "/messages/plan",
      );
      return await planInboundMessage(payload);
    },
  );

  app.post(
    "/messages",
    { preHandler: [app.authenticateOptionalSession] },
    async (request) => {
      const payload = applyHeadersToPayload(
        parseWithSchema(messageBodySchema, request.body),
        request.headers,
        request.employee,
        "/messages",
      );
      if (
        !request.employee &&
        !payload.actorEmployeeId &&
        !payload.actorEmployeeEmail &&
        !payload.actorEmployeeName &&
        !payload.senderId
      ) {
        throw new AuthError();
      }
      return await handleInboundMessage(payload);
    },
  );
};

function applyHeadersToPayload(
  payload: InboundMessagePayload,
  headers: Record<string, string | string[] | undefined>,
  actor: { employeeId: string; displayName: string } | null,
  path: string,
) {
  const blueAuth = normalizeBlueRequestAuth({
    tokenId:
      payload.actorBlueTokenId ??
      readHeader(headers, "x-aya-blue-token-id") ??
      readHeader(headers, "x-blue-token-id"),
    tokenSecret:
      payload.actorBlueTokenSecret ??
      readHeader(headers, "x-aya-blue-token-secret") ??
      readHeader(headers, "x-blue-token-secret"),
  });

  return {
    ...payload,
    transport: payload.transport ?? (path === "/messages" ? "web" : "http"),
    actorEmployeeId:
      payload.actorEmployeeId ??
      actor?.employeeId ??
      readHeader(headers, "x-employee-id"),
    actorEmployeeEmail:
      payload.actorEmployeeEmail ?? readHeader(headers, "x-employee-email"),
    actorEmployeeName:
      payload.actorEmployeeName ??
      actor?.displayName ??
      readHeader(headers, "x-employee-name"),
    actorBlueTokenId: blueAuth?.tokenId,
    actorBlueTokenSecret: blueAuth?.tokenSecret,
    senderId: payload.senderId ?? readHeader(headers, "x-sender-id"),
    senderLabel: payload.senderLabel ?? readHeader(headers, "x-sender-label"),
  } satisfies InboundMessagePayload;
}

function readHeader(
  headers: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = headers[name];
  return Array.isArray(value) ? value[0] : value;
}
