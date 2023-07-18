FROM node:18
WORKDIR /app
COPY package*.json ./
COPY ./ ./
RUN npm i
CMD [ "npm", "start" ]