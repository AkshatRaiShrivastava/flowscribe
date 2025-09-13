import { GoogleGenerativeAI } from '@google/generative-ai';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeCode(code) {
  try {
    // Use the correct model name for the Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analyze this code and provide the output in the following format. For machine learning code, focus on the training process and data flow:

### Pseudocode
[Write a clear, step-by-step pseudocode explanation of the logic]

### Flowchart
\`\`\`mermaid
graph TD
    A[Start] --> B[Initialize Data]
    B --> C[Initialize Model]
    C --> D{Training Loop}
    D -->|Each Epoch| E[Process Batch]
    E --> F{Check Error}
    F -->|Yes| G[Update Weights]
    F -->|No| H[Next Batch]
    G --> H
    H --> D
    D -->|Done| I[Save Model]
    I --> J[End]

Note: Create a flowchart following these EXACT rules:
1. Start with "graph TD" on its own line
2. Put each node and connection on a new line
3. Use simple node IDs: A, B, C, etc.
4. Use these brackets correctly:
   - [Process] for steps
   - {Condition} for decisions
   - (Input) for data
5. Use proper arrow syntax:
   A --> B
   B -->|Yes| C
   B -->|No| D
6. Avoid special characters in labels
7. Keep each line under 50 characters
8. End each line with either a node or connection
\`\`\`

### Complexity Analysis
[Provide detailed time and space complexity analysis]

### Test Cases
[List 2-3 sample test cases with inputs and expected outputs]

Code to analyze:
${code}

Important: Make sure to use the exact section headers as shown above and proper markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return parseSections(text);
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
}

function parseSections(text) {
  const sections = {
    pseudocode: '',
    flowchart: '',
    complexity: '',
    testCases: ''
  };

  // Use regex to extract content between sections
  const pseudocodeMatch = text.match(/### Pseudocode\s*([\s\S]*?)(?=###|$)/);
  const flowchartMatch = text.match(/\`\`\`mermaid\s*([\s\S]*?)\`\`\`/);
  const complexityMatch = text.match(/### Complexity Analysis\s*([\s\S]*?)(?=###|$)/);
  const testCasesMatch = text.match(/### Test Cases\s*([\s\S]*?)(?=###|$)/);

  if (pseudocodeMatch) sections.pseudocode = pseudocodeMatch[1].trim();
  if (flowchartMatch) sections.flowchart = flowchartMatch[1].trim();
  if (complexityMatch) sections.complexity = complexityMatch[1].trim();
  if (testCasesMatch) sections.testCases = testCasesMatch[1].trim();

  return sections;
}
