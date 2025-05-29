import { createFileRoute } from '@tanstack/react-router'
import TailwindColors from '@/tools/TailwindColors'

export const Route = createFileRoute('/tailwind/colors')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "tinydev.tools - Tailwind Colors",
        },
      ],
    };
  },
})

function RouteComponent() {
  return <TailwindColors />
}
