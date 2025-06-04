import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const conversations = [
  {
    id: "1",
    name: "Vendedor local",
    lastMessage: "ainda temos no estoque.",
    time: "9:30",
    isOnline: true,
  },
  {
    id: "2",
    name: "Vendedor local",
    lastMessage: "esse está em promoção",
    time: "10:34",
    isOnline: false,
  },
  {
    id: "3",
    name: "Vendedor local",
    lastMessage: "Sua doença, nossa alegria",
    time: "13:39",
    isOnline: false,
  },
  {
    id: "4",
    name: "Vendedor local",
    lastMessage: "Gostaria de recebe...",
    time: "15:19",
    isOnline: false,
  },
  {
    id: "5",
    name: "Vendedor local",
    lastMessage: "temos promoções",
    time: "18:36",
    isOnline: false,
  },
];

const messages = [
  { id: "1", text: "Vai demorar muito? preciso dos meus produtos para o almoço!", time: "5 minutos atrás", sent: true },
  { id: "2", text: "Já estou a caminho.", time: "5 minutos atrás", sent: false },
];

export default function ChatComprador() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // Hook para obter as áreas seguras
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => setSelectedConversation(item)}
    >
      <View style={styles.conversationAvatar}>
        <FontAwesome name="user" size={24} color={colors.textSecondary} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.conversationDetails}>
        <Text style={[styles.conversationName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.conversationMessage, { color: colors.textSecondary }]}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={[styles.conversationTime, { color: colors.textSecondary }]}>
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sent
          ? { backgroundColor: colors.primary, alignSelf: "flex-end" }
          : { backgroundColor: colors.card, alignSelf: "flex-start" },
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sent ? { color: "#FFF" } : { color: colors.text },
        ]}
      >
        {item.text}
      </Text>
      <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {selectedConversation ? (
        // Tela de conversa individual
        <View style={[styles.chatContainer, { paddingTop: insets.top }]}>
          <View style={styles.chatHeader}>
            <TouchableOpacity
              onPress={() => setSelectedConversation(null)}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.chatName, { color: colors.text }]}>
              {selectedConversation.name}
            </Text>
            <TouchableOpacity>
              <FontAwesome name="user-circle" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
          />
          <View style={styles.inputContainer}>
            <TouchableOpacity>
              <Feather name="camera" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Rápido, por favor..."
              placeholderTextColor={colors.textSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              onPress={() => {
                if (newMessage.trim()) {
                  // Adiciona a nova mensagem (mock)
                  messages.push({
                    id: Date.now().toString(),
                    text: newMessage,
                    time: "Agora",
                    sent: true,
                  });
                  setNewMessage("");
                }
              }}
            >
              <Feather name="send" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Tela de lista de conversas
        <View style={[styles.conversationsContainer, { paddingTop: insets.top }]}>
          <Text style={[styles.title, { color: colors.text }]}>Conversas</Text>
          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.conversationsList}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conversationsContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  conversationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  conversationDetails: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  conversationMessage: {
    fontSize: 14,
    marginTop: 4,
  },
  conversationTime: {
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
});
