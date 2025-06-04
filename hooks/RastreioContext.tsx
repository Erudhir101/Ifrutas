import { supabase, Tracking } from "../lib/supabase";

let globalState: {
  trackings: Tracking[];
  isLoading: boolean;
  fetchTrackings: () => Promise<void>;
  getTrackingInfo: (trackingId: string) => Promise<Tracking | null>;
  createTracking: (
    purchaseId: string,
    deliveryPersonId: string,
    estimatedTime: string
  ) => Promise<Tracking | null>;
  updateTracking: (
    trackingId: string,
    updates: Partial<Tracking>
  ) => Promise<void>;
} | null = null;

export function useTracking() {
  if (!globalState) {
    const trackings: Tracking[] = [];
    let isLoading = true;

    // Função para buscar todos os rastreios
    const fetchTrackings = async () => {
      isLoading = true;
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

        trackings.splice(0, trackings.length, ...data);
      } catch (error: any) {
        console.error("Erro ao buscar rastreios:", error.message);
      } finally {
        isLoading = false;
      }
    };

    // Função para obter informações detalhadas de um rastreio
    const getTrackingInfo = async (
      trackingId: string
    ): Promise<Tracking | null> => {
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

    globalState = {
      trackings,
      isLoading,
      fetchTrackings,
      getTrackingInfo,
      createTracking,
      updateTracking,
    };

    // Carrega os rastreios na inicialização
    fetchTrackings();
  }

  return globalState;
}