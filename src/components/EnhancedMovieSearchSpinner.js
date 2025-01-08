import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';  // Import Lottie

const EnhancedMovieSearchSpinner = () => {
  const [searchText, setSearchText] = useState('Searching for your movie');
  const [dots, setDots] = useState('');

  // Dots animation for the loading text (ellipsis effect)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length >= 3 ? '' : prevDots + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Changing the search messages periodically
  useEffect(() => {
    const texts = [
      'Analyzing frames',
      'Identifying actors',
      'Matching scenes',
      'Decoding plot twists',
      'Exploring cinematic universes',
    ];
    let index = 0;
    const interval = setInterval(() => {
      setSearchText(texts[index]);
      index = (index + 1) % texts.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Lottie Animation */}
      <LottieView
        source={require('../../assets/YzxjnRqugu.json')} // Path to your Lottie JSON file
        autoPlay
        loop
        style={styles.lottie}
      />

      {/* Animated search message */}
      <Text style={styles.searchText}>{searchText}{dots}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  lottie: {
    width: 300,  // Adjust to your needs
    height: 300, // Adjust to your needs
  },
  searchText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default EnhancedMovieSearchSpinner;
