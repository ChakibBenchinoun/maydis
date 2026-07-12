# Build context = apps/whatsapp-bot (Railway Root Directory)
FROM node:22-bookworm-slim

# ca-certificates for HTTPS; build tools for optional native deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    python3 \
    make \
    g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

# Fresh install inside the image (no monorepo lockfile required)
RUN npm install --omit=dev --no-audit --no-fund \
  && npm cache clean --force

COPY src ./src

ENV NODE_ENV=production
ENV WHATSAPP_BOT_HOST=0.0.0.0
ENV WHATSAPP_AUTH_DIR=/data/auth
# Railway sets PORT at runtime; keep a default for local docker runs
ENV PORT=3100

RUN mkdir -p /data/auth

EXPOSE 3100

CMD ["node", "src/server.js"]
