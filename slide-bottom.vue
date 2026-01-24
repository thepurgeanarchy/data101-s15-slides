<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter, $slidev } = useSlideContext()

const hiddenLayouts = new Set([
  'cover',
  'intro',
  'intro-image',
  'intro-image-right',
  'section',
  'statement',
  'fact',
  'quote',
  'image',
  'image-right',
  '3-images',
])

const show = computed(() => !hiddenLayouts.has($frontmatter.layout || ''))
const footerTitle = computed(() => $frontmatter.footerTitle || $slidev.configs.title || $frontmatter.title || '')
const footerAuthor = computed(() => $frontmatter.author || 'Marc Reyes')
</script>

<template>
  <div v-if="show" class="slide-footer" aria-hidden="true">
    <div class="slide-footer__left">
      <span class="slide-footer__tag">DATA101</span>
      <span class="slide-footer__sep">·</span>
      <span class="slide-footer__title">{{ footerTitle }}</span>
    </div>
    <div class="slide-footer__right">
      <span class="slide-footer__name">{{ footerAuthor }}</span>
      <span class="slide-footer__sep">·</span>
      <span class="slide-footer__count"><SlideCurrentNo /> / <SlidesTotal /></span>
    </div>
  </div>
</template>
