#!/bin/bash -e

rm -rf dist

mkdir -p dist

cp -v ../package.json dist
cp -rv ../lib/ dist

mkdir -p dist/server
cp -v ../server/package-lock.json dist/server
cp -v ../server/package.json dist/server
cp -rv ../server/src dist/server

mkdir -p dist/web
cp -v ../web/package-lock.json dist/web
cp -v ../web/package.json dist/web
cp -rv ../web/public dist/web
cp -rv ../web/src dist/web

mkdir -p dist/web-build
cp -v ../web-build/package-lock.json dist/web-build
cp -v ../web-build/package.json dist/web-build

docker build -t wobc .
