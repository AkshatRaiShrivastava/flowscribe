const AnalysisCard = ({ title, icon, children }) => (
  <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
    <div className="border-b border-white/10 p-4 flex items-center space-x-3">
      <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
        {icon}
      </span>
      <h2 className="text-sm font-medium text-gray-400">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Analysis = ({ pseudocode, complexity, testCases }) => {
  return (
    <div className="grid gap-6">
      {pseudocode && (
        <AnalysisCard 
          title="Pseudocode Explanation"
          icon={
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        >
          <div className="space-y-4">
            {Array.isArray(pseudocode) ? pseudocode.map((section, index) => (
              <div key={index} className="relative group">
                {section.group && (
                  <h3 className="text-sm font-medium text-violet-400 mb-2">{section.group}</h3>
                )}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-lg blur opacity-75"></div>
                <pre className="relative bg-black/50 rounded-lg p-4 text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
                  {section.code}
                </pre>
              </div>
            )) : (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-lg blur opacity-75"></div>
                <pre className="relative bg-black/50 rounded-lg p-4 text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
                  {pseudocode}
                </pre>
              </div>
            )}
          </div>
        </AnalysisCard>
      )}

      {complexity && (
        <AnalysisCard 
          title="Time & Space Complexity"
          icon={
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="bg-black/50 rounded-lg p-4 text-gray-300 space-y-2 leading-relaxed border border-white/5">
            <p className="flex items-start space-x-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Time Complexity: {complexity.time || 'Not available'}</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Space Complexity: {complexity.space || 'Not available'}</span>
            </p>
          </div>
        </AnalysisCard>
      )}

      {testCases && (
        <AnalysisCard 
          title="Sample Test Cases"
          icon={
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        >
          <ul className="space-y-3">
            {Array.isArray(testCases) ? testCases.map((testCase, index) => (
              <li key={index} className="bg-black/50 rounded-lg p-4 border border-white/5">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="text-xs text-violet-400 font-medium">{index + 1}</span>
                  </span>
                  <span className="text-gray-300">
                    {typeof testCase === 'string' ? testCase : (
                      <>
                        <strong>Input:</strong> {testCase.input}
                        <br />
                        <strong>Output:</strong> {testCase.output}
                        {testCase.explanation && (
                          <>
                            <br />
                            <strong>Explanation:</strong> {testCase.explanation}
                          </>
                        )}
                      </>
                    )}
                  </span>
                </div>
              </li>
            )) : null}
          </ul>
        </AnalysisCard>
      )}
    </div>
  );
};



export default Analysis;
