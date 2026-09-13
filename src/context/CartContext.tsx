import { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  unit: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY":
      if (action.payload.qty <= 0) {
        return { items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQty: (id, qty) => dispatch({ type: "UPDATE_QTY", payload: { id, qty } }),
        clear: () => dispatch({ type: "CLEAR" }),
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
