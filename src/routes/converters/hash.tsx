import { createFileRoute } from '@tanstack/react-router'
import HashTool from '@/tools/HashTool'

export const Route = createFileRoute('/converters/hash')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "Hash Generator & Verifier - tinydev.tools",
        },
      ],
    };
  },
})

function RouteComponent() {
  return <HashTool />
}
