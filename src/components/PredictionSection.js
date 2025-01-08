import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet } from 'react-native';

const PredictionSection = ({ onLinkPress }) => {
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width * 0.85, 500); // 500px max width or 85% of screen width

  return (
    <View style={styles.container}>
      <View style={[styles.predictSection, { width: maxWidth }]}>
        <View style={styles.predictHeader}>
          <Text style={styles.predictTitle}>Predict Now</Text>
        </View>

        <TouchableOpacity
          onPress={onLinkPress}
          style={[styles.predictButton, styles.linkButton]}
        >
          <Icon name="link" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Share Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  predictSection: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  predictHeader: {
    marginBottom: 20,
    width: '100%',
  },
  predictTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  predictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  buttonIcon: {
    marginRight: 12,
  },
  linkButton: {
    backgroundColor: '#8b5cf6',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PredictionSection;