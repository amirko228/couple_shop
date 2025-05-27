import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

export default function TshirtsPage() {
  // Фильтруем только футболки
  const tshirts = products.filter((product) => product.category === "tshirt");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Футболки</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tshirts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {tshirts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Товары не найдены</p>
        </div>
      )}
    </div>
  );
} 