import { useDispatch, useSelector } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  updateQty,
  clearCart,
} from "../store/cart/cartSlice";

export default function Cart() {
  const { items, totalPrice, totalQuantity } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <p className="text-center mt-10 text-lg font-medium">
        🛒 Your cart is empty
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Your Cart ({totalQuantity} items)
      </h2>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= LEFT : CART ITEMS ================= */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 border rounded p-4"
            >
              {/* IMAGE */}
              <img
                src={item.featured_image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              {/* DETAILS */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>
                <p className="text-gray-600">
                  ₹{item.price}
                </p>

                {/* QTY CONTROLS */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() =>
                      dispatch(decreaseQty({ id: item.id }))
                    }
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateQty({
                          id: item.id,
                          quantity: Number(e.target.value),
                        })
                      )
                    }
                    className="w-16 text-center border rounded"
                  />

                  <button
                    onClick={() =>
                      dispatch(increaseQty({ id: item.id }))
                    }
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      dispatch(removeFromCart({ id: item.id }))
                    }
                    className="ml-4 text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* ITEM TOTAL */}
              <div className="font-bold text-right">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT : PAYMENT SUMMARY ================= */}
        <div className="border rounded p-5 h-fit sticky top-20">
          <h3 className="text-lg font-semibold mb-4">
            Price Details
          </h3>

          <div className="flex justify-between mb-2">
            <span>Items ({totalQuantity})</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span className="text-green-600">FREE</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Tax</span>
            <span>₹0</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>

          {/* PLACE ORDER BUTTON */}
          <button
            onClick={() => alert("Proceed to Checkout")}
            className="w-full mt-5 bg-pink-600 text-white py-3 rounded hover:bg-pink-700"
          >
            Place Order
          </button>

          <button
            onClick={() => dispatch(clearCart())}
            className="w-full mt-3 border py-2 rounded text-sm"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
