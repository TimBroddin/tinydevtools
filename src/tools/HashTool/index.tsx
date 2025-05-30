import { useState, useEffect, useRef, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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

  const performVerification = useCallback(async () => {
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
  }, [knownHash, compareMode, compareInput, compareFile, compareAlgorithm]);

  const generateHashes = useCallback(async () => {
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
  }, [input]);

  const generateFileHashes = useCallback(async () => {
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
  }, [selectedFile]);

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
  }, [input, selectedFile, mode, knownHash, compareAlgorithm, compareInput, compareFile, compareMode, generateHashes, generateFileHashes, performVerification]);

  
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
            <Button
              onClick={() => setMode('text')}
              variant={mode === 'text' ? 'default' : 'secondary'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Text Hash
            </Button>
            <Button
              onClick={() => setMode('file')}
              variant={mode === 'file' ? 'default' : 'secondary'}
            >
              <Hash className="w-4 h-4 mr-2" />
              File Hash
            </Button>
            <Button
              onClick={() => setMode('compare')}
              variant={mode === 'compare' ? 'default' : 'secondary'}
            >
              <Check className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </div>
          
          <Button
            onClick={handleClearAll}
            variant="ghost"
            size="sm"
          >
            Clear All
          </Button>
        </div>

        {/* Text Input Mode */}
        {mode === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Text to Hash
            </label>
            <Textarea
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to generate hashes..."
              className="min-h-[100px]"
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
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
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
              <Input
                type="text"
                value={knownHash}
                onChange={(e) => setKnownHash(e.target.value)}
                placeholder="Enter known hash value"
                className="font-mono"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Hash Algorithm
              </label>
              <Select value={compareAlgorithm} onValueChange={(value: HashAlgorithm) => setCompareAlgorithm(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {HASH_ALGORITHMS.map((alg) => (
                    <SelectItem key={alg} value={alg}>
                      {alg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mb-2">
              <Button 
                onClick={() => setCompareMode('text')} 
                variant={compareMode === 'text' ? 'default' : 'secondary'}
                size="sm"
              >
                Text
              </Button>
              <Button 
                onClick={() => setCompareMode('file')} 
                variant={compareMode === 'file' ? 'default' : 'secondary'}
                size="sm"
              >
                File
              </Button>
            </div>

            {compareMode === 'text' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Text to Verify
                </label>
                <Textarea
                  value={compareInput}
                  onChange={(e) => setCompareInput(e.target.value)}
                  placeholder="Enter text to generate hash for verification..."
                  className="min-h-[100px]"
                  rows={3}
                />
              </div>
            )}

            {compareMode === 'file' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select File to Verify
                </label>
                <Input
                  ref={compareFileInputRef}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCompareFile(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
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
                      <Button
                        onClick={() => handleCopyHash('known', knownHash)}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                      >
                        {copiedHash === 'known' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                      {knownHash}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Generated Hash ({compareAlgorithm})</h4>
                      <Button
                        onClick={() => handleCopyHash('generated', verificationResult.generatedHash)}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                      >
                        {copiedHash === 'generated' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
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
                    <Button
                      onClick={() => handleCopyHash(algorithm, hash)}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                    >
                      {copiedHash === algorithm ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
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
