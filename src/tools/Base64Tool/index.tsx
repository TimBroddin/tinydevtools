import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, RotateCw } from 'lucide-react';
import { encodeBase64, decodeBase64 } from './utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';



type Mode = 'encode' | 'decode';

const Base64Tool = () => {
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
        const encoded = encodeBase64(input);
        setOutput(encoded);
      } else {
        const decoded = decodeBase64(input);
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
      title="Base64 Encoder/Decoder"
      description="Convert text to and from Base64 encoding"
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
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <Textarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter text to encode as Base64...'
                : 'Enter Base64 to decode...'
            }
            className="min-h-[100px]"
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
                {mode === 'encode' ? 'Encoded Base64' : 'Decoded Text'}
              </label>
              <Button
                onClick={handleCopyOutput}
                variant="link"
                size="sm"
                className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 h-auto p-0"
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
          <h3 className="text-sm font-medium mb-2">About Base64</h3>
          <p className="text-sm text-muted-foreground">
            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
            It's commonly used for encoding binary data such as images, audio files, and other media to be
            transported over text-based protocols like email or HTML.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default Base64Tool;