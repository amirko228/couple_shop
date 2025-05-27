"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/90 backdrop-blur-md shadow-lg py-3" 
          : "bg-black py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">Couple</span>
            <span className="text-white">_Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              href="/catalog/tshirts" 
              className={`hover:text-pink-500 transition-colors relative ${
                isActive('/catalog/tshirts') ? 'text-pink-500' : 'text-white'
              }`}
            >
              Футболки
              {isActive('/catalog/tshirts') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"></span>
              )}
            </Link>
            <Link 
              href="/catalog/hoodies" 
              className={`hover:text-pink-500 transition-colors relative ${
                isActive('/catalog/hoodies') ? 'text-pink-500' : 'text-white'
              }`}
            >
              Худи
              {isActive('/catalog/hoodies') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"></span>
              )}
            </Link>
            <Link 
              href="/custom-print" 
              className={`hover:text-pink-500 transition-colors relative ${
                isActive('/custom-print') ? 'text-pink-500' : 'text-white'
              }`}
            >
              Свой принт
              {isActive('/custom-print') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"></span>
              )}
            </Link>
            <Link 
              href="/how-it-works" 
              className={`hover:text-pink-500 transition-colors relative ${
                isActive('/how-it-works') ? 'text-pink-500' : 'text-white'
              }`}
            >
              Как это работает
              {isActive('/how-it-works') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"></span>
              )}
            </Link>
            <Link 
              href="/contact" 
              className={`hover:text-pink-500 transition-colors relative ${
                isActive('/contact') ? 'text-pink-500' : 'text-white'
              }`}
            >
              Контакты
              {isActive('/contact') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"></span>
              )}
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {/* Search Button */}
            <button 
              onClick={toggleSearch}
              className="text-white hover:text-pink-500 transition-colors hidden md:block"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Cart */}
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-white hover:text-pink-500 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu} 
              className="md:hidden focus:outline-none text-white hover:text-pink-500 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-6 pb-4 flex flex-col space-y-5 border-t border-gray-800 mt-4 animate-fade-in">
            <Link 
              href="/catalog/tshirts" 
              className="text-white hover:text-pink-500 transition-colors flex justify-between items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Футболки
              <span className="text-gray-400 text-sm">→</span>
            </Link>
            <Link 
              href="/catalog/hoodies" 
              className="text-white hover:text-pink-500 transition-colors flex justify-between items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Худи
              <span className="text-gray-400 text-sm">→</span>
            </Link>
            <Link 
              href="/custom-print" 
              className="text-white hover:text-pink-500 transition-colors flex justify-between items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Свой принт
              <span className="text-gray-400 text-sm">→</span>
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-white hover:text-pink-500 transition-colors flex justify-between items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Как это работает
              <span className="text-gray-400 text-sm">→</span>
            </Link>
            <Link 
              href="/contact" 
              className="text-white hover:text-pink-500 transition-colors flex justify-between items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
              <span className="text-gray-400 text-sm">→</span>
            </Link>
          </nav>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Что вы ищете?"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button 
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-r-md"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <button 
              onClick={toggleSearch}
              className="text-gray-500 hover:text-pink-500 mt-2 text-sm"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 