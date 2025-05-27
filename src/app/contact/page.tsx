"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Свяжитесь с нами
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          У вас есть вопросы или предложения? Заполните форму ниже, и мы свяжемся с вами в ближайшее время.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Контактная информация */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">Контактная информация</h2>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-pink-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Адрес</h3>
                    <p className="text-gray-600">г. Москва, ул. Примерная, 123</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-pink-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Телефон</h3>
                    <p className="text-gray-600">+7 (999) 123-45-67</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-pink-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">info@couple-shop.ru</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-pink-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Время работы</h3>
                    <p className="text-gray-600">Пн-Вс: 10:00 - 22:00</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Социальные сети</h2>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-pink-100 text-pink-500 p-3 rounded-full hover:bg-pink-200 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-pink-100 text-pink-500 p-3 rounded-full hover:bg-pink-200 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-pink-100 text-pink-500 p-3 rounded-full hover:bg-pink-200 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Напишите нам</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Сообщение отправлено!</h3>
                  <p className="text-gray-600 mb-4">
                    Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="text-pink-500 hover:text-pink-600"
                  >
                    Отправить еще одно сообщение
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-1">
                      Тема
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Выберите тему</option>
                      <option value="order">Вопрос по заказу</option>
                      <option value="product">Вопрос о товаре</option>
                      <option value="custom">Индивидуальный дизайн</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-1">
                      Сообщение <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 bg-pink-500 text-white font-medium rounded-full transition duration-300 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600"
                      }`}
                    >
                      {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Карта */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-4">
          <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Здесь будет карта с местоположением</p>
          </div>
        </div>
      </div>
    </div>
  );
} 