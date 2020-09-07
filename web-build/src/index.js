const Bundler = require('parcel-bundler');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const path = require('path');


const app = express();

app.use(createProxyMiddleware('/api', {
  target: 'http://localhost:8080'
}));

const bundle = path.join(__dirname, '../../web/public/index.html');
console.log(bundle);
const bundler = new Bundler(bundle);
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));
