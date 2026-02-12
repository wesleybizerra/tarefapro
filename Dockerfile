# Estágio de Build para o Frontend (React + Vite)
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Estágio de Execução para o Servidor (Node.js + Express)
FROM node:20-alpine
WORKDIR /app
# Variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3000
# Instala apenas dependências de produção para o Express
COPY package*.json ./
RUN npm install --omit=dev
# Copia o script do servidor e o build gerado pelo frontend
COPY server.js ./
COPY --from=build-stage /app/dist ./dist
# Expõe a porta padrão para o Railway
EXPOSE 3000
# Inicia o servidor Express que serve a API e o Frontend
CMD ["node", "server.js"]