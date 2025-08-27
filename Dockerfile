FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production || npm install --production
COPY . .
EXPOSE 13000 8080
ENV PORT=13000
CMD ["npm","run","start"]
