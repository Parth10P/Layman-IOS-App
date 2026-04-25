import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { askLayman, generateChatSuggestions } from '../../src/lib/api';
import { ChatBubble } from '../../src/components/ChatBubble';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';
import type { TabKey, Message } from '../../src/types';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ articleId?: string; from?: string }>();
  const { feedArticles } = useAppState();
  const article = feedArticles.find((entry) => entry.id === params.articleId) ?? null;
  const from = (params.from as TabKey | undefined) ?? 'home';
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(article?.suggestions || []);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  useEffect(() => {
    if (!article) return;

    const loadSuggestions = async () => {
      const newSuggestions = await generateChatSuggestions(article);
      setSuggestions(newSuggestions);
    };

    setMessages([{
      id: `assistant-${article.id}-1`,
      role: 'assistant',
      text: `Hi, I'm Layman. Ask me anything about "${article.headline}".`,
    }]);
    setChatHistory([]);
    loadSuggestions();
  }, [article?.id]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !article || isLoadingResponse) return;

    const userMessage: Message = {
      id: `${article.id}-${Date.now()}-user`,
      role: 'user',
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoadingResponse(true);

    const response = await askLayman(article, trimmed, chatHistory);

    const assistantMessage: Message = {
      id: `${article.id}-${Date.now()}-assistant`,
      role: 'assistant',
      text: response,
    };

    setMessages((current) => [...current, assistantMessage]);
    setChatHistory((current) => [...current, { role: 'user', content: trimmed }, { role: 'assistant', content: response }]);
    setIsLoadingResponse(false);
    setInput('');
  };

  if (!article) {
    return (
      <Screen>
        <View style={styles.missingState}>
          <Text style={styles.title}>Ask Layman</Text>
          <Text style={styles.missingText}>
            Chat is unavailable because the selected article is not loaded in the live feed.
          </Text>
          <Pressable
            style={styles.sendButton}
            onPress={() => router.replace(from === 'home' ? '/(tabs)' : `/(tabs)/${from}`)}
          >
            <Text style={styles.sendButtonText}>Back to feed</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={() =>
            router.replace({ pathname: '/article/[id]', params: { id: article.id, from } })
          }
        >
          <Text style={styles.iconButtonText}>{'<'}</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>Ask Layman</Text>
          <Text style={styles.subhead}>{article.headline}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              style={styles.chip}
              onPress={() => handleSend(suggestion)}
            >
              <Text style={styles.chipText}>{suggestion}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {isLoadingResponse ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primaryDark} />
            <Text style={styles.loadingText}>Layman is thinking...</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about this story"
          placeholderTextColor={colors.muted}
          style={styles.input}
          onSubmitEditing={() => handleSend(input)}
        />
        <Pressable
          style={styles.sendButton}
          onPress={() => handleSend(input)}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 14,
  },
  missingState: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  subhead: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
    maxWidth: 260,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  chipRow: {
    gap: 10,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFFDF9',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  missingText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginVertical: 16,
  },
  loadingBox: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
