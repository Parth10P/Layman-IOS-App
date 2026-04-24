import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme';
import { ArticleCard } from '../../src/components/ArticleCard';
import { useStore } from '../../src/store/useStore';

export default function SavedScreen() {
  const router = useRouter();
  const { savedArticles } = useStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {savedArticles.length === 0 ? (
          <Text style={styles.emptyText}>You haven't saved any articles yet.</Text>
        ) : (
          savedArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              title={article.title} 
              imageUrl={article.image_url}
              onPress={() => router.push(`/article/${article.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.darkText },
  searchIcon: { fontSize: 24 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: colors.mutedText, marginTop: 50, fontSize: 16 }
});
