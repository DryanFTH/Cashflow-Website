FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps ----------
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile

# ---------- dev ----------
FROM deps AS dev

ENV NODE_ENV=development

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm dev"]

# ---------- builder ----------
FROM deps AS builder

ENV NODE_ENV=production

COPY . .

RUN pnpm prisma generate
RUN pnpm build

# ---------- production ----------
FROM base AS production

ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/production.db"

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/next.config.ts ./

RUN mkdir -p /app/data

VOLUME /app/data

# disable switching user because its only use for exam test
# RUN chown -R node:node /app
# USER node

EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]