import { createFileRoute } from '@tanstack/react-router'
import TextCaseTool from '@/tools/TextCase'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/converters/textcase')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Text Case Converter",
          description: "Convert text to different cases (uppercase, lowercase, title case, camel case, pascal case, snake case, kebab case, random case, alternating case, inverse case)",
          keywords: "text, case, converter, uppercase, lowercase, title case, camel case, pascal case, snake case, kebab case, random case, alternating case, inverse case",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <TextCaseTool />
}
