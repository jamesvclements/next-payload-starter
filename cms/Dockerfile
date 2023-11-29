# Base Image
FROM node:18.8-alpine AS base
WORKDIR /home/node/app

# Builder Stage
FROM base AS builder

# Pass through environment variables that are needed for the build (most aren't)
ARG MUX_TOKEN_ID
ENV MUX_TOKEN_ID=$MUX_TOKEN_ID
ARG MUX_TOKEN_SECRET
ENV MUX_TOKEN_SECRET=$MUX_TOKEN_SECRET

COPY ./cms/package*.json ./
COPY ./cms .
RUN yarn install && yarn build

# Runtime Stage
FROM base AS runtime
ENV NODE_ENV=production PAYLOAD_CONFIG_PATH=dist/payload.config.js

# Install production dependencies
COPY ./cms/package*.json ./
RUN yarn install --production

# Copy built assets from builder stage
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

# Expose port and define CMD
EXPOSE 8080
CMD ["node", "dist/server.js"]
