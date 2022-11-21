# Build Stage 1
# This build created a staging docker image
#
FROM node:16.16 as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prepare

RUN npm run build

# Build Stage 2
# This build takes the production build from staging build
#
FROM node:16.16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=builder /app/build /app/build

EXPOSE 80

ENTRYPOINT node ./build
