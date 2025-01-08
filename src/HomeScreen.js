// MainScreen.js
import React, { useState, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, ActivityIndicator, useWindowDimensions, ScrollView } from "react-native";
import { UserContext } from "./context/UserContext";
import TrendingMovies from "./components/TrendingMovies";
import Header from "./navigation/Header";
import LinkScreen from "./components/LinkScreen";
import WelcomeSection from "./components/WelcomeSection";
import PredictionSection from "./components/PredictionSection";
import ResultScreen from "./components/ResultScreen";
import { fetchTrendingMovies, fetchGenres } from "./context/API";

const MainScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingMoviesLoading, setTrendingMoviesLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setTrendingMoviesLoading(true);
        const [movies, genresData] = await Promise.all([
          fetchTrendingMovies(),
          fetchGenres(),
        ]);
        setTrendingMovies(movies);
        setGenres(genresData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setTrendingMoviesLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePredictionComplete = (newPrediction) => {
    setPrediction(newPrediction);
    setShowResult(true);
  };

  const handleResultClose = () => {
    setShowResult(false);
    setPrediction(null);
  };

  const renderMainContent = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Header title="Home" icon="home" />
      
      <WelcomeSection isTablet={isTablet} />
      
      <PredictionSection
        onLinkPress={() => setIsLinkModalVisible(true)}
        isTablet={isTablet}
      />

      <View style={styles.trendingSection}>
        {trendingMoviesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <TrendingMovies 
            movies={trendingMovies} 
            genres={genres}
            isTablet={isTablet}
          />
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.content, isTablet && styles.tabletContent]}>
          {showResult ? (
            <ResultScreen
              prediction={prediction}
              onClose={handleResultClose}
              isTablet={isTablet}
            />
          ) : (
            renderMainContent()
          )}
        </View>
        <LinkScreen
          isVisible={isLinkModalVisible}
          onClose={() => setIsLinkModalVisible(false)}
          setPrediction={handlePredictionComplete}
          isTablet={isTablet}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  trendingSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  tabletContent: {
    alignItems: 'center',
    maxWidth: 800,
    alignSelf: 'center',
  }
});

export default MainScreen;