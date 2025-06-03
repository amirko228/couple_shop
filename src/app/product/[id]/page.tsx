"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { products as initialProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Product } from "@/types";

export default function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // Обработка изображений из localStorage
  const processImages = (images: string[]): string[] => {
    return images.map(imagePath => {
      if (imagePath.startsWith("data:") || imagePath.startsWith("blob:") || imagePath.startsWith("http")) {
        // Если это Data URL, Blob URL или внешняя ссылка - используем как есть
        return imagePath;
      } else if (imagePath.startsWith("/images/uploads/")) {
        // Если это загруженное изображение - ищем в localStorage
        try {
          const imagesMap = JSON.parse(localStorage.getItem('uploadedImages') || '{}');
          if (imagesMap[imagePath]) {
            return imagesMap[imagePath];
          }
        } catch (error) {
          console.error('Ошибка при получении изображения из localStorage:', error);
        }
      }
      // По умолчанию возвращаем исходный путь
      return imagePath;
    });
  };
  
  useEffect(() => {
    // Функция для загрузки товара из localStorage или из статических данных
    const loadProduct = () => {
      try {
        // Пробуем получить товары из localStorage
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          const foundProduct = parsedProducts.find((p: Product) => p.id === id);
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Обрабатываем изображения
            if (foundProduct.images && foundProduct.images.length > 0) {
              const processedImages = processImages(foundProduct.images);
              setImageUrls(processedImages);
              setMainImage(processedImages[0]);
            }
            
            setLoading(false);
            return;
          }
        }
        
        // Если товар не найден в localStorage, ищем в исходных данных
        const foundProduct = initialProducts.find(p => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Обрабатываем изображения
          if (foundProduct.images && foundProduct.images.length > 0) {
            const processedImages = processImages(foundProduct.images);
            setImageUrls(processedImages);
            setMainImage(processedImages[0]);
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
    
    // Слушатель события изменения localStorage
    window.addEventListener("storage", loadProduct);
    
    return () => {
      window.removeEventListener("storage", loadProduct);
    };
  }, [id]);
  
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Устанавливаем начальные значения для размера и цвета после загрузки товара
  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);
  
  // Показываем загрузку, пока товар не загружен
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Загрузка...</p>
      </div>
    );
  }
  
  // Если товар не найден
  if (!product) {
    notFound();
  }
  
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
  
  // Обновляем отображение изображений в галерее
  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : product ? (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="sticky top-24">
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden border">
                <Image
                  src={mainImage || product.images[0] || "/images/product-placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {imageUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {imageUrls.map((image, index) => (
                    <button
                      key={index}
                      className={`relative aspect-square rounded border overflow-hidden ${
                        mainImage === image ? "ring-2 ring-pink-500" : ""
                      }`}
                      onClick={() => setMainImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - изображение ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 20vw, 10vw"
                      />
                    </button>
                  ))}
                </div>
              )}
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
      ) : (
        <div className="text-center py-12">Товар не найден</div>
      )}
    </div>
  );
} 