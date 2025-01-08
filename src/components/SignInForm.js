// SignInForm.js and SignUpForm.js
import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const SignInForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  handleSignIn, 
  errorMessage, 
  styles 
}) => {
  const passwordRef = useRef();

  return (
    <>
      <View style={styles.inputContainer}>
        <Icon name="mail" size={24} color="#60a5fa" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#4b5563"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="#60a5fa" style={styles.inputIcon} />
        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#4b5563"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
        />
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity 
        style={styles.signInButton} 
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </>
  );
};

const SignUpForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword,
  username,
  setUsername,
  confirmPassword,
  setConfirmPassword,
  handleSignUp,
  errorMessage,
  styles
}) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  return (
    <>
      <View style={styles.inputContainer}>
        <Icon name="user" size={24} color="#60a5fa" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#4b5563"
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
          autoCapitalize="none"
          onSubmitEditing={() => emailRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="mail" size={24} color="#60a5fa" style={styles.inputIcon} />
        <TextInput
          ref={emailRef}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#4b5563"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="#60a5fa" style={styles.inputIcon} />
        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#4b5563"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="#60a5fa" style={styles.inputIcon} />
        <TextInput
          ref={confirmPasswordRef}
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#4b5563"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
        />
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity 
        style={styles.signInButton} 
        onPress={handleSignUp}
      >
        <Text style={styles.signInButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </>
  );
};

export { SignInForm, SignUpForm };