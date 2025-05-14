# Base image with Node.js
FROM node:18-slim

# Instalar ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Set working directory
WORKDIR /app

# Copiar package.json e instalar as dependências
COPY package*.json ./
RUN npm install

# Copiar a chave de autenticação do Google Cloud para dentro do container
COPY ./signsync-459720-7200b7db9fbe.json /app/signsync-459720-7200b7db9fbe.json

# Definir variável de ambiente para o caminho da chave de autenticação
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/signsync-459720-7200b7db9fbe.json

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta do servidor
EXPOSE 3000

# Iniciar o servidor
CMD ["node", "server.js"]
