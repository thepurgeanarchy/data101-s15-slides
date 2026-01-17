import { defineConfig } from 'unocss'

const systemSans = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"SF Pro Text"',
  '"SF Pro Display"',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')

const systemMono = [
  'ui-monospace',
  'SFMono-Regular',
  'Menlo',
  'Monaco',
  'Consolas',
  '"Liberation Mono"',
  '"Courier New"',
  'monospace',
].join(',')

export default defineConfig({
  theme: {
    fontFamily: {
      sans: systemSans,
      mono: systemMono,
    },
  },
})

