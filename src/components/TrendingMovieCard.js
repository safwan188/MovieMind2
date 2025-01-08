// MovieCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';

const TrendingMovieCard = ({ movie, onPress }) => (



  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View style={styles.trendingItem}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.trendingImage}
      />
      <Text style={styles.trendingTitle} numberOfLines={1}>
        {movie.title}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  trendingItem: {
    width: 140,
    marginRight: 16,
  },
  trendingImage: {
    width: 140,
    height: 210,
    borderRadius: 12,
    marginBottom: 8,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
    alignSelf: 'center',
  },
});

export default TrendingMovieCard;