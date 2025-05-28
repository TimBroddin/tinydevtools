import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015, vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '../../contexts/ThemeContext';
import { formatJson, validateJson } from './utils';

const JsonBeautifier = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const { theme } = useTheme();

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const { isValid, message } = validateJson(input);
      
      if (!isValid) {
        setError(message);
        setOutput('');
        return;
      }
      
      const formatted = formatJson(input, indentSize);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError((err as Error).message || 'Invalid JSON');
      setOutput('');
    }
  }, [input, indentSize]);

  const handleMinify = () => {
    if (!input.trim()) return;

    try {
      const parsedJson = JSON.parse(input);
      const minified = JSON.stringify(parsedJson);
      setOutput(minified);
    } catch (err) {
      // Keep the existing error state if minification fails
    }
  };

  const handleClearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <ToolLayout
      title="JSON Beautifier"
      description="Format, validate, and structure your JSON data"
    >
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Input JSON
            </label>
            <div className="flex items-center gap-3">
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="bg-background border border-input rounded px-2 py-1 text-sm"
              >
                {[2, 4, 8].map((size) => (
                  <option key={size} value={size}>
                    {size} spaces
                  </option>
                ))}
              </select>
              <button
                onClick={handleMinify}
                className="text-xs text-primary hover:text-primary/80"
              >
                Minify
              </button>
              <button
                onClick={handleClearAll}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="tool-textarea"
          />
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {(output || input) && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Formatted JSON
              </label>
              <button
                onClick={handleCopyOutput}
                className="text-xs text-primary hover:text-primary/80"
              >
                Copy to Clipboard
              </button>
            </div>
            <div className="relative">
              <SyntaxHighlighter
                language="json"
                style={theme === 'dark' ? vs2015 : vs}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                {output}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default JsonBeautifier;