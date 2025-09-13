import { collection, addDoc, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

class HistoryService {
  constructor() {
    this.collection = collection(db, 'flowcharts');
    this.unsubscribeSnapshot = null;
    this.initAuthListener();
  }

  initAuthListener() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is authenticated, history service ready');
      } else {
        console.log('User is not authenticated, history service waiting');
        if (this.unsubscribeSnapshot) {
          this.unsubscribeSnapshot();
          this.unsubscribeSnapshot = null;
        }
      }
    });
  }

  async saveFlowchart(data) {
    if (!auth.currentUser) {
      throw new Error('Please sign in to save flowcharts');
    }

    try {
      // Add timestamp server-side to ensure consistency
      const docData = {
        userId: auth.currentUser.uid,
        repoUrl: data.repoUrl,
        owner: data.owner,
        repo: data.repo,
        flowchartData: data.flowchartData,
        createdAt: new Date().toISOString(),
        userEmail: auth.currentUser.email,
      };

      const docRef = await addDoc(this.collection, docData);
      console.log('Flowchart saved successfully');
      return docRef.id;
    } catch (error) {
      console.error('Error saving flowchart:', error);
      if (error.code === 'permission-denied') {
        throw new Error('You don\'t have permission to save flowcharts');
      }
      throw new Error('Failed to save flowchart. Please try again.');
    }
  }

  async getUserHistory() {
    if (!auth.currentUser) {
      throw new Error('Please sign in to view your history');
    }

    try {
      // Create a query with multiple retry attempts
      const maxRetries = 3;
      let attempt = 0;
      let lastError;

      while (attempt < maxRetries) {
        try {
          const q = query(
            this.collection,
            where('userId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
          );

          const querySnapshot = await getDocs(q);
          console.log('History fetched successfully');
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          lastError = error;
          attempt++;
          if (attempt < maxRetries) {
            console.log(`Retry attempt ${attempt} of ${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      // If we get here, all retries failed
      console.error('Error fetching user history after retries:', lastError);
      if (lastError.code === 'permission-denied') {
        throw new Error('You don\'t have permission to view this history');
      }
      throw new Error('Failed to load history. Please try again.');
    } catch (error) {
      console.error('Error in getUserHistory:', error);
      throw error;
    }
  }

  // Helper method to setup real-time updates
  subscribeToHistory(callback) {
    if (!auth.currentUser) {
      throw new Error('Please sign in to view history updates');
    }

    try {
      const q = query(
        this.collection,
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      this.unsubscribeSnapshot = onSnapshot(q, 
        (snapshot) => {
          const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(null, history);
        },
        (error) => {
          console.error('History subscription error:', error);
          callback(error);
        }
      );

      return () => {
        if (this.unsubscribeSnapshot) {
          this.unsubscribeSnapshot();
          this.unsubscribeSnapshot = null;
        }
      };
    } catch (error) {
      console.error('Error setting up history subscription:', error);
      throw error;
    }
  }
}

export const historyService = new HistoryService();
