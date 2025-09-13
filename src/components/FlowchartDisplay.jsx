import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Panel,
} from 'reactflow';
import { formatGeminiResponse, wrapFormattedContent } from '../utils/formatGeminiResponse';
import 'reactflow/dist/style.css';

const nodeTypes = {
  start: ({ data }) => (
    <div className="group px-3 sm:px-5 py-2 sm:py-3 shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-xl border-2 border-blue-400/50 bg-gradient-to-br from-blue-50 to-blue-100/90 transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:scale-105">
      <div className="font-bold text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent whitespace-nowrap group-hover:from-blue-800 group-hover:to-blue-950">{data.label}</div>
    </div>
  ),
  end: ({ data }) => (
    <div className="group px-3 sm:px-5 py-2 sm:py-3 shadow-[0_0_15px_rgba(147,51,234,0.3)] rounded-xl border-2 border-purple-400/50 bg-gradient-to-br from-purple-50 to-purple-100/90 transition-all duration-300 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] hover:scale-105">
      <div className="font-bold text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent whitespace-nowrap group-hover:from-purple-800 group-hover:to-purple-950">{data.label}</div>
    </div>
  ),
  process: ({ data }) => (
    <div className="group px-3 sm:px-5 py-2 sm:py-3 shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-xl border-2 border-indigo-200/50 bg-gradient-to-br from-white to-indigo-50/90 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:scale-105">
      <div className="text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-indigo-700 to-indigo-900 bg-clip-text text-transparent whitespace-nowrap group-hover:from-indigo-800 group-hover:to-indigo-950">{data.label}</div>
    </div>
  ),
  decision: ({ data }) => (
    <div className="group px-3 sm:px-5 py-2 sm:py-3 shadow-[0_0_15px_rgba(245,158,11,0.3)] rotate-45 transition-all duration-300">
      <div className="px-3 sm:px-5 py-2 sm:py-3 border-2 border-amber-400/50 bg-gradient-to-br from-amber-50 to-amber-100/90 -rotate-45 rounded-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105">
        <div className="text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent whitespace-nowrap group-hover:from-amber-800 group-hover:to-amber-950">{data.label}</div>
      </div>
    </div>
  ),
};

import ComplexityOverview from './ComplexityOverview';

const FlowchartDisplay = ({ flowchartCode, explanation, complexity = { time: 'O(n)', space: 'O(n)' } }) => {
  const [error, setError] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const parseFlowchart = useCallback((code) => {
    if (!code) return { nodes: [], edges: [] };

    try {
      const lines = code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('graph'));

      const nodes = [];
      const edges = [];
      let yOffset = 0;
      let lastNodeId = '';

      lines.forEach((line, index) => {
        const parts = line.split('-->');
        
        parts.forEach((part, partIndex) => {
          const nodeMatch = part.match(/([A-Z])\[(.*?)\]|([A-Z])\{(.*?)\}/);
          if (nodeMatch) {
            const id = nodeMatch[1] || nodeMatch[3];
            const label = nodeMatch[2] || nodeMatch[4];
            const isDecision = nodeMatch[4] !== undefined;

            // Only add node if it doesn't exist
            if (!nodes.find(n => n.id === id)) {
              let type = 'process';
              if (label.toLowerCase() === 'start') type = 'start';
              else if (label.toLowerCase() === 'end') type = 'end';
              else if (isDecision) type = 'decision';

              nodes.push({
                id,
                type,
                position: { x: 200 * partIndex, y: yOffset },
                data: { label },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
              });
            }

            // Create edge if there's a next part
            if (partIndex < parts.length - 1) {
              const nextPart = parts[partIndex + 1];
              const nextNodeMatch = nextPart.match(/([A-Z])/);
              if (nextNodeMatch) {
                const edgeLabel = nextPart.match(/\|(.*?)\|/)?.[1] || '';
                edges.push({
                  id: `${id}-${nextNodeMatch[1]}`,
                  source: id,
                  target: nextNodeMatch[1],
                  label: edgeLabel,
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#f0cb7bff', strokeWidth: 2 },
                });
              }
            }

            lastNodeId = id;
          }
        });

        // Increment y-offset for next row if this line created a node
        if (lastNodeId) {
          yOffset += 100;
        }
      });

      return { nodes, edges };
    } catch (err) {
      console.error('Error parsing flowchart:', err);
      setError('Failed to parse flowchart syntax');
      return { nodes: [], edges: [] };
    }
  }, []);

  useEffect(() => {
    if (flowchartCode) {
      const { nodes: newNodes, edges: newEdges } = parseFlowchart(flowchartCode);
      setNodes(newNodes);
      setEdges(newEdges);
      setError(null);
    }
  }, [flowchartCode, parseFlowchart, setNodes, setEdges]);

  if (!flowchartCode) {
    return null;
  }

  return (
    <div className="w-full max-w-full overflow-hidden bg-black/30 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
      <div className="border-b border-white/10 p-2 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full flex items-center justify-center ${
            error ? 'bg-red-500/20' : 'bg-violet-500/20'
          }`}>
            <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
              error ? 'bg-red-500' : 'bg-violet-500'
            }`}></span>
          </span>
          <h2 className="text-xs sm:text-sm font-medium text-gray-400">Interactive Flowchart</h2>
        </div>
        <ComplexityOverview
          timeComplexity={complexity.time}
          spaceComplexity={complexity.space}
        />
      </div>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-b-xl opacity-50"></div>
        <div className="relative p-3 sm:p-6">
          {explanation && (
            <div 
              className="mb-4 sm:mb-6 text-xs sm:text-sm max-h-[200px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent"
              dangerouslySetInnerHTML={{ 
                __html: wrapFormattedContent(formatGeminiResponse(explanation)) 
              }}
            />
          )}
          {error ? (
            <div className="flex items-center gap-2 sm:gap-3 text-red-400 bg-red-500/10 rounded-lg p-3 sm:p-4 border border-red-500/20">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm">{error}</p>
            </div>
          ) : (
            <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[2/1]">
              <ReactFlow
                proOptions={{ hideAttribution: true }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-lg"
                minZoom={0.2}
                maxZoom={1.5}
                defaultViewport={{ zoom: 0.8 }}
                edgeOptions={{
                  style: {
                    strokeWidth: 3,
                    stroke: 'url(#edge-gradient)',
                  },
                  type: 'smoothstep',
                  animated: true,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#818cf8',
                    width: 20,
                    height: 20,
                  },
                  className: 'animate-pulse',
                }}
                defaultEdgeOptions={{
                  style: {
                    strokeWidth: 3,
                    stroke: 'url(#edge-gradient)',
                  },
                  type: 'smoothstep',
                  animated: true,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#818cf8',
                    width: 20,
                    height: 20,
                  },
                  className: 'animate-pulse',
                }}
              >
                <Background 
                  variant="dots"
                  gap={16}
                  size={1}
                  color="#818cf8"
                  style={{ opacity: 0.1 }}
                />
                <Controls 
                  className="!left-2 !bottom-2 !bg-white/90 !shadow-lg !border !border-indigo-100"
                  showInteractive={false}
                  fitViewOptions={{ padding: 0.2 }}
                />
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <defs>
                    <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                </svg>
                <Panel position="top-center" className="bg-white/80 px-3 py-1 rounded-full shadow-md border border-indigo-100 text-xs text-gray-500">
                  Drag to pan • Scroll to zoom • Click nodes to select
                </Panel>
                <MiniMap
                  className="!bottom-2 !right-2 !shadow-lg"
                  nodeStrokeColor={(n) => {
                    if (n.type === 'start') return '#3b82f6';
                    if (n.type === 'end') return '#9333ea';
                    if (n.type === 'decision') return '#f59e0b';
                    return '#6366f1';
                  }}
                  nodeColor={(n) => {
                    if (n.type === 'start') return '#dbeafe';
                    if (n.type === 'end') return '#f3e8ff';
                    if (n.type === 'decision') return '#fef3c7';
                    return '#eef2ff';
                  }}
                  maskColor="rgba(255, 255, 255, 0.5)"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                    borderWidth: '2px',
                    borderRadius: '8px'
                  }}
                />
              </ReactFlow>
            </div>
          )}
          {flowchartCode && !error && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-black/40 rounded-lg border border-white/5">
              <pre className="text-[10px] sm:text-xs text-gray-400 font-mono overflow-x-auto max-h-[150px] scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
                {flowchartCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowchartDisplay;
