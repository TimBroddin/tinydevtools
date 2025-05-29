import { createFileRoute } from '@tanstack/react-router';
import LoremIpsumTool from '../../tools/LoremIpsum'; // Adjusted path to point to the tool's index.tsx
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/generators/lorem-ipsum')({
  component: LoremIpsumPage,
  head: () => {
    return {
      meta: [
        ...seo({
            title: "Lorem Ipsum Generator",
            description: "Generate placeholder text in various formats (paragraphs, sentences, words).",
            keywords: "lorem ipsum, generator, placeholder text, text generator, dummy content",
        }),
      ],
    };
  },
});

function LoremIpsumPage() {
  return (
    <LoremIpsumTool />
  );
} 