# Base image with Node.js
FROM node:18-slim

# Instalar ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the Google Cloud credentials file
COPY ./signsync-459720-43c3e4cb8e37.json /app/signsync-459720-43c3e4cb8e37.json

# Define the environment variable
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/signsync-459720-43c3e4cb8e37.json

# Copy the rest of the application code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
