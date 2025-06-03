import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, Product, Category } from "../lib/supabase";

interface ProductContextType {
  products: Product[]; // Lista de produtos
  isLoading: boolean; // Indica se os dados estão sendo carregados
  fetchProducts: () => Promise<void>; // Buscar todos os produtos
  fetchProductsByCategory: (category: Category) => Promise<void>; // Buscar produtos por categoria
  fetchProductsByStore: (storeId: string) => Promise<void>; // Buscar produtos por loja
  createProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<void>; // Criar produto
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>; // Atualizar produto
  deleteProduct: (id: string) => Promise<void>; // Excluir produto
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct deve ser usado dentro de um ProductProvider");
  }
  return context;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para buscar todos os produtos
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("product").select("*");

      if (error) throw error;

      setProducts(data);
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar produtos por categoria
  const fetchProductsByCategory = async (category: Category) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("category", category);

      if (error) throw error;

      setProducts(data);
    } catch (error: any) {
      console.error("Erro ao buscar produtos por categoria:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar produtos por loja
  const fetchProductsByStore = async (storeId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("seller", storeId);

      if (error) throw error;

      setProducts(data);
    } catch (error: any) {
      console.error("Erro ao buscar produtos por loja:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar um novo produto
  const createProduct = async (
    product: Omit<Product, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { error } = await supabase.from("product").insert(product);

      if (error) throw error;

      await fetchProducts(); // Atualiza a lista de produtos
    } catch (error: any) {
      console.error("Erro ao criar produto:", error.message);
    }
  };

  // Função para atualizar um produto existente
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase.from("product").update(updates).eq("id", id);

      if (error) throw error;

      await fetchProducts(); // Atualiza a lista de produtos
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error.message);
    }
  };

  // Função para excluir um produto
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("product").delete().eq("id", id);

      if (error) throw error;

      await fetchProducts(); // Atualiza a lista de produtos
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    isLoading,
    fetchProducts,
    fetchProductsByCategory,
    fetchProductsByStore,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}