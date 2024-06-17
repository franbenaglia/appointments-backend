FROM node:20

WORKDIR /appointments-backend
COPY package.json .
RUN npm install
COPY . .
CMD [ "node", "src/index.js" ]

#problema al conectar con mongodb
