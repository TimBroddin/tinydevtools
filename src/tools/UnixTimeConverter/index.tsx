import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { convertTimestamp, formatTimestamp } from './utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UnixTimeConverter = () => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  useEffect(() => {
    // Initialize with current time
    const now = new Date();
    const unixTime = Math.floor(now.getTime() / 1000);
    setCurrentTimestamp(unixTime);
    
    // Format date and time for the inputs
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(' ')[0];
    
    setDate(formattedDate);
    setTime(formattedTime);
    setTimestamp(unixTime.toString());
    
    // Update current timestamp every second
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(new Date().getTime() / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimestamp(value);
    
    if (value.trim() === '') {
      return;
    }
    
    try {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        const { dateString, timeString } = convertTimestamp(numericValue);
        setDate(dateString);
        setTime(timeString);
      }
    } catch (error) {
      console.error('Invalid timestamp:', error);
    }
  };

  const handleDateTimeChange = () => {
    if (date && time) {
      try {
        const dateTimeString = `${date}T${time}`;
        const dateObj = new Date(dateTimeString);
        const unixTime = Math.floor(dateObj.getTime() / 1000);
        
        if (!isNaN(unixTime)) {
          setTimestamp(unixTime.toString());
        }
      } catch (error) {
        console.error('Invalid date/time:', error);
      }
    }
  };

  const useCurrentTime = () => {
    const now = new Date();
    const unixTime = Math.floor(now.getTime() / 1000);
    setTimestamp(unixTime.toString());
    
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(' ')[0];
    
    setDate(formattedDate);
    setTime(formattedTime);
  };

  return (
    <ToolLayout
      title="Unix Time Converter"
      description="Convert between Unix timestamps and human-readable dates"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Unix Timestamp
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={timestamp}
              onChange={handleTimestampChange}
              placeholder="Enter Unix timestamp"
            />
            <Button
              onClick={useCurrentTime}
              variant="secondary"
              className="whitespace-nowrap"
            >
              Now
            </Button>
          </div>
          <p className="text-xs mt-2 text-muted-foreground">
            Current timestamp: {currentTimestamp}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Human-readable Date & Time
          </label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDate(e.target.value);
                handleDateTimeChange();
              }}
            />
            <Input
              type="time"
              value={time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTime(e.target.value);
                handleDateTimeChange();
              }}
              step="1"
            />
          </div>
        </div>
      </div>

      {timestamp && (
        <div className="mt-8">
          <h3 className="font-medium mb-3">Formatted Results</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Local Time</div>
                <div>{formatTimestamp(parseInt(timestamp, 10), 'local')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">UTC</div>
                <div>{formatTimestamp(parseInt(timestamp, 10), 'utc')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">ISO 8601</div>
                <div>{formatTimestamp(parseInt(timestamp, 10), 'iso')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Relative Time</div>
                <div>{formatTimestamp(parseInt(timestamp, 10), 'relative')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          About Unix Time (Epoch Time)
        </h3>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Unix time, also known as Epoch time, POSIX time, or Unix timestamp, is a system for describing a point in time.
            It is the number of seconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970, not counting leap seconds.
          </p>
          <div className="space-y-1">
            <p className="font-medium text-gray-700 dark:text-gray-300">Key Characteristics:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Simplicity:</strong> Represents time as a single integer, making it easy to store and compute differences.</li>
              <li><strong>Universality:</strong> Independent of time zones and daylight saving rules, providing a global standard (always UTC).</li>
              <li><strong>Usage:</strong> Widely used in operating systems, file formats, programming languages, and databases.</li>
              <li><strong>Millisecond Precision:</strong> While the standard is seconds, some systems use milliseconds since epoch (this tool uses seconds).</li>
            </ul>
          </div>
          <p className="pt-2">
            This tool helps you convert Unix timestamps to human-readable dates and vice-versa, and also displays the current Unix timestamp.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default UnixTimeConverter;