import { createFileRoute } from '@tanstack/react-router'
import TextDebuggerTool from '../../tools/TextDebugger'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/debuggers/text')({
  component: TextDebuggerTool,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Text Debugger",
          description: "Debug and analyze text content to check for errors, statistics, and more",
          keywords: "text, debugger, analyze, statistics, errors",
        }),
      ],
    };
  },
})
