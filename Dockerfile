FROM node:21-alpine3.18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn cache clean

COPY . .

RUN yarn build

RUN mkdir src/keys

EXPOSE 3000

CMD [ "yarn" , "start" ]
