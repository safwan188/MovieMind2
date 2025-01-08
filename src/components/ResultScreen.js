import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import ResultCard from './ResultCard';

const ResultScreen = ({ prediction, onClose, }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ResultCard 
          prediction={prediction}
          onClose={handleClose}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});

export default ResultScreen;