<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: false,
    default: 'light',
  },
  tab: {
    type: String,
    required: false,
    default: 'result',
  },
})

const src = computed(() => `https://codepen.io/klaasnienhuis/embed/${props.id}?default-tab=${props.tab}&editable=true&theme-id=${props.theme}`)
</script>

<template>
<iframe 
  :src="src"
  height="500"
  style="width: 100%;"
  scrolling="no"
  frameborder="no"
  loading="lazy"
  allowtransparency="true"
  allowfullscreen="true"
>
</iframe>
</template>
