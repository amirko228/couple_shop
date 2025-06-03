/**
 * Утилиты для работы с Telegram API
 */

// Токен бота должен быть получен от BotFather и добавлен в переменные окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// Идентификатор чата, куда будут отправляться сообщения (ваш личный чат)
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

/**
 * Отправляет сообщение в Telegram
 * @param message Текст сообщения
 * @returns Результат отправки
 */
export async function sendTelegramMessage(message: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Не настроены переменные окружения для Telegram (TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)');
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Telegram API вернул ошибку: ${data.description || 'Неизвестная ошибка'}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
    };
  }
}

/**
 * Отправляет изображение в Telegram
 * @param imageUrl URL изображения или Base64 данные
 * @param caption Подпись к изображению
 * @returns Результат отправки
 */
export async function sendTelegramPhoto(
  imageUrl: string,
  caption: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Не настроены переменные окружения для Telegram (TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)');
    }

    let formData;
    const isBase64 = imageUrl.startsWith('data:');
    
    if (isBase64) {
      // Конвертируем Base64 в бинарные данные
      const base64Data = imageUrl.split(',')[1];
      const mimeType = imageUrl.split(';')[0].split(':')[1];
      const binaryData = Buffer.from(base64Data, 'base64');
      
      // Создаем формдату с файлом
      formData = new FormData();
      const blob = new Blob([binaryData], { type: mimeType });
      formData.append('photo', blob, 'photo.jpg');
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('parse_mode', 'HTML');
      formData.append('caption', caption);
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: isBase64 
        ? formData 
        : JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: imageUrl, // Внешний URL для фото
            parse_mode: 'HTML',
            caption
          }),
      headers: isBase64 
        ? undefined 
        : {
            'Content-Type': 'application/json',
          }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Telegram API вернул ошибку: ${data.description || 'Неизвестная ошибка'}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Ошибка при отправке изображения в Telegram:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
    };
  }
}

/**
 * Форматирует данные пользовательской печати для отправки в Telegram
 */
export function formatCustomPrintMessage(data: {
  name: string;
  contact: string;
  phone: string;
  message: string;
  hasAttachment?: boolean;
}): string {
  return `
<b>🎨 Новая заявка на индивидуальную печать</b>

<b>Имя:</b> ${data.name}
<b>Контакт (Telegram/WhatsApp):</b> ${data.contact}
<b>Телефон:</b> ${data.phone}
<b>Сообщение:</b>
${data.message}
${data.hasAttachment ? '\n<b>✅ К заявке прикреплено изображение</b>' : ''}

<i>⚠️ Не забудьте связаться с клиентом для уточнения деталей.</i>
`;
}

/**
 * Форматирует данные заказа для отправки в Telegram
 */
export function formatOrderMessage(data: {
  orderItems: Array<{
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  totalPrice: number;
  customerInfo: {
    name: string;
    contact: string;
    phone: string;
  };
}): string {
  const { orderItems, totalPrice, customerInfo } = data;
  
  // Форматирование товаров
  const itemsText = orderItems.map(item => {
    return `- ${item.productName} ${item.size ? `(Размер: ${item.size})` : ''} ${item.color ? `(Цвет: ${item.color})` : ''} - ${item.quantity} шт. x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`;
  }).join('\n');
  
  return `
<b>🛍 Новый заказ</b>

<b>Заказанные товары:</b>
${itemsText}

<b>Итого:</b> ${formatPrice(totalPrice)}

<b>Информация о клиенте:</b>
<b>Имя:</b> ${customerInfo.name}
<b>Контакт (Telegram/WhatsApp):</b> ${customerInfo.contact}
<b>Телефон:</b> ${customerInfo.phone}

<i>⚠️ Не забудьте связаться с клиентом для подтверждения заказа.</i>
`;
}

/**
 * Форматирует цену в сомах
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
} 