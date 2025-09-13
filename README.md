# FlowScribe

FlowScribe is an intelligent code analysis tool that transforms your code into visual flowcharts, pseudocode explanations, complexity analysis, and test cases using Google's Gemini AI. Built with React and Firebase, it provides developers with a comprehensive understanding of their code's structure and behavior.

## Features

- **AI-Powered Code Analysis**: Leverages Google's Gemini AI to analyze code and generate insights
- **Interactive Flowcharts**: Visualize your code logic with interactive flowcharts using ReactFlow
- **Pseudocode Generation**: Get clear, step-by-step pseudocode explanations of your algorithms
- **Complexity Analysis**: Understand time and space complexity of your code
- **Test Case Generation**: Automatically generate sample test cases for your code
- **GitHub Integration**: Import code directly from GitHub repositories
- **User Authentication**: Secure Firebase authentication with Google sign-in
- **Analysis History**: Save and revisit your previous code analyses
- **Sharing Capability**: Share your analyses with others via unique links
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technologies Used

- **Frontend**: React 18, React Router, Tailwind CSS
- **AI Integration**: Google Gemini API
- **Visualization**: ReactFlow, Mermaid.js
- **Authentication & Database**: Firebase Authentication, Firestore
- **UI Components**: Mantine UI, Heroicons
- **Build Tool**: Vite
- **Code Analysis**: Custom parsing and formatting utilities

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm or yarn package manager
- A Google Gemini API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/flowscribe-react.git
   ```

2. Navigate to the project directory:
   ```bash
   cd flowscribe-react
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Usage

1. **Code Analysis**:
   - Paste your code into the input area
   - Select the appropriate language
   - Click "Analyze Code" to generate insights

2. **GitHub Import**:
   - Use the GitHub import feature to analyze code directly from repositories
   - Enter the repository URL and file path

3. **Authentication**:
   - Sign in with Google to save your analysis history
   - Access your previous analyses from the history panel

4. **Sharing**:
   - Share your analyses with others using the share feature
   - Others can view your analysis without needing to sign in

## Project Structure

```
flowscribe-react/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and static files
│   ├── components/         # React components
│   ├── services/           # API and service integrations
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── firebase.json           # Firebase configuration
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

## Key Components

- `App.jsx`: Main application component with routing
- `CodeInput.jsx`: Handles code input and submission
- `FlowchartDisplay.jsx`: Renders interactive flowcharts using ReactFlow
- `Analysis.jsx`: Displays pseudocode, complexity, and test cases
- `Auth.jsx`: Handles user authentication
- `GitHubImport.jsx`: Manages GitHub code import functionality
- `UserHistory.jsx`: Displays user's analysis history
- `SharedAnalysis.jsx`: Shows shared analyses

## Services

- `gemini.js`: Integrates with Google's Gemini AI for code analysis
- `firebase.js`: Configures Firebase authentication and database
- `github.js`: Handles GitHub API interactions
- `history.js`: Manages user analysis history
- `repository.js`: Handles data persistence
- `share.js`: Manages analysis sharing functionality

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google's Gemini AI for powering the code analysis
- ReactFlow for the interactive flowchart visualization
- Firebase for authentication and database services
- Tailwind CSS for styling
- Vite for the fast build tool

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
