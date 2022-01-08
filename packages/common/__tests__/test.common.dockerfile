FROM base_node_folder

WORKDIR ./packages/common

RUN npm install

RUN npm run test

CMD tail -f /dev/null