export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const celsiusToKelvin = (celsius: number): number => {
  return celsius + 273.15;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

export const fahrenheitToKelvin = (fahrenheit: number): number => {
  const celsius = fahrenheitToCelsius(fahrenheit);
  return celsiusToKelvin(celsius);
};

export const kelvinToCelsius = (kelvin: number): number => {
  return kelvin - 273.15;
};

export const kelvinToFahrenheit = (kelvin: number): number => {
  const celsius = kelvinToCelsius(kelvin);
  return celsiusToFahrenheit(celsius);
}; 