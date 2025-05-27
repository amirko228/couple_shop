/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем проверку ESLint при сборке
    ignoreDuringBuilds: true,
  },
  // Другие настройки Next.js можно добавить здесь
};

module.exports = nextConfig; 