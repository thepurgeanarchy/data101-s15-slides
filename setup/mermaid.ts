import { defineMermaidSetup } from '@slidev/types'

const systemSans = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"SF Pro Text"',
  '"SF Pro Display"',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')

export default defineMermaidSetup(() => {
  return {
    theme: 'base',
    fontFamily: systemSans,
    htmlLabels: true,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      wrappingWidth: 220,
    },
    sequence: {
      useMaxWidth: true,
    },
    gantt: {
      useMaxWidth: true,
    },
    mindmap: {
      useMaxWidth: true,
      maxNodeWidth: 220,
      padding: 8,
    },
    themeVariables: {
      fontFamily: systemSans,
      fontSize: '14px',
      background: 'transparent',
      textColor: '#EAF2FF',
      primaryColor: '#0F1B2D',
      primaryTextColor: '#EAF2FF',
      primaryBorderColor: '#4DA3FF',
      lineColor: '#93C5FD',
      secondaryColor: '#0B1220',
      tertiaryColor: '#111C2E',
      edgeLabelBackground: '#0B1220',
      clusterBkg: '#0B1220',
      clusterBorder: '#4DA3FF',
      titleColor: '#EAF2FF',
    },
  }
})
