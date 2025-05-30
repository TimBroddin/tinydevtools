import WhoisTool from '@/tools/Whois'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/network/whois')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "WHOIS Lookup",
          description: "Lookup WHOIS information for a domain name",
        }),
      ],
    };
  },
  
})

function RouteComponent() {
  return <WhoisTool />
}
