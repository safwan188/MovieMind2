// components/MovieDetailModal.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Modal,
  Dimensions,
  StyleSheet,
  Linking 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MovieDetailModal = ({ movie, onClose, visible, genres }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getOverviewText = () => {
    if (!movie?.overview) return "Overview not available.";
    
    if (!isExpanded && movie.overview.length > 150) {
      // Find the last space within the first 150 characters
      const lastSpace = movie.overview.substring(0, 150).lastIndexOf(' ');
      return `${movie.overview.substring(0, lastSpace)}...`;
    }
    
    return movie.overview;
  };

  const overviewText = getOverviewText();

  const handleTrailerPress = async () => {
    if (movie.trailer_url) {
      try {
        await Linking.openURL(movie.trailer_url);
      } catch (error) {
        console.error('Error opening trailer URL:', error);
      }
    }
  };

  const formatReleaseDate = (date) => {
    try {
      return date;
    } catch (error) {
      return 'Release date unavailable';
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Icon name="x" size={24} color="#fff" />
          </TouchableOpacity>

          <ScrollView style={styles.content}>
            <Image 
              source={{ 
                uri: movie.backdrop_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                  : movie.image_path 
              }} 
              style={styles.backdropImage} 
            />
            
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{movie.title}</Text>
              
              {movie.genre_ids && movie.genre_ids.length > 0 && (
                <View style={[styles.genreContainer, styles.topGenreContainer]}>
                  {movie.genre_ids.map((genreId) => {
                    const genre = genres.find(g => g.id === genreId);
                    return genre ? (
                      <View key={genreId} style={styles.genreTag}>
                        <Text style={styles.genreText}>
                          {genre.name}
                        </Text>
                      </View>
                    ) : null;
                  })}
                </View>
              )}

              <View style={styles.statsContainer}>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={20} color="#fbbf24" />
                  <Text style={styles.ratingText}>
                    {movie.vote_average.toFixed(1)}
                  </Text>
                  <Text style={styles.voteCount}>
                    ({movie.vote_count} votes)
                  </Text>
                </View>

                <View style={styles.popularityContainer}>
                  <Icon name="trending-up" size={20} color="#4ade80" />
                  <Text style={styles.popularityText}>
                    Popularity: {movie.popularity.toFixed(1)}
                  </Text>
                </View>
              </View>

              {movie.trailer_url && (
                <TouchableOpacity 
                  style={styles.trailerButton}
                  onPress={handleTrailerPress}
                >
                  <Icon name="play" size={20} color="#fff" />
                  <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.overview}>{overviewText}</Text>
              
              {movie?.overview && movie.overview.length > 150 && (
                <TouchableOpacity 
                  onPress={() => setIsExpanded(!isExpanded)}
                  style={styles.expandButton}
                >
                  <Text style={styles.expandButtonText}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.7,
    backgroundColor: '#151B26',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.9)',
  },
  content: {
    flex: 1,
  },
  backdropImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
    letterSpacing: 0.4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  voteCount: {
    color: '#94A3B8',
    marginLeft: 8,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularityText: {
    color: '#F8FAFC',
    marginLeft: 8,
  },
  releaseDate: {
    color: '#94A3B8',
    marginBottom: 16,
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.9)',
  },
  trailerButtonText: {
    color: '#F8FAFC',
    marginLeft: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  overview: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 24,
  },
  expandButton: {
    marginTop: 12,
    marginBottom: 16,
  },
  expandButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  topGenreContainer: {
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.9)',
  },
  genreText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default MovieDetailModal;