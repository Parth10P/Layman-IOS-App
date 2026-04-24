import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme";
import { ArticleCard } from "../../src/components/ArticleCard";
import { fetchNews, Article } from "../../src/lib/api";

export default function HomeScreen() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const featured = articles.slice(0, 3);
  const picks = articles.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logo}>Layman</Text>
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Articles</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {featured.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              imageUrl={article.image_url}
              featured
              onPress={() => router.push(`/article/${article.id}`)}
            />
          ))}
        </ScrollView>

        <View style={styles.picksHeader}>
          <Text style={styles.sectionTitle}>Today's Picks</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        <View style={styles.list}>
          {picks.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              imageUrl={article.image_url}
              onPress={() => router.push(`/article/${article.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  logo: { fontSize: 28, fontWeight: "bold", color: colors.primary },
  searchIcon: { fontSize: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 15,
    color: colors.darkText,
  },
  carousel: { paddingLeft: 20, marginBottom: 30 },
  picksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  viewAll: { color: colors.primary, fontWeight: "bold" },
  list: { paddingHorizontal: 20 },
});
