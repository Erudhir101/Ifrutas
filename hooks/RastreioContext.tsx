import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, Tracking } from "../lib/supabase";

interface TrackingContextType {
  trackings: Tracking[]; // Lista de rastreios
  isLoading: boolean; // Indica se os dados estão sendo carregados
  fetchTrackings: () => Promise<void>; // Buscar todos os rastreios
  getTrackingInfo: (trackingId: string) => Promise<Tracking | null>; // Obter informações detalhadas de um rastreio
  createTracking: (
    purchaseId: string,
    deliveryPersonId: string,
    estimatedTime: string
  ) => Promise<Tracking | null>; // Criar um novo rastreio
  updateTracking: (
    trackingId: string,
    updates: Partial<Tracking>
  ) => Promise<void>; // Atualizar um rastreio
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

export function useTracking() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error(
      "useTracking deve ser usado dentro de um TrackingProvider"
    );
  }
  return context;
}

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para buscar todos os rastreios
  const fetchTrackings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tracking")
        .select(`
          *,
          purchase:purchase_id (
            *,
            store:store_id (
              id,
              name,
              endereco,
              telefone
            )
          ),
          delivery_person:delivery_person_id (
            id,
            full_name,
            telefone
          )
        `);

      if (error) throw error;

      setTrackings(data);
    } catch (error: any) {
      console.error("Erro ao buscar rastreios:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter informações detalhadas de um rastreio
  const getTrackingInfo = async (trackingId: string): Promise<Tracking | null> => {
    try {
      const { data, error } = await supabase
        .from("tracking")
        .select(`
          *,
          purchase:purchase_id (
            *,
            store:store_id (
              id,
              name,
              endereco,
              telefone
            )
          ),
          delivery_person:delivery_person_id (
            id,
            full_name,
            telefone
          )
        `)
        .eq("id", trackingId)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erro ao buscar informações de rastreio:", error.message);
      return null;
    }
  };

  // Função para criar um novo rastreio
  const createTracking = async (
    purchaseId: string,
    deliveryPersonId: string,
    estimatedTime: string
  ): Promise<Tracking | null> => {
    try {
      const { data, error } = await supabase
        .from("tracking")
        .insert({
          purchase_id: purchaseId,
          delivery_person_id: deliveryPersonId,
          estimated_time: estimatedTime,
        })
        .single();

      if (error) throw error;

      await fetchTrackings(); // Atualiza a lista de rastreios
      return data;
    } catch (error: any) {
      console.error("Erro ao criar rastreio:", error.message);
      return null;
    }
  };

  // Função para atualizar um rastreio
  const updateTracking = async (
    trackingId: string,
    updates: Partial<Tracking>
  ) => {
    try {
      const { error } = await supabase
        .from("tracking")
        .update(updates)
        .eq("id", trackingId);

      if (error) throw error;

      await fetchTrackings(); // Atualiza a lista de rastreios
    } catch (error: any) {
      console.error("Erro ao atualizar rastreio:", error.message);
    }
  };

  useEffect(() => {
    fetchTrackings();
  }, []);

  const value = {
    trackings,
    isLoading,
    fetchTrackings,
    getTrackingInfo,
    createTracking,
    updateTracking,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}