import { useEffect, useState } from 'react';
import { historyService } from '../services/history';
import { auth } from '../services/firebase';
import { createShareableLink } from '../services/share';

const ShareModal = ({ isOpen, onClose, shareLink }) => {
  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-white/10 p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Share Analysis</h3>
        <div className="flex items-center space-x-2 bg-black/30 rounded-lg p-2">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="flex-1 bg-transparent text-gray-300 text-sm focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-md text-sm transition-colors"
          >
            Copy
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const UserHistory = ({ onFlowchartSelect }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState({ isOpen: false, link: null });

  useEffect(() => {
    let unsubscribe;

    const setupHistorySubscription = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        unsubscribe = historyService.subscribeToHistory((error, userHistory) => {
          if (error) {
            setError(error.message);
            console.error('Error in history subscription:', error);
          } else {
            setHistory(userHistory);
          }
          setLoading(false);
        });
      } catch (err) {
        setError(err.message);
        console.error('Error setting up history subscription:', err);
        setLoading(false);
      }
    };

    setupHistorySubscription();
  }, []);

  if (!auth.currentUser) {
    return (
      <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
        <p className="text-gray-400 text-sm">Please log in to view your history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-black/30 border border-white/10 rounded-lg flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 text-violet-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
        <p className="text-gray-400 text-sm">No flowchart history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ShareModal 
        isOpen={shareModal.isOpen}
        shareLink={shareModal.link}
        onClose={() => setShareModal({ isOpen: false, link: null })}
      />
      {history.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="text-sm font-medium text-gray-300">{item.owner}/{item.repo}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const shareableData = {
                      ...item,
                      complexity: item.flowchartData.complexity,
                      pseudocode: item.flowchartData.pseudocode,
                      testCases: item.flowchartData.testCases
                    };
                    const link = await createShareableLink(shareableData);
                    setShareModal({ isOpen: true, link });
                  } catch (err) {
                    setError('Failed to create share link');
                  }
                }}
                className="p-1.5 bg-violet-500/20 hover:bg-violet-500/30 rounded-lg transition-colors"
              >
                <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              <time className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
          <div 
            className="mt-2 cursor-pointer"
            onClick={() => onFlowchartSelect(item.flowchartData)}
          >
            <p className="text-xs text-gray-400 truncate">{item.repoUrl}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserHistory;
