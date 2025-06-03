"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Upload, AlertCircle, Check } from "lucide-react";
import Image from "next/image";

export default function CustomPrintPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    message: "",
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Проверка типа файла (только изображения)
    if (!file.type.match('image.*')) {
      setError("Пожалуйста, загрузите изображение (JPEG, PNG, GIF)");
      return;
    }
    
    // Проверка размера файла (максимум 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      setError("Размер файла не должен превышать 5 МБ");
      return;
    }
    
    setFile(file);
    
    // Создание превью изображения
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setImagePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Валидация формы
    if (!formData.name || !formData.contact || !formData.phone || !formData.message) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    if (!file) {
      setError("Пожалуйста, загрузите изображение для печати");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Подготовка данных для отправки, включая изображение
      const dataToSend = {
        ...formData,
        imageData: imagePreview, // Добавляем изображение в формате base64
      };
      
      // Отправка данных на сервер
      const response = await fetch('/api/telegram/custom-print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка при отправке запроса');
      }
      
      // Очищаем форму и показываем сообщение об успехе
      setFormData({ name: "", contact: "", phone: "", message: "" });
      setFile(null);
      setImagePreview(null);
      setSuccess(true);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setError(error instanceof Error ? error.message : "Произошла ошибка при отправке запроса. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Индивидуальная печать
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Загрузите свое изображение, и мы напечатаем его на футболке или худи. 
          Создайте свой уникальный стиль с Couple_Shoop!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Информация о процессе */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">Как это работает</h2>
              
              <ol className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-pink-100 text-pink-500 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Загрузите изображение</h3>
                    <p className="text-gray-600 text-sm">
                      Загрузите изображение высокого качества, которое вы хотите видеть на своей одежде.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-pink-100 text-pink-500 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Заполните форму заявки</h3>
                    <p className="text-gray-600 text-sm">
                      Укажите свои контактные данные и дополнительную информацию о заказе.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-pink-100 text-pink-500 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Получите обратную связь</h3>
                    <p className="text-gray-600 text-sm">
                      Наш менеджер свяжется с вами для уточнения деталей и оплаты.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-pink-100 text-pink-500 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Получите вашу уникальную вещь</h3>
                    <p className="text-gray-600 text-sm">
                      Мы изготовим и доставим вам футболку или худи с вашим дизайном.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Требования к изображениям</h2>
              <ul className="space-y-2 text-gray-600 text-sm list-disc pl-5">
                <li>Форматы: JPEG, PNG, GIF</li>
                <li>Максимальный размер файла: 5 МБ</li>
                <li>Рекомендуемое разрешение: не менее 1500x1500 пикселей</li>
                <li>Избегайте изображений с авторскими правами</li>
              </ul>
            </div>
          </div>

          {/* Форма заявки */}
          <div className="md:col-span-3">
            {success ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Заявка отправлена!</h2>
                <p className="text-gray-600 mb-6">
                  Спасибо за ваш запрос. Мы свяжемся с вами в ближайшее время для обсуждения деталей.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Отправить заявку</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Загрузка изображения */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Загрузить изображение <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        isDragging ? "border-pink-500 bg-pink-50" : "border-gray-300 hover:border-pink-500"
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <div className="relative w-48 h-48 mx-auto overflow-hidden rounded">
                            <Image 
                              src={imagePreview} 
                              alt="Предпросмотр" 
                              layout="fill"
                              objectFit="contain"
                              className="object-contain"
                            />
                          </div>
                          <p className="mt-4 text-sm text-gray-500">
                            {file?.name} ({file && (file.size / 1024 / 1024).toFixed(2)} МБ)
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFile(null);
                            }}
                            className="mt-2 text-pink-500 hover:text-pink-600"
                          >
                            Удалить и загрузить другое
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">
                              Перетащите файл сюда или{" "}
                              <label className="relative cursor-pointer text-pink-500 hover:text-pink-600">
                                <span>выберите файл</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Контактная информация */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Имя <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">
                        Telegram/WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        required
                        placeholder="@username или номер"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Сообщение <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Опишите, что именно вы хотите видеть на футболке или худи. Укажите размер, цвет и другие пожелания."
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 bg-pink-500 text-white font-medium rounded-full transition duration-300 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-600"
                      }`}
                    >
                      {isSubmitting ? "Отправка..." : "Отправить заявку"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 