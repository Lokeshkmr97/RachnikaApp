import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import { ENDPOINTS } from "../api/endpoint";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(ENDPOINTS.PRODUCTS)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">Products</h1>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
