import { createFileRoute } from '@tanstack/react-router'
import HashTool from '@/tools/HashTool'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/converters/hash')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Hash Generator & Verifier",
          description: "Generate and verify hashes using MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms",
          keywords: "hash, generator, verifier, md5, sha1, sha256, sha384, sha512",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <HashTool />
}
