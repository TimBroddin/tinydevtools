import { useState, useEffect, useRef } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, FileText, Hash, Check, X, Info } from 'lucide-react';
import { 
  generateAllHashes, 
  generateHash,
  compareHashes, 
  getHashInfo,
  HashAlgorithm, 
  HASH_ALGORITHMS 
} from './utils';

type Mode = 'text' | 'file' | 'compare';

const HashTool = () => {
  const [input, setInput] = useState<string>('');
  const [mode, setMode] = useState<Mode>('text');
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({} as Record<HashAlgorithm, string>);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Compare mode states
  const [knownHash, setKnownHash] = useState<string>('');
  const [compareAlgorithm, setCompareAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [compareInput, setCompareInput] = useState<string>('');
  const [compareFile, setCompareFile] = useState<File | null>(null);
  const [compareMode, setCompareMode] = useState<'text' | 'file'>('text');
  const [verificationResult, setVerificationResult] = useState<{ match: boolean; generatedHash: string } | null>(null);
  
  const [copiedHash, setCopiedHash] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compareFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'text' && input.trim()) {
      generateHashes();
    } else if (mode === 'file' && selectedFile) {
      generateFileHashes();
    } else if (mode === 'compare') {
      performVerification();
    } else {
      setHashes({} as Record<HashAlgorithm, string>);
      setError('');
    }
  }, [input, selectedFile, mode, knownHash, compareAlgorithm, compareInput, compareFile, compareMode]);

  const performVerification = async () => {
    if (!knownHash.trim()) {
      setVerificationResult(null);
      return;
    }

    const contentToHash = compareMode === 'text' ? compareInput : (compareFile ? await readFileAsText(compareFile) : '');
    
    if (!contentToHash.trim()) {
      setVerificationResult(null);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const generatedHash = await generateHash(contentToHash, compareAlgorithm);
      const match = compareHashes(knownHash, generatedHash);
      setVerificationResult({ match, generatedHash });
    } catch (err) {
      setError(`Verification failed: ${(err as Error).message}`);
      setVerificationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHashes = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await generateAllHashes(input);
      setHashes(result);
    } catch (err) {
      setError(`Failed to generate hashes: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFileHashes = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const fileContent = await readFileAsText(selectedFile);
      const result = await generateAllHashes(fileContent);
      setHashes(result);
    } catch (err) {
      setError(`Failed to generate file hashes: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setInput('');
    }
  };

  const handleCopyHash = async (identifier: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(identifier);
      setTimeout(() => setCopiedHash(''), 2000);
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const handleClearAll = () => {
    setInput('');
    setSelectedFile(null);
    setHashes({} as Record<HashAlgorithm, string>);
    setError('');
    setKnownHash('');
    setCompareAlgorithm('SHA-256');
    setCompareInput('');
    setCompareFile(null);
    setCompareMode('text');
    setVerificationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (compareFileInputRef.current) {
      compareFileInputRef.current.value = '';
    }
  };

  return (
    <ToolLayout
      title="Hash Generator & Verifier"
      description="Generate and verify hashes using MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms"
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('text')}
              className={`btn px-4 py-2 ${
                mode === 'text' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Text Hash
            </button>
            <button
              onClick={() => setMode('file')}
              className={`btn px-4 py-2 ${
                mode === 'file' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Hash className="w-4 h-4 mr-2" />
              File Hash
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`btn px-4 py-2 ${
                mode === 'compare' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Check className="w-4 h-4 mr-2" />
              Verify
            </button>
          </div>
          
          <button
            onClick={handleClearAll}
            className="btn btn-ghost px-3 py-2 text-sm"
          >
            Clear All
          </button>
        </div>

        {/* Text Input Mode */}
        {mode === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Text to Hash
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to generate hashes..."
              className="tool-textarea"
              rows={4}
            />
          </div>
        )}

        {/* File Input Mode */}
        {mode === 'file' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Select File to Hash
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {selectedFile && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Compare Mode */}
        {mode === 'compare' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Known Hash (to verify against)
              </label>
              <input
                type="text"
                value={knownHash}
                onChange={(e) => setKnownHash(e.target.value)}
                placeholder="Enter the expected hash value..."
                className="tool-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Hash Algorithm
              </label>
              <select
                value={compareAlgorithm}
                onChange={(e) => setCompareAlgorithm(e.target.value as HashAlgorithm)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {HASH_ALGORITHMS.map((algorithm) => (
                  <option key={algorithm} value={algorithm}>
                    {algorithm}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setCompareMode('text');
                  setCompareFile(null);
                  if (compareFileInputRef.current) {
                    compareFileInputRef.current.value = '';
                  }
                }}
                className={`btn px-4 py-2 ${
                  compareMode === 'text' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => {
                  setCompareMode('file');
                  setCompareInput('');
                }}
                className={`btn px-4 py-2 ${
                  compareMode === 'file' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                File Input
              </button>
            </div>

            {compareMode === 'text' ? (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content to Verify
                </label>
                <textarea
                  value={compareInput}
                  onChange={(e) => setCompareInput(e.target.value)}
                  placeholder="Enter the content you want to verify..."
                  className="tool-textarea"
                  rows={4}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">
                  File to Verify
                </label>
                <input
                  ref={compareFileInputRef}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCompareFile(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {compareFile && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <strong>File:</strong> {compareFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Size:</strong> {(compareFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {verificationResult && (
              <div className="space-y-4">
                <div className={`p-4 rounded-md flex items-center gap-2 ${
                  verificationResult.match 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {verificationResult.match ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="font-medium">✅ Verification successful! The content matches the known hash.</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      <span className="font-medium">❌ Verification failed! The content does not match the known hash.</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Known Hash ({compareAlgorithm})</h4>
                      <button
                        onClick={() => handleCopyHash('known', knownHash)}
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
                      >
                        {copiedHash === 'known' ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                      {knownHash}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Generated Hash ({compareAlgorithm})</h4>
                      <button
                        onClick={() => handleCopyHash('generated', verificationResult.generatedHash)}
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
                      >
                        {copiedHash === 'generated' ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                      {verificationResult.generatedHash}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              {mode === 'compare' ? 'Verifying...' : 'Generating hashes...'}
            </span>
          </div>
        )}

        {/* Hash Results */}
        {(mode === 'text' || mode === 'file') && Object.keys(hashes).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Generated Hashes</h3>
            {HASH_ALGORITHMS.map((algorithm) => {
              const hash = hashes[algorithm];
              const hashInfo = getHashInfo(algorithm);
              
              if (!hash) return null;
              
              return (
                <div key={algorithm} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{algorithm}</h4>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
                          {hashInfo.description}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyHash(algorithm, hash)}
                      className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
                    >
                      {copiedHash === algorithm ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                    {hash.startsWith('Error:') ? (
                      <span className="text-destructive">{hash}</span>
                    ) : (
                      hash
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Information Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-medium">About Hash Functions</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Hash functions are cryptographic algorithms that transform input data of any size into a fixed-size string of characters.
              They are commonly used for data integrity verification, password storage, and digital signatures.
            </p>
            
            <div className="space-y-1">
              <p><strong>Available Algorithms:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>MD5:</strong> Fast but cryptographically broken. Use only for non-security purposes like checksums.</li>
                <li><strong>SHA-1:</strong> Deprecated for cryptographic use due to vulnerabilities. Still used in some legacy systems.</li>
                <li><strong>SHA-256:</strong> Widely used and considered secure for most applications. Part of Bitcoin and many security protocols.</li>
                <li><strong>SHA-384/512:</strong> More secure variants of SHA-2 with longer hash lengths for high-security applications.</li>
              </ul>
            </div>

            <div className="space-y-1 mt-4">
              <p><strong>Tool Features:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Text Hash:</strong> Generate hashes from any text input using all algorithms simultaneously.</li>
                <li><strong>File Hash:</strong> Upload files to generate hashes of their contents.</li>
                <li><strong>Verify:</strong> Verify if content matches a known hash by providing the expected hash, algorithm, and content.</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs">
                <strong>Use Case Example:</strong> Download a file and its SHA-256 checksum. Use the "Verify" mode to paste the checksum, 
                select SHA-256, upload the file, and verify the file hasn't been corrupted during download.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default HashTool;
