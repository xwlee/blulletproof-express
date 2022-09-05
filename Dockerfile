# syntax=docker/dockerfile:1

FROM --platform=arm64 node:16-alpine AS build

WORKDIR /workdir

COPY . .

RUN yarn install \
  --frozen-lockfile \
  --ignore-optional \
  --non-interactive

RUN yarn build

###

FROM --platform=arm64 node:16-alpine AS deps

WORKDIR /workdir

COPY package.json yarn.lock ./

RUN yarn install \
  --frozen-lockfile \
  --ignore-optional \
  --ignore-scripts \
  --non-interactive \
  --production

###

FROM --platform=arm64 gcr.io/distroless/nodejs:16 AS runtime

WORKDIR /workdir

COPY --from=build /workdir/dist dist

COPY --from=deps /workdir/node_modules node_modules

ENV NODE_ENV=production
ENV NODE_OPTIONS=--enable-source-maps

EXPOSE 8080

CMD [ "dist/server.js" ]
