FROM node:18-alpine

WORKDIR /app

# 1. Копируем только файлы зависимостей
COPY package*.json ./

# 2. Устанавливаем зависимости
RUN npm install

# 3. Копируем остальные файлы
COPY . .

# 4. Опционально: пропускаем линтинг при сборке
ENV NEXT_DISABLE_ESLINT=true
RUN npm run build

# 5. Запускаем
EXPOSE 3000
CMD ["npm", "start"]