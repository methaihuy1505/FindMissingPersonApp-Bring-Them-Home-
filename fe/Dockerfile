FROM node:20

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY . .

# Tạo file tailwind.config.js nếu chưa có
RUN test -f tailwind.config.js || npx tailwindcss init -p

EXPOSE 5173

CMD ["npm", "run", "dev"]
