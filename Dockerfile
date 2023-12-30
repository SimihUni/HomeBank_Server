FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn cache clean

COPY . .

RUN yarn build

ENV PORT="3000" DB_PORT="5432" 
ENV HOSTNAME="localhost" DB_HOSTNAME="localhost"
ENV DB_PASSWORD=""

EXPOSE 3000

CMD [ "yarn" , "start" ]
