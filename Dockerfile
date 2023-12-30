FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn cache clean

COPY . .

RUN yarn build

ARG port db_port hostname db_hostname db_password

ENV PORT=$port DB_PORT=$db_port HOSTNAME=$hostname DB_HOSTNAME=$db_hostname
ENV DB_PASSWORD=$db_password

EXPOSE 3000

CMD [ "yarn" , "start" ]
