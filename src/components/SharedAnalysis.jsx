import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedAnalysis } from '../services/share';
import Analysis from './Analysis';
import FlowchartDisplay from './FlowchartDisplay';

const SharedAnalysis = () => {
  const { shareId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedAnalysis = async () => {
      try {
        const data = await getSharedAnalysis(shareId);
        setAnalysis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchSharedAnalysis();
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <svg className="animate-spin h-8 w-8 text-violet-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400">Analysis not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        <div className="bg-black/30 border border-white/10 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-medium text-gray-200 break-all">
                {analysis.owner}/{analysis.repo}
              </h1>
              <a 
                href={analysis.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors break-all"
              >
                View Repository
              </a>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-400">
                Shared on {new Date(analysis.sharedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                Views: {analysis.viewCount}
              </p>
            </div>
          </div>
        </div>

        {analysis.flowchart && (
          <FlowchartDisplay flowchartCode={analysis.flowchart} />
        )}

        <div className="overflow-x-auto">
          <Analysis
            pseudocode={analysis.pseudocode}
            complexity={analysis.complexity}
            testCases={analysis.testCases}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedAnalysis;
