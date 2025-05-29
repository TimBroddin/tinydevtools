import { createFileRoute } from '@tanstack/react-router'
import UuidGenerator from '../../tools/UuidGenerator'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/generators/uuid')({
  component: UuidGenerator,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "UUID Generator",
          description: "Generate UUIDs to uniquely identify objects and ensure data integrity",
          keywords: "uuid, generator, unique, identifier, id",
        }),
      ],
    };
  },    
});


