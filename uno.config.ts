import { defineConfig, presetIcons, presetWind3 } from 'unocss'

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
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.1,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': '-0.14em',
      },
    }),
  ],
  theme: {
    fontFamily: {
      sans: systemSans,
      mono: systemMono,
    },
  },
})
