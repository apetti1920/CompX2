FROM node:14

WORKDIR compx

ADD package.json ./

RUN npm install

ADD packages jest.config.ts lerna.json tsconfig.json ./

CMD tail -f /dev/null