import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  celsiusToFahrenheit,
  celsiusToKelvin,
  fahrenheitToCelsius,
  fahrenheitToKelvin,
  kelvinToCelsius,
  kelvinToFahrenheit,
} from './utils';

const TemperatureConverter = () => {
  const [celsius, setCelsius] = useState<string>('0');
  const [fahrenheit, setFahrenheit] = useState<string>(celsiusToFahrenheit(0).toFixed(2));
  const [kelvin, setKelvin] = useState<string>(celsiusToKelvin(0).toFixed(2));

  const handleCelsiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCelsius(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setFahrenheit('');
      setKelvin('');
      return;
    }
    const c = parseFloat(value);
    setFahrenheit(celsiusToFahrenheit(c).toFixed(2));
    setKelvin(celsiusToKelvin(c).toFixed(2));
  };

  const handleFahrenheitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFahrenheit(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setCelsius('');
      setKelvin('');
      return;
    }
    const f = parseFloat(value);
    const c = fahrenheitToCelsius(f);
    setCelsius(c.toFixed(2));
    setKelvin(fahrenheitToKelvin(f).toFixed(2));
  };

  const handleKelvinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKelvin(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setCelsius('');
      setFahrenheit('');
      return;
    }
    const k = parseFloat(value);
    const c = kelvinToCelsius(k);
    setCelsius(c.toFixed(2));
    setFahrenheit(kelvinToFahrenheit(k).toFixed(2));
  };

 useEffect(() => {
    // Set default Celsius to 0 and calculate F and K
    const initialCelsius = 0;
    setCelsius(initialCelsius.toString());
    setFahrenheit(celsiusToFahrenheit(initialCelsius).toFixed(2));
    setKelvin(celsiusToKelvin(initialCelsius).toFixed(2));
  }, []);


  return (
    <ToolLayout
      title="Temperature Converter"
      description="Convert temperatures between Celsius, Fahrenheit, and Kelvin."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="celsius" className="block text-sm font-medium mb-2">
            Celsius (°C)
          </Label>
          <Input
            id="celsius"
            type="number"
            value={celsius}
            onChange={handleCelsiusChange}
            placeholder="Enter Celsius"
            autoFocus
          />
        </div>
        <div>
          <Label htmlFor="fahrenheit" className="block text-sm font-medium mb-2">
            Fahrenheit (°F)
          </Label>
          <Input
            id="fahrenheit"
            type="number"
            value={fahrenheit}
            onChange={handleFahrenheitChange}
            placeholder="Enter Fahrenheit"
          />
        </div>
        <div>
          <Label htmlFor="kelvin" className="block text-sm font-medium mb-2">
            Kelvin (K)
          </Label>
          <Input
            id="kelvin"
            type="number"
            value={kelvin}
            onChange={handleKelvinChange}
            placeholder="Enter Kelvin"
          />
        </div>
      </div>
    </ToolLayout>
  );
};

export default TemperatureConverter;
