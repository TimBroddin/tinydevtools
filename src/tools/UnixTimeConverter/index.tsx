import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { convertTimestamp, formatTimestamp } from './utils';

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
            <input
              type="text"
              value={timestamp}
              onChange={handleTimestampChange}
              className="tool-input"
              placeholder="Enter Unix timestamp"
            />
            <button
              onClick={useCurrentTime}
              className="btn btn-secondary px-3 py-2 whitespace-nowrap"
            >
              Now
            </button>
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
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                handleDateTimeChange();
              }}
              className="tool-input"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                handleDateTimeChange();
              }}
              className="tool-input"
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
    </ToolLayout>
  );
};

export default UnixTimeConverter;