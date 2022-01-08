FROM node:14

ADD . ./

RUN npm install

WORKDIR ./packages/common

RUN npm install
RUN npm run test --ci

CMD tail -f /dev/null