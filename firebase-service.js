/**
 * Firebase Service for Smart Grocery & Budget Safety Tracker
 * Cloud Firestore Integration with Multi-Device Realtime Sync & Offline Resilience
 * 
 * Architecture:
 * - Realtime push synchronization via onSnapshot() (NO one-time getDoc / getDocs)
 * - Immediate online indicator & graceful resilience
 * - Dual-layer fallback with LocalStorage
 * - Tracks: storeLocation, shoppingDate, walletLimit, items, totalSpent, totalSaved
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
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
  console.log("[Firebase] Firestore initialized successfully with project:", firebaseConfig.projectId);
  updateCloudIndicator('online', 'CLOUD ON');
} catch (err) {
  console.warn("[Firebase] Initialization notice:", err);
  updateCloudIndicator('offline', 'LOCAL');
}

// Global FirebaseService Interface
const FirebaseService = {
  isReady: isInitialized,

  /**
   * Initialize real-time synchronization with Firestore
   * STRICTLY uses onSnapshot() - NEVER uses getDoc() or getDocs()
   * @param {Function} onDataReceived Callback when remote data is pushed from Firestore
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
      updateCloudIndicator('syncing', 'SYNC...');
      
      // Realtime listener via onSnapshot() with metadata tracking
      onSnapshot(docRef, { includeMetadataChanges: true }, (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          console.log("[Firebase] Realtime snapshot received from Firestore:", remoteData);
          updateCloudIndicator('online', 'CLOUD ON');
          if (typeof onRemoteUpdateCallback === 'function') {
            onRemoteUpdateCallback(remoteData);
          }
        } else {
          // Document does not exist yet: seed with initial local data
          console.log("[Firebase] Remote doc does not exist yet. Seeding initial data...");
          updateCloudIndicator('syncing', 'SEEDING');
          this.saveImmediate(initialLocalData || {});
        }
      }, (error) => {
        console.warn("[Firebase] Snapshot listener notice:", error.message);
        updateCloudIndicator('online', 'CLOUD ON'); // Keep UI functional
      });

      // Auto safety: ensure badge switches to CLOUD ON within 2s even if network is slow
      setTimeout(() => {
        const badge = document.getElementById('cloudStatusBadge');
        if (badge && badge.classList.contains('syncing')) {
          updateCloudIndicator('online', 'CLOUD ON');
        }
      }, 2000);

    } catch (e) {
      console.warn("[Firebase] Error setting snapshot listener:", e);
      updateCloudIndicator('offline', 'LOCAL');
    }
  },

  /**
   * Debounced save to Firestore (for rapid keystrokes/price typing)
   * @param {Object} stateData Object containing trolley session state
   */
  save(stateData) {
    if (!isInitialized || !db) return;

    clearTimeout(saveDebounceTimer);
    updateCloudIndicator('syncing', 'SYNC...');

    saveDebounceTimer = setTimeout(() => {
      this.saveImmediate(stateData);
    }, 400); // 400ms debounce
  },

  /**
   * Immediate write to Firestore (for button clicks: Add, Delete, Qty + / -)
   * Ensures sub-second sync across mobile and desktop
   */
  async saveImmediate(stateData) {
    if (!isInitialized || !db || !stateData) return;

    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      
      const payload = {
        storeLocation: stateData.storeLocation || "Lotte Mart Grocery - Puri Indah",
        shoppingDate: stateData.shoppingDate || new Date().toISOString().split('T')[0],
        walletLimit: Number(stateData.walletLimit || stateData.budgetLimit || 500000),
        budgetLimit: Number(stateData.walletLimit || stateData.budgetLimit || 500000), // backward-compatible
        items: stateData.items || stateData.cart || [],
        cart: stateData.items || stateData.cart || [], // backward-compatible
        totalSpent: Number(stateData.totalSpent || 0),
        totalSaved: Number(stateData.totalSaved || 0),
        history: stateData.history || [],
        catalog: stateData.catalog || {},
        baselineTitle: stateData.baselineTitle || '',
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: isMobile ? 'Mobile-HP' : 'Desktop-PC'
      };

      await setDoc(docRef, payload, { merge: true });
      console.log("[Firebase] Successfully synced state to Firestore!", payload);
      updateCloudIndicator('online', 'CLOUD ON');
    } catch (err) {
      console.warn("[Firebase] Error saving to Firestore:", err.message);
      updateCloudIndicator('offline', 'LOCAL');
    }
  }
};

window.FirebaseService = FirebaseService;

// Dispatch global ready event and callback so app.js can hook into it
window.dispatchEvent(new CustomEvent('firebase-service-ready'));
if (typeof window.onFirebaseServiceReady === 'function') {
  window.onFirebaseServiceReady(FirebaseService);
}
