import { createFileRoute } from '@tanstack/react-router'
import TextCaseTool from '@/tools/TextCase'

export const Route = createFileRoute('/converters/textcase')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "Text Case Converter - tinydev.tools",
        },
      ],
    };
  },
})

function RouteComponent() {
  return <TextCaseTool />
}
