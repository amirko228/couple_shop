"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const imagePath = product.images[0];
      if (imagePath.startsWith("data:") || imagePath.startsWith("blob:") || imagePath.startsWith("http")) {
        // Если это Data URL, Blob URL или внешняя ссылка - используем как есть
        setImageUrl(imagePath);
      } else if (imagePath.startsWith("/images/uploads/")) {
        // Если это загруженное изображение - ищем в localStorage
        try {
          const imagesMap = JSON.parse(localStorage.getItem('uploadedImages') || '{}');
          if (imagesMap[imagePath]) {
            setImageUrl(imagesMap[imagePath]);
          } else {
            // Если не найдено - используем путь как есть
            setImageUrl(imagePath);
          }
        } catch (error) {
          console.error('Ошибка при получении изображения из localStorage:', error);
          setImageUrl(imagePath);
        }
      } else {
        // Иначе используем путь как есть
        setImageUrl(imagePath);
      }
    }
  }, [product.images]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "KGS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isFeatured = product.featured;

  return (
    <div 
      className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-t-xl aspect-[3/4]">
        <Link href={`/product/${product.id}`}>
          <div className="w-full h-full relative">
            <Image
              src={imageUrl || "/images/product-placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 flex justify-center opacity-0 transform translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Link href={`/product/${product.id}`} className="w-full">
            <button className="w-full bg-white text-pink-500 hover:bg-pink-500 hover:text-white py-3 px-6 rounded-full font-medium transition-all duration-300 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Eye className="w-4 h-4 mr-2" />
              Подробнее
            </button>
          </Link>
        </div>
        
        {/* Бейдж для хитов продаж */}
        {isFeatured && (
          <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
            Хит продаж
          </div>
        )}
        
        {/* Бейдж категории */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-md z-10">
          {product.category === 'tshirt' ? 'Футболка' : 'Худи'}
        </div>
      </div>
      
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-lg mb-1 group-hover:text-pink-500 transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-1">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-pink-500 font-bold text-xl">{formatPrice(product.price)}</p>
          
          {/* Доступные цвета */}
          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div 
                key={index} 
                className="w-4 h-4 rounded-full border border-gray-300" 
                style={{ 
                  backgroundColor: 
                    color.toLowerCase() === 'белый' ? 'white' : 
                    color.toLowerCase() === 'черный' ? 'black' : 
                    color.toLowerCase() === 'серый' ? 'gray' : 
                    color.toLowerCase() === 'розовый' ? 'pink' : 
                    color.toLowerCase() === 'зеленый' ? 'green' : 
                    color.toLowerCase() === 'бежевый' ? 'beige' : 'gray'
                }} 
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                +{product.colors.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 