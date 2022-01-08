FROM node:14

WORKDIR compx

ADD package.json ./

RUN npm install

COPY packages ./packages
COPY jest.config.ts lerna.json tsconfig.json ./

CMD tail -f /dev/null