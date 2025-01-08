import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { UserContext } from './context/UserContext';
import { SignInForm, SignUpForm } from './components/SignInForm';

const SignInScreen = () => {
  const { signIn, signUp } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    Keyboard.dismiss();
    setErrorMessage('');
    const result = await signIn(email, password);
    if (!result.success) {
      setErrorMessage(result.error);
    }
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
    if (!username || !email || !password) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    setErrorMessage('');

    const result = await signUp(email, password, username);
    if (!result.success) {
      setErrorMessage(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Icon name="film" size={48} color="#60a5fa" />
              <Text style={styles.appName}>MovieMind</Text>
            </View>
            
            <Text style={styles.welcomeText}>
              {isSigningUp ? 'Create your account' : 'Welcome back!'}
            </Text>
            
            {isSigningUp ? (
              <SignUpForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                username={username}
                setUsername={setUsername}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleSignUp={handleSignUp}
                errorMessage={errorMessage}
                styles={signInStyles}
              />
            ) : (
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSignIn={handleSignIn}
                errorMessage={errorMessage}
                styles={signInStyles}
              />
            )}

            <TouchableOpacity 
              style={styles.toggleButton} 
              onPress={() => {
                setIsSigningUp(!isSigningUp);
                setErrorMessage('');
              }}
            >
              <Text style={styles.toggleButtonText}>
                {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginLeft: 12,
    fontFamily: 'System',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
    fontFamily: 'System',
  },
  toggleButton: {
    marginTop: 16,
  },
  toggleButtonText: {
    color: '#60a5fa',
    fontSize: 16,
    fontFamily: 'System',
  },
});


// Keep the full styles object for the forms
const signInStyles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 400,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'System',
  },
  signInButton: {
    backgroundColor: '#60a5fa',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 8,
  },
});

export default SignInScreen;