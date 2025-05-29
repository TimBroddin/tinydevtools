import { createFileRoute } from '@tanstack/react-router'
import TailwindColors from '@/tools/TailwindColors'

export const Route = createFileRoute('/tailwind/colors')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TailwindColors />
}
