/**
 * Firebase Service for Smart Grocery & Budget Safety Tracker
 * Cloud Firestore Integration with Offline Resilience & Realtime Sync
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// User's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLPHFaIwbXMzO8Ow6O5nZQFwDZcS4IWD0",
  authDomain: "groceryapp-cb4b9.firebaseapp.com",
  projectId: "groceryapp-cb4b9",
  storageBucket: "groceryapp-cb4b9.firebasestorage.app",
  messagingSenderId: "383618912955",
  appId: "1:383618912955:web:e941662e7ab27c4bb94f9e"
};

// Initialize Firebase App & Firestore
let app = null;
let db = null;
let isInitialized = false;
let saveDebounceTimer = null;
let onRemoteUpdateCallback = null;

const COLLECTION_NAME = "smart_grocery";
const DOC_ID = "trolley_session";

function updateCloudIndicator(status, text) {
  const badge = document.getElementById('cloudStatusBadge');
  const txt = document.getElementById('cloudStatusText');
  if (!badge || !txt) return;

  badge.className = `cloud-status-badge ${status}`;
  txt.textContent = text;
}

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isInitialized = true;
  console.log("[Firebase] Initialized successfully with project:", firebaseConfig.projectId);
  updateCloudIndicator('syncing', 'CLOUD...');
} catch (err) {
  console.warn("[Firebase] Initialization failed:", err);
  updateCloudIndicator('offline', 'OFFLINE');
}

// Global FirebaseService Interface
window.FirebaseService = {
  isReady: isInitialized,

  /**
   * Initialize real-time synchronization with Firestore
   * @param {Function} onDataReceived Callback when remote data is fetched or updated
   * @param {Object} initialLocalData Data to seed in Firestore if document is empty
   */
  listen(onDataReceived, initialLocalData) {
    if (!isInitialized || !db) {
      console.warn("[Firebase] Firestore is not initialized. Running in local-only mode.");
      updateCloudIndicator('offline', 'LOCAL');
      return;
    }

    onRemoteUpdateCallback = onDataReceived;
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);

    try {
      // Set up real-time listener
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          console.log("[Firebase] Realtime snapshot received from Firestore:", remoteData);
          updateCloudIndicator('online', 'CLOUD OK');
          if (typeof onRemoteUpdateCallback === 'function') {
            onRemoteUpdateCallback(remoteData);
          }
        } else {
          // Document does not exist yet: seed with initial local data
          console.log("[Firebase] Remote doc does not exist yet. Seeding initial data...");
          updateCloudIndicator('syncing', 'SEEDING');
          this.saveImmediate(initialLocalData);
        }
      }, (error) => {
        console.warn("[Firebase] Snapshot listener notice (offline or permission):", error.message);
        updateCloudIndicator('offline', 'OFFLINE');
      });
    } catch (e) {
      console.warn("[Firebase] Error setting snapshot listener:", e);
      updateCloudIndicator('offline', 'OFFLINE');
    }
  },

  /**
   * Debounced save to Firestore (prevents spamming writes on rapid quantity/price edits)
   * @param {Object} stateData Object containing cart, budgetLimit, history, catalog, baselineTitle
   */
  save(stateData) {
    if (!isInitialized || !db) return;

    clearTimeout(saveDebounceTimer);
    updateCloudIndicator('syncing', 'SYNC...');

    saveDebounceTimer = setTimeout(() => {
      this.saveImmediate(stateData);
    }, 800);
  },

  /**
   * Immediate write to Firestore
   */
  async saveImmediate(stateData) {
    if (!isInitialized || !db) return;

    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const payload = {
        cart: stateData.cart || [],
        budgetLimit: stateData.budgetLimit || 500000,
        history: stateData.history || [],
        catalog: stateData.catalog || {},
        baselineTitle: stateData.baselineTitle || '',
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, payload, { merge: true });
      console.log("[Firebase] Successfully synced state to Firestore!");
      updateCloudIndicator('online', 'CLOUD OK');
    } catch (err) {
      console.warn("[Firebase] Error saving to Firestore:", err.message);
      updateCloudIndicator('offline', 'OFFLINE');
    }
  }
};

// Dispatch global ready event so app.js can hook into it
window.dispatchEvent(new CustomEvent('firebase-service-ready'));
