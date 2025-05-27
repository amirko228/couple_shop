"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { Upload, Check, X } from "lucide-react";

export default function CustomPrintPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Проверка типа файла
    if (!file.type.match('image.*')) {
      alert('Пожалуйста, загружайте только изображения.');
      return;
    }
    
    // Проверка размера файла (макс. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setUploadedImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedImage) {
      alert('Пожалуйста, загрузите изображение');
      return;
    }
    
    setIsSubmitting(true);
    
    // Здесь был бы реальный запрос к API
    // В данном примере просто имитируем задержку
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Сбросить форму
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setUploadedImage(null);
    }, 1500);
  };
  
  const handleReset = () => {
    setIsSubmitted(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Спасибо за ваш запрос!</h1>
          <p className="text-gray-600 mb-8">
            Мы получили ваше изображение и скоро с вами свяжемся для обсуждения деталей.
          </p>
          <button
            onClick={handleReset}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition duration-300"
          >
            Отправить еще один запрос
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Создай свой уникальный дизайн
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Загрузите свое изображение или дизайн, и мы нанесем его на футболку или худи.
          Расскажите нам о своей идее, и мы поможем воплотить ее в жизнь.
        </p>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Форма для контактной информации */}
              <div>
                <h2 className="text-xl font-bold mb-4">Ваши данные</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-1">
                      Имя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-1">
                      Сообщение
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Расскажите нам о вашей идее или укажите детали (размер, цвет и т.д.)"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Область для загрузки изображения */}
              <div>
                <h2 className="text-xl font-bold mb-4">Ваше изображение</h2>
                
                {!uploadedImage ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      dragActive ? "border-pink-500 bg-pink-50" : "border-gray-300 hover:border-pink-300"
                    }`}
                    onClick={triggerFileInput}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">
                      Перетащите изображение сюда или нажмите для выбора
                    </p>
                    <p className="text-gray-400 text-sm">
                      Поддерживаемые форматы: JPEG, PNG, GIF
                    </p>
                  </div>
                ) : (
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={uploadedImage}
                      alt="Загруженное изображение"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeUploadedImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-2">
                  * Максимальный размер файла: 5MB
                </p>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting || !uploadedImage}
                className={`w-full py-3 bg-pink-500 text-white font-medium rounded-full transition duration-300 ${
                  isSubmitting || !uploadedImage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-pink-600"
                }`}
              >
                {isSubmitting ? "Отправка..." : "Отправить запрос"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 