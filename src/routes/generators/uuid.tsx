import { createFileRoute } from '@tanstack/react-router'
import UuidGenerator from '../../tools/UuidGenerator'

export const Route = createFileRoute('/generators/uuid')({
  component: UuidGenerator,
})


