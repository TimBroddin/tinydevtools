import TemperatureConverter from '@/tools/TemparatureConverter'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'
export const Route = createFileRoute('/converters/temperature')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        ...seo({
          title: "Temperature Converter",
          description: "Convert temperatures between Celsius, Fahrenheit, and Kelvin",
          keywords: "temperature, converter, celsius, fahrenheit, kelvin",
        }),
      ],
    };
  },
})

function RouteComponent() {
  return <TemperatureConverter />
}
