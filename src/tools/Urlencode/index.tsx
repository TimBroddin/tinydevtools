import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, RotateCw } from 'lucide-react';
import { encodeURL, decodeURL } from './utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Mode = 'encode' | 'decode';

const URLEncodeTool = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = encodeURL(input);
        setOutput(encoded);
      } else {
        const decoded = decodeURL(input);
        setOutput(decoded);
      }
      setError('');
    } catch (err) {
      setError(`Failed to ${mode}: ${(err as Error).message}`);
      setOutput('');
    }
  }, [input, mode]);

  const handleModeToggle = () => {
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleClearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Convert text to and from URL encoding (percent encoding)"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <div className="flex gap-2">
            <Button
              onClick={() => setMode('encode')}
              variant={mode === 'encode' ? 'default' : 'secondary'}
            >
              Encode
            </Button>
            <Button
              onClick={() => setMode('decode')}
              variant={mode === 'decode' ? 'default' : 'secondary'}
            >
              Decode
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleClearAll}
              variant="ghost"
              size="sm"
            >
              Clear All
            </Button>
            <Button
              onClick={handleModeToggle}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCw className="w-4 h-4" />
              Swap
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'URL Encoded Text to Decode'}
          </label>
          <Textarea
            autoFocus
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter text to URL encode...'
                : 'Enter URL encoded text to decode...'
            }
            className="min-h-[150px] font-mono text-sm"
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
                {mode === 'encode' ? 'URL Encoded Text' : 'Decoded Text'}
              </label>
              <Button
                onClick={handleCopyOutput}
                variant="link"
                size="sm"
                className="text-xs flex items-center gap-1 h-auto p-0"
              >
                <Copy className="w-3 h-3" />
                Copy to Clipboard
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-md font-mono text-sm break-all whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-sm font-medium mb-2">About URL Encoding</h3>
          <p className="text-sm text-muted-foreground">
            URL encoding (also known as percent encoding) is a mechanism to encode information
            in URLs that might otherwise be misinterpreted. Special characters are converted to
            percent-encoded values (e.g., spaces become %20). This is essential for safely
            including data in URLs, especially in query parameters and form submissions.
          </p>
          <div className="mt-4">
            <h4 className="text-xs font-medium mb-2 text-muted-foreground">Common Examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              <div>Space → %20</div>
              <div>! → %21</div>
              <div># → %23</div>
              <div>$ → %24</div>
              <div>% → %25</div>
              <div>& → %26</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default URLEncodeTool;
