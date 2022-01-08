FROM base_node_folder

RUN ls

WORKDIR ./packages/common

RUN npm install
RUN npm run test --ci

CMD tail -f /dev/null