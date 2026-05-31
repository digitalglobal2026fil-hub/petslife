FROM oven/bun:1

WORKDIR /app

COPY . .

RUN cd packages/web && bun install && bun run build

EXPOSE 10000

ENV PORT=10000

CMD ["bun", "run", "packages/web/src/server.ts"]
