/**
 * Имитация хранилища данных
 * В реальном приложении вместо этого использовалась бы база данных
 */

// Хранилище заявок на индивидуальную печать
export const customPrintRequests: Array<{
  id: string;
  name: string;
  contact: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
}> = [];

// Хранилище заказов
export const orders: Array<{
  id: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
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
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}> = []; 