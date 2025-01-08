// PredictionCard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const TAB_WIDTH = width - width * 0.2;
const POSTER_WIDTH = width * 0.5;
const POSTER_HEIGHT = height * 0.3; // 210 * 1.5
const CONTENT_HEIGHT = height * 0.55;

const PLATFORMS = {
  instagram: { name: 'Instagram', logo: require('../../assets/instagram.png') },
  tiktok: { name: 'TikTok', logo: require('../../assets/tiktok.png') },
  facebook: { name: 'Facebook', logo: require('../../assets/facebook.png') },
};

// Existing handleOpenLink function
const handleOpenLink = async (url) => {
  if (!url) return;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Can't open URL:", url);
    }
  } catch (error) {
    console.error('Error opening URL:', error);
  }
};

const MovieTab = ({ prediction, isActive }) => (
  <View style={[styles.tab, !isActive && { opacity: 0.6 }]}>
    <View style={styles.contentContainer}>
      {/* Movie Poster */}
      <TouchableOpacity
        onPress={() => handleOpenLink(prediction.movieDetails?.trailer_url)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: prediction.movieDetails?.Poster }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.playButton}>
          <Text style={styles.playButtonText}>▶</Text>
        </View>
      </TouchableOpacity>

      {/* Movie Info */}
      <View style={styles.info}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {prediction.movieDetails?.Title || prediction.title}
      </Text>
      <View style={styles.yearContainer}>
        <Text style={styles.yearText}>{prediction.movieDetails?.Year}</Text>
      </View>
    </View>

        {/* Genres */}
        {prediction.movieDetails?.Genre && (
          <View style={styles.genreContainer}>
            {prediction.movieDetails.Genre.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.probability}>
          Match: {Math.round(prediction.probability * 100)}%
        </Text>

        {/* Overview Section */}
        <Text style={styles.overview} numberOfLines={4}>
          {prediction.movieDetails?.Overview}
        </Text>
      </View>
    </View>
  </View>
);

const ResultCard = ({ prediction, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / TAB_WIDTH);
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.card}>
      {/* Close Button */}
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Icon name="x" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Content */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        snapToInterval={TAB_WIDTH}
        decelerationRate="fast"
        snapToAlignment="center"
      >
        {prediction.all_predictions.map((pred, index) => (
          <MovieTab key={index} prediction={pred} isActive={index === activeIndex} />
        ))}
      </ScrollView>

      {/* Modified Header: Wrapped in TouchableOpacity to open prediction.url */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => handleOpenLink(prediction.url)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Watch clip on ${PLATFORMS[prediction.platform]?.name}`}
      >
        <Text style={styles.headerTitle}>Watch clip on</Text>
        <Image
          source={PLATFORMS[prediction.platform]?.logo}
          style={styles.platformLogo}
          resizeMode="contain"
        />
        {/* Optional: Add a right arrow icon to indicate it's clickable */}
        <Icon name="arrow-right" size={20} color="#3B82F6" style={styles.arrowIcon} />
      </TouchableOpacity>

      {/* Indicators */}
      <View style={styles.indicators}>
        {prediction.all_predictions.map((_, index) => (
          <View
            key={index}
            style={[styles.indicator, index === activeIndex && styles.activeIndicator]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151B26',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollViewContent: {
    paddingHorizontal: 12,
  },
  contentContainer: {
    height: CONTENT_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
  },
  headerTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
  },
  platformLogo: {
    height: 22,
    width: 22,
  },
  tab: {
    width: TAB_WIDTH,
    height: CONTENT_HEIGHT,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#1E293B',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '62%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -24,
    marginTop: -24,
    transform: [{ translateX: -POSTER_WIDTH / 2 }],
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  info: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 16,
    width: '100%',
  },
// Update the related styles:
titleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Changed from center to space-between
  gap: 12,
  width: '100%',
},
title: {
  fontSize: 22,
  fontWeight: '700',
  color: '#F8FAFC',
  letterSpacing: 0.3,
  flex: 1, // Added to allow text to shrink
},
yearContainer: {
  backgroundColor: 'transparent',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#475569',
  flexShrink: 0, // Prevent year from shrinking
},
  yearText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  genreTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  genreText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '500',
  },
  probability: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  overview: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
    width: '100%',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  activeIndicator: {
    backgroundColor: '#3B82F6',
    transform: [{ scale: 1.2 }],
  },
});

export default ResultCard;
