FROM node:18.18.0-alpine as builder

ENV NODE_ENV build
WORKDIR /app

COPY ./ /app

RUN npm ci
RUN npm run build \
  && npm prune --production

FROM node:18.18.0-alpine

ENV NODE_ENV production
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

EXPOSE 3000
CMD ["npm", "run", "start:prod"]