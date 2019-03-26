FROM node:8

ADD ./package.json /app/package.json

WORKDIR /app

RUN npm install

ADD ./app.js /app/app.js

CMD node ./app.js