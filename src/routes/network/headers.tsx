import { createFileRoute } from '@tanstack/react-router'
import HttpHeadersTool from '@/tools/HttpHeaders'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/network/headers')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "HTTP Headers",
          description: "Check HTTP headers for a URL",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <HttpHeadersTool />
}
