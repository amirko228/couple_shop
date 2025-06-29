import { Product } from "@/types";

// Initial products data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Футболка Urban Style",
    description: "Стильная футболка из 100% хлопка с уникальным принтом в урбанистическом стиле. Идеально подходит для повседневной носки.",
    price: 2490,
    category: "tshirt",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Белый", "Черный", "Серый"],
    inStock: true,
    featured: true,
    createdAt: "2024-05-01T12:00:00Z",
  },
  {
    id: "2",
    name: "Худи Minimal Black",
    description: "Теплое худи с минималистичным дизайном. Идеально подходит для прохладной погоды. Состав: 80% хлопок, 20% полиэстер.",
    price: 4990,
    category: "hoodie",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Черный"],
    inStock: true,
    featured: true,
    createdAt: "2024-05-02T12:00:00Z",
  },
  {
    id: "3",
    name: "Футболка Geometric Art",
    description: "Футболка с геометрическим принтом. Современный дизайн для тех, кто ценит индивидуальность и стиль.",
    price: 2690,
    category: "tshirt",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L"],
    colors: ["Белый", "Черный"],
    inStock: true,
    featured: true,
    createdAt: "2024-05-03T12:00:00Z",
  },
  {
    id: "4",
    name: "Худи Street Art",
    description: "Худи с яркими принтами в стиле уличного искусства. Для тех, кто не боится выделяться из толпы.",
    price: 5290,
    category: "hoodie",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Черный", "Серый"],
    inStock: true,
    featured: true,
    createdAt: "2024-05-04T12:00:00Z",
  },
  {
    id: "5",
    name: "Футболка Couple Vibes",
    description: "Специальная футболка для пар. Два дизайна, которые дополняют друг друга. Идеальный подарок для влюбленных.",
    price: 3990,
    category: "tshirt",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Белый", "Черный", "Розовый"],
    inStock: true,
    featured: false,
    createdAt: "2024-05-05T12:00:00Z",
  },
  {
    id: "6",
    name: "Худи Couple Edition",
    description: "Парные худи с уникальными принтами. Комфорт и стиль для двоих.",
    price: 8990,
    category: "hoodie",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Черный", "Белый"],
    inStock: true,
    featured: false,
    createdAt: "2024-05-06T12:00:00Z",
  },
  {
    id: "7",
    name: "Футболка Minimalist",
    description: "Минималистичная футболка с лаконичным дизайном. Подходит к любому образу.",
    price: 1990,
    category: "tshirt",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Белый", "Черный", "Бежевый"],
    inStock: true,
    featured: false,
    createdAt: "2024-05-07T12:00:00Z",
  },
  {
    id: "8",
    name: "Худи Urban Comfort",
    description: "Удобное худи для городской жизни. Стильно и практично.",
    price: 4490,
    category: "hoodie",
    images: ["/images/product-placeholder.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Серый", "Черный", "Зеленый"],
    inStock: true,
    featured: false,
    createdAt: "2024-05-08T12:00:00Z",
  },
];

// Функция для получения продуктов
const getProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (error) {
        console.error('Error parsing saved products:', error);
        localStorage.setItem('products', JSON.stringify(initialProducts));
        return initialProducts;
      }
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return initialProducts;
    }
  }
  return initialProducts;
};

// Получаем продукты
const products = getProducts();

export { products, initialProducts }; 