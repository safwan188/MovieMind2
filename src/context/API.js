import {  db } from '../../firebaseConfig';

import { 
  doc, 
  getDoc,
  setDoc, 
  serverTimestamp ,
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  addDoc,
  updateDoc,
  getIdToken,
  onSnapshot,
  deleteDoc,
  
} from 'firebase/firestore';

// services/movieService.js
export const subscribeToPredictions = (callback, errorCallback) => {
  try {
    const predictionsRef = collection(db, "predictions");
    const q = query(predictionsRef, orderBy("created_at", "desc"), limit(30));

    // Set up the onSnapshot listener
    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        const predictionsWithDetails = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const prediction = { id: doc.id, ...doc.data() };

            // Fetch movie details for each prediction in all_predictions
            const predictionsWithMovieDetails = await Promise.all(
              prediction.all_predictions.map(async (pred) => {
                const movieDetails = await fetchMovieDetails(pred.tconst);
                return {
                  ...pred,
                  movieDetails,
                };
              })
            );

            const predictionWithDetails = {
              id: doc.id,
              all_predictions: predictionsWithMovieDetails,
              prediction_time_seconds: prediction.prediction_time_seconds,
              platform: prediction.platform,
              url: prediction.url,
              user_id: prediction.user_id,
              created_at: prediction.created_at,
              user_name: prediction.user_name,
            };

 

            return predictionWithDetails;
          })
        );

        // Filter out predictions where none of the movies have details
        const validPredictions = predictionsWithDetails.filter((prediction) =>
          prediction.all_predictions.some((p) => p.movieDetails !== null)
        );

        // Optional: Log summary of processed predictions
        console.log("Processed predictions summary:", {
          totalPredictions: validPredictions.length,
          platforms: [...new Set(validPredictions.map((p) => p.platform))],
          samplePrediction: validPredictions[0]
            ? {
                id: validPredictions[0].id,
                platform: validPredictions[0].platform,
                topMovie: {
                  title: validPredictions[0].all_predictions[0]?.title,
                  probability: validPredictions[0].all_predictions[0]?.probability,
                  movieDetails: validPredictions[0].all_predictions[0]?.movieDetails,
                },
              }
            : null,
        });

        // Invoke the callback with the updated predictions
        callback(validPredictions);
      },
      (error) => {
        console.error("Error subscribing to predictions:", error);
        if (errorCallback) errorCallback(error);
      }
    );

    // Return the unsubscribe function to allow caller to detach the listener
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up subscription:", error);
    if (errorCallback) errorCallback(error);
    return () => {}; // Return a no-op unsubscribe function in case of error
  }
};
export const fetchTrendingMovies = async () => {
  try {
    const moviesCollection = collection(db, 'trending_movies');
    const snapshot = await getDocs(moviesCollection);
    const moviesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return moviesList;
  } catch (error) {
    console.error('Error fetching trending movies from Firebase:', error);
    throw error;
  }
};
export const fetchGenres = async () => {
  try {
    const genresCollection = collection(db, 'genres');
    const genreDocs = await getDocs(genresCollection);
    const genresData = genreDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return genresData;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const fetchMoviesByGenre = async (genreId) => {
  try {
    const moviesCollection = collection(db, 'tmdb_movies');
    const moviesQuery = query(moviesCollection, where('genre_id', '==', genreId));
    const movieDocs = await getDocs(moviesQuery);
    return movieDocs.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};


// API functions
export const fetchUserPredictions = async (userId) => {
  try {
    // Fetch user document
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log("No user document found");
      return [];
    }

    const userData = userDoc.data();
    const predictionIds = userData.predictions || [];

    // Now using all prediction IDs instead of just the last 3
    if (predictionIds.length === 0) {
      return [];
    }

    // Fetch predictions
    const predictionsPromises = predictionIds.map(async (predictionId) => {
      try {
        const predictionDocRef = doc(db, "predictions", predictionId);
        const predictionDoc = await getDoc(predictionDocRef);
        
        if (!predictionDoc.exists()) {
          console.log(`Prediction ${predictionId} not found`);
          return null;
        }

        const predictionData = predictionDoc.data();
        
        // Fetch movie details for all predictions
        const predictionsWithDetails = await Promise.all(
          predictionData.all_predictions.map(async (prediction) => {
            const movieDetails = await fetchMovieDetails(prediction.tconst);
            return {
              ...prediction,
              movieDetails
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
          created_at: predictionData.created_at
        };
      } catch (err) {
        console.error(`Error fetching prediction ${predictionId}:`, err);
        return null;
      }
    });

    // Wait for all promises and filter out any null values from failed fetches
    const predictions = (await Promise.all(predictionsPromises))
      .filter(prediction => prediction !== null)
      // Filter out predictions where no movie details could be fetched
      .filter(prediction => prediction.all_predictions.some(p => p.movieDetails !== null));

    // Sort predictions by created_at in descending order (most recent first)
    return predictions.sort((a, b) => {
      const timeA = a.created_at?.toMillis() || 0;
      const timeB = b.created_at?.toMillis() || 0;
      return timeB - timeA;
    });

  } catch (error) {
    console.error("Error fetching user predictions:", error);
    throw error;
  }
};


export const fetchMovieDetails = async (tconst) => {
  try {
    if (tconst === null) {
      return null;
    }
    const docRef = doc(db, "movies_data", tconst);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};



export const fetchPredictions = async () => {
  try {
    const predictionsRef = collection(db, "predictions");
    // Fetch the 50 most recent predictions by ordering in descending order of created_at
    const q = query(predictionsRef, orderBy("created_at", "desc"), limit(50));
    const querySnapshot = await getDocs(q);

    const predictionsWithDetails = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const prediction = { id: doc.id, ...doc.data() };

        // Fetch movie details for each prediction in all_predictions
        const predictionsWithMovieDetails = await Promise.all(
          prediction.all_predictions.map(async (pred) => {
            const movieDetails = await fetchMovieDetails(pred.tconst);
            return {
              ...pred,
              movieDetails,
            };
          })
        );

        const predictionWithDetails = {
          id: doc.id,
          all_predictions: predictionsWithMovieDetails,
          prediction_time_seconds: prediction.prediction_time_seconds,
          platform: prediction.platform,
          url: prediction.url,
          user_id: prediction.user_id,
          created_at: prediction.created_at,
          user_name: prediction.user_name,
        };

   

        return predictionWithDetails;
      })
    );

    // Filter out predictions where none of the movies have details
    const validPredictions = predictionsWithDetails
      .filter((prediction) =>
        prediction.all_predictions.some((p) => p.movieDetails !== null)
      )

 

    return validPredictions;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }
};
export const predictFromLink = async (videoLink, selectedPlatform, user) => {
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get the Firebase ID token for the user
    const idToken = await user.getIdToken();

    // Prepare JSON payload
    const payload = {
      url: videoLink,
      type: selectedPlatform,
    };
    //start timer
    const startTime = performance.now();
    // Send the POST request with the ID token in the headers
    const response = await fetch(
      "https://lychee-fruit-kh3h87av9lsw5d2k.salad.cloud/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`, // Include the token here
        },
        body: JSON.stringify(payload),
      }
    );
    //end timer
    const endTime = performance.now();
    const predictionTime = endTime - startTime;
    
    // Check if the response was successful
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        `Error: ${response.status} - ${errorResponse.message || "Prediction failed"}`
      );
    }

    // Parse the response JSON
    const result = await response.json();
    console.log(result);
    // Get user name
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userName = userDoc.data()?.username;

    // Structure the prediction data directly from the API response
    const predictionData = {
      all_predictions: result.final_top_3_combined,
      prediction_time_seconds: result.prediction_time_seconds,
      platform: selectedPlatform,
      url: result.expanded_url,
      user_id: user.uid,
      created_at: serverTimestamp(),
      user_name: userName,
    };

    // Save prediction to Firestore
    const predictionRef = collection(db, "predictions");
    const docRef = await addDoc(predictionRef, predictionData);
    const newPredictionId = docRef.id;

    // Update user's predictions array
    const userRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userRef);
    const userData = userDocSnap.data();
    const userPredictions = userData.predictions || [];
    userPredictions.push(newPredictionId);

    await updateDoc(userRef, { 
      predictions: userPredictions,
      updatedAt: serverTimestamp(),
    });

    // Return the prediction object with the new ID
    return {
      id: newPredictionId,
      ...predictionData,
    };

  } catch (error) {
    console.error("Error in predictFromLink:", error);
    throw error;
  }
};

// Function to check server health
export const checkServerHealth = async () => {
  try {
    const response = await fetch("https://lychee-fruit-kh3h87av9lsw5d2k.salad.cloud", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return true;
    } else {
      console.error(`Server health check failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("Error checking server health:", error);
    return false;
  }
};