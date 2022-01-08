FROM node:14

ADD . ./

RUN npm install

CMD tail -f /dev/null