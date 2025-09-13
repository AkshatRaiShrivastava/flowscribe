import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { analyzeCode } from './services/gemini';
import CodeInput from './components/CodeInput';
import FlowchartDisplay from './components/FlowchartDisplay';
import Analysis from './components/Analysis';
import Auth from './components/Auth';
import GitHubImport from './components/GitHubImport';
import UserHistory from './components/UserHistory';
import SharedAnalysis from './components/SharedAnalysis';
import './App.css';

function MainApp() {
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAnalyze = async ({ code, language }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeCode(code);
      setAnalysis(result);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while analyzing the code');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-gray-900 to-gray-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              FlowScribe
            </h1>
          </div>
          <Auth user={user} />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-900 text-sm text-gray-400">Code Analysis Tool</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />
              <GitHubImport onFlowchartGenerated={result => {
                setAnalysis({
                  flowchart: result.flowchart,
                  pseudocode: result.pseudocode,
                  complexity: result.complexity,
                  testCases: result.testCases
                });
              }} />
            </div>
            {user && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-200">Your History</h2>
                <UserHistory 
                  onFlowchartSelect={result => {
                    setAnalysis(result);
                  }} 
                />
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-200">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-3 text-violet-400 animate-pulse">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing code...
            </div>
          )}
          
          {analysis && !isLoading && (
            <div className="space-y-8 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-gray-900 text-sm text-gray-400">Analysis Results</span>
                </div>
              </div>
              
              <FlowchartDisplay flowchartCode={analysis.flowchart} />
              <Analysis
                pseudocode={analysis.pseudocode}
                complexity={analysis.complexity}
                testCases={analysis.testCases}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/shared/:shareId" element={<SharedAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
