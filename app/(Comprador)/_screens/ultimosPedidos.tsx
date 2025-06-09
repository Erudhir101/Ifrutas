import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, Image,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from "expo-router";

interface ProdutoComprado {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  isDelivered: boolean; // novo campo
}

export default function UltimasCompras() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [produtos, setProdutos] = useState<ProdutoComprado[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarProdutosComprados = async () => {
    setLoading(true);

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      console.error("Usuário não autenticado", userError?.message);
      setLoading(false);
      return;
    }

    const userId = user.user.id;

    // Busca os produtos comprados e o status de entrega da purchase
    const { data, error } = await supabase
      .from('purchase_products')
      .select(`
        id,
        quantity,
        product:product_id (
          id,
          name,
          price,
          image
        ),
        purchase:purchase_id (
          id,
          buyer_id,
          is_delivered
        )
      `)
      .eq('purchase.buyer_id', userId);

    if (error) {
      console.error("Erro ao buscar compras:", error.message);
    } else {
      const produtosFormatados = data.map((item: any) => ({
        id: item.id, // id único do registro de purchase_products
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
        isDelivered: item.purchase?.is_delivered ?? false, // garante o campo
        purchaseId: item.purchase?.id, // salva o id da purchase para navegação
      }));

      setProdutos(produtosFormatados);
    }

    setLoading(false);
  };

  useEffect(() => {
    carregarProdutosComprados();
  }, []);

  const renderItem = ({ item }: { item: ProdutoComprado & { purchaseId?: string } }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
          ) : (
            <FontAwesome name="cube" size={24} color="#333" />
          )}
        </View>
        <View>
          <Text style={styles.nomeProduto}>{item.name}</Text>
          <Text style={styles.preco}>Qtd: {item.quantity}</Text>
          <Text style={styles.preco}>R$ {item.price.toFixed(2)}</Text>
        </View>
      </View>
      {item.isDelivered ? (
        <TouchableOpacity style={styles.botaoAcompanhar}>
          <Text style={styles.textoAcompanhar}>Ver detalhes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.botaoAcompanhar}
          onPress={() => router.push({ pathname: "/(Comprador)/_screens/acompanharPedido", params: { id: item.purchaseId } })}
        >
          <Text style={styles.textoAcompanhar}>Acompanhar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
        <Feather name="bell" size={24} color="#000" />
      </View>

      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#999" />
        <Text style={styles.searchPlaceholder}>Produtos</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma compra encontrada.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F7F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBox: {
    backgroundColor: '#D9D9D9',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#999',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#D9D9D9',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 34,
    height: 34,
    borderRadius: 6,
  },
  nomeProduto: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  preco: {
    color: '#666',
  },
  botaoAcompanhar: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  textoAcompanhar: {
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});
