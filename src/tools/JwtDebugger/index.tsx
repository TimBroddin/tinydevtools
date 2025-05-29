import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, Check, X } from 'lucide-react';
import { decodeJwt, formatJwt, verifyJwt, encodeJwt } from './utils';
import { JWT_ALGORITHMS, type JwtAlgorithm } from './types';
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

const JwtDebugger = () => {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState<JwtAlgorithm>('HS256');
  const [decoded, setDecoded] = useState({ header: '', payload: '', signature: '', error: '' });
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      const result = decodeJwt(token);
      setDecoded({ ...result, error: result.error || '' });
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
              <Button
                onClick={handlePaste}
                variant="link"
                size="sm"
                className="text-xs h-auto p-0"
              >
                Paste
              </Button>
              <Button
                onClick={handleClear}
                variant="link"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground h-auto p-0"
              >
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={token}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setToken(e.target.value);
              setIsEditing(false);
            }}
            placeholder="Enter your JWT token..."
            className="min-h-[100px] font-mono text-sm"
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
                  <Button
                    onClick={() => handleCopy(decoded.header)}
                    variant="link"
                    size="sm"
                    className="text-xs flex items-center gap-1 h-auto p-0"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={decoded.header}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleHeaderChange(e.target.value)}
                  placeholder="{}"
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Payload</label>
                  <Button
                    onClick={() => handleCopy(decoded.payload)}
                    variant="link"
                    size="sm"
                    className="text-xs flex items-center gap-1 h-auto p-0"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={decoded.payload}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePayloadChange(e.target.value)}
                  placeholder="{}"
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Verify Signature
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <Select value={algorithm} onValueChange={(value: JwtAlgorithm) => setAlgorithm(value)}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="Algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      {JWT_ALGORITHMS.map(alg => (
                        <SelectItem key={alg} value={alg}>{alg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    value={secret}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecret(e.target.value)}
                    placeholder="Enter your secret key..."
                    className="flex-1"
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
                  <Button
                    onClick={handleEncode}
                  >
                    Encode Changes
                  </Button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Signature</label>
                  <Button
                    onClick={() => handleCopy(decoded.signature)}
                    variant="link"
                    size="sm"
                    className="text-xs flex items-center gap-1 h-auto p-0"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
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