import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../src/theme';
import { ChatBubble } from '../../src/components/ChatBubble';
import { fetchNews, generateChatSuggestions, askLayman, Article } from '../../src/lib/api';

export default function ChatScreen() {
  const { articleId } = useLocalSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: "Hi, I'm Layman! What can I answer for you?" }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchNews().then(async (articles) => {
      const found = articles.find(a => a.id === articleId) || articles[0];
      if (found) {
        setArticle(found);
        const autoSuggestions = await generateChatSuggestions(found);
        setSuggestions(autoSuggestions);
      }
      setLoading(false);
    });
  }, [articleId]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !article) return;

    const userMsg = text.trim();
    setInputText('');
    setSuggestions([]); // hide suggestions once they chat
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsSending(true);

    const history = messages.filter(m => m.role !== 'system');
    const response = await askLayman(article, userMsg, history);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsSending(false);
  };

  if (loading || !article) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask Layman</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg.content} isUser={msg.role === 'user'} />
          ))}
          {isSending && (
            <ChatBubble message="..." isUser={false} />
          )}
        </ScrollView>

        {suggestions.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.suggestionChip}
                onPress={() => handleSend(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micButton}>
            <Text>🎤</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your question..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend(inputText)}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 24,
    color: colors.darkText,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  keyboardAvoid: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  suggestionsContainer: {
    maxHeight: 50,
    minHeight: 50,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: 'center',
  },
  suggestionText: {
    color: colors.accent,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  micButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    fontSize: 16,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: 'white',
    fontSize: 18,
  },
});
