FROM node:22-alpine@sha256:48f53c3f0105ccddcc5e4f520347398dfc0ba9b3008fbfd98a2add27e5797957 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm test
RUN npm run build
RUN npx @cyclonedx/cyclonedx-npm --output-file dist/sbom.json

FROM nginx:alpine@sha256:c032460d1fd73978317479ba23c37bcb57d93156cab122eb3c54b8e4bdc292fa AS serve
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
