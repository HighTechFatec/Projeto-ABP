# Etapa 1 — Compilação TypeScript
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2 — Execução em produção
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000
CMD ["node", "dist/server.js"]