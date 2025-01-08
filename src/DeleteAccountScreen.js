import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import Header from './navigation/Header';
import { UserContext } from './context/UserContext';
const DeleteAccountScreen = ({ navigation }) => {
  const { deleteAccount } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              // Add your delete account logic here
              await deleteAccount();
              // Navigate to login or initial screen after successful deletion
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again later."
              );
              console.error('Delete account error:', error);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Delete Account" icon="trash-2" />
      
      <View style={styles.content}>
        <Text style={styles.warningTitle}>Delete Your Account</Text>
        
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            Before you proceed, please note:
          </Text>
          
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • All your data will be permanently deleted
            </Text>
            <Text style={styles.bulletPoint}>
              • Your predictions and history will be removed
            </Text>
            <Text style={styles.bulletPoint}>
              • This action cannot be undone
            </Text>
            <Text style={styles.bulletPoint}>
              • You'll lose access to all your saved content
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          )}
        </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 24,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  bulletPoints: {
    gap: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteAccountScreen;