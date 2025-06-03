"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [contactInfo, setContactInfo] = useState({ name: "", contact: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    if (!contactInfo.name || !contactInfo.contact || !contactInfo.phone) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Отправка данных на сервер
      const response = await fetch('/api/telegram/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          totalPrice,
          customerInfo: contactInfo,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка при оформлении заказа');
      }
      
      // Очистка корзины и показ сообщения об успехе
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      setError(error instanceof Error ? error.message : "Произошла ошибка. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Заказ успешно оформлен!</h1>
          <p className="text-gray-600 mb-6">
            Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения деталей заказа.
          </p>
          <Link
            href="/catalog"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition duration-300 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Вернуться к покупкам
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-6">Ваша корзина пуста</p>
          <Link
            href="/catalog"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition duration-300 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Вернуться к покупкам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Список товаров */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Ваши товары</h2>
            </div>

            <ul>
              {items.map((item) => (
                <li key={`${item.product.id}-${item.size}-${item.color}`} className="p-6 border-b flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-24 sm:h-24 aspect-square relative rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/images/product-placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <Link href={`/product/${item.product.id}`} className="text-lg font-medium hover:text-pink-500 transition-colors">
                      {item.product.name}
                    </Link>
                    <div className="text-gray-500 text-sm mt-1">
                      Размер: {item.size}, Цвет: {item.color}
                    </div>
                    <div className="text-pink-500 font-bold mt-1">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-pink-500 hover:text-pink-500"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="mx-3 text-center w-8">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-pink-500 hover:text-pink-500"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 mt-2 inline-flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-6 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-red-500 inline-flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Очистить корзину
              </button>
              <Link
                href="/catalog"
                className="text-pink-500 hover:text-pink-600 inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Продолжить покупки
              </Link>
            </div>
          </div>
        </div>

        {/* Сводка заказа */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Сводка заказа</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Товары ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Итого</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            
            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
              <h3 className="font-medium">Контактная информация</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactInfo.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="contact" className="block text-gray-700 text-sm font-medium mb-1">
                  Telegram/WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={contactInfo.contact}
                  onChange={handleInputChange}
                  required
                  placeholder="@username или номер"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 bg-pink-500 text-white font-medium rounded-full transition duration-300 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-600"
                }`}
              >
                {isSubmitting ? "Оформление..." : "Оформить заказ"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 