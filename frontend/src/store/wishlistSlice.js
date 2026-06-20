import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoint";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cart/cartSlice";
import { Heart, Share2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ProductDetails = () => {
  const { slug } = useParams(); // better SEO than id
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  useEffect(() => {
    api
      .get(`${ENDPOINTS.PRODUCTS}${slug}/`)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(res.data.featured_image);
      })
      .catch(console.error);
  }, [slug]);

  if (!product) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  const galleryImages = [
    product.featured_image,
    ...product.images.map((img) => img.image),
  ];

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      setDeliveryMsg("✅ Delivery available at your location");
    } else {
      setDeliveryMsg("❌ Please enter a valid 6-digit pincode");
    }
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `${product.name} - ₹${product.final_price}\n${url}`
      )}`,
      "_blank"
    );
  };

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{product.name} | Rachnika</title>
        <meta name="description" content={product.short_description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.featured_image} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE – IMAGES */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-3">
            {galleryImages.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 object-cover border cursor-pointer rounded ${
                  activeImage === img ? "border-black" : ""
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="relative overflow-hidden group rounded">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Wishlist */}
            <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
              <Heart className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE – DETAILS */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Category: {product.category_name}
          </p>

          {/* Price */}
          <div className="mt-4">
            {product.discount_price && (
              <p className="line-through text-gray-400">
                ₹{product.price}
              </p>
            )}
            <p className="text-2xl font-semibold">
              ₹{product.final_price}
            </p>
          </div>

          {/* Stock */}
          <p className={`mt-2 text-sm ${product.is_in_stock ? "text-green-600" : "text-red-600"}`}>
            {product.is_in_stock ? "In Stock" : "Out of Stock"}
          </p>

          {/* Offers */}
          <div className="mt-6 bg-pink-50 p-4 rounded">
            <p className="font-semibold mb-2">Available Offers</p>
            <ul className="text-sm space-y-1">
              <li>🎉 Flat 10% OFF on prepaid orders</li>
              <li>🚚 Free delivery above ₹999</li>
              <li>💳 Extra 5% OFF using cards</li>
            </ul>
          </div>

          {/* Pincode */}
          <div className="mt-6">
            <p className="font-medium">Check Delivery</p>
            <div className="flex gap-2 mt-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                className="border px-3 py-2 rounded w-40"
              />
              <button
                onClick={handlePincodeCheck}
                className="bg-black text-white px-4 rounded"
              >
                Check
              </button>
            </div>
            {deliveryMsg && (
              <p className="text-sm mt-1">{deliveryMsg}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              disabled={!product.is_in_stock}
              onClick={() => dispatch(addToCart(product))}
              className="flex-1 bg-black text-white py-3 rounded disabled:opacity-50"
            >
              Add to Cart
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="border px-4 rounded"
            >
              <Share2 />
            </button>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Product Description</h3>
            <p className="text-sm text-gray-600">
              {product.description}
            </p>
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Customer Reviews</h3>
            <p className="text-sm text-gray-500">
              ⭐⭐⭐⭐☆ (4.3 based on 89 reviews)
            </p>
          </div>
        </div>
      </div>

      {/* STICKY BUY BUTTON – MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden">
        <button
          onClick={() => dispatch(addToCart(product))}
          className="w-full bg-black text-white py-3 rounded"
        >
          Add to Cart
        </button>
      </div>
    </>
  );
};

export default ProductDetails;
