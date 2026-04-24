import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = () => {
    // Navigate back to auth screen
    router.replace('/auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.darkText },
  content: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  name: { fontSize: 24, fontWeight: 'bold', color: colors.darkText, marginBottom: 5 },
  email: { fontSize: 16, color: colors.mutedText, marginBottom: 40 },
  signOutButton: { width: '100%', padding: 16, backgroundColor: '#FFF0F0', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FFCCCC' },
  signOutText: { color: 'red', fontSize: 16, fontWeight: 'bold' }
});
