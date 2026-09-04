/// <reference types="vite/client" />

declare module '*.svg?react' {
  import type { ComponentType, SVGProps } from 'react'
  const component: ComponentType<SVGProps<SVGSVGElement>>
  export default component
}
