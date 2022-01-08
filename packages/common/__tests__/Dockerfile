FROM node:14

COPY jest.config.ts package.json tsconfig.json ./
ADD __tests__ src ./

RUN npm install
RUN npm run test --ci

CMD tail -f /dev/null