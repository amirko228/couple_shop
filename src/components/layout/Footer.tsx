import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-pink-500">Couple</span>
              <span className="text-white">_Shoop</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Магазин стильной одежды с уникальными принтами. Создай свой дизайн или выбери из наших коллекций.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-6 h-6 hover:text-pink-500 transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-6 h-6 hover:text-pink-500 transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-6 h-6 hover:text-pink-500 transition-colors" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog/tshirts" className="text-gray-400 hover:text-pink-500 transition-colors">
                  Футболки
                </Link>
              </li>
              <li>
                <Link href="/catalog/hoodies" className="text-gray-400 hover:text-pink-500 transition-colors">
                  Худи
                </Link>
              </li>
              <li>
                <Link href="/custom-print" className="text-gray-400 hover:text-pink-500 transition-colors">
                  Свой принт
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-pink-500 transition-colors">
                  Как это работает
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-pink-500 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Адрес: г. Москва, ул. Примерная, 123</li>
              <li>Телефон: +7 (999) 123-45-67</li>
              <li>Email: info@couple-shoop.ru</li>
              <li>Время работы: Пн-Вс 10:00 - 22:00</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="mb-2">&copy; {new Date().getFullYear()} Couple_Shoop. Все права защищены.</p>
          <Link href="/login" className="text-gray-500 text-sm hover:text-pink-500 transition-colors">
            Вход для администраторов
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 