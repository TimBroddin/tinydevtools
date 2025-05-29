import { createFileRoute } from '@tanstack/react-router'
import JwtDebugger from '../../tools/JwtDebugger'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/debuggers/jwt')({
  component: JwtDebugger,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "JWT Debugger",
          description: "Debug and decode JSON Web Tokens (JWT) to verify their contents and ensure they are properly formatted",
          keywords: "jwt, debugger, decode, verify, token",
        }),
      ],
    };
  },
})
