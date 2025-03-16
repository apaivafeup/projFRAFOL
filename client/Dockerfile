FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

RUN ls -la /app/dist

EXPOSE 4173

CMD [ "serve", "-s", "dist", "-l", "4173" ]

