import { extendTheme } from '@chakra-ui/react'

// Extend Chakra UI theme to include custom colors, fonts, etc
const fonts = {
  body: "Open Sans, system-ui, sans-serif",
  heading: "Raleway, sans-serif",
  mono: "Menlo, monospace",
}

export default extendTheme({fonts});