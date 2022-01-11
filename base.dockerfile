FROM node:16

WORKDIR compx

COPY package.json package.json

RUN npm install

COPY . .