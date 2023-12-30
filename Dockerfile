FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn cache clean

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn" , "start" ]
