import { createFileRoute } from '@tanstack/react-router'
import JsonFormatter from '../../tools/JsonBeautifier'

export const Route = createFileRoute('/formatters/json')({
  component: JsonFormatter,
  head: () => {
    return {
      meta: [
        {
          title: "JSON Formatter - tinydev.tools",
        },
      ],
    };
  },
})
