# Production image for the free Baileys WhatsApp bridge
FROM node:22-bookworm-slim

WORKDIR /app

# pnpm via corepack
RUN corepack enable

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

# Persist WhatsApp session across restarts (mount a volume at /data)
ENV WHATSAPP_AUTH_DIR=/data/auth
ENV NODE_ENV=production
ENV PORT=3100
ENV WHATSAPP_BOT_HOST=0.0.0.0

RUN mkdir -p /data/auth
VOLUME ["/data"]

EXPOSE 3100

CMD ["node", "src/server.js"]
