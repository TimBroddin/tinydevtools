import { createFileRoute } from '@tanstack/react-router'
import JsonFormatter from '../../tools/JsonBeautifier'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/formatters/json')({
  component: JsonFormatter,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "JSON Formatter",
          description: "Format JSON data to make it more readable and easier to understand",
          keywords: "json, formatter, format, pretty, pretty print",
        }),
      ],
    };
  },
})
