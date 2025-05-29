import { createFileRoute } from '@tanstack/react-router'
import FakeData from '@/tools/FakeData'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/generators/fake-data')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Fake Data Generator",
          description: "Generate fake data for your development needs using faker.js",
          keywords: "fake data, faker, generator, development, testing",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <FakeData />
} 