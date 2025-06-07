import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Product, supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface Purchase {
  id: string;
  buyer_id: string;
  store_id: string | null;
  is_paid: boolean;
  is_delivered: boolean;
  created_at: string;
}

export interface PurchaseProduct {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
}

export type CartItem = PurchaseProduct & {
  products: Product | null;
};

interface CartContextValue {
  cart: Purchase | null;
  items: CartItem[];
  loading: boolean;
  addItem: (product: Product, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Purchase | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchActiveCart = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const { data: activeCart, error: cartError } = await supabase
        .from("purchases")
        .select("*")
        .eq("buyer_id", user.id)
        .eq("is_paid", false)
        .maybeSingle();

      if (cartError) throw cartError;
      setCart(activeCart);

      if (activeCart) {
        const { data: cartItems, error: itemsError } = await supabase
          .from("purchase_products")
          .select("*, products (*)") // <-- JOIN AQUI!
          .eq("purchase_id", activeCart.id);

        if (itemsError) throw itemsError;
        setItems(cartItems || []);
      } else {
        setItems([]); // Nenhum carrinho, nenhum item
      }
    } catch (e) {
      console.error("Erro ao buscar carrinho ativo:", e);
      setCart(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: Product, quantity: number) => {
    if (!user) return;

    let currentCart = cart;

    // Se não existir um carrinho, crie um primeiro
    if (!currentCart) {
      const { data: newCart, error } = await supabase
        .from("purchases")
        .insert({ buyer_id: user.id })
        .select()
        .single();
      if (error || !newCart) {
        console.error("Erro ao criar carrinho");
        return;
      }
      currentCart = newCart;
      setCart(newCart);
    }

    // Verifica se o item já existe no carrinho
    const existingItem = items.find((item) => item.product_id === product.id);
    if (existingItem) {
      // Se existe, apenas atualiza a quantidade
      await updateItemQuantity(
        existingItem.id,
        existingItem.quantity + quantity,
      );
    } else {
      // Se não existe, insere um novo 'purchase_product'
      const { data: newItem, error } = await supabase
        .from("purchase_products")
        .insert({
          purchase_id: currentCart?.id,
          product_id: product.id,
          quantity,
        })
        .select("*, products(*)")
        .single();

      if (error) {
        console.error("Erro ao adicionar item");
      }
      if (newItem) {
        setItems((prev) => [...prev, newItem]);
      }
    }
  };

  // ATUALIZAR a quantidade de um item
  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId); // Se a quantidade for 0 ou menos, remove o item
      return;
    }
    const { data: updatedItem, error } = await supabase
      .from("purchase_products")
      .update({ quantity: newQuantity })
      .eq("id", itemId)
      .select("*, products(*)")
      .single();

    if (error) {
      console.error("Erro ao atualizar item");
    }
    if (updatedItem) {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item)),
      );
    }
  };

  // REMOVER um item do carrinho
  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from("purchase_products")
      .delete()
      .eq("id", itemId);
    if (error) {
      console.error("Erro ao remover item");
    } else {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // LIMPAR o carrinho (útil após checkout)
  const clearCart = async () => {
    if (!cart) return;
    // Isso pode ser feito deletando os itens ou marcando o 'purchase' como pago
    // Por simplicidade, vamos apenas limpar o estado local
    setItems([]);
    setCart(null);
    // Aqui você também faria a lógica de marcar 'is_paid = true' no 'purchase'
  };

  // Busca o carrinho quando o usuário muda (login/logout)
  useEffect(() => {
    fetchActiveCart();
  }, [user]);

  // Valores calculados com useMemo para otimização
  const itemCount = useMemo(() => items.length, [items]);
  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.products?.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const value = {
    cart,
    items,
    loading,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    itemCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
