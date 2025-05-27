"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    alert("Функция оформления заказа пока в разработке. Спасибо за понимание!");
    // В реальном приложении здесь был бы переход к оформлению заказа
  };

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
            
            <button
              onClick={handleCheckout}
              className="w-full mt-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-full transition duration-300"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 