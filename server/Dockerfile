FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install --save-dev ts-node typescript

COPY . .

EXPOSE 3333

CMD ["npm", "run", "start:dev"]
