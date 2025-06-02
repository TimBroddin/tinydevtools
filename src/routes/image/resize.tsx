import { createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'
import ImageResizeTool from '@/tools/ImageResize'

export const Route = createFileRoute('/image/resize')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Image Resizer",
          description: "Resize images to your desired dimensions",
          keywords: "image, resize, dimensions",
        }),
      ],
    }
  },
})

function RouteComponent() {
  return (
    <ImageResizeTool />
  )
}
