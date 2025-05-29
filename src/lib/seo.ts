export const seo = ({
    title,
    description,
    keywords,
    image,
  }: {
    title: string | null
    description?: string
    image?: string
    keywords?: string
  }) => {
    const tags = [
      { title: title ? `${title} - tinydev.tools` : 'tinydev.tools' },
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'twitter:title', content: title ? `${title} - tinydev.tools` : 'tinydev.tools' },
      { name: 'twitter:description', content: description },
      { name: 'twitter:creator', content: '@broddin' },
      { name: 'twitter:site', content: 'https://tinydev.tools' },
      { name: 'og:type', content: 'website' },
      { name: 'og:title', content: title ? `${title} - tinytools.dev` : 'tinytools.dev' },
      { name: 'og:description', content: description },
      ...(image
        ? [
            { name: 'twitter:image', content: image },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'og:image', content: image },
          ]
        : []),
    ]
  
    return tags
  }
  