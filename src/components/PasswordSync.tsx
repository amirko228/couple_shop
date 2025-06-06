"use client";

import { useEffect } from 'react';

/**
 * Компонент для имитации синхронизации данных между устройствами.
 * В реальном приложении такая синхронизация должна осуществляться через сервер.
 * Этот компонент - демонстрационное решение.
 */
export default function PasswordSync() {
  // Синхронизируем "общий" пароль при загрузке страницы
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Если изменился глобальный пароль, отражаем это изменение
      if (event.key === 'globalAdminPassword' && event.newValue) {
        localStorage.setItem('globalAdminPassword', event.newValue);
      }
    };

    // Подписываемся на изменения localStorage в других вкладках
    window.addEventListener('storage', handleStorageChange);

    // При монтировании компонента проверяем, есть ли глобальный пароль
    try {
      const globalPassword = localStorage.getItem('globalAdminPassword');
      if (globalPassword) {
        console.log('Синхронизация пароля успешна');
      }
    } catch (error) {
      console.error('Ошибка при синхронизации пароля:', error);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Этот компонент не рендерит никакой UI
  return null;
} 