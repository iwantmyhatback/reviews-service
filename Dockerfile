FROM node:12
WORKDIR /home/ubuntu/reviews-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8393
CMD ["node","index.js"]
