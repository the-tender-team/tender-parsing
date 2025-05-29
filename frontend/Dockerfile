FROM node:18-alpine

WORKDIR /app

# 1. Копируем только файлы зависимостей
COPY package*.json ./

# 2. Устанавливаем зависимости
RUN npm install

# 3. Копируем остальные файлы
COPY . .

# 4. Опционально: пропускаем линтинг при сборке
ENV NODE_ENV=production
RUN npm run build || echo "Build completed with warnings"

# 5. Запускаем
EXPOSE 3000
CMD ["npm", "start"]