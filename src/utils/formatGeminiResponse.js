/**
 * Formats a response text from Gemini with proper markdown-like styling
 */
export const formatGeminiResponse = (text) => {
  if (!text) return '';

  // Split into lines and process each line
  return text
    .split('\n')
    .map(line => {
      line = line.trim();
      
      // Handle headings
      if (line.startsWith('# ')) {
        return `<h1 class="text-2xl font-bold text-violet-300 mb-4">${line.slice(2)}</h1>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 class="text-xl font-semibold text-violet-200 mb-3">${line.slice(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3 class="text-lg font-medium text-violet-100 mb-2">${line.slice(4)}</h3>`;
      }

      // Handle code blocks
      if (line.startsWith('```')) {
        return '<div class="bg-black/40 rounded-lg p-4 my-4 font-mono text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap break-words">';
      }
      if (line.endsWith('```')) {
        return '</div>';
      }

      // Handle inline code
      if (line.includes('`')) {
        line = line.replace(/`([^`]+)`/g, '<code class="bg-black/30 px-1 py-0.5 rounded text-violet-300 break-words">$1</code>');
      }

      // Handle bullet points
      if (line.startsWith('- ')) {
        return `<li class="ml-4 text-gray-300 mb-1">• ${line.slice(2)}</li>`;
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(line)) {
        return `<li class="ml-4 text-gray-300 mb-1">${line}</li>`;
      }

      // Handle bold text
      if (line.includes('**')) {
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-violet-200">$1</strong>');
      }

      // Handle italic text
      if (line.includes('*')) {
        line = line.replace(/\*([^*]+)\*/g, '<em class="text-violet-100">$1</em>');
      }

      // Handle special sections
      if (line.startsWith('>')) {
        return `<blockquote class="border-l-4 border-violet-500/50 pl-4 my-2 text-gray-400 italic">${line.slice(2)}</blockquote>`;
      }

      // Handle horizontal rules
      if (line === '---') {
        return '<hr class="border-violet-500/20 my-4" />';
      }

      // Handle paragraphs
      if (line) {
        return `<p class="text-gray-300 mb-2 break-words whitespace-pre-wrap">${line}</p>`;
      }

      // Keep empty lines for spacing
      return '<div class="h-2"></div>';
    })
    .join('\\n');
};

/**
 * Wraps the formatted content in a styled container
 */
export const wrapFormattedContent = (content) => {
  return `
    <div class="prose prose-invert prose-violet max-w-none overflow-x-hidden break-words">
      ${content}
    </div>
  `;
};
