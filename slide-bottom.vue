<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()

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
</script>

<template>
  <div v-if="show" class="slide-footer" aria-hidden="true">
    <div class="slide-footer__left">
      <span class="slide-footer__tag">DATA101</span>
      <span class="slide-footer__sep">·</span>
      <span class="slide-footer__title">Data &amp; Task Abstraction</span>
    </div>
    <div class="slide-footer__right">
      <span class="slide-footer__name">Marc Reyes</span>
      <span class="slide-footer__sep">·</span>
      <span class="slide-footer__count"><SlideCurrentNo /> / <SlidesTotal /></span>
    </div>
  </div>
</template>
