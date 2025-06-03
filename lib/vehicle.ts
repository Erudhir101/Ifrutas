import { supabase } from "./supabase";
import { Alert } from "react-native";

export type Vehicle = {
  id?: string;
  model: string;
  brand: string;
  plate: string;
  year: string;
  type: "carro" | "bicicleta" | "moto";
  id_deliveryman: string;
};

export async function fetchVehicles(id: string): Promise<Vehicle[]> {
  const { data, error: error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id_deliveryman", id);
  if (error) {
    console.error("Erro ao buscar veiculos:", error.message);
    return [];
  }
  return data as Vehicle[];
}

export async function createVehicle(
  productData: Omit<Vehicle, "id">,
): Promise<Vehicle | null> {
  const { data: vehicle, error: dbError } = await supabase
    .from("vehicles")
    .insert({ ...productData })
    .select()
    .single();
  if (dbError)
    Alert.alert("Erro", `Falha ao criar veiculo: ${dbError.message}`);
  return vehicle as Vehicle;
}

export async function updateVehicle(
  productData: Omit<Vehicle, "id">,
  item: Vehicle,
): Promise<Vehicle | null> {
  const { data: vehicle, error: dbError } = await supabase
    .from("vehicles")
    .update({ ...productData })
    .eq("id", item.id)
    .select()
    .single();
  if (dbError)
    Alert.alert("Erro", `Falha ao atualizar veiculo: ${dbError.message}`);
  return vehicle as Vehicle;
}

export async function deleteVehicle(vehicle: Vehicle) {
  const { error: dbError } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", vehicle.id)
    .single();
  if (dbError) console.log("error ao deletar veiculo: ", dbError.message);
}
