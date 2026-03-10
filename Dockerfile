FROM oven/bun:1 AS build

WORKDIR /app
COPY web/package.json web/bun.lock ./
RUN bun install --frozen-lockfile

COPY web/ .
RUN bun run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://localhost/ || exit 1
