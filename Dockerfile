FROM node:12
WORKDIR /usr/src/reviews-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8393
CMD ["node","index.js"]
