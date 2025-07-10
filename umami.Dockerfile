# Install dependencies only when needed
FROM node:16-slim AS deps

# Install libc6 (GNU libc) - usually preinstalled but just in case
RUN apt-get update && apt-get install -y libc6 && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./extra-certificate.crt* .

ENV NODE_EXTRA_CA_CERTS=extra-certificate.crt

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-slim AS builder
WORKDIR /app

# Install OpenSSL 1.1 and openssl CLI needed for Prisma
RUN apt-get update && apt-get install -y openssl libssl1.1 libssl-dev && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ARG DATABASE_TYPE
ARG BASE_PATH
ARG DISABLE_LOGIN
ARG EXTRA_CERT_PATH

ENV BASE_PATH=$BASE_PATH
ENV DISABLE_LOGIN=$DISABLE_LOGIN
ENV NEXT_TELEMETRY_DISABLED=1

COPY ./extra-certificate.crt* .

ENV NODE_EXTRA_CA_CERTS=extra-certificate.crt

ENV PRISMA_CLI_QUERY_ENGINE_TYPE="library"
ENV PRISMA_BINARY_TARGETS="native,linux-musl,linux-arm64-openssl-1.1.x"

# Optional: Verify OpenSSL version
RUN openssl version

RUN npx prisma generate --schema=db/postgresql/schema.prisma

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY ./extra-certificate.crt* .

ENV NODE_EXTRA_CA_CERTS=extra-certificate.crt

RUN apt-get update && apt-get install -y openssl libssl1.1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN yarn global add prisma@3.15.2
RUN yarn add npm-run-all dotenv

# Copy needed files from builder
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["yarn", "start-docker"]
