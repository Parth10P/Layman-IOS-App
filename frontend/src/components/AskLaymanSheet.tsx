import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ScrollView as ScrollViewType,
} from 'react-native';
import { askLayman, generateChatSuggestions } from '../lib/api';
import { colors } from '../theme';
import type { Article, Message } from '../types';

export function AskLaymanSheet({
  article,
  visible,
  onClose,
}: {
  article: Article;
  visible: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(article.suggestions || []);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const messagesScrollRef = useRef<ScrollViewType>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const introMessage: Message = {
      id: `assistant-${article.id}-intro`,
      role: 'assistant',
      text: `Hi, I'm Layman! What can I answer for you about "${article.headline}"?`,
    };

    setMessages([introMessage]);
    setChatHistory([]);
    setInput('');

    const loadSuggestions = async () => {
      const newSuggestions = await generateChatSuggestions(article);
      setSuggestions(newSuggestions);
    };

    loadSuggestions();
  }, [article, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd({ animated: true });
    }, 60);

    return () => clearTimeout(timer);
  }, [isLoadingResponse, messages, visible]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoadingResponse) {
      return;
    }

    const userMessage: Message = {
      id: `${article.id}-${Date.now()}-user`,
      role: 'user',
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsLoadingResponse(true);

    const response = await askLayman(article, trimmed, chatHistory);

    const assistantMessage: Message = {
      id: `${article.id}-${Date.now()}-assistant`,
      role: 'assistant',
      text: response,
    };

    setMessages((current) => [...current, assistantMessage]);
    setChatHistory((current) => [
      ...current,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: response },
    ]);
    setIsLoadingResponse(false);
  };

  const introMessage = messages[0];
  const conversationMessages = messages.slice(1);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <BlurView intensity={42} tint="light" style={StyleSheet.absoluteFill} />
        <Pressable style={styles.backdrop} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <ScrollView
              ref={messagesScrollRef}
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => messagesScrollRef.current?.scrollToEnd({ animated: true })}
            >
              {introMessage ? (
                <View
                  key={introMessage.id}
                  style={[styles.messageRow, styles.assistantRow]}
                >
                  <View style={styles.messageBadge}>
                    <Ionicons name="sparkles" size={12} color={colors.white} />
                  </View>
                  <View style={[styles.messageBubble, styles.assistantBubble]}>
                    <Text style={[styles.messageText, styles.assistantMessageText]}>
                      {introMessage.text}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.suggestionMessagesWrap}>
                {suggestions.slice(0, 3).map((suggestion) => (
                  <View key={suggestion} style={[styles.messageRow, styles.userRow]}>
                    <Pressable
                      style={[styles.messageBubble, styles.suggestionBubble]}
                      onPress={() => handleSend(suggestion)}
                    >
                      <Text style={[styles.messageText, styles.suggestionText]}>{suggestion}</Text>
                    </Pressable>
                  </View>
                ))}
              </View>

              {conversationMessages.map((message) => {
                const isUser = message.role === 'user';

                return (
                  <View
                    key={message.id}
                    style={[styles.messageRow, isUser ? styles.userRow : styles.assistantRow]}
                  >
                    {!isUser ? (
                      <View style={styles.messageBadge}>
                        <Ionicons name="sparkles" size={12} color={colors.white} />
                      </View>
                    ) : null}
                    <View
                      style={[
                        styles.messageBubble,
                        isUser ? styles.userBubble : styles.assistantBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          isUser ? styles.userMessageText : styles.assistantMessageText,
                        ]}
                      >
                        {message.text}
                      </Text>
                    </View>
                    {isUser ? (
                      <View style={styles.userBadge}>
                        <Ionicons name="person" size={14} color={colors.primary} />
                      </View>
                    ) : null}
                  </View>
                );
              })}

              {isLoadingResponse ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color={colors.primaryDark} size="small" />
                  <Text style={styles.loadingText}>Layman is thinking...</Text>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.composer}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type your question..."
                placeholderTextColor={colors.muted}
                style={styles.input}
                onSubmitEditing={() => handleSend(input)}
                returnKeyType="send"
              />
              <Pressable style={styles.micButton} accessibilityLabel="Voice input">
                <Ionicons name="mic-outline" size={20} color={colors.muted} />
              </Pressable>
              <Pressable style={styles.sendButton} onPress={() => handleSend(input)}>
                <Ionicons name="paper-plane-outline" size={18} color={colors.white} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(32, 24, 18, 0.12)',
  },
  sheetWrap: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF9F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 30 : 22,
    borderTopWidth: 1,
    borderColor: '#F0DDCC',
    minHeight: 430,
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E1D4C8',
    marginBottom: 18,
  },
  messagesScroll: {
    flexGrow: 0,
    maxHeight: 260,
  },
  messagesContent: {
    paddingBottom: 10,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  messageBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  userBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#EFDCCB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  assistantBubble: {
    backgroundColor: '#EEDFC9',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderWidth: 0,
    maxWidth: '74%',
  },
  suggestionMessagesWrap: {
    gap: 12,
    marginTop: -2,
    marginBottom: 6,
  },
  suggestionBubble: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '88%',
  },
  suggestionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  assistantMessageText: {
    color: colors.text,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  composer: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0DDCC',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 15,
    color: colors.text,
    fontSize: 15,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
