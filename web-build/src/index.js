import Bundler from 'parcel-bundler';
import express from 'express';
import hpm from 'http-proxy-middleware';

import path from 'path';

const app = express();

app.use(hpm.createProxyMiddleware('/api', {
  target: 'http://localhost:8080'
}));

const bundle = path.resolve('../web/public/index.html');
console.log(bundle);
const bundler = new Bundler(bundle);
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));
