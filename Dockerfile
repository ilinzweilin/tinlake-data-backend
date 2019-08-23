FROM node:10.16.3-alpine

WORKDIR /usr/src/app

COPY . ./

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
