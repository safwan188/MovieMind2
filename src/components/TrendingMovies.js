// TrendingPredictions.js
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import TrendingMovieCard from './TrendingMovieCard';
import MovieDetailModal from './MovieDetailModal';

const TrendingMovies = ({ movies, genres }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMoviePress = (movie) => {
    setSelectedMovie(movie);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
  };

  return (
    <View style={styles.trendingSection}>
      <View style={styles.sectionHeader}>
        <Icon name="trending-up" size={24} color="#fbbf24" />
        <Text style={styles.sectionTitle}>Trending Movies</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
        {movies.map((movie) => (
          <TrendingMovieCard 
            key={movie.id} 
            movie={movie} 
            onPress={() => handleMoviePress(movie)}
          />
        ))}
      </ScrollView>

      {isModalVisible && selectedMovie && (
        <MovieDetailModal 
          genres={genres}
          movie={selectedMovie} 
          onClose={handleCloseModal} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trendingSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
  },
  trendingScroll: {
    marginBottom: 32,
  },
});

export default TrendingMovies;
