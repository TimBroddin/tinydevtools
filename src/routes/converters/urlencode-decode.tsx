import { createFileRoute } from '@tanstack/react-router'
import URLEncodeTool from '../../tools/Urlencode'

export const Route = createFileRoute('/converters/urlencode-decode')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "URL Encoder/Decoder - tinydev.tools",
        },
      ],
    };
  },
})

function RouteComponent() {
  return <URLEncodeTool />
}
