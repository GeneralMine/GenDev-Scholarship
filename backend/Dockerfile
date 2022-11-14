FROM node:16.16-alpine

WORKDIR /api

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 8080

ENTRYPOINT npm start
