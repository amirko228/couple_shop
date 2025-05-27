"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types";

type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
    
    // Обновление количества товаров и общей стоимости
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const price = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    setItemCount(count);
    setTotalPrice(price);
  }, [items]);

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setItems(prevItems => {
      // Проверяем, есть ли уже такой товар в корзине с такими же параметрами
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex !== -1) {
        // Если товар уже есть, обновляем количество
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Если товара нет, добавляем новый
        return [...prevItems, { product, quantity, size, color }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 