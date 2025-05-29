import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, RotateCw, Hash } from 'lucide-react';
import { 
  BASES, 
  SupportedBase, 
  convertBetweenBases, 
  formatWithSpaces,
  getValidCharsForBase 
} from './utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const numericSupportedBases: SupportedBase[] = [2, 8, 10, 16];

const NumberBaseConverter = () => {
  const [input, setInput] = useState<string>('');
  const [fromBase, setFromBase] = useState<SupportedBase>(10);
  const [results, setResults] = useState<Record<SupportedBase, string>>({
    2: '',
    8: '',
    10: '',
    16: '',
  });
  const [error, setError] = useState<string>('');

  const handleBaseChange = (newBase: SupportedBase) => {
    if (newBase === fromBase) return;
    
    // Always clear input when switching bases to avoid validation conflicts
    setFromBase(newBase);
    setInput('');
    setResults({ 2: '', 8: '', 10: '', 16: '' });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.toUpperCase();
    const currentValidChars = getValidCharsForBase(fromBase);
    
    const filteredValue = newValue
      .split('')
      .filter(char => currentValidChars.includes(char) || char === ' ')
      .join('');
    
    setInput(filteredValue);
  };

  useEffect(() => {
    if (!input.trim()) {
      setResults({ 2: '', 8: '', 10: '', 16: '' });
      setError('');
      return;
    }

    try {
      const newResults: Partial<Record<SupportedBase, string>> = {};
      
      for (const targetBaseNum of numericSupportedBases) {
        if (targetBaseNum === fromBase) {
          newResults[targetBaseNum] = input.trim();
        } else {
          newResults[targetBaseNum] = convertBetweenBases(input, fromBase, targetBaseNum);
        }
      }
      
      setResults(newResults as Record<SupportedBase, string>);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setResults({ 2: '', 8: '', 10: '', 16: '' });
    }
  }, [input, fromBase]);

  const handleCopy = (value: string) => {
    if (value) {
      navigator.clipboard.writeText(value.replace(/\s+/g, ''));
    }
  };

  const handleSwap = (newFromBase: SupportedBase) => {
    if (newFromBase !== fromBase && results[newFromBase]) {
      setInput(results[newFromBase].replace(/\s+/g, ''));
      setFromBase(newFromBase);
    }
  };

  const handleClearAll = () => {
    setInput('');
    setResults({ 2: '', 8: '', 10: '', 16: '' });
    setError('');
  };

  const getPlaceholder = () => {
    const validChars = getValidCharsForBase(fromBase);
    switch (fromBase) {
      case 2:
        return 'Enter binary number (e.g., 1010)...';
      case 8:
        return 'Enter octal number (e.g., 755)...';
      case 10:
        return 'Enter decimal number (e.g., 255)...';
      case 16:
        return 'Enter hexadecimal number (e.g., FF)...';
      default:
        return `Valid characters: ${validChars.join(', ')}`;
    }
  };

  return (
    <ToolLayout
      title="Number Base Converter"
      description="Convert numbers between binary, octal, decimal, and hexadecimal bases"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-sm font-medium mr-2">From Base:</label>
            {numericSupportedBases.map((baseValue) => (
              <Button
                key={baseValue}
                onClick={() => handleBaseChange(baseValue)}
                variant={fromBase === baseValue ? 'default' : 'secondary'}
                size="sm"
              >
                {BASES[baseValue]} ({baseValue})
              </Button>
            ))}
          </div>
          
          <Button
            onClick={handleClearAll}
            variant="ghost"
            size="sm"
          >
            Clear All
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Input ({BASES[fromBase]} - Base {fromBase})
          </label>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            className="min-h-[96px] font-mono text-sm"
          />
          {fromBase === 16 && (
            <p className="text-xs text-muted-foreground mt-1">
              Tip: You can include or omit the "0x" prefix for hexadecimal numbers
            </p>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {(Object.values(results).some(v => v) || input) && (
          <div className="grid gap-4 md:grid-cols-2">
            {numericSupportedBases.map((baseValue) => {
              const name = BASES[baseValue];
              const value = results[baseValue];
              const formattedValue = value ? formatWithSpaces(value, baseValue) : '';
              const isFromBase = baseValue === fromBase;
              
              return (
                <div key={baseValue} className={`p-4 rounded-md border ${
                  isFromBase ? 'border-primary/30 bg-primary/5' : 'border-border'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        {name} (Base {baseValue})
                      </label>
                      {isFromBase && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                          Input
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!isFromBase && value && (
                        <Button
                          onClick={() => handleSwap(baseValue)}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                          title="Use this as input"
                        >
                          <RotateCw className="w-3 h-3" />
                        </Button>
                      )}
                      {value && (
                        <Button
                          onClick={() => handleCopy(value)}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm min-h-[3rem] flex items-center">
                    {formattedValue || (
                      <span className="text-muted-foreground italic">
                        {error ? 'Invalid input' : 'Enter a number above'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Number Bases
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div><strong>Binary (Base 2):</strong> Uses digits 0-1</div>
              <div><strong>Octal (Base 8):</strong> Uses digits 0-7</div>
              <div><strong>Decimal (Base 10):</strong> Uses digits 0-9</div>
              <div><strong>Hexadecimal (Base 16):</strong> Uses digits 0-9 and A-F</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Common Use Cases</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div><strong>Binary:</strong> Computer science, digital circuits</div>
              <div><strong>Octal:</strong> Unix file permissions (e.g., 755)</div>
              <div><strong>Decimal:</strong> Everyday mathematics</div>
              <div><strong>Hexadecimal:</strong> Colors (#FF0000), memory addresses</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default NumberBaseConverter; 