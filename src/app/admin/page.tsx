"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { Pencil, Trash2, Plus, Search, Users, ShoppingBag, Image as ImageIcon, X, CheckCircle, Download, ExternalLink, Eye } from "lucide-react";
import { Product } from "@/types";

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
function ProductForm({ product, onSubmit, onCancel }: { 
  product?: ExtendedProduct; 
  onSubmit: (product: ExtendedProduct) => void;
  onCancel: () => void;
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

// Демо данные для заказов
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
  const [activeTab, setActiveTab] = useState<"products" | "uploads" | "orders">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Локальное хранение продуктов для демонстрации функциональности
  const [localProducts, setLocalProducts] = useState<ExtendedProduct[]>([]);
  
  // Состояния для модальных окон
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({ title: "", message: "", productId: "" });
  
  // Инициализация локальных продуктов
  useEffect(() => {
    setLocalProducts(products as ExtendedProduct[]);
  }, []);
  
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
  
  // Демо данные для загруженных изображений
  const mockUploads = [
    {
      id: "1",
      imageUrl: "/images/product-placeholder.jpg",
      name: "Иван Иванов",
      email: "ivan@example.com",
      date: "22.05.2024",
      status: "pending",
    },
    {
      id: "2",
      imageUrl: "/images/product-placeholder.jpg",
      name: "Мария Петрова",
      email: "maria@example.com",
      date: "21.05.2024",
      status: "processing",
    },
    {
      id: "3",
      imageUrl: "/images/product-placeholder.jpg",
      name: "Алексей Сидоров",
      email: "alex@example.com",
      date: "20.05.2024",
      status: "completed",
    },
  ];

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
    // В реальном приложении здесь был бы API запрос
    showInfoModal("Статус обновлен", `Статус заказа ${orderId} изменен на "${newStatus}"`);
  };
  
  // Функция для загрузок
  const handleUploadAction = (action: string, uploadId: string) => {
    if (action === "скачивания") {
      showInfoModal("Скачивание", `Скачивание изображения начато. ID: ${uploadId}`);
    } else {
      showInfoModal("Уведомление", `Отправлено сообщение клиенту. ID: ${uploadId}`);
    }
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
        <div className="flex border-b">
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
              activeTab === "uploads"
                ? "border-b-2 border-pink-500 text-pink-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("uploads")}
          >
            <ImageIcon className="inline-block w-4 h-4 mr-2" />
            Загруженные изображения
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
          
          {/* Uploads Tab */}
          {activeTab === "uploads" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Загруженные пользователями изображения</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUploads.map((upload) => (
                  <div key={upload.id} className="bg-white rounded-lg shadow border overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={upload.imageUrl}
                        alt={`Загрузка от ${upload.name}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="font-medium">{upload.name}</div>
                      <div className="text-gray-500 text-sm">{upload.email}</div>
                      <div className="text-gray-500 text-sm mt-1">Загружено: {upload.date}</div>
                      <div className="mt-2">
                        <span
                          className={`py-1 px-2 rounded-full text-xs ${
                            upload.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : upload.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {upload.status === "pending"
                            ? "Ожидает обработки"
                            : upload.status === "processing"
                            ? "В обработке"
                            : "Завершено"}
                        </span>
                      </div>
                      <div className="mt-3 flex">
                        <button
                          onClick={() => handleUploadAction("скачивания", upload.id)}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm mr-2 flex items-center"
                        >
                          <Download className="w-3 h-3 mr-1" /> Скачать
                        </button>
                        <button
                          onClick={() => handleUploadAction("связи с клиентом", upload.id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" /> Связаться
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {mockUploads.length === 0 && (
                <div className="text-center py-6">
                  <p>Загруженные изображения не найдены</p>
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
                    {mockOrders.map((order) => (
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
              
              {mockOrders.length === 0 && (
                <div className="text-center py-6">
                  <p>Заказы не найдены</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Модальные окна */}
      <Modal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Добавление товара"
        onConfirm={() => {}}
        confirmText="Добавить"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      
      <Modal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактирование товара"
        onConfirm={() => {}}
        confirmText="Сохранить"
      >
        {productToEdit && (
          <ProductForm
            product={productToEdit}
            onSubmit={handleEditProduct}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
      
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
                {selectedOrder.items.map((item, index) => (
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
    </div>
  );
} 