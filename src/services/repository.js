import { githubService } from './github';
import { analyzeCode } from './gemini';

const DEFAULT_ANALYSIS = {
  flowchart: '',
  pseudocode: 'No pseudocode available',
  complexity: { time: 'Unknown', space: 'Unknown' },
  testCases: []
};

export class RepositoryService {
  constructor() {
    this.complexityMap = {
      'O(1)': 1,
      'O(log n)': 2,
      'O(n)': 3,
      'O(n log n)': 4,
      'O(n²)': 5,
      'O(2ⁿ)': 6
    };

    this.reverseComplexityMap = {
      1: 'O(1)',
      2: 'O(log n)',
      3: 'O(n)',
      4: 'O(n log n)',
      5: 'O(n²)',
      6: 'O(2ⁿ)'
    };
  }

  async analyzeRepository(owner, repo) {
    try {
      const files = await this.safeGetFiles(owner, repo);
      if (!files.length) {
        throw new Error('No files found in repository');
      }

      const groupedFiles = this.groupFilesByPurpose(files);
      const analysisResults = await this.analyzeFileGroups(groupedFiles);
      
      return this.combineAnalyses(analysisResults);
    } catch (error) {
      console.error('Repository analysis failed:', error);
      throw new Error(`Failed to analyze repository: ${error.message}`);
    }
  }

  async safeGetFiles(owner, repo) {
    try {
      return await githubService.getAllFiles(owner, repo);
    } catch (error) {
      console.error('Error fetching repository files:', error);
      return [];
    }
  }

  groupFilesByPurpose(files) {
    const fileGroups = {
      models: (path) => path.includes('model') || path.includes('entity') || path.includes('schema'),
      controllers: (path) => path.includes('controller') || path.includes('handler'),
      views: (path) => path.includes('view') || path.includes('component') || path.includes('template'),
      utilities: (path) => path.includes('util') || path.includes('helper'),
      other: () => true
    };

    return Object.entries(fileGroups).reduce((groups, [groupName, matcher]) => {
      const matchingFiles = files.filter(file => {
        const path = file.path.toLowerCase();
        return matcher(path) && !Object.values(groups).flat().includes(file);
      });

      if (matchingFiles.length > 0) {
        groups[groupName] = matchingFiles;
      }
      return groups;
    }, {});
  }

  async analyzeFileGroups(groupedFiles) {
    const analyzeGroup = async ([groupName, files]) => {
      try {
        const combinedCode = files.map(file => file.content).join('\n\n');
        const analysis = await analyzeCode(combinedCode);
        
        return {
          groupName,
          analysis: {
            flowchart: analysis?.flowchart || DEFAULT_ANALYSIS.flowchart,
            pseudocode: analysis?.pseudocode || DEFAULT_ANALYSIS.pseudocode,
            complexity: this.validateComplexity(analysis?.complexity),
            testCases: this.validateTestCases(analysis?.testCases)
          },
          files: files.map(f => f.path)
        };
      } catch (error) {
        console.error(`Analysis failed for ${groupName}:`, error);
        return {
          groupName,
          analysis: { ...DEFAULT_ANALYSIS },
          files: files.map(f => f.path)
        };
      }
    };

    return Promise.all(Object.entries(groupedFiles).map(analyzeGroup));
  }

  validateComplexity(complexity = {}) {
    return {
      time: this.isValidComplexity(complexity.time) ? complexity.time : 'Unknown',
      space: this.isValidComplexity(complexity.space) ? complexity.space : 'Unknown'
    };
  }

  validateTestCases(testCases) {
    if (!Array.isArray(testCases)) return DEFAULT_ANALYSIS.testCases;
    return testCases.filter(tc => tc && typeof tc === 'object');
  }

  isValidComplexity(complexity) {
    return complexity && typeof complexity === 'string' && this.complexityMap[complexity];
  }

  combineAnalyses(analysisResults) {
    if (!Array.isArray(analysisResults) || !analysisResults.length) {
      return { ...DEFAULT_ANALYSIS, complexity: { overall: DEFAULT_ANALYSIS.complexity } };
    }

    const validFlowcharts = this.mergeFlowcharts(analysisResults);
    const overallComplexity = this.calculateOverallComplexity(analysisResults);
    
    return {
      flowchart: validFlowcharts,
      pseudocode: this.combinePseudocode(analysisResults),
      complexity: {
        overall: overallComplexity,
        byGroup: this.getComplexityByGroup(analysisResults)
      },
      testCases: this.combineTestCases(analysisResults)
    };
  }

  mergeFlowcharts(analysisResults) {
    return analysisResults
      .map(r => r.analysis?.flowchart)
      .filter(Boolean)
      .join('\n') || DEFAULT_ANALYSIS.flowchart;
  }

  combinePseudocode(analysisResults) {
    return analysisResults.map(r => ({
      group: r.groupName,
      code: r.analysis?.pseudocode || DEFAULT_ANALYSIS.pseudocode
    }));
  }

  getComplexityByGroup(analysisResults) {
    return analysisResults.map(r => ({
      group: r.groupName,
      complexity: this.validateComplexity(r.analysis?.complexity)
    }));
  }

  combineTestCases(analysisResults) {
    return analysisResults.flatMap(r => {
      const testCases = this.validateTestCases(r.analysis?.testCases);
      return testCases.map(tc => ({ ...tc, group: r.groupName }));
    });
  }

  calculateOverallComplexity(analysisResults) {
    const validComplexities = analysisResults
      .map(r => r.analysis?.complexity)
      .filter(this.isValidComplexity)
      .map(c => ({
        time: this.complexityMap[c.time] || 0,
        space: this.complexityMap[c.space] || 0
      }));

    if (!validComplexities.length) {
      return DEFAULT_ANALYSIS.complexity;
    }

    const maxTime = Math.max(...validComplexities.map(c => c.time));
    const maxSpace = Math.max(...validComplexities.map(c => c.space));

    return {
      time: this.reverseComplexityMap[maxTime] || 'Unknown',
      space: this.reverseComplexityMap[maxSpace] || 'Unknown'
    };
  }
}

export const repositoryService = new RepositoryService();
