FROM base_node_folder

WORKDIR ./packages/common

RUN npm install

RUN npm run test --ci

CMD tail -f /dev/null