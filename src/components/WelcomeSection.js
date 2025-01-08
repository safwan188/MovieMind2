import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';

const WelcomeSection = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={[
      styles.welcomeSection,
      isTablet && styles.welcomeSectionTablet
    ]}>
      <View style={styles.logoAndTitle}>
        <Image
          source={require('../../assets/new_logo.png')}
          style={[
            styles.logo,
            isTablet && styles.logoTablet
          ]}
          resizeMode="contain"
        />
        <Text style={[
          styles.appName,
          isTablet && styles.appNameTablet
        ]}>MovieMind</Text>
      </View>
      <Text style={[
        styles.welcomeSubtitle,
        isTablet && styles.welcomeSubtitleTablet
      ]}>Discover your next favorite movie</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    padding: 5,
    marginTop: 5,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500, // Default max width for phones
  },
  welcomeSectionTablet: {
    padding: 12,
    marginTop: 10,
    maxWidth: 800, // Larger max width for tablets
  },
  logoAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 5,
  },
  logoTablet: {
    width: 140,
    height: 140,
    marginRight: 10,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#60a5fa',
    fontFamily: 'System',
  },
  appNameTablet: {
    fontSize: 64,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
    textAlign: 'center',
    marginTop: 8,
  },
  welcomeSubtitleTablet: {
    fontSize: 24,
    marginTop: 12,
  },
});

export default WelcomeSection;