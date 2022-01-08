FROM node:14

COPY . .

RUN npm install
RUN npm run test --ci

CMD tail -f /dev/null