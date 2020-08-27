FROM node:14.8-stretch-slim

WORKDIR /app
COPY dist/ /app/

RUN npm run build

ENTRYPOINT ["npm", "start"]
