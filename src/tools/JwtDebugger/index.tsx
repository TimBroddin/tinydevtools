import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, Check, X } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015, vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '../../contexts/ThemeContext';
import { decodeJwt, formatJwt, verifyJwt, encodeJwt } from './utils';
import { JWT_ALGORITHMS, type JwtAlgorithm } from './types';

const JwtDebugger = () => {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState<JwtAlgorithm>('HS256');
  const [decoded, setDecoded] = useState({ header: '', payload: '', signature: '', error: '' });
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!isEditing) {
      const result = decodeJwt(token);
      setDecoded(result);
      setIsValid(null);
    }
  }, [token, isEditing]);

  useEffect(() => {
    if (token && secret) {
      verifyJwt(token, secret, algorithm).then(setIsValid);
    } else {
      setIsValid(null);
    }
  }, [token, secret, algorithm]);

  const handleHeaderChange = (value: string) => {
    setDecoded(prev => ({ ...prev, header: value, error: '' }));
    setIsEditing(true);
  };

  const handlePayloadChange = (value: string) => {
    setDecoded(prev => ({ ...prev, payload: value, error: '' }));
    setIsEditing(true);
  };

  const handleEncode = async () => {
    try {
      const newToken = await encodeJwt(
        decoded.header,
        decoded.payload,
        secret,
        algorithm
      );
      setToken(newToken);
      setIsEditing(false);
    } catch (error) {
      setDecoded(prev => ({
        ...prev,
        error: (error as Error).message
      }));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setToken(formatJwt(text));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleClear = () => {
    setToken('');
    setSecret('');
    setDecoded({ header: '', payload: '', signature: '', error: '' });
    setIsValid(null);
    setIsEditing(false);
  };

  const syntaxStyle = theme === 'dark' ? vs2015 : vs;

  return (
    <ToolLayout
      title="JWT Debugger"
      description="Decode and verify JSON Web Tokens"
    >
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Encoded JWT
            </label>
            <div className="flex gap-2">
              <button
                onClick={handlePaste}
                className="text-xs text-primary hover:text-primary/80"
              >
                Paste
              </button>
              <button
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setIsEditing(false);
            }}
            placeholder="Enter your JWT token..."
            className="tool-textarea font-mono text-sm"
          />
        </div>

        {decoded.error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm">
            {decoded.error}
          </div>
        )}

        {(decoded.header || token) && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Header</label>
                  <button
                    onClick={() => handleCopy(decoded.header)}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <textarea
                  value={decoded.header}
                  onChange={(e) => handleHeaderChange(e.target.value)}
                  placeholder="{}"
                  className="tool-textarea font-mono text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Payload</label>
                  <button
                    onClick={() => handleCopy(decoded.payload)}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <textarea
                  value={decoded.payload}
                  onChange={(e) => handlePayloadChange(e.target.value)}
                  placeholder="{}"
                  className="tool-textarea font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Verify Signature
                </label>
                <div className="flex gap-4">
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as JwtAlgorithm)}
                    className="tool-input w-32"
                  >
                    {JWT_ALGORITHMS.map(alg => (
                      <option key={alg} value={alg}>{alg}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter your secret key..."
                    className="tool-input flex-1"
                  />
                  {isValid !== null && (
                    <div className={`flex items-center gap-2 px-4 rounded-md ${
                      isValid 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      {isValid ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleEncode}
                    className="btn btn-primary px-4 py-2"
                  >
                    Encode Changes
                  </button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Signature</label>
                  <button
                    onClick={() => handleCopy(decoded.signature)}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
                  {decoded.signature}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default JwtDebugger;