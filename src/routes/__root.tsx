import {
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import Layout from '@/components/Layout'
import { ThemeProvider } from '@/contexts/ThemeContext'
import appCss from "@/index.css?url"
import { seo } from '@/lib/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title:'tinydev.tools',
      },
      {
        name: 'theme-color',
        content: '#000000',
      },
      ...seo({
        title: null,
        description: 'A collection of tiny tools to help you with your daily tasks.',
        keywords: 'tinytools,tinydevtools, tools, tinydev.tools',
      }),
    ],
    links: [
      {
        rel: "icon",
        href: "/icon-512.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
    scripts: [
      {
        src: "https://stats.broddin.be/js/script.js",
        'data-domain': 'tinydev.tools',
        defer: true,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}