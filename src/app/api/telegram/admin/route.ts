import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '../utils';
import { customPrintRequests, orders } from './storage';

export async function GET(request: Request) {
  try {
    // Проверка аутентификации (в реальном приложении)
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    // }
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Возвращаем данные в зависимости от запрашиваемого типа
    if (type === 'custom-print') {
      return NextResponse.json({ data: customPrintRequests });
    } else if (type === 'orders') {
      return NextResponse.json({ data: orders });
    }
    
    return NextResponse.json({ 
      data: {
        customPrintRequests,
        orders
      } 
    });
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении данных' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Проверка аутентификации (в реальном приложении)
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    // }
    
    const { action, id, data } = body;
    
    // Обработка различных действий админа
    if (action === 'update-order-status') {
      // Найдем заказ по ID и обновим его статус
      const orderIndex = orders.findIndex(order => order.id === id);
      
      if (orderIndex === -1) {
        return NextResponse.json(
          { error: 'Заказ не найден' },
          { status: 404 }
        );
      }
      
      const oldStatus = orders[orderIndex].status;
      orders[orderIndex].status = data.status;
      
      // Отправляем уведомление клиенту при изменении статуса (опционально)
      if (data.notifyCustomer && data.status !== oldStatus) {
        const order = orders[orderIndex];
        const message = `
<b>Обновление статуса заказа</b>

Уважаемый(ая) ${order.customerInfo.name},

Статус вашего заказа #${order.id} был изменен на "${data.status}".

${data.comment ? `<b>Комментарий:</b> ${data.comment}` : ''}

С уважением,
Команда Couple_Shoop
`;
        
        await sendTelegramMessage(message);
      }
      
      return NextResponse.json({ 
        success: true, 
        order: orders[orderIndex] 
      });
    }
    
    if (action === 'update-custom-print-status') {
      // Найдем заявку по ID и обновим её статус
      const requestIndex = customPrintRequests.findIndex(req => req.id === id);
      
      if (requestIndex === -1) {
        return NextResponse.json(
          { error: 'Заявка не найдена' },
          { status: 404 }
        );
      }
      
      customPrintRequests[requestIndex].status = data.status;
      
      return NextResponse.json({ 
        success: true, 
        request: customPrintRequests[requestIndex] 
      });
    }
    
    if (action === 'delete-order') {
      // Удаление заказа
      const orderIndex = orders.findIndex(order => order.id === id);
      
      if (orderIndex === -1) {
        return NextResponse.json(
          { error: 'Заказ не найден' },
          { status: 404 }
        );
      }
      
      orders.splice(orderIndex, 1);
      return NextResponse.json({ success: true });
    }
    
    if (action === 'delete-custom-print') {
      // Удаление заявки на печать
      const requestIndex = customPrintRequests.findIndex(req => req.id === id);
      
      if (requestIndex === -1) {
        return NextResponse.json(
          { error: 'Заявка не найдена' },
          { status: 404 }
        );
      }
      
      customPrintRequests.splice(requestIndex, 1);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Неизвестное действие' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке запроса' },
      { status: 500 }
    );
  }
} 