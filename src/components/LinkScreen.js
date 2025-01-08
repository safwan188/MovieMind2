import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Platform,
  Keyboard,
  Clipboard,
} from "react-native";
import { BlurView } from 'expo-blur';
import Icon from "react-native-vector-icons/Feather";
import { UserContext } from "../context/UserContext"; // Import UserContext
import { predictFromLink, checkServerHealth, fetchMovieDetails } from "../context/API";

const { width, height } = Dimensions.get("window");

// Constants for error handling
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const ERROR_MESSAGES = {
  RATE_LIMIT: "Too many requests. Please try again later.",
  SERVER_ERROR: "Server error occurred. Retrying...",
  NETWORK_ERROR: "Network connection error. Please check your connection.",
  INVALID_LINK: "Invalid video link. Please check the URL and try again.",
  UNAUTHORIZED: "Please log in to continue.",
  DEFAULT: "An unexpected error occurred. Please try again.",
  SERVER_UNAVAILABLE: "The server is currently unavailable. Please try again in a minute.",
};

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const retryableStatusCodes = [500, 502, 503, 504];
  return retryableStatusCodes.includes(error?.response?.status) || error.message === 'Network Error';
};

const LinkScreen = ({
  isVisible,
  onClose,
  setIsLoading,
  setPrediction,
}) => {
  const { user } = useContext(UserContext); // Access user from UserContext
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Platforms configuration
  const platforms = [
    { id: "instagram", name: "Instagram", logo: require("../../assets/instagram.png") },
    { id: "tiktok", name: "TikTok", logo: require("../../assets/tiktok.png") },
    { id: "facebook", name: "Facebook", logo: require("../../assets/facebook.png") },
  ];

  // Cleanup effect
  useEffect(() => {
    return () => {
      setIsRetrying(false);
      setRetryCount(0);
    };
  }, []);

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getString();
      setVideoLink(text);
    } catch (error) {
      console.error('Failed to paste:', error);
      Alert.alert(
        "Paste Error",
        "Failed to paste content from clipboard."
      );
    }
  };

  const handlePlatformSelect = (platformId) => {
    setSelectedPlatform(platformId);
    setVideoLink("");
  };

  const validateInput = () => {
    if (!selectedPlatform || !videoLink) {
      Alert.alert(
        "Incomplete Information",
        "Please select a platform and enter a valid video link."
      );
      return false;
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    setRetryCount(0);
    
    const attemptPrediction = async (attempt = 0) => {
      try {
        // Check server health
        const isHealthy = await checkServerHealth();
        if (!isHealthy) {
          throw new Error('SERVER_HEALTH_CHECK_FAILED');
        }

        // Attempt prediction
        const initialPrediction = await predictFromLink(videoLink, selectedPlatform, user);
        
        // Fetch movie details for all predictions
        const predictionsWithDetails = await Promise.all(
          initialPrediction.all_predictions.map(async (prediction) => {
            try {
              const movieDetails = await fetchMovieDetails(prediction.tconst);
              return {
                ...prediction,
                movieDetails
              };
            } catch (err) {
              console.error(`Error fetching details for tconst ${prediction.tconst}:`, err);
              return {
                ...prediction,
                movieDetails: null
              };
            }
          })
        );

        // Create the final prediction object with movie details
        const finalPrediction = {
          ...initialPrediction,
          all_predictions: predictionsWithDetails
        };

        setPrediction(finalPrediction);
        onClose();
        setIsRetrying(false);
        setRetryCount(0);
        
      } catch (error) {
        console.error(`Prediction attempt ${attempt + 1} failed:`, error);

        // Handle specific error cases
        if (error.message === 'SERVER_HEALTH_CHECK_FAILED') {
          Alert.alert("Server Error", ERROR_MESSAGES.SERVER_UNAVAILABLE);
          return;
        }

        if (error.response?.status === 401) {
          Alert.alert("Authentication Error", ERROR_MESSAGES.UNAUTHORIZED);
          return;
        }

        if (error.response?.status === 429) {
          Alert.alert("Rate Limit", ERROR_MESSAGES.RATE_LIMIT);
          return;
        }

        // Handle retryable errors
        if (isRetryableError(error) && attempt < MAX_RETRIES) {
          setIsRetrying(true);
          setRetryCount(attempt + 1);
          
          Alert.alert(
            "Retrying",
            `${ERROR_MESSAGES.SERVER_ERROR}\nAttempt ${attempt + 1} of ${MAX_RETRIES}`,
            [{ 
              text: "Cancel", 
              onPress: () => {
                setIsRetrying(false);
                setIsLoading(false);
              }
            }],
            { cancelable: false }
          );

          await delay(RETRY_DELAY);
          
          if (!isRetrying) return;

          return attemptPrediction(attempt + 1);
        }

        // Handle non-retryable errors or max retries exceeded
        let errorMessage = ERROR_MESSAGES.DEFAULT;
        
        if (error.message === 'Network Error') {
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        } else if (error.response?.status === 400) {
          errorMessage = ERROR_MESSAGES.INVALID_LINK;
        }

        Alert.alert("Error", errorMessage);
      }
    };

    try {
      await attemptPrediction();
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
      setSelectedPlatform(null);
      setVideoLink("");
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <BlurView intensity={30} tint="dark" style={[StyleSheet.absoluteFill, styles.blurContainer]}>
            <View style={styles.modalWrapper}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Icon name="x" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.linkContent}>
                  <Text style={styles.sectionTitle}>Choose Platform</Text>
                  <View style={styles.platformIcons}>
                    {platforms.map((platform) => (
                      <TouchableOpacity
                        key={platform.id}
                        style={[
                          styles.platformIcon,
                          selectedPlatform === platform.id && styles.selectedPlatform,
                        ]}
                        onPress={() => handlePlatformSelect(platform.id)}
                      >
                        <Image source={platform.logo} style={styles.socialIcon} />
                        <Text style={styles.platformText}>{platform.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.sectionTitle}>Enter Video Link</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.linkInput, { flex: 1, marginBottom: 0 }]}
                      value={videoLink}
                      onChangeText={setVideoLink}
                      placeholder={`Paste your ${
                        selectedPlatform
                          ? platforms.find((p) => p.id === selectedPlatform).name
                          : "video"
                      } link here`}
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <TouchableOpacity 
                      style={styles.pasteButton}
                      onPress={handlePaste}
                    >
                      <Icon name="clipboard" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={handlePredict}
                    style={[
                      styles.predictButton,
                      (!selectedPlatform || !videoLink) && styles.disabledButton,
                    ]}
                    disabled={!selectedPlatform || !videoLink || isRetrying}
                  >
                    <Icon name="film" size={24} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>
                      {isRetrying ? `Retrying (${retryCount}/${MAX_RETRIES})` : "Predict Movie"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  overlay: {
    flex: 1,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 200,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  linkContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  platformIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  platformIcon: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  selectedPlatform: {
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
  },
  socialIcon: {
    width: 48,
    height: 48,
    marginBottom: 10,
  },
  platformText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  linkInput: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    color: '#fff',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  pasteButton: {
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(156, 163, 175, 0.5)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
});

export default LinkScreen;
