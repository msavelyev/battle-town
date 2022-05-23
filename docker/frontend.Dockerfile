FROM node:14.10 AS builder

WORKDIR /app
COPY ./lib/package.json ./lib/package-lock.json /app/lib/
RUN npm --prefix /app/lib install
COPY ./lib /app/lib
RUN npm --prefix /app/lib run postinstall --unsafe-perm

COPY ./server/package.json ./server/package-lock.json /app/server/
RUN npm --prefix /app/server install --unsafe-perm
COPY ./server /app/server
RUN npm --prefix /app/server run postinstall --unsafe-perm

COPY ./web/package.json ./web/package-lock.json /app/web/
RUN npm --prefix /app/web install --unsafe-perm
COPY ./web /app/web
RUN npm --prefix /app/web run postinstall --unsafe-perm

COPY ./web-build/package.json ./web-build/package-lock.json /app/web-build/
RUN npm --prefix /app/web-build install --unsafe-perm
COPY ./web-build /app/web-build

RUN npm --prefix /app/web-build run build

ENTRYPOINT npm --prefix /app/server start

FROM nginx:1.21

COPY --from=builder /app/web-build/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
