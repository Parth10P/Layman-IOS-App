import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { Message } from '../types';

export function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {!isUser ? (
        <View style={styles.botBadge}>
          <Text style={styles.botBadgeText}>L</Text>
        </View>
      ) : null}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  botBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  botBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bubbleAssistant: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleUser: {
    backgroundColor: colors.primaryDark,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  textAssistant: {
    color: colors.text,
  },
  textUser: {
    color: colors.white,
  },
});
