"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { initialProducts } from "@/data/products";
import { Pencil, Trash2, Plus, Search, Users, ShoppingBag, X, CheckCircle, Eye } from "lucide-react";
import { Product, Order as OrderType } from "@/types";

// Типы для модального окна
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
}

// Компонент модального окна
function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = "Подтвердить" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="mb-6">
          {children}
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Расширение типа Product для работы с датой создания
interface ExtendedProduct extends Product {
  createdAt?: string;
}

// Форма товара
function ProductForm({ product, onSubmit, onCancel, isFullScreen = false }: { 
  product?: ExtendedProduct; 
  onSubmit: (product: ExtendedProduct) => void;
  onCancel: () => void;
  isFullScreen?: boolean;
}) {
  const [formData, setFormData] = useState<ExtendedProduct>(
    product || {
      id: String(Date.now()),
      name: "",
      description: "",
      price: 1990,
      category: "tshirt",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Белый", "Черный"],
      images: ["/images/product-placeholder.jpg"],
      inStock: true,
      featured: false,
      createdAt: new Date().toISOString(),
    }
  );

  const [imageURL, setImageURL] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    formData.images && formData.images.length > 0 ? [...formData.images] : []
  );

  // Функция для добавления изображения по URL
  const handleAddImage = () => {
    if (imageURL.trim() && !formData.images.includes(imageURL)) {
      const newImages = [...formData.images, imageURL];
      setFormData({ ...formData, images: newImages });
      setImagePreviews([...imagePreviews, imageURL]);
      setImageURL("");
    }
  };

  // Функция для удаления изображения
  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  // Функция для загрузки изображения из файла
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Создаем URL для предпросмотра изображения
      const previewUrl = URL.createObjectURL(file);
      
      // Создаем уникальное имя файла
      const timestamp = new Date().getTime();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
      const fileName = `/images/uploads/${timestamp}-${safeFileName}`;
      
      // В реальном приложении здесь был бы код для загрузки файла на сервер
      // Для демо-версии используем localStorage для хранения Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // В localStorage сохраняем путь к файлу
        const newImages = [...formData.images, fileName];
        setFormData({ ...formData, images: newImages });
        
        // Для предпросмотра используем URL.createObjectURL
        setImagePreviews([...imagePreviews, previewUrl]);
        
        // В реальном приложении сохраняем файл на сервере через FormData + fetch
        try {
          // Имитация сохранения в localStorage
          const imagesMap = JSON.parse(localStorage.getItem('uploadedImages') || '{}');
          imagesMap[fileName] = reader.result;
          localStorage.setItem('uploadedImages', JSON.stringify(imagesMap));
          console.log(`Изображение сохранено: ${fileName}`);
        } catch (error) {
          console.error('Ошибка при сохранении изображения:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === "price") {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === "inStock" || name === "featured") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sizes = e.target.value.split(",").map(size => size.trim());
    setFormData({ ...formData, sizes });
  };

  const handleColorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const colors = e.target.value.split(",").map(color => color.trim());
    setFormData({ ...formData, colors });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ExtendedProduct);
  };

  // Если режим на весь экран, применяем другую верстку
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="bg-gray-100 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {product ? "Редактирование товара" : "Добавление товара"}
            </h2>
            <button 
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="container mx-auto py-6 px-4 max-w-6xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Левая колонка - информация о товаре */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-base p-3 border"
                    placeholder="Введите название товара"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-base p-3 border"
                    placeholder="Введите подробное описание товара"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена (руб.)</label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-base p-3 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-base p-3 border"
                    >
                      <option value="tshirt">Футболка</option>
                      <option value="hoodie">Худи</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Размеры (через запятую)</label>
                  <input 
                    type="text" 
                    value={formData.sizes?.join(", ")}
                    onChange={handleSizesChange}
                    placeholder="S, M, L, XL"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-base p-3 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цвета (через запятую)</label>
                  <input 
                    type="text" 
                    value={formData.colors?.join(", ")}
                    onChange={handleColorsChange}
                    placeholder="Белый, Черный, Серый"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-base p-3 border"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="inStock"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="inStock" className="text-base font-medium text-gray-700">В наличии</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="text-base font-medium text-gray-700">Популярный товар</label>
                  </div>
                </div>
              </div>

              {/* Правая колонка - изображения */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Изображения товара</label>
                  
                  {/* Превью загруженных изображений */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-lg border overflow-hidden shadow-sm">
                          <Image
                            src={src}
                            alt={`Изображение ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Загрузка изображения по URL */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Добавить по URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        placeholder="Вставьте URL изображения"
                        className="flex-grow p-3 border rounded-md text-base"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-medium"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                  
                  {/* Загрузка изображения из файла */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <label className="cursor-pointer block">
                      <div className="mb-3">
                        <div className="mx-auto w-16 h-16 mb-3 flex items-center justify-center bg-gray-100 rounded-full">
                          <Plus className="w-8 h-8 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-700">Загрузить изображение</span>
                      </div>
                      <span className="text-sm text-gray-500">Перетащите файл или нажмите для выбора</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Поддерживаются форматы JPG, PNG и GIF</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Отмена
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 font-medium"
              >
                {product ? "Сохранить изменения" : "Добавить товар"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Стандартная форма для использования в модальных окнах
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Название</label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Описание</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Цена (руб.)</label>
        <input 
          type="number" 
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Категория</label>
        <select 
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
        >
          <option value="tshirt">Футболка</option>
          <option value="hoodie">Худи</option>
        </select>
      </div>
      
      {/* Секция загрузки изображений */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Изображения</label>
        
        {/* Превью загруженных изображений */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded border overflow-hidden">
                <Image
                  src={src}
                  alt={`Изображение ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Загрузка изображения по URL */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Вставьте URL изображения"
            className="flex-grow p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Добавить
          </button>
        </div>
        
        {/* Загрузка изображения из файла */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <label className="cursor-pointer block">
            <span className="text-sm text-gray-500">Загрузить изображение с компьютера</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">Поддерживаются форматы JPG, PNG и GIF</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Размеры (через запятую)</label>
        <input 
          type="text" 
          value={formData.sizes?.join(", ")}
          onChange={handleSizesChange}
          placeholder="S, M, L, XL"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Цвета (через запятую)</label>
        <input 
          type="text" 
          value={formData.colors?.join(", ")}
          onChange={handleColorsChange}
          placeholder="Белый, Черный, Серый"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
        />
      </div>

      <div className="flex items-center space-x-3">
        <input 
          type="checkbox" 
          id="inStock"
          name="inStock"
          checked={formData.inStock}
          onChange={handleChange}
          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
        />
        <label htmlFor="inStock" className="text-sm font-medium text-gray-700">В наличии</label>
      </div>

      <div className="flex items-center space-x-3">
        <input 
          type="checkbox" 
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">Популярный товар</label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          {product ? "Сохранить" : "Добавить"}
        </button>
      </div>
    </form>
  );
}

// Типы для модальной информации
interface ModalInfo {
  title: string;
  message: string;
  productId: string;
}

// Тип для заказов
interface Order {
  id: string;
  customerName: string;
  email: string;
  date: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

// Демо заказы
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Иван Иванов",
    email: "ivan@example.com",
    date: "25.05.2024",
    status: "pending",
    total: 4980,
    items: [
      {
        productId: "1",
        productName: "Футболка Urban Style",
        quantity: 2,
        price: 2490
      }
    ]
  },
  {
    id: "ORD-002",
    customerName: "Мария Петрова",
    email: "maria@example.com",
    date: "24.05.2024",
    status: "processing",
    total: 7680,
    items: [
      {
        productId: "3",
        productName: "Футболка Geometric Art",
        quantity: 1,
        price: 2690
      },
      {
        productId: "2",
        productName: "Худи Minimal Black",
        quantity: 1,
        price: 4990
      }
    ]
  },
  {
    id: "ORD-003",
    customerName: "Алексей Сидоров",
    email: "alex@example.com",
    date: "23.05.2024",
    status: "completed",
    total: 8990,
    items: [
      {
        productId: "6",
        productName: "Худи Couple Edition",
        quantity: 1,
        price: 8990
      }
    ]
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "settings">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Состояния для хранения данных
  const [localProducts, setLocalProducts] = useState<ExtendedProduct[]>([]);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  
  // Состояния для модальных окон
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({ title: "", message: "", productId: "" });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Инициализация данных из localStorage или из демо-данных
  useEffect(() => {
    // Проверяем наличие директории для загрузок
    try {
      // В реальном приложении здесь был бы код для проверки и создания директории
      // на сервере, но для демо-версии просто проверим наличие папки в public
      const uploadsDir = '/images/uploads/';
      console.log(`Проверка директории: ${uploadsDir}`);
      
      // Для демо-версии предположим, что директория существует
      // В реальном приложении здесь был бы код для создания директории
      // если она не существует
    } catch (error) {
      console.error("Ошибка при проверке директории uploads:", error);
    }
    
    // Загрузка продуктов
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      try {
        setLocalProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
        setLocalProducts(initialProducts as ExtendedProduct[]);
      }
    } else {
      setLocalProducts(initialProducts as ExtendedProduct[]);
    }
    
    // Загрузка заказов
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      try {
        setLocalOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
        setLocalOrders(mockOrders);
      }
    } else {
      setLocalOrders(mockOrders);
    }
  }, []);
  
  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    if (localProducts.length > 0) {
      localStorage.setItem("products", JSON.stringify(localProducts));
      
      // Вызываем событие storage для обновления других компонентов
      window.dispatchEvent(new Event('storage'));
    }
  }, [localProducts]);
  
  useEffect(() => {
    if (localOrders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(localOrders));
    }
  }, [localOrders]);
  
  // Проверка авторизации при монтировании компонента
  useEffect(() => {
    try {
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin !== "true") {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  
  // Фильтрация продуктов по поисковому запросу
  const filteredProducts = localProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Выход из админ-панели
  const handleLogout = () => {
    try {
      localStorage.removeItem("isAdmin");
      router.push("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  // Функции для модальных окон
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (productId: string) => {
    setModalInfo({ title: "Редактирование товара", message: "", productId });
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (productId: string) => {
    setModalInfo({ title: "Удаление товара", message: "Вы уверены, что хотите удалить этот товар?", productId });
    setIsDeleteModalOpen(true);
  };
  
  const showInfoModal = (title: string, message: string) => {
    setModalInfo({ title, message, productId: "" });
    setIsInfoModalOpen(true);
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };
  
  // Функции действий для товаров
  const handleAddProduct = (newProduct: ExtendedProduct) => {
    setLocalProducts(prev => [...prev, newProduct]);
    setIsAddModalOpen(false);
    showInfoModal("Успех", "Товар успешно добавлен");
  };
  
  const handleEditProduct = (updatedProduct: ExtendedProduct) => {
    setLocalProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsEditModalOpen(false);
    showInfoModal("Успех", "Товар успешно обновлен");
  };
  
  const handleDeleteProduct = () => {
    setLocalProducts(prev => 
      prev.filter(product => product.id !== modalInfo.productId)
    );
    showInfoModal("Успех", "Товар успешно удален");
  };
  
  // Функции для заказов
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // Обновляем статус заказа в локальном состоянии
    setLocalOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Если открыт модальный диалог с деталями заказа, обновляем выбранный заказ
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    showInfoModal("Статус обновлен", `Статус заказа ${orderId} изменен на "${newStatus}"`);
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "KGS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setIsPasswordModalOpen(true);
  };

  const handlePasswordChange = () => {
    // Список допустимых паролей (должен совпадать со списком в login/page.tsx)
    const validPasswords = [
      "passd030201", // Исходный пароль
      "admin123",    // Предустановленный альтернативный пароль
    ];
    
    // Проверка текущего пароля
    if (!validPasswords.includes(currentPassword) && 
        currentPassword !== localStorage.getItem("globalAdminPassword")) {
      setPasswordError("Неверный текущий пароль");
      return;
    }

    // Проверка нового пароля
    if (newPassword.length < 6) {
      setPasswordError("Новый пароль должен содержать минимум 6 символов");
      return;
    }

    // Проверка подтверждения пароля
    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    // Сохраняем новый пароль в localStorage
    try {
      // Сохраняем пароль глобально
      localStorage.setItem("globalAdminPassword", newPassword);
      
      showInfoModal("Пароль изменен", "Ваш пароль был успешно изменен. Используйте новый пароль для входа на всех устройствах.");
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении пароля:", error);
      setPasswordError("Ошибка при сохранении пароля. Попробуйте еще раз.");
    }
  };

  // Компонент Настройки
  const SettingsTab = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Настройки профиля</h2>
      
      <div className="max-w-md space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Данные для входа</h3>
          <p className="text-gray-600 mb-4">Логин: adminko</p>
          <button 
            onClick={openPasswordModal}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            Изменить пароль
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Редирект обрабатывается в useEffect
  }

  // Получение товара для редактирования
  const productToEdit = localProducts.find(product => product.id === modalInfo.productId);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
        >
          Выйти
        </button>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b flex-wrap">
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "products"
                ? "border-b-2 border-pink-500 text-pink-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("products")}
          >
            <ShoppingBag className="inline-block w-4 h-4 mr-2" />
            Товары
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-pink-500 text-pink-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            Заказы
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "settings"
                ? "border-b-2 border-pink-500 text-pink-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Настройки
          </button>
        </div>
        
        <div className="p-6">
          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                <button
                  onClick={openAddModal}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 inline-flex items-center"
                >
                  <Plus className="mr-2 w-4 h-4" /> Добавить товар
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Изображение</th>
                      <th className="py-3 px-6 text-left">Название</th>
                      <th className="py-3 px-6 text-left">Категория</th>
                      <th className="py-3 px-6 text-right">Цена</th>
                      <th className="py-3 px-6 text-center">В наличии</th>
                      <th className="py-3 px-6 text-center">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6">
                          <div className="w-12 h-12 relative overflow-hidden rounded">
                            <Image
                              src={product.images[0] || "/images/product-placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="font-medium">{product.name}</div>
                        </td>
                        <td className="py-3 px-6">
                          {product.category === "tshirt" ? "Футболка" : "Худи"}
                        </td>
                        <td className="py-3 px-6 text-right">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span
                            className={`py-1 px-3 rounded-full text-xs ${
                              product.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock ? "Да" : "Нет"}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => openEditModal(product.id)}
                              className="w-8 h-8 mr-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-100 flex items-center justify-center"
                              title="Редактировать"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(product.id)}
                              className="w-8 h-8 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-100 flex items-center justify-center"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-6">
                  <p>Товары не найдены</p>
                </div>
              )}
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Управление заказами</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">№ Заказа</th>
                      <th className="py-3 px-6 text-left">Клиент</th>
                      <th className="py-3 px-6 text-left">Дата</th>
                      <th className="py-3 px-6 text-right">Сумма</th>
                      <th className="py-3 px-6 text-center">Статус</th>
                      <th className="py-3 px-6 text-center">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {localOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6">
                          <div className="font-medium">{order.id}</div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-gray-500 text-xs">{order.email}</div>
                        </td>
                        <td className="py-3 px-6">
                          {order.date}
                        </td>
                        <td className="py-3 px-6 text-right">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span
                            className={`py-1 px-3 rounded-full text-xs ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status === "pending"
                              ? "Ожидает обработки"
                              : order.status === "processing"
                              ? "В обработке"
                              : order.status === "completed"
                              ? "Завершен"
                              : "Отменен"}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => showOrderDetails(order)}
                              className="w-8 h-8 mr-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-100 flex items-center justify-center"
                              title="Просмотреть детали"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 
                                order.status === "pending" ? "processing" : 
                                order.status === "processing" ? "completed" : "pending"
                              )}
                              className="w-8 h-8 text-gray-500 hover:text-green-500 rounded-full hover:bg-green-100 flex items-center justify-center"
                              title="Изменить статус"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {localOrders.length === 0 && (
                <div className="text-center py-6">
                  <p>Заказы не найдены</p>
                </div>
              )}
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
      
      {/* Модальные окна */}
      {isAddModalOpen && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
          isFullScreen={true}
        />
      )}
      
      {isEditModalOpen && productToEdit && (
        <ProductForm
          product={productToEdit}
          onSubmit={handleEditProduct}
          onCancel={() => setIsEditModalOpen(false)}
          isFullScreen={true}
        />
      )}
      
      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={modalInfo.title}
        onConfirm={handleDeleteProduct}
        confirmText="Удалить"
      >
        <p>{modalInfo.message}</p>
      </Modal>
      
      <Modal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={modalInfo.title}
        onConfirm={() => {}}
        confirmText="Понятно"
      >
        <p>{modalInfo.message}</p>
      </Modal>
      
      <Modal 
        isOpen={isOrderDetailsModalOpen}
        onClose={() => setIsOrderDetailsModalOpen(false)}
        title={`Детали заказа ${selectedOrder?.id}`}
        onConfirm={() => {}}
        confirmText="Закрыть"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Информация о клиенте:</h4>
              <p>{selectedOrder.customerName}</p>
              <p>{selectedOrder.email}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Товары:</h4>
              <ul className="space-y-2 mt-2">
                {selectedOrder.items.map((item: { productName: string; quantity: number; price: number }, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.productName} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Итого:</span>
              <span>{formatPrice(selectedOrder.total)}</span>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Статус:</h4>
              <div className="mt-2">
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                >
                  <option value="pending">Ожидает обработки</option>
                  <option value="processing">В обработке</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Изменение пароля"
        onConfirm={handlePasswordChange}
        confirmText="Изменить пароль"
      >
        <div className="space-y-4">
          {passwordError && (
            <div className="text-red-500 text-sm mb-4">
              {passwordError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текущий пароль
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Новый пароль
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтвердите новый пароль
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
} 