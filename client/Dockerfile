FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN ls -la /app/dist

FROM node:18-alpine AS runtime

WORKDIR /app

COPY --from=build /app .

RUN npm i -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]