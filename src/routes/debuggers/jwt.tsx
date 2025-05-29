import { createFileRoute } from '@tanstack/react-router'
import JwtDebugger from '../../tools/JwtDebugger'

export const Route = createFileRoute('/debuggers/jwt')({
  component: JwtDebugger,
  head: () => {
    return {
      meta: [
        {
          title: "JWT Debugger - tinydev.tools",
        },
      ],
    };
  },
})
