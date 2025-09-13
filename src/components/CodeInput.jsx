import { useState } from 'react';

const CodeInput = ({ onAnalyze, isLoading }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = () => {
    if (!code.trim()) return;
    onAnalyze({ code, language });
  };

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
      <div className="border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h2 className="text-sm font-medium text-gray-400">Code Editor</h2>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-900/50 text-sm border border-white/10 rounded-md py-1 px-3 text-gray-300 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      
      <div className="p-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative">
            <textarea
              placeholder="// Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              spellCheck="false"
              className="w-full bg-black/50 backdrop-blur-sm rounded-lg py-3 px-4 text-gray-300 font-mono text-sm leading-relaxed placeholder-gray-500 border border-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleSubmit}
          disabled={!code.trim() || isLoading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium h-10 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 group"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Flowchart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeInput;
