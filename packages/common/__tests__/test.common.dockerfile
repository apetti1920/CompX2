FROM base_node_folder

WORKDIR ./packages/common

COPY package.json package.json
RUN npm install

COPY . .

RUN npm run test

CMD ["tail", "-f", "/dev/null"]