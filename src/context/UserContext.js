import React, { createContext, useState, useEffect } from "react";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    deleteUser,
        
    reauthenticateWithCredential,
    EmailAuthProvider
  } from "firebase/auth";
import { doc, setDoc, serverTimestamp, onSnapshot, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { fetchMovieDetails } from "./API"; // Import API helper function

// Create UserContext
export const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, [initializing]);

  // Sign-in function
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user); // Update the context with the signed-in user
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Sign-in error:", error);
      return { success: false, error: error.message };
    }
  };

  // Sign-up function
  const signUp = async (email, password, username) => {
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Prepare user data for Firestore
      const userData = {
        email: email,
        username: username,
        predictions: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Create a document for the user in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, userData);

      // Update the context with the new user
      setUser(user);

      return { success: true, user: user };
    } catch (error) {
      console.error("Sign-up error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Subscribe to user predictions
  const subscribeToUserPredictions = (callback, errorCallback) => {
    if (!user?.uid) {
      console.error("subscribeToUserPredictions: User ID is required.");
      if (errorCallback) errorCallback(new Error("User ID is missing."));
      return () => {};
    }

    try {
      const userDocRef = doc(db, "users", user.uid);

      const unsubscribe = onSnapshot(
        userDocRef,
        async (userDoc) => {
          if (!userDoc.exists()) {
            console.log(`User document for ID ${user.uid} does not exist.`);
            callback([]);
            return;
          }

          const userData = userDoc.data();
          const predictionIds = userData.predictions || [];

          if (predictionIds.length === 0) {
            callback([]);
            return;
          }

          // Fetch predictions in batches
          try {
            const predictionsPromises = predictionIds.map(async (predictionId) => {
              const predictionDocRef = doc(db, "predictions", predictionId);
              const predictionDoc = await getDoc(predictionDocRef);

              if (!predictionDoc.exists()) {
                console.log(`Prediction ${predictionId} not found.`);
                return null;
              }

              const predictionData = predictionDoc.data();

              // Fetch movie details for each prediction
              const predictionsWithDetails = await Promise.all(
                predictionData.all_predictions.map(async (pred) => {
                  const movieDetails = await fetchMovieDetails(pred.tconst);
                  return {
                    ...pred,
                    movieDetails,
                  };
                })
              );

              return {
                id: predictionId,
                all_predictions: predictionsWithDetails,
                prediction_time_seconds: predictionData.prediction_time_seconds,
                platform: predictionData.platform,
                url: predictionData.url,
                user_id: predictionData.user_id,
                created_at: predictionData.created_at,
                user_name: predictionData.user_name,
              };
            });

            let predictions = await Promise.all(predictionsPromises);

            // Filter out any null predictions
            predictions = predictions.filter((pred) => pred !== null);

            // Further filter to ensure at least one movie detail is present
            const validPredictions = predictions.filter((prediction) =>
              prediction.all_predictions.some((p) => p.movieDetails !== null)
            );

            // Sort predictions by created_at descending
            validPredictions.sort((a, b) => {
              const timeA = a.created_at?.toMillis() || 0;
              const timeB = b.created_at?.toMillis() || 0;
              return timeB - timeA;
            });

            // Invoke the callback with the updated predictions
            callback(validPredictions);
          } catch (fetchError) {
            console.error("Error fetching user predictions:", fetchError);
            if (errorCallback) errorCallback(fetchError);
          }
        },
        (error) => {
          console.error("Error subscribing to user predictions:", error);
          if (errorCallback) errorCallback(error);
        }
      );

      // Return the unsubscribe function to allow caller to detach the listener
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up user predictions subscription:", error);
      if (errorCallback) errorCallback(error);
      return () => {}; // Return a no-op unsubscribe function in case of error
    }
  };
// Delete account function

const deleteAccount = async () => {
  try {
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    // Delete user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userData = (await getDoc(userDocRef)).data();

    // Delete user's associated data (e.g., predictions)
    if (userData?.predictions) {
      const deletePredictions = userData.predictions.map(async (predictionId) => {
        const predictionRef = doc(db, "predictions", predictionId);
        await deleteDoc(predictionRef);
      });
      await Promise.all(deletePredictions);
    }

    // Delete the user's document in Firestore
    await deleteDoc(userDocRef);

    // Delete Firebase Auth user
    await deleteUser(user);

    // Clear local user state and log out
    setUser(null);
    logout();

    return { success: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return { success: false, error: error.message };
  }
};

  return (
    <UserContext.Provider value={{ user, initializing, signIn, signUp, logout, subscribeToUserPredictions, deleteAccount }}>
      {children}
    </UserContext.Provider>
  );
};
