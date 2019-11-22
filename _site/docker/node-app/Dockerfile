FROM node:12

ADD weather-app /weather-app

WORKDIR /weather-app

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]