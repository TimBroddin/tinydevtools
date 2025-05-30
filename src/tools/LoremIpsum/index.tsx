import { useState, useEffect, useCallback } from "react";
import ToolLayout from "../../components/ToolLayout";
import { Copy, Check, RefreshCw } from "lucide-react";
import { generateLoremIpsum, LoremIpsumOptions, LoremUnit } from "./utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const LoremIpsumTool = () => {
  const [options, setOptions] = useState<LoremIpsumOptions>({
    units: "paragraphs",
    count: 5,
    startsWithLoremIpsum: true,
  });
  const [generatedText, setGeneratedText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = useCallback(() => {
    const text = generateLoremIpsum(options);
    setGeneratedText(text);
  }, [options]);

  useEffect(() => {
    handleGenerate();
  }, [options, handleGenerate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    setOptions((prev: LoremIpsumOptions) => ({ ...prev, count: value }));
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text in various formats (paragraphs, sentences, words)."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="space-y-2">
            <Label htmlFor="count">Number of</Label>
            <Input
              id="count"
              type="number"
              value={options.count}
              onChange={handleCountChange}
              min="1"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Units</Label>
            <RadioGroup
              value={options.units}
              onValueChange={(value: string) =>
                setOptions((prev: LoremIpsumOptions) => ({
                  ...prev,
                  units: value as LoremUnit,
                }))
              }
              className="flex space-x-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paragraphs" id="paragraphs" />
                <Label htmlFor="paragraphs">Paragraphs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sentences" id="sentences" />
                <Label htmlFor="sentences">Sentences</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="words" id="words" />
                <Label htmlFor="words">Words</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex space-x-2 items-center gap-4">
          <Button onClick={handleGenerate} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <div className="flex items-center space-x-2">
          <Switch
            id="startsWithLorem"
            checked={options.startsWithLoremIpsum}
            onCheckedChange={(checked: boolean) =>
              setOptions((prev: LoremIpsumOptions) => ({
                ...prev,
                startsWithLoremIpsum: checked,
              }))
            }
          />
          <Label htmlFor="startsWithLorem">
            Start with "Lorem ipsum dolor sit amet..."
          </Label>
        </div>
        </div>

        {generatedText && (
          <div className="space-y-2">
            <Label>Generated Text</Label>
            <Textarea
              value={generatedText}
              readOnly
              className="min-h-[200px]"
              rows={10}
            />
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default LoremIpsumTool;
