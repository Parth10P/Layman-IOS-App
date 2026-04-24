import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

interface ArticleCardProps {
  title: string;
  imageUrl: string | null;
  onPress: () => void;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ title, imageUrl, onPress, featured = false }) => {
  if (featured) {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
        <Image 
          source={{ uri: imageUrl || 'https://via.placeholder.com/400x200' }} 
          style={styles.featuredImage} 
        />
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredTitle} numberOfLines={2}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.listCard} onPress={onPress}>
      <Image 
        source={{ uri: imageUrl || 'https://via.placeholder.com/100' }} 
        style={styles.listThumbnail} 
      />
      <View style={styles.listContent}>
        <Text style={styles.listTitle} numberOfLines={3}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    width: 300,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#eaeaea',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)', // gradient approximation
  },
  featuredTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  listThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
  },
});
