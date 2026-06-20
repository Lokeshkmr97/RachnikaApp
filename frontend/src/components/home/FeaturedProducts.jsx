import { useEffect, useState } from "react";
import api from "../../api/axios";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../store/cart/cartSlice";
import { ENDPOINTS } from "../../api/endpoint";
import { Link } from "react-router-dom";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  // const dispatch = useDispatch();

  useEffect(() => {
    api
      .get(ENDPOINTS.PRODUCTS)
      .then((res) => {
        // ✅ handle paginated OR normal response
        const data = res.data?.results || res.data;
        setProducts(data.slice(0, 8));
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Trending Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            {/* IMAGE + NAME */}
            <Link to={`/product/${product.slug}`}>
              <img
                src={product.featured_image}
                alt={product.name}
                className="h-40 w-full object-cover rounded"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x300?text=No+Image")
                }
              />

              <h3 className="mt-2 font-semibold hover:text-pink-600 line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* PRICE */}
            <p className="font-bold mt-1 text-gray-800">
              ₹{product.final_price || product.price}
            </p>

            {/* ADD TO CART */}
            {/* <button
              onClick={() => dispatch(addToCart(product))}
              className="mt-3 w-full bg-black text-white py-2 rounded hover:opacity-90"
            >
              Add to Cart
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
