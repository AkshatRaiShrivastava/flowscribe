import { addDoc, collection, getDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from './firebase';

export const createShareableLink = async (analysisData) => {
  try {
    // Extract all necessary data for sharing and ensure no undefined values
    const shareData = {
      flowchart: analysisData.flowchartData.flowchart || null,
      owner: analysisData.owner || '',
      repo: analysisData.repo || '',
      repoUrl: analysisData.repoUrl || '',
      complexity: analysisData.flowchartData?.complexity || { time: 'Unknown', space: 'Unknown' },
      pseudocode: analysisData.flowchartData?.pseudocode || [],
      testCases: analysisData.flowchartData?.testCases || [],
      sharedAt: new Date().toISOString(),
      viewCount: 0,
      originalCreatedAt: analysisData.createdAt || new Date().toISOString(),
      sharedBy: auth.currentUser?.uid || null
    };

    // Create a new document in the 'shared' collection
    const shareDoc = await addDoc(collection(db, 'shared'), shareData);

    // Return a shareable link using the document ID
    return `${window.location.origin}/shared/${shareDoc.id}`;
  } catch (error) {
    console.error('Error creating shareable link:', error);
    throw error;
  }
};

export const getSharedAnalysis = async (shareId) => {
  try {
    const shareDoc = await getDoc(doc(db, 'shared', shareId));
    if (!shareDoc.exists()) {
      throw new Error('Shared analysis not found');
    }
    
    // Update view count
    await updateDoc(doc(db, 'shared', shareId), {
      viewCount: increment(1)
    });

    return shareDoc.data();
  } catch (error) {
    console.error('Error fetching shared analysis:', error);
    throw error;
  }
};
