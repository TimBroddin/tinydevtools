import { createFileRoute } from '@tanstack/react-router'
import TailwindColors from '@/tools/TailwindColors'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/tailwind/colors')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Tailwind Colors",
          description: "Generate Tailwind CSS colors to use in your projects",
          keywords: "tailwind, colors, generator, tailwindcss",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <TailwindColors />
}
