import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const DiscoverMovieCard = ({ movie, onPress }) => (
  <TouchableOpacity style={styles.movieCard} onPress={() => onPress(movie)}>
    <Image
      source={{
        uri: movie.image_path,
        headers: { 'Accept': 'image/*' },
      }}
      style={styles.moviePoster}
    />
    <View style={styles.movieInfo}>
      <Text style={styles.movieTitle} numberOfLines={1}>
        {movie.title}
      </Text>
      <Text style={styles.movieYear}>
        {new Date(movie.release_date).getFullYear()}
      </Text>
      <View style={styles.ratingContainer}>
        <Icon name="star" size={12} color="#fbbf24" />
        <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  movieCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moviePoster: {
    width: '100%',
    aspectRatio: 2/3, // This gives the movie poster the correct aspect ratio
    resizeMode: 'cover', // Changed to 'cover' to fill the space properly
  },
  movieInfo: {
    padding: 12,
    backgroundColor: '#1f2937', // Dark background for the info section
    width: '100%',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  movieYear: {
    fontSize: 12,
    color: '#93c5fd',
    marginBottom: 4,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#fbbf24',
    marginLeft: 4,
  },
});

export default DiscoverMovieCard;