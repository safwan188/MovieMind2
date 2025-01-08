import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { UserContext } from "../context/UserContext"; // Import UserContext

const RecentPredictions = ({ onPredictionSelect }) => {
  const { user, subscribeToUserPredictions } = useContext(UserContext); // Access context
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      console.warn("RecentPredictions: User is not logged in.");
      setIsLoading(false);
      return;
    }

    // Subscribe to predictions using the context function
    const unsubscribe = subscribeToUserPredictions(
      (updatedPredictions) => {
        setPredictions(updatedPredictions);
        setIsLoading(false);
      },
      (error) => {
        console.error("Subscription error:", error);
        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, subscribeToUserPredictions]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "Unknown Date";
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString(); // Adjust formatting as needed
  };

  const renderPredictionCard = (prediction) => {
    const movieDetails = prediction.all_predictions[0]?.movieDetails;

    return (
      <TouchableOpacity
        key={prediction.id}
        style={styles.recentItem}
        onPress={() => onPredictionSelect(prediction)}
      >
        <Image
          source={{
            uri: movieDetails?.Poster || "https://via.placeholder.com/64x96",
          }}
          style={styles.recentImage}
        />
        <View style={styles.recentInfo}>
          <View style={styles.titleYearContainer}>
            <Text style={styles.recentTitle} numberOfLines={1}>
              {movieDetails?.Title || "Unknown Title"}
            </Text>
            {movieDetails?.Year && (
              <Text style={styles.yearText}>({movieDetails.Year})</Text>
            )}
          </View>
          <View style={styles.detailsContainer}>
            {movieDetails?.Genre && (
              <Text style={styles.genreText} numberOfLines={1}>
                {movieDetails.Genre.join(", ")}
              </Text>
            )}
            {movieDetails?.Language && (
              <Text style={styles.languageText}>
                {movieDetails.Language.toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.createdAtContainer}>
            <Text style={styles.createdAtLabel}>Predicted at:</Text>
            <Text style={styles.createdAtText}>
              {formatTimestamp(prediction.created_at)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93c5fd" />
        <Text style={styles.loadingText}>Loading predictions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.recentSection}>
      {predictions.length > 0 ? (
        predictions.map(renderPredictionCard)
      ) : (
        <Text style={styles.noPredictionsText}>No recent predictions</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recentSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  recentImage: {
    width: 64,
    height: 96,
    borderRadius: 4,
    marginRight: 16,
  },
  recentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  titleYearContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  yearText: {
    fontSize: 14,
    color: "#93c5fd",
    marginLeft: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  genreText: {
    fontSize: 12,
    color: "#93c5fd",
    flex: 1,
    marginRight: 8,
  },
  languageText: {
    fontSize: 12,
    color: "#93c5fd",
    backgroundColor: "rgba(147, 197, 253, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  createdAtContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  createdAtLabel: {
    fontSize: 12,
    color: "#fbbf24",
    marginRight: 4,
  },
  createdAtText: {
    fontSize: 12,
    color: "#93c5fd",
  },
  noPredictionsText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default RecentPredictions;
