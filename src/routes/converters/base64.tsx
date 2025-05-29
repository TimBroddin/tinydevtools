import { createFileRoute } from "@tanstack/react-router";
import Base64Tool from "../../tools/Base64Tool";

export const Route = createFileRoute("/converters/base64")({
  component: Base64Tool,
  head: () => {
    return {
      meta: [
        {
          title: "Base64 Converter - tinydev.tools",
        },
      ],
    };
  },
});
