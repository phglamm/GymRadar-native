import React, { useState, useEffect, useRef } from "react";
import { TouchableWithoutFeedback } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from "react-native";
// import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Tôi có thể giúp gì cho bạn ?",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Initialize SignalR connection (commented out for now)
  // useEffect(() => {
  //   const newConnection = new HubConnectionBuilder()
  //     .withUrl("YOUR_SIGNALR_HUB_URL")
  //     .withAutomaticReconnect()
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //   setConnection(newConnection);

  //   return () => {
  //     if (newConnection) {
  //       newConnection.stop();
  //     }
  //   };
  // }, []);

  // Start SignalR connection (commented out for now)
  // useEffect(() => {
  //   if (connection) {
  //     connection
  //       .start()
  //       .then(() => {
  //         console.log("SignalR Connected");
  //         setIsConnected(true);

  //         connection.on("ReceiveMessage", (user, message) => {
  //           const newMessage = {
  //             id: Date.now(),
  //             text: message,
  //             isAI: true,
  //             timestamp: new Date(),
  //           };
  //           setMessages((prev) => [...prev, newMessage]);
  //         });

  //         connection.on("ReceiveAIResponse", (response) => {
  //           const newMessage = {
  //             id: Date.now(),
  //             text: response,
  //             isAI: true,
  //             timestamp: new Date(),
  //           };
  //           setMessages((prev) => [...prev, newMessage]);
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("SignalR Connection Error:", error);
  //         Alert.alert("Connection Error", "Failed to connect to chat server");
  //       });
  //   }
  // }, [connection]);
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Tôi có thể giúp gì cho bạn ?",
        isAI: true,
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send message to SignalR hub (commented out for demo)
      // await connection.invoke("SendMessage", "User", inputText);

      // Simulate AI response for demo
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: "Tôi là PT AI, Bạn muốn tập luyện gì ?",
          isAI: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    }

    setInputText("");
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageWrapper}>
      <View
        style={[
          styles.messageContainer,
          item.isAI ? styles.aiMessage : styles.userMessage,
        ]}
      >
        {item.isAI && (
          <View style={styles.aiAvatar}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            item.isAI ? styles.aiBubble : styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.isAI ? styles.aiText : styles.userText,
            ]}
          >
            {item.text}
          </Text>
        </View>
        {!item.isAI && (
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        )}
      </View>
    </View>
  );

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Auto scroll when new messages are added
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleInputFocus = () => {
    // Scroll to bottom when input is focused to show the input area
    setTimeout(
      () => {
        scrollToBottom();
      },
      Platform.OS === "ios" ? 50 : 100
    );
  };

  const handleSendMessage = () => {
    sendMessage();
    // Keep keyboard open after sending
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.clearChatWrapper}>
          <TouchableOpacity
            onPress={handleClearChat}
            style={styles.clearChatButton}
          >
            <Text style={styles.clearChatText}>🗑️ Xóa cuộc trò chuyện </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
          ư
        >
          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss} // 👈 This line dismisses the keyboard when user scrolls
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
          />

          {/* Input Area */}
          <View
            style={[
              styles.inputContainer,
              Platform.OS === "android" &&
                keyboardHeight > 0 && {
                  marginBottom: 0,
                },
            ]}
          >
            <TouchableOpacity style={styles.attachButton}>
              <Text style={styles.attachButtonText}>📎</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Aa"
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              onFocus={handleInputFocus}
              textAlignVertical="top"
              returnKeyType="default"
              returnKeyLabel="nhập"
              enablesReturnKeyAutomatically={false}
              blurOnSubmit={false}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: inputText.trim() ? 1 : 0.5 },
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  wrapper: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  messagesContainer: {
    paddingVertical: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageWrapper: {
    marginVertical: 2,
    marginHorizontal: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "85%",
  },
  aiMessage: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  userMessage: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: 4,
  },
  avatarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: "100%",
  },
  aiBubble: {
    backgroundColor: "#EBF8FF",
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: "#EF4444",
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    color: "#1F2937",
  },
  userText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    minHeight: 60,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  attachButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    paddingTop: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  clearChatWrapper: {
    alignItems: "flex-end",
    marginVertical: 10,
  },

  clearChatButton: {
    backgroundColor: "#f87171", // red-400
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 16,
  },

  clearChatText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
