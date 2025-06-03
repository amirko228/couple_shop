import { NextResponse } from 'next/server';
import { sendTelegramMessage, formatOrderMessage } from '../utils';
import { orders } from '../admin/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация данных
    if (!body.items || !body.totalPrice || !body.customerInfo) {
      return NextResponse.json(
        { error: 'Отсутствуют необходимые данные о заказе' },
        { status: 400 }
      );
    }
    
    if (!body.customerInfo.name || !body.customerInfo.contact || !body.customerInfo.phone) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все контактные данные' },
        { status: 400 }
      );
    }
    
    // Подготовка данных для форматирования сообщения
    const orderItems = body.items.map((item: any) => ({
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));
    
    // Форматирование сообщения для Telegram
    const message = formatOrderMessage({
      orderItems,
      totalPrice: body.totalPrice,
      customerInfo: body.customerInfo,
    });
    
    // Отправка сообщения в Telegram
    const result = await sendTelegramMessage(message);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Не удалось отправить сообщение в Telegram' },
        { status: 500 }
      );
    }
    
    // Генерируем уникальный идентификатор заказа
    const orderId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5).toUpperCase();
    
    // Сохранение заказа в хранилище
    const newOrder = {
      id: orderId,
      items: body.items,
      totalPrice: body.totalPrice,
      customerInfo: body.customerInfo,
      date: new Date().toISOString(),
      status: 'pending' as const,
    };
    
    orders.push(newOrder);
    
    return NextResponse.json({ 
      success: true, 
      orderId 
    });
  } catch (error) {
    console.error('Ошибка при обработке заказа:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке запроса' },
      { status: 500 }
    );
  }
} 