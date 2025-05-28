import { createFileRoute } from '@tanstack/react-router'
import UnixTimeTool from '../../tools/UnixTimeConverter'

export const Route = createFileRoute('/converters/unix-time')({
  component: UnixTimeTool,
})

