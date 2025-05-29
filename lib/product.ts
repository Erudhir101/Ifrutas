import { Product, supabase } from "./supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { Alert } from "react-native";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      throw error;
    }

    return data as Product[];
  } catch (error: any) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }
}

export async function createProduct(
  productData: Omit<Product, "id" | "image" | "created_at" | "updated_at">,
  imageUri: string,
): Promise<Product | null> {
  try {
    const fileExtension = imageUri.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const storagePath = `${fileName}`;

    const fileContent = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imageArrayBuffer = decode(fileContent);

    const { error: uploadError } = await supabase.storage
      .from("productimages")
      .upload(storagePath, imageArrayBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro ao fazer upload da imagem:", uploadError.message);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("productimages")
      .getPublicUrl(storagePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error("Não foi possível obter o URL público da imagem.");
    }
    const imageUrl = publicUrlData.publicUrl;

    const { data: product, error: dbError } = await supabase
      .from("products")
      .insert({ ...productData, image: imageUrl })
      .select()
      .single();

    if (dbError) {
      console.error(
        "Erro ao inserir produto no banco de dados:",
        dbError.message,
      );
      await supabase.storage.from("productimages").remove([storagePath]);
      throw dbError;
    }

    return product as Product;
  } catch (error: any) {
    console.error("Falha ao criar produto:", error.message);
    Alert.alert("Erro", `Falha ao criar produto: ${error.message}`);
    return null;
  }
}
