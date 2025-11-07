# Etapa 1: Build do TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila o TypeScript
RUN npm run build

# Etapa 2: Imagem final (leve)
FROM node:18-alpine

WORKDIR /app

# Copia apenas o necessário do build anterior
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Define a variável de ambiente
ENV NODE_ENV=production
ENV PORT=10000

# Expõe a porta
EXPOSE 10000

# Comando para iniciar o servidor
CMD ["node", "dist/index.js"]