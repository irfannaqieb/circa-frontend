# ---------- Base (dependencies layer) ----------
FROM node:20-alpine AS base
WORKDIR /src

# Install dependencies (cache this layer)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- Development image ----------
FROM base AS dev
ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    NUXT_HOST=0.0.0.0 \
    PORT=3000

# Copy all source files for dev (overridden by volume in docker-compose)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ---------- Build image (production build) ----------
FROM base AS build
ENV NODE_ENV=production

# Copy source code for building
COPY . .

# Build Nuxt production output
RUN npm run build

# ---------- Production runtime ----------
FROM node:20-alpine AS prod
WORKDIR /src
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    HOST=0.0.0.0 \
    PORT=3000

# Copy only the build artifacts from the build stage
COPY --from=build /src/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
