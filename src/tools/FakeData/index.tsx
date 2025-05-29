import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

// TODO: Add more comprehensive generation options
// TODO: Add ability to select locale
// TODO: Add ability to specify count for generated data

export default function FakeData() {
  const [dataType, setDataType] = useState('name.fullName');
  const [generatedData, setGeneratedData] = useState('');
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    // This is a simplified example. In a real application, you'd want a more robust
    // way to access nested properties and handle different data types.
    if (!dataType || count < 1) {
      setGeneratedData('');
      return;
    }

    const [category, subCategory] = dataType.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generatorFunction = (faker as any)[category]?.[subCategory];

    if (typeof generatorFunction !== 'function') {
      setGeneratedData('Invalid data type selected.');
      return;
    }

    try {
      const data = Array.from({ length: Math.max(1, count) }, () => generatorFunction());
      setGeneratedData(data.join('\n'));
    } catch (error) {
      console.error("Error generating fake data:", error);
      setGeneratedData('Error generating data. Check console.');
    }
  }, [dataType, count]); // Regenerate when dataType or count changes

  // A small subset of available faker modules and their methods
  // TODO: Expand this list or generate it dynamically
  const fakerOptions = {
    'address.streetAddress': 'Street Address',
    'address.city': 'City',
    'address.zipCode': 'Zip Code',
    'commerce.productName': 'Product Name',
    'commerce.price': 'Price',
    'company.companyName': 'Company Name',
    'date.past': 'Past Date',
    'date.future': 'Future Date',
    'finance.accountName': 'Account Name',
    'finance.amount': 'Amount',
    'hacker.phrase': 'Hacker Phrase',
    'internet.email': 'Email',
    'internet.userName': 'Username',
    'internet.url': 'URL',
    'lorem.words': 'Words',
    'lorem.sentence': 'Sentence',
    'lorem.paragraph': 'Paragraph',
    'name.firstName': 'First Name',
    'name.lastName': 'Last Name',
    'name.fullName': 'Full Name',
    'phone.number': 'Phone Number',
  };


  return (
    <ToolLayout
      title="Fake Data Generator"
      description="Generate various types of fake data for testing and development."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dataType" className="mb-2 block">
              Select Data Type:
            </Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger id="dataType" className="w-full">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(fakerOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="count" className="mb-2 block">
              Number to Generate:
            </Label>
            <Input
              id="count"
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              className="w-full"
            />
          </div>
        </div>
        {generatedData && (
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Generated Data:</Label>
            <Textarea
              readOnly
              value={generatedData}
              className="min-h-[100px] font-mono text-sm whitespace-pre-wrap bg-muted"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
} 