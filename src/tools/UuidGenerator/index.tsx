import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy } from 'lucide-react';
import { generateUuid } from './utils';
import { UUID_TYPES, type UuidType } from './types';

const UuidGenerator = () => {
  const [type, setType] = useState<UuidType>('v4');
  const [count, setCount] = useState<number>(5);
  const [uuids, setUuids] = useState<string[]>([]);

  useEffect(() => {
    setUuids(generateUuid(type, count));
  }, [type, count]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate different types of unique identifiers"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              UUID Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as UuidType)}
              className="tool-input"
            >
              {UUID_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Count
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="tool-input w-32"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Generated UUIDs
            </label>
            <button
              onClick={handleCopyAll}
              className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
            >
              <Copy className="w-3 h-3" />
              Copy All
            </button>
          </div>
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-muted rounded-md font-mono text-sm group"
              >
                <span className="flex-1">{uuid}</span>
                <button
                  onClick={() => handleCopy(uuid)}
                  className="text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium mb-2">About UUID Types</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>UUID v1:</strong> Time-based version using timestamp and node ID</p>
            <p><strong>UUID v3:</strong> Name-based version using MD5 hashing</p>
            <p><strong>UUID v4:</strong> Random or pseudo-random version</p>
            <p><strong>UUID v5:</strong> Name-based version using SHA-1 hashing</p>
            <p><strong>ULID:</strong> Universally Unique Lexicographically Sortable Identifier</p>
            <p><strong>Object ID:</strong> 12-byte MongoDB-style identifier</p>
            <p><strong>Nano ID:</strong> Tiny, secure, URL-friendly unique string ID</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default UuidGenerator;