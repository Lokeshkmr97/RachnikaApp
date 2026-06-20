import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoint";
import { addToCart } from "../store/cart/cartSlice";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!query) return;

    // setLoading(true);

    api
      .get(`${ENDPOINTS.PRODUCT_SEARCH}?query=${query}`)
      .then((res) => {
        setProducts(res.data.results || res.data);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">
        Search results for "{query}"
      </h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-3
          sm:gap-6
        ">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                bg-white
                border
                rounded-lg
                overflow-hidden
                hover:shadow-lg
                transition
                flex
                flex-col
              "
            >
              {/* CLICKABLE PRODUCT AREA */}
              <Link
                to={`/product/${product.slug}`}
                className="flex-1"
              >
                <img
                  src={product.featured_image}
                  alt={product.name}
                  className="
                    w-full
                    object-cover
                    h-36
                    sm:h-44
                    md:h-48
                  "
                />

                <div className="p-2 sm:p-3">
                  <h3 className="
                    text-sm
                    sm:text-base
                    font-semibold
                    line-clamp-2
                    hover:text-pink-600
                  ">
                    {product.name}
                  </h3>

                  <p className="font-bold text-sm sm:text-base mt-1">
                    ₹{product.price}
                  </p>
                </div>
              </Link>

              {/* ADD TO CART (MOBILE FRIENDLY) */}
              <div className="p-2 sm:p-3 pt-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(addToCart(product));
                  }}
                  className="
                    w-full
                    bg-black
                    text-white
                    py-2
                    rounded
                    text-sm
                    sm:text-base
                    active:scale-95
                    transition
                  "
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
