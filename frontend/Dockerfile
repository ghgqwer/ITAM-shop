FROM node:21-alpine AS builder

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN npm install uuid
COPY . .
RUN npm run build

FROM node:21-alpine AS production

WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install uuid
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
CMD ["node", "./build"]
