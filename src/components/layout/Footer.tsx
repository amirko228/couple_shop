import Link from "next/link";
import { Instagram, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-80"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500 opacity-5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">Couple</span>
              <span className="text-white">_Shoop</span>
            </h3>
            <p className="text-gray-400 mb-6 text-sm md:text-base max-w-md">
              Магазин стильной одежды с уникальными принтами. Создай свой дизайн или выбери из наших коллекций.
            </p>
            <div className="flex items-center">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-pink-500 flex items-center justify-center transition-all duration-300"
                aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Navigation column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              Навигация
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-pink-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/catalog/tshirts" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2 opacity-60"></span>
                  Футболки
                </Link>
              </li>
              <li>
                <Link href="/catalog/hoodies" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2 opacity-60"></span>
                  Худи
                </Link>
              </li>
              <li>
                <Link href="/custom-print" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2 opacity-60"></span>
                  Свой принт
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2 opacity-60"></span>
                  Как это работает
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Couple_Shoop. Все права защищены.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link href="/login" className="text-gray-500 hover:text-pink-400 transition-colors">
              Вход для администраторов
            </Link>
            <span className="hidden md:inline text-gray-700">|</span>
            <p className="flex items-center text-gray-500">
              Сделано с <Heart className="w-3 h-3 text-pink-500 mx-1 animate-pulse" /> в Бишкеке
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 