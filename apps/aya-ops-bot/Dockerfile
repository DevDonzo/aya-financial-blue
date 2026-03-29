FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY admin-ui/package.json admin-ui/package-lock.json ./admin-ui/

RUN npm ci
RUN npm --prefix admin-ui ci

FROM deps AS build
WORKDIR /app

COPY tsconfig.json ./
COPY src ./src
COPY admin-ui ./admin-ui
COPY README.md ROADMAP.md schema.sql ./

RUN npm run build

FROM deps AS prod-deps
WORKDIR /app

RUN npm prune --omit=dev

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3010
ENV LOG_LEVEL=info

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/admin-ui/dist ./admin-ui/dist
COPY package.json package-lock.json ./

RUN mkdir -p /app/data

EXPOSE 3010
VOLUME ["/app/data"]

CMD ["node", "dist/server.js"]

