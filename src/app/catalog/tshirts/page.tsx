"use client";

import { useState, useEffect } from "react";
import { products as initialProducts } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";

export default function TshirtsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Загрузка товаров из localStorage
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts.filter((product: Product) => product.category === "tshirt"));
        } else {
          setProducts(initialProducts.filter(product => product.category === "tshirt"));
        }
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
        setProducts(initialProducts.filter(product => product.category === "tshirt"));
      }
    };

    // Загружаем товары сразу при монтировании
    loadProducts();

    // Добавляем слушатель событий для обновления при изменении localStorage
    window.addEventListener("storage", loadProducts);

    // Очистка слушателя при размонтировании
    return () => {
      window.removeEventListener("storage", loadProducts);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Футболки</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Товары не найдены</p>
        </div>
      )}
    </div>
  );
} 