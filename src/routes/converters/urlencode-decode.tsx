import { createFileRoute } from '@tanstack/react-router'
import URLEncodeTool from '../../tools/Urlencode'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/converters/urlencode-decode')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "URL Encoder/Decoder",
          description: "Encode and decode URLs to ensure they are properly formatted for web use",
          keywords: "url, encoder, decoder, encode, decode",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <URLEncodeTool />
}
