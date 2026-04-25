import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Screen } from '../src/components/Screen';
import { useAuth } from '../src/hooks/useAuth';
import { useAppState } from '../src/state/app-state';
import { colors } from '../src/theme';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
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
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <View style={styles.card}>
            <Text style={styles.brand}>Layman</Text>
            <Text style={styles.title}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </Text>

            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                  Login
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, mode === 'signup' && styles.tabActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                  Sign up
                </Text>
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
              keyboardType="email-address"
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

            <Pressable
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === 'login' ? 'Enter app' : 'Create account'}
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FCF6EF',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  keyboardWrap: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFCF8',
    borderRadius: 36,
    paddingHorizontal: 34,
    paddingTop: 42,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: '#F0DCCA',
    shadowColor: 'rgba(130, 83, 43, 0.08)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
    alignItems: 'center',
  },
  brand: {
    color: colors.primaryDark,
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '800',
    letterSpacing: -1.8,
    textAlign: 'center',
    marginBottom: 14,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 35,
    fontWeight: '800',
    letterSpacing: -1.4,
    textAlign: 'center',
    marginBottom: 24,
  },
  tabs: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFF5EA',
    borderRadius: 28,
    padding: 6,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(148, 92, 46, 0.08)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  tabText: {
    color: '#807166',
    fontSize: 17,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.primaryDark,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFD9C7',
    borderRadius: 26,
    paddingHorizontal: 26,
    paddingVertical: 21,
    color: colors.text,
    fontSize: 17,
    marginBottom: 22,
  },
  errorText: {
    width: '100%',
    color: '#DC3545',
    fontSize: 14,
    textAlign: 'center',
    marginTop: -6,
    marginBottom: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 26,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
});
