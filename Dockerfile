FROM node:16-alpine
WORKDIR /usr/src/construction-companies/server
COPY ./server/package*.json ./
RUN npm i
WORKDIR /usr/src/construction-companies/client
COPY ./client/package*.json ./
RUN npm i
WORKDIR /usr/src/construction-companies
COPY . .
WORKDIR /usr/src/construction-companies/client
RUN npm run build
WORKDIR /usr/src/construction-companies/server
EXPOSE 3000
CMD ["npm", "start"]