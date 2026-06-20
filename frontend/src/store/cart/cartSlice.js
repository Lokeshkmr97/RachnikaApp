import { createSlice } from "@reduxjs/toolkit";

// 🔹 Load cart from localStorage
const loadCart = () => {
  try {
    const data = localStorage.getItem("cart");
    return data
      ? JSON.parse(data)
      : { items: [], totalQuantity: 0, totalPrice: 0 };
  } catch {
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }
};

const initialState = loadCart();

const saveCart = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ADD TO CART
    addToCart: (state, action) => {
      const item = action.payload;
      const price = item.variant?.price || item.final_price || item.price;

      const existing = state.items.find(
        (i) => i.id === item.id || i.slug === item.slug
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          price,
          quantity: 1,
        });
      }

      state.totalQuantity += 1;
      state.totalPrice += price;

      saveCart(state);
    },

    // INCREASE QUANTITY (+)
    increaseQty: (state, action) => {
      const { id } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.price;
      }

      saveCart(state);
    },

    // DECREASE QUANTITY (-)
    decreaseQty: (state, action) => {
      const { id } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;

        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }

      saveCart(state);
    },

    // UPDATE QUANTITY (INPUT)
    updateQty: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item && quantity >= 1) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalQuantity += diff;
        state.totalPrice += diff * item.price;
      }

      saveCart(state);
    },

    // REMOVE ITEM
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter((i) => i.id !== id);
      }

      saveCart(state);
    },

    // CLEAR CART
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  updateQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
