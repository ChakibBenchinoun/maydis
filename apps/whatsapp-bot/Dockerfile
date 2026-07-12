# Build context = apps/whatsapp-bot (Railway Root Directory)
FROM node:22-bookworm-slim

# git: required by npm for some deps (Baileys tree)
# ca-certificates: HTTPS to WhatsApp
# python3/make/g++: optional native builds
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    python3 \
    make \
    g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev --no-audit --no-fund \
  && npm cache clean --force

COPY src ./src

ENV NODE_ENV=production
ENV WHATSAPP_BOT_HOST=0.0.0.0
ENV WHATSAPP_AUTH_DIR=/data/auth
# Do NOT hardcode PORT — Railway injects PORT; the public domain must target that same port.

RUN mkdir -p /data/auth

EXPOSE 3100

CMD ["node", "src/server.js"]
