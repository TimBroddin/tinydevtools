import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, RotateCcw, Shuffle } from 'lucide-react';
import { convertCase, CaseType } from './utils';

interface CaseOption {
  key: CaseType;
  label: string;
  description: string;
}

const caseOptions: CaseOption[] = [
  { key: 'uppercase', label: 'UPPERCASE', description: 'ALL LETTERS UPPERCASE' },
  { key: 'lowercase', label: 'lowercase', description: 'all letters lowercase' },
  { key: 'capitalize', label: 'Capitalize', description: 'First letter uppercase' },
  { key: 'titlecase', label: 'Title Case', description: 'First Letter Of Each Word' },
  { key: 'camelcase', label: 'camelCase', description: 'firstWordLowercaseRestUppercase' },
  { key: 'pascalcase', label: 'PascalCase', description: 'FirstLetterOfEachWordUppercase' },
  { key: 'snakecase', label: 'snake_case', description: 'words_separated_by_underscores' },
  { key: 'kebabcase', label: 'kebab-case', description: 'words-separated-by-hyphens' },
  { key: 'randomcase', label: 'rAnDoM cAsE', description: 'rAnDoMlY cApItAlIzEd' },
  { key: 'alternatingcase', label: 'aLtErNaTiNg', description: 'aLtErNaTiNg CaPiTaLiZaTiOn' },
  { key: 'inversecase', label: 'iNVERSE cASE', description: 'fLIPS tHE cASE oF eACH lETTER' }
];

const TextCase = () => {
  const [input, setInput] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('uppercase');
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!input.trim()) {
      setResult('');
      return;
    }

    setResult(convertCase(input, selectedCase));
  }, [input, selectedCase]);

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleRandomizeInput = () => {
    if (input) {
      setInput(convertCase(input, 'randomcase'));
    }
  };

  const selectedCaseOption = caseOptions.find(option => option.key === selectedCase);

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between different cases: uppercase, lowercase, camelCase, snake_case, and more"
    >
      <div className="space-y-6">
        <div className="flex justify-end gap-2">
          <button
            onClick={handleRandomizeInput}
            className="btn btn-secondary px-3 py-2 text-sm flex items-center gap-1"
            disabled={!input}
          >
            <Shuffle className="w-4 h-4" />
            Randomize
          </button>
          <button
            onClick={handleClear}
            className="btn btn-ghost px-3 py-2 text-sm flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Enter Text to Convert
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            className="tool-textarea min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">
            Select Case Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {caseOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedCase(option.key)}
                className={`btn px-3 py-2 text-sm ${
                  selectedCase === option.key ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {input && (
          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedCaseOption?.label}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCaseOption?.description}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className={`btn px-4 py-2 flex items-center gap-2 transition-colors ${
                    copied
                      ? 'btn-ghost text-green-600'
                      : 'btn-primary'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Result'}
                </button>
              </div>
              <div className="bg-muted p-4 rounded-md font-mono text-base break-words">
                {result || ''}
              </div>
            </div>
          </div>
        )}

        {!input && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Enter some text to see conversions</p>
            <p className="text-sm">Type your text above to get started</p>
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-medium mb-3">Case Conversion Types</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <strong>UPPERCASE:</strong> All letters converted to uppercase
            </div>
            <div>
              <strong>lowercase:</strong> All letters converted to lowercase
            </div>
            <div>
              <strong>Capitalize:</strong> Only the first letter is uppercase
            </div>
            <div>
              <strong>Title Case:</strong> First letter of each word is uppercase
            </div>
            <div>
              <strong>camelCase:</strong> First word lowercase, rest start with uppercase
            </div>
            <div>
              <strong>PascalCase:</strong> Every word starts with uppercase, no spaces
            </div>
            <div>
              <strong>snake_case:</strong> Words separated by underscores, all lowercase
            </div>
            <div>
              <strong>kebab-case:</strong> Words separated by hyphens, all lowercase
            </div>
            <div>
              <strong>rAnDoM cAsE:</strong> Each letter randomly uppercase or lowercase
            </div>
            <div>
              <strong>aLtErNaTiNg:</strong> Letters alternate between cases
            </div>
            <div>
              <strong>iNVERSE:</strong> Flips the case of each letter
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TextCase;
