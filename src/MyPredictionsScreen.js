import React, { useState, useContext } from 'react';
import { 
  View, 
  SafeAreaView, 
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { UserContext } from './context/UserContext'; // Import UserContext
import RecentPredictions from './components/RecentPredictions';
import ResultScreen from './components/ResultScreen';
import Header from './navigation/Header';

const MyPredictionsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Access user from UserContext
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const handlePredictionSelect = (prediction) => {
    setSelectedPrediction(prediction);
  };

  const handleCloseResult = () => {
    setSelectedPrediction(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Predictions" icon="film" />
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={styles.content}>
        <View style={[styles.recentPredictions, selectedPrediction && styles.hidden]}>
          {user?.uid && (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <RecentPredictions
                userId={user.uid}
                onPredictionSelect={handlePredictionSelect}
              />
            </ScrollView>
          )}
        </View>
        
        {selectedPrediction && (
          <View style={styles.resultScreen}>
            <ResultScreen
              prediction={selectedPrediction}
              onClose={handleCloseResult}
              similarContent={[]} // Pass empty array or fetch similar content if needed
            />
          </View>
        )}
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
  },
  recentPredictions: {
    flex: 1,
  },
  hidden: {
    display: 'none', // Hide the component but keep it mounted
  },
  resultScreen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
});

export default MyPredictionsScreen;
