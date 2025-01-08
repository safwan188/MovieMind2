// CommunityScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  ScrollView,
  FlatList,
} from 'react-native';
import { subscribeToPredictions } from './context/API';
import Header from './navigation/Header';

const PLATFORM_CONFIG = {
  instagram: {
    name: "Instagram",
    logo: require("../assets/instagram.png"),
  },
  tiktok: {
    name: "TikTok",
    logo: require("../assets/tiktok.png"),
  },
  facebook: {
    name: "Facebook",
    logo: require("../assets/facebook.png"),
  },
};

const handleOpenLink = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Can't open URL:", url);
    }
  } catch (error) {
    console.error("Error opening URL:", error);
  }
};

const getPercentageColor = (percentage) => {
  if (percentage <= 33) return '#EF4444'; // Red
  if (percentage <= 66) return '#FBBF24'; // Yellow
  return '#22C55E'; // Green
};
const MovieCard = ({ prediction }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePrediction = prediction.all_predictions[activeIndex];
  const percentage = Math.round(activePrediction.probability * 100);
  const color = getPercentageColor(percentage);
  const genres = activePrediction.movieDetails?.Genre?.join(', ') || 'N/A';

  return (
    <View style={styles.movieContent}>
      <View style={styles.movieInnerContent}>
        {/* Poster Section */}
        <TouchableOpacity
          style={styles.posterContainer}
          onPress={() => handleOpenLink(activePrediction.movieDetails?.trailer_url)}
        >
          <Image
            source={{ uri: activePrediction.movieDetails?.Poster }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.movieInfo}>
          {/* Title */}
          <Text style={styles.movieTitle} numberOfLines={2}>
            {activePrediction.movieDetails?.Title || activePrediction.title}
          </Text>

          {/* Meta Info */}
          <View style={styles.movieMeta}>
            <Text style={styles.yearText}>{activePrediction.movieDetails?.Year}</Text>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <Text style={[styles.probabilityText, { color }]}>
              {percentage}% Match
            </Text>
          </View>

          {/* Genre */}
          <View style={styles.genreContainer}>
            <Text style={styles.genreLabel}>Genre: </Text>
            <Text style={styles.genreText}>{genres}</Text>
          </View>

          {/* User Info */}
          <View style={styles.userContainer}>
            <Text style={styles.userLabel}>Predicted by: </Text>
            <Text style={styles.userName}>{prediction.user_name}</Text>
          </View>

          {/* Platform */}
          <View style={styles.platformContainer}>
            <TouchableOpacity
              style={styles.platformButton}
              onPress={() => handleOpenLink(prediction.url)}
            >
              <Text style={{ color: '#fff', marginRight: 8 }}>Watch clip on</Text>
              <Image
                source={PLATFORM_CONFIG[prediction.platform].logo}
                style={styles.platformLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {prediction.all_predictions.map((pred, index) => {
            const predPercentage = Math.round(pred.probability * 100);
            const predColor = getPercentageColor(predPercentage);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabButton,
                  index === activeIndex && styles.activeTabButton,
                ]}
                onPress={() => setActiveIndex(index)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    index === activeIndex && styles.activeTabButtonText,
                    { color: index === activeIndex ? predColor : '#64748B' },
                  ]}
                >
                  {predPercentage}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const CommunityScreen = () => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPredictions(
      (predictionsData) => {
        setPredictions(predictionsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Subscription error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Community" icon="users" />
      <Text style={styles.subtitle}>Check other people's predictions</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={predictions}
          renderItem={({ item }) => <MovieCard prediction={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  // Core Container Styles - Unchanged
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Movie Card Container
  movieContent: {
    backgroundColor: '#151B26',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    gap: 16,
  },

  // Main Content Row
  movieInnerContent: {
    flexDirection: 'row',
    gap: 20,
    minHeight: 180,
  },

  // Poster Section
  posterContainer: {
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#334155',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: 'white',
    fontSize: 16,
  },

  // Movie Info Section
  movieInfo: {
    flex: 1,
    gap: 12,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.4,
    maxHeight: 56,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yearText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#475569',
  },
  probabilityText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Genre Section
  genreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  genreLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  genreText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  // User Section
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Platform Section
  platformContainer: {
    marginTop: 'auto',
  },
  platformButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  platformLogo: {
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.9)',
    borderRadius: 6,
  },

  // Tabs Section
  tabsWrapper: {
    marginTop: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabButton: {
    minWidth: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.9)',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabButtonText: {
    fontWeight: '700',
  },
});

export default CommunityScreen;
