# stage: development
FROM node:18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# stage: build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build || true

# stage: runtime (production)
FROM node:18-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app ./
RUN npm ci --production=true
EXPOSE 3000
CMD ["node", "src/index.js"]