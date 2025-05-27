"use client";

import { useState } from "react";
import Image from "next/image";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find((p) => p.id === id);
  
  if (!product) {
    notFound();
  }
  
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity, selectedSize, selectedColor);
    alert("Товар добавлен в корзину!");
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Изображение товара */}
        <div className="md:w-1/2">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || "/images/product-placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        
        {/* Информация о товаре */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-pink-500 mb-6">{formatPrice(product.price)}</p>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Описание</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Выбор размера */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Размер</h2>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? "border-pink-500 bg-pink-50 text-pink-500"
                      : "border-gray-300 hover:border-pink-300"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Выбор цвета */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Цвет</h2>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded-md ${
                    selectedColor === color
                      ? "border-pink-500 bg-pink-50 text-pink-500"
                      : "border-gray-300 hover:border-pink-300"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          {/* Выбор количества */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">Количество</h2>
            <div className="flex items-center">
              <button
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-pink-500 hover:text-pink-500"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="mx-4 text-lg w-8 text-center">{quantity}</span>
              <button
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-pink-500 hover:text-pink-500"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Кнопка добавления в корзину */}
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-full transition duration-300"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
} 