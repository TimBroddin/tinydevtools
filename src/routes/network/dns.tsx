import { seo } from '@/lib/seo'
import DNSTool from '@/tools/DNSTool'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/network/dns')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "DNS Lookup",
          description: "Lookup DNS records for a domain",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <DNSTool />
}
