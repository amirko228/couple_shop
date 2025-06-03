import { NextResponse } from 'next/server';
import { sendTelegramMessage, formatCustomPrintMessage, sendTelegramPhoto } from '../utils';

// Временное решение - имитация хранилища данных
// В реальном приложении здесь был бы импорт из базы данных
const customPrintRequests: Array<{
  id: string;
  name: string;
  contact: string;
  phone: string;
  message: string;
  hasImage?: boolean;
  date: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация данных
    if (!body.name || !body.contact || !body.phone || !body.message) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }
    
    // Генерируем уникальный идентификатор заявки
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5).toUpperCase();
    
    // Формируем сообщение для Telegram
    const message = formatCustomPrintMessage({
      name: body.name,
      contact: body.contact,
      phone: body.phone,
      message: body.message,
      hasAttachment: !!body.imageData
    });
    
    let result;
    
    // Если есть изображение, отправляем его с подписью
    if (body.imageData) {
      result = await sendTelegramPhoto(
        body.imageData,
        message
      );
    } else {
      // Иначе отправляем обычное текстовое сообщение
      result = await sendTelegramMessage(message);
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Не удалось отправить сообщение в Telegram' },
        { status: 500 }
      );
    }
    
    // Сохранение заявки в хранилище
    const newRequest = {
      id,
      ...body,
      date: new Date().toISOString(),
      status: 'new' as const,
    };
    
    // Удаляем большие данные изображения перед сохранением в память
    if (newRequest.imageData) {
      // Сохраняем только факт наличия изображения
      newRequest.hasImage = true;
      delete newRequest.imageData;
    }
    
    customPrintRequests.push(newRequest);
    
    return NextResponse.json({ 
      success: true,
      requestId: id
    });
  } catch (error) {
    console.error('Ошибка при обработке заявки:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке запроса' },
      { status: 500 }
    );
  }
} 