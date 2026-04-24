import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChatBubble } from '../../src/components/ChatBubble';
import { Screen } from '../../src/components/Screen';
import { articles } from '../../src/data/articles';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';
import type { TabKey } from '../../src/types';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ articleId?: string; from?: string }>();
  const article = articles.find((entry) => entry.id === params.articleId) ?? articles[0];
  const from = (params.from as TabKey | undefined) ?? 'home';
  const { chats, sendMessage } = useAppState();
  const [input, setInput] = useState('');
  const messages = chats[article.id] ?? [];

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
          {article.suggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              style={styles.chip}
              onPress={() => sendMessage(article.id, suggestion)}
            >
              <Text style={styles.chipText}>{suggestion}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about this story"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Pressable
          style={styles.sendButton}
          onPress={() => {
            sendMessage(article.id, input);
            setInput('');
          }}
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
});
