FROM node:14

WORKDIR compx

ADD . ./

RUN npm install

CMD tail -f /dev/null