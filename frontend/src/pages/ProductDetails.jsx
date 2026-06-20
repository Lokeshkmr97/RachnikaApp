import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoint";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cart/cartSlice";

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true);

    api
      .get(ENDPOINTS.PRODUCT_DETAILS(slug))
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.featured_image);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const images = [
    product.featured_image,
    ...(product.images?.map((img) => img.image) || []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT IMAGE */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {images.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumbnail"
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                  mainImage === img
                    ? "border-pink-600"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex-1">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[420px] object-cover rounded-lg shadow"
            />
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-2xl text-pink-600 font-semibold mt-2">
            ₹{product.final_price}
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => dispatch(addToCart(product))}
              className="flex-1 bg-black text-white py-3 rounded cursor-pointer"
            >
              Add to Cart
            </button>

            <button 
            className="flex-1 bg-pink-600 text-white py-3 rounded cursor-pointer"
            onClick={()=>(console.log("Hello This is Buy Now."))}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
