# Coolify Dockerfile alternatifi
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.11-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server.py ./
ENV PORT=5005
ENV HOST=0.0.0.0
ENV DB_PATH=/data/cografya.db
RUN mkdir -p /data
VOLUME ["/data"]
EXPOSE 5005
CMD ["python3", "server.py"]
