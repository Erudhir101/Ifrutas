import { Product, supabase } from "./supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { Alert } from "react-native";

export async function fetchProducts(id: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("seller", id);

    if (error) {
      throw error;
    }

    return data as Product[];
  } catch (error: any) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }
}

function imagePath(image: string) {
  return {
    storage: `${Date.now()}.${image.split(".").pop()}`,
    extension: image.split(".").pop() ?? "",
  };
}

async function addImage(imageUri: string) {
  const { storage, extension } = imagePath(imageUri);

  const fileContent = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imageArrayBuffer = decode(fileContent);

  const { error: uploadError } = await supabase.storage
    .from("productimages")
    .upload(storage, imageArrayBuffer, {
      contentType: `image/${extension}`,
      upsert: false,
    });

  if (uploadError) {
    console.error("Erro ao fazer upload da imagem:", uploadError.message);
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("productimages")
    .getPublicUrl(storage);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Não foi possível obter o URL público da imagem.");
  }
  return publicUrlData.publicUrl;
}

async function updateImage(oldImage: string, newImage: string) {
  const { storage, extension } = imagePath(newImage);

  const fileContent = await FileSystem.readAsStringAsync(newImage, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imageArrayBuffer = decode(fileContent);

  const { error: uploadError } = await supabase.storage
    .from("productimages")
    .update(oldImage, imageArrayBuffer, {
      contentType: `image/${extension}`,
    });

  if (uploadError) {
    console.error("Erro ao fazer atualização da imagem:", uploadError.message);
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("productimages")
    .getPublicUrl(storage);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Não foi possível obter o URL público da imagem.");
  }
  return publicUrlData.publicUrl;
}

export async function createProduct(
  productData: Omit<Product, "id" | "image" | "created_at" | "updated_at">,
  imageUri: string,
): Promise<Product | null> {
  try {
    const imageUrl = await addImage(imageUri);
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
      await supabase.storage.from("productimages").remove([imageUrl]);
      throw dbError;
    }

    return product as Product;
  } catch (error: any) {
    console.error("Falha ao criar produto:", error.message);
    Alert.alert("Erro", `Falha ao criar produto: ${error.message}`);
    return null;
  }
}

export async function updateProduct(
  productData: Omit<Product, "id" | "created_at" | "updated_at">,
  item: Product,
  imageUri: string,
): Promise<Product | null> {
  let imageUrl;
  try {
    if (imageUri !== item.image) {
      imageUrl = await updateImage(item.image ?? "", imageUri);
    } else {
      imageUrl = item.image;
    }
    const { data: product, error: dbError } = await supabase
      .from("products")
      .update({ ...productData, image: imageUrl })
      .eq("id", item.id)
      .select()
      .single();

    if (dbError) {
      console.error(
        "Erro ao inserir produto no banco de dados:",
        dbError.message,
      );
      await updateImage(imageUri, item.image ?? "");
      throw dbError;
    }

    return product as Product;
  } catch (error: any) {
    console.error("Falha ao criar produto:", error.message);
    Alert.alert("Erro", `Falha ao criar produto: ${error.message}`);
    return null;
  }
}

export async function deleteProduct(product: Product) {
  try {
    console.log(product.image?.split("/productimages"));
    const { error: dbError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .single();
    if (dbError) {
      console.log("error ao deletar: ", dbError.message);
    } else
      await supabase.storage
        .from("productimages")
        .remove([product.image?.split("/productimages/")[1] ?? ""]);
  } catch (error: any) {
    console.log("erro ao deletar o Produto: ", error.message);
  }
}
