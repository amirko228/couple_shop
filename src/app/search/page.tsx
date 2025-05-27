"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { Search } from "lucide-react";
import { Product } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки для демонстрации состояния загрузки
    setIsLoading(true);
    
    // Фильтрация товаров на основе поискового запроса
    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Устанавливаем небольшую задержку для демонстрации загрузки
    const timer = setTimeout(() => {
      setFilteredProducts(searchResults);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Результаты поиска</h1>
        <div className="flex items-center mb-2">
          <p className="text-gray-600">
            По запросу <span className="font-medium">"{searchQuery}"</span> {filteredProducts.length > 0 
              ? `найдено ${filteredProducts.length} ${
                  filteredProducts.length === 1 
                    ? 'товар' 
                    : filteredProducts.length > 1 && filteredProducts.length < 5 
                      ? 'товара' 
                      : 'товаров'
                }`
              : 'ничего не найдено'
            }
          </p>
        </div>
        
        {/* Форма поиска для повторного поиска */}
        <div className="mt-6 max-w-md">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const query = formData.get('query') as string;
              if (query.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="flex items-center"
          >
            <input 
              type="text"
              name="query"
              defaultValue={searchQuery}
              placeholder="Поиск товаров..."
              className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button 
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-r-md"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Товары не найдены</h2>
          <p className="text-gray-600 mb-6">
            К сожалению, по вашему запросу ничего не найдено. 
            Попробуйте изменить поисковый запрос или просмотреть наш каталог.
          </p>
          <a 
            href="/catalog" 
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition duration-300 inline-block"
          >
            Перейти в каталог
          </a>
        </div>
      )}
    </div>
  );
} 