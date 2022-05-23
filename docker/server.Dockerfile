FROM node:14.10 AS lib-builder

WORKDIR /app
COPY ./lib/package.json ./lib/package-lock.json /app/lib/
RUN npm --prefix /app/lib install
COPY ./lib /app/lib
RUN npm --prefix /app/lib run postinstall --unsafe-perm

#FROM node:14.10 AS server-builder

COPY ./server/package.json ./server/package-lock.json /app/server/
RUN npm --prefix /app/server install --unsafe-perm
COPY ./server /app/server
RUN npm --prefix /app/server run postinstall --unsafe-perm

ENTRYPOINT npm --prefix /app/server start

#FROM node:14.10
#
#WORKDIR /app
#COPY --from=builder /app /app
