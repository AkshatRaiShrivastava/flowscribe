import { useState } from 'react';
import { githubService } from '../services/github';
import { historyService } from '../services/history';
import { repositoryService } from '../services/repository';
import { auth } from '../services/firebase';

const GitHubImport = ({ onFlowchartGenerated }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        throw new Error('Please log in to import repositories');
      }

      const { owner, repo } = githubService.parseGitHubUrl(repoUrl);
      const flowchartData = await repositoryService.analyzeRepository(owner, repo);

      // Save to history
      await historyService.saveFlowchart({
        repoUrl,
        owner,
        repo,
        flowchartData,
      });

      onFlowchartGenerated(flowchartData);
    } catch (err) {
      setError(err.message);
      console.error('Error importing repository:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-1">
            GitHub Repository URL
          </label>
          <input
            id="repoUrl"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-white placeholder-gray-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 
            text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2
            ${loading ? 'cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Importing...
            </>
          ) : (
            'Import Repository'
          )}
        </button>
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
};



export default GitHubImport;
