import { createFileRoute } from '@tanstack/react-router'
import UnixTimeTool from '../../tools/UnixTimeConverter'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/converters/unix-time')({
  component: UnixTimeTool,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Unix Time Converter",
          description: "Convert Unix timestamps to human-readable dates and vice versa",
          keywords: "unix, time, converter, timestamp, date",
        }),
      ],
    };
  },
})

