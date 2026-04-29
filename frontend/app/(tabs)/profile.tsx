import { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { Screen } from '../../src/components/Screen';
import { useAuth } from '../../src/hooks/useAuth';
import { useProfile } from '../../src/hooks/useProfile';
import { useSavedArticles } from '../../src/hooks/useSavedArticles';
import { colors } from '../../src/theme';

export default function ProfileTab() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { profile, profileLoading } = useProfile();
  const { savedArticles, loading: articlesLoading, refreshSavedArticles } = useSavedArticles();

  useFocusEffect(
    useCallback(() => {
      refreshSavedArticles();
    }, [refreshSavedArticles])
  );

  const handleSignOut = async () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  if (profileLoading || articlesLoading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
        <BottomTabBar activeTab="profile" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.root}>
        <Text style={styles.brand}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.white} />
          </View>
          <Text style={styles.name}>{profile?.full_name || user?.email || 'User'}</Text>
          <Text style={styles.email}>{profile?.email || user?.email}</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Saved stories</Text>
            <Text style={styles.settingValue}>{savedArticles.length}</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Preferred mode</Text>
            <Text style={styles.settingValue}>Simple explainers</Text>
          </View>
          <View style={[styles.settingRow, styles.lastRow]}>
            <Text style={styles.settingLabel}>Reading style</Text>
            <Text style={styles.settingValue}>Short cards</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </View>
      <BottomTabBar activeTab="profile" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.muted,
    marginTop: 16,
    fontSize: 14,
  },
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 120,
  },
  brand: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1.1,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  email: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  settingValue: {
    color: colors.muted,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
