FROM node:20

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
ENV PORT 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]