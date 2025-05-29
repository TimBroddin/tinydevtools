import { createFileRoute } from "@tanstack/react-router";
import Base64Tool from "../../tools/Base64Tool";
import { seo } from "@/lib/seo";


export const Route = createFileRoute("/converters/base64")({
  component: Base64Tool,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Base64 Converter",
          description: "Convert text to and from Base64 encoding.",
          keywords: "base64, converter, encode, decode",
        }),
      ],
    };
  },
});
