import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Copy, Check } from 'lucide-react';
import { 
  tailwindColorsV3, 
  tailwindColorsV4, 
  formatColorValue, 
  hexToRgb, 
  hexToHsl, 
  type ColorFormat, 
  type TailwindVersion 
} from './utils';
import { Button } from '@/components/ui/button';

const TailwindColors = () => {
  const [version, setVersion] = useState<TailwindVersion>('v4');
  const [format, setFormat] = useState<ColorFormat>('oklch');
  const [copiedColor, setCopiedColor] = useState<string>('');

  const currentColors = version === 'v3' ? tailwindColorsV3 : tailwindColorsV4;
  const availableFormats = version === 'v3' 
    ? ['hex', 'rgb', 'hsl', 'tailwind'] 
    : ['oklch', 'tailwind'];

  // Reset format if current format is not available for the selected version
  const handleVersionChange = (newVersion: TailwindVersion) => {
    setVersion(newVersion);

    // Determine the valid formats for the NEW version
    const validFormatsForNewVersion = newVersion === 'v3'
      ? ['hex', 'rgb', 'hsl', 'tailwind']
      : ['oklch', 'tailwind'];

    // Check if the current format (from state) is valid for the new version
    if (!validFormatsForNewVersion.includes(format)) {
      // If the current format is not valid for the new version,
      // set a default format for that new version.
      if (newVersion === 'v4') {
        setFormat('oklch'); // Default for v4
      } else { // newVersion must be 'v3'
        setFormat('hex');   // Default for v3 (e.g., if coming from 'oklch' in v4)
      }
    }
    // If the current format IS valid for the new version, no change to format is needed.
  };

  const handleCopyColor = async (colorName: string, shade: string, value: string) => {
    const formattedValue = formatColorValue(value, format, colorName, shade, version);
    await navigator.clipboard.writeText(formattedValue);
    setCopiedColor(`${colorName}-${shade}`);
    setTimeout(() => setCopiedColor(''), 1000);
  };

  const getDisplayValue = (value: string, colorName: string, shade: string) => {
    if (version === 'v4') {
      switch (format) {
        case 'oklch':
          return value;
        case 'tailwind':
          return `${colorName}-${shade}`;
        default:
          return value;
      }
    }

    // v3 logic
    switch (format) {
      case 'rgb': {
        const rgb = hexToRgb(value);
        return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : value;
      }
      case 'hsl': {
        const hsl = hexToHsl(value);
        return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : value;
      }
      case 'tailwind':
        return `${colorName}-${shade}`;
      default:
        return value;
    }
  };

  // For v4 colors, we need to extract actual color values for background
  const getBackgroundStyle = (value: string) => {
    if (version === 'v3') {
      return { backgroundColor: value };
    }
    // For v4, use the OKLCH value directly - modern browsers support it
    return { backgroundColor: value };
  };

  return (
    <ToolLayout
      title="Tailwind Color Grid"
      description="Browse and copy Tailwind CSS colors in different formats"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium mr-2">Version:</span>
            <div className="flex gap-1">
              {(['v3', 'v4'] as TailwindVersion[]).map((v) => (
                <Button
                  key={v}
                  onClick={() => handleVersionChange(v)}
                  variant={version === v ? 'default' : 'secondary'}
                  size="sm"
                >
                  {v.toUpperCase()} {v === 'v3' ? '(RGB)' : '(OKLCH)'}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium mr-2">Copy as:</span>
            <div className="flex gap-1">
              {availableFormats.map((f) => (
                <Button
                  key={f}
                  onClick={() => setFormat(f as ColorFormat)}
                  variant={format === f ? 'default' : 'secondary'}
                  size="sm"
                >
                  {f.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(currentColors).map(([colorName, shades]) => (
            <div key={colorName}>
              <h3 className="text-sm font-medium mb-3 capitalize">{colorName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-11 gap-2">
                {Object.entries(shades as Record<string, string>).map(([shade, value]) => {
                  const isLight = parseInt(shade) <= 400;
                  const colorKey = `${colorName}-${shade}`;
                  const isCopied = copiedColor === colorKey;

                  return (
                    <div
                      key={shade}
                      className="group relative aspect-square rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105 shadow-sm border border-border/20"
                      style={getBackgroundStyle(value)}
                      onClick={() => handleCopyColor(colorName, shade, value)}
                      title={`Click to copy ${getDisplayValue(value, colorName, shade)}`}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        {isCopied ? (
                          <Check className="w-4 h-4 text-white drop-shadow-lg" />
                        ) : (
                          <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                        )}
                      </div>
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className={`text-xs font-medium text-center ${
                          isLight ? 'text-gray-800' : 'text-white'
                        } drop-shadow`}>
                          {shade}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-medium">About Tailwind Colors</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This tool displays the complete Tailwind CSS color palette for both v3 and v4. 
              Click any color to copy its value in your preferred format.
            </p>
            <p>
              <strong>v3 (RGB):</strong> Traditional RGB/HEX colors compatible with all browsers. 
              Formats: HEX, RGB, HSL, and Tailwind class names.
            </p>
            <p>
              <strong>v4 (OKLCH):</strong> Modern OKLCH color space providing more perceptually uniform colors 
              and wider color gamut. Formats: OKLCH and Tailwind class names.
            </p>
            <p>
              Each color family includes shades from 50 (lightest) to 950 (darkest), providing a comprehensive 
              range for your design needs.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TailwindColors;
