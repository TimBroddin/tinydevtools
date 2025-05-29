import { createFileRoute } from "@tanstack/react-router";
import NumberBaseConverter from "@/tools/NumberBaseConverter";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/converters/number-base")({
  component: NumberBaseConverter,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Number Base Converter",
          description: "Convert numbers between different bases (binary, octal, decimal, hexadecimal)",
          keywords: "number, base, converter, binary, octal, decimal, hexadecimal",
        }),
      ],
    };
  },
}); 