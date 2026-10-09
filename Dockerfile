FROM node:22-bookworm-slim

COPY --from=oven/bun:1.2.2 /usr/local/bin/bun /usr/local/bin/bun

# System Chromium for PDF generation. Puppeteer's own Chrome download is skipped.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates \
		chromium \
		fonts-liberation \
	&& rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	PUPPETEER_SKIP_DOWNLOAD=true \
	PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
	HUSKY=0

WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/biome-config/package.json packages/biome-config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/errors/package.json packages/errors/package.json
COPY packages/observability/package.json packages/observability/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN bun install --frozen-lockfile --ignore-scripts

COPY apps ./apps
COPY packages ./packages
COPY scripts ./scripts
COPY tsconfig.json biome.json ./

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["node", "-r", "esbuild-register", "./src/index.ts"]
