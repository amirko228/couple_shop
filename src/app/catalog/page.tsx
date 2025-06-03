"use client";

import { useState, useEffect } from "react";
import { products as initialProducts } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { Filter } from "lucide-react";
import { Product, ProductCategory } from "@/types";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  // Загрузка товаров из localStorage при монтировании компонента
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
        }
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
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

  // Обновление минимальной и максимальной цены при изменении списка товаров
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  // Установка начального диапазона цен
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Фильтрация товаров
  useEffect(() => {
    let result = [...products];
    
    // Фильтр по категории
    if (activeCategory !== "all") {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Фильтр по цене
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [activeCategory, priceRange, products]);

  const handleCategoryChange = (category: ProductCategory | "all") => {
    setActiveCategory(category);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(event.target.value);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = newValue;
    setPriceRange(newRange);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "KGS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Каталог товаров</h1>
        <button 
          className="md:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          Фильтры
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Фильтры */}
        <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Фильтры</h2>
            
            {/* Категории */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Категории</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="category-all" 
                    name="category" 
                    checked={activeCategory === "all"}
                    onChange={() => handleCategoryChange("all")}
                    className="mr-2"
                  />
                  <label htmlFor="category-all">Все товары</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="category-tshirt" 
                    name="category" 
                    checked={activeCategory === "tshirt"}
                    onChange={() => handleCategoryChange("tshirt")}
                    className="mr-2"
                  />
                  <label htmlFor="category-tshirt">Футболки</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="category-hoodie" 
                    name="category" 
                    checked={activeCategory === "hoodie"}
                    onChange={() => handleCategoryChange("hoodie")}
                    className="mr-2"
                  />
                  <label htmlFor="category-hoodie">Худи</label>
                </div>
              </div>
            </div>
            
            {/* Диапазон цен */}
            <div>
              <h3 className="font-medium mb-2">Цена</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">От: {formatPrice(priceRange[0])}</span>
                <span className="text-sm text-gray-500">До: {formatPrice(priceRange[1])}</span>
              </div>
              <div className="mb-4">
                <input 
                  type="range" 
                  min={minPrice} 
                  max={maxPrice} 
                  value={priceRange[0]} 
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full"
                />
              </div>
              <div>
                <input 
                  type="range" 
                  min={minPrice} 
                  max={maxPrice} 
                  value={priceRange[1]} 
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Товары */}
        <div className="md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Товары не найдены</p>
              <button 
                onClick={() => {
                  setActiveCategory("all");
                  setPriceRange([minPrice, maxPrice]);
                }}
                className="mt-4 text-pink-500 hover:text-pink-600 underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}