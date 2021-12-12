FROM node:16

WORKDIR /auto-moderator

COPY package.json .
COPY yarn.lock .

ENV NODE_ENV=prod

RUN yarn install

COPY . .

RUN yarn deploy
RUN yarn generate

CMD ["yarn", "start"]