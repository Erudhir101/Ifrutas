import { useState, useEffect } from "react";
import { supabase, Product, Category } from "../lib/supabase";

export function useProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsByCategory = async (category: Category) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category);
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar produtos por categoria:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega os produtos na inicialização
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    fetchProducts,
    fetchProductsByCategory,
  };
}