import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-bold text-black">₹{product.price}</p>

      <button
        onClick={() => dispatch(addToCart(product))}
        className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
