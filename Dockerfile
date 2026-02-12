# Estágio de build
FROM node:20-alpine AS builder
WORKDIR /app
# Instala as dependências primeiro para aproveitar o cache de camadas do Docker
COPY package*.json ./
RUN npm install
# Copia o restante dos arquivos do projeto
COPY . .
# Executa o build do Vite para gerar a pasta dist
RUN npm run build
# Estágio de execução (Runtime)
FROM node:20-alpine
WORKDIR /app
# Define variáveis de ambiente
ENV NODE_ENV=production
# Copia os arquivos compilados (frontend) do estágio anterior
COPY --from=builder /app/dist ./dist
# Copia o servidor Express e os arquivos de configuração
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
#Instala apenas as dependências necessárias para a execução (produção)
RUN npm install --only=production
#Expõe a porta padrão (o Railway usará a variável PORT interna)
EXPOSE 3000
#Comando para iniciar o servidor que serve o app e a API
CMD ["node", "server.js"]