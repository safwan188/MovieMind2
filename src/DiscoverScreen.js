import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fetchGenres, fetchMoviesByGenre } from './context/API'; // Ensure fetchTrendingMovies is exported from API
import MovieDetailModal from './components/MovieDetailModal'; // Import the modal component
import Header from './navigation/Header';
import DiscoverMovieCard from './components/DiscoverMovieCard'; // Import DiscoverMovieCard

const GenreCard = ({ genre, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[styles.genreCard, isSelected && styles.genreCardSelected]}
    onPress={() => onSelect(genre)}
  >
    <View style={styles.genreIconContainer}>
      <Icon
        name={getGenreIcon(genre.name)}
        size={20}
        color={isSelected ? '#fff' : '#93c5fd'}
      />
    </View>
    <Text style={[styles.genreText, isSelected && styles.genreTextSelected]}>
      {genre.name}
    </Text>
  </TouchableOpacity>
);

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3B82F6" />
  </View>
);

const getGenreIcon = (genreName) => {
  const iconMap = {
    Music: 'music',
    Romance: 'heart',
    Family: 'home',
    War: 'target',
    'TV Movie': 'tv',
    Adventure: 'compass',
    Fantasy: 'sun',
    Animation: 'play',
    Drama: 'heart',
    Horror: 'alert-octagon',
    Action: 'zap',
    Comedy: 'smile',
    History: 'book',
    Western: 'compass',
    Thriller: 'alert-triangle',
    Crime: 'shield',
    'Science Fiction': 'star',
    Mystery: 'search',
    Documentary: 'camera',
    default: 'film',
  };
  return iconMap[genreName] || iconMap.default;
};

const DiscoverScreen = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      loadMovies(selectedGenre.id);
    }
  }, [selectedGenre]);

  const loadGenres = async () => {
    try {
      const genresData = await fetchGenres();
      setGenres(genresData);
      if (genresData.length > 0) {
        setSelectedGenre(genresData[0]); // Automatically select the first genre
      }
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadMovies = async (genreId) => {
    setIsLoading(true);
    try {
      const moviesData = await fetchMoviesByGenre(genreId);
      console.log('Movies Data:', moviesData[0]);
      setMovies(moviesData);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoviePress = (movie) => {
    setSelectedMovie(movie);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
  };

  const renderMovieGrid = () => {
    if (isLoading) {
      return <LoadingView />;
    }

    return (
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <DiscoverMovieCard movie={item} onPress={handleMoviePress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.moviesGrid}
        columnWrapperStyle={styles.movieRow}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Discover" icon="film" />

      <View style={styles.genreScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreScroll}
        >
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              isSelected={selectedGenre?.id === genre.id}
              onSelect={setSelectedGenre}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.flex1}>{renderMovieGrid()}</View>

      {/* Render MovieDetailModal */}
      {selectedMovie && (
        <MovieDetailModal
          visible={isModalVisible}
          onClose={closeModal}
          movie={selectedMovie}
          genres={genres}
        />
      )}
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  flex1: {
    flex: 1,
  },


  genreScrollContainer: {
    height: 56,
  },
  genreScroll: {
    paddingHorizontal: 16,
  },
  genreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginVertical: 8,
  },
  genreCardSelected: {
    backgroundColor: '#3b82f6',
  },
  genreIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  genreText: {
    color: '#93c5fd',
    fontSize: 14,
    fontWeight: '500',
  },
  genreTextSelected: {
    color: '#fff',
  },
  moviesGrid: {
    padding: 16,
  },
  movieRow: {
    justifyContent: 'space-between',
  },
  movieCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
  },
  moviePoster: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: '#93c5fd',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#fbbf24',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiscoverScreen;
