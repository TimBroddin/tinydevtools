import { createFileRoute } from "@tanstack/react-router";
import NumberBaseConverter from "@/tools/NumberBaseConverter";

export const Route = createFileRoute("/converters/number-base")({
  component: NumberBaseConverter,
  head: () => {
    return {
      meta: [
        {
          title: "Number Base Converter - tinydev.tools",
        },
      ],
    };
  },
}); 