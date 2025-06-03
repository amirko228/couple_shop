"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products as initialProducts } from "@/data/products";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Загрузка товаров из localStorage
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          // Фильтруем только популярные товары
          const featured = parsedProducts.filter((product: Product) => product.featured).slice(0, 4);
          setFeaturedProducts(featured);
        } else {
          // Если в localStorage ничего нет, используем начальные данные
          const featured = initialProducts.filter(product => product.featured).slice(0, 4);
          setFeaturedProducts(featured);
        }
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
        const featured = initialProducts.filter(product => product.featured).slice(0, 4);
        setFeaturedProducts(featured);
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 z-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-60"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Твой <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400">стиль.</span> Твоя <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400">индивидуальность.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fade-in-delay">
              Создай свой уникальный дизайн или выбери из наших коллекций футболок и худи с эксклюзивными принтами.
            </p>
            <div className="flex flex-wrap gap-5 animate-fade-in-delay-2">
              <Link
                href="/catalog/tshirts"
                className="group bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-medium transition duration-300 inline-flex items-center shadow-lg hover:shadow-pink-500/30"
              >
                Смотреть каталог 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/custom-print"
                className="group bg-transparent backdrop-blur-sm border border-white/30 hover:border-pink-500/50 hover:bg-white/5 text-white px-8 py-4 rounded-full font-medium transition duration-300 shadow-lg"
              >
                Создать свой дизайн
                <ArrowRight className="ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Почему <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">Couple_Shoop</span>?</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16 text-lg">Мы предлагаем лучшие решения для создания вашего уникального стиля</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-pink-500 transition-colors">Уникальный дизайн</h3>
              <p className="text-gray-600 leading-relaxed">Создай свой собственный принт или выбери из наших эксклюзивных коллекций.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">👕</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-pink-500 transition-colors">Качественные материалы</h3>
              <p className="text-gray-600 leading-relaxed">Мы используем только премиальные ткани для максимального комфорта.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-pink-500 transition-colors">Быстрая доставка</h3>
              <p className="text-gray-600 leading-relaxed">Доставляем по всей России в течение 1-3 рабочих дней.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl font-bold">Популярные товары</h2>
            <Link 
              href="/catalog" 
              className="text-pink-500 hover:text-pink-600 flex items-center group"
            >
              Смотреть все <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              // Заглушки, если популярных товаров нет
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="relative overflow-hidden rounded-t-xl aspect-[3/4] bg-gray-200">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                  </div>
                  <div className="p-5 bg-white rounded-b-xl">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Custom Print CTA */}
      <section className="py-24 bg-gradient-to-r from-black to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Создай свой <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">уникальный дизайн</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                Загрузи свою картинку или референс, и мы нанесем ее на футболку или худи. 
                Будь уникальным, носи то, что действительно отражает твою индивидуальность!
              </p>
              <Link
                href="/custom-print"
                className="group bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-medium transition duration-300 inline-flex items-center shadow-lg hover:shadow-pink-500/30"
              >
                Создать дизайн <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="md:w-2/5">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-9xl animate-float">🎨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
