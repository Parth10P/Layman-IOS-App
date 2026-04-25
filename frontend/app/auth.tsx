import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Screen } from '../src/components/Screen';
import { useAppState } from '../src/state/app-state';
import { useAuth } from '../src/hooks/useAuth';
import { colors } from '../src/theme';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fullName, setFullName, email, setEmail, password, setPassword } = useAppState();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setAuthError(error.message);
          Alert.alert('Login failed', error.message);
        } else {
          router.replace('/(tabs)');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setAuthError(error.message);
          Alert.alert('Sign up failed', error.message);
        } else {
          // Profile is auto-created by database trigger
          Alert.alert(
            'Check your email',
            'We sent you a confirmation link. Please verify your email before logging in.',
            [{ text: 'OK', onPress: () => setMode('login') }]
          );
        }
      }
    } catch (err) {
      setAuthError('An unexpected error occurred');
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.card}>
            <Text style={styles.brand}>Layman</Text>
            <Text style={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>
            <Text style={styles.subtitle}>Business, tech & startups made simple.</Text>

            <View style={styles.tabs}>
              <Pressable style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => setMode('login')}>
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Login</Text>
              </Pressable>
              <Pressable style={[styles.tab, mode === 'signup' && styles.tabActive]} onPress={() => setMode('signup')}>
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign up</Text>
              </Pressable>
            </View>

            {mode === 'signup' ? (
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full name"
                placeholderTextColor={colors.muted}
                style={styles.input}
                editable={!isSubmitting}
              />
            ) : null}

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.muted}
              style={styles.input}
              secureTextEntry
              editable={!isSubmitting}
            />

            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

            <Pressable style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>{mode === 'login' ? 'Enter app' : 'Create account'}</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  brand: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceStrong,
    borderRadius: 18,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.primaryDark,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: '#DC3545',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
});
