FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

RUN ls node_modules/.bin
RUN npm list typescript

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]