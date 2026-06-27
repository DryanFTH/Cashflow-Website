FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# =====================================================

FROM deps AS dev

ENV NODE_ENV=development

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma generate && pnpm prisma db push --accept-data-loss && pnpm dev"]

# ======================================================

FROM deps AS builder

ENV NODE_ENV=production

COPY . .

RUN pnpm prisma generate

RUN pnpm build

#=======================================================

FROM builder AS production

ENV NODE_ENV=production
ENV CI=true
ENV DATABASE_URL="file:/app/data/production.db"

# disable switching user because its only use for exam test
# RUN chown -R node:node /app

# USER node

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma db push && pnpm start"]