<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  playersettings: {
    type: Object,
    required: false,
    default: {}
  }
})
const viewerIframeRef = ref(null)

onMounted(() => {
  import('@sketchfab/viewer-api').then((module) => {
    const client = new module.default('1.12.1', viewerIframeRef.value);
    client.init("dGUrytaktlDeNudCEGKk31oTJY", {
      success: () => console.log("Sketchfab API success"),
      error: () => console.error("Sketchfab API error"),
      ...props.playersettings
    });
  })
})
</script>

<template>
  <v-responsive :aspect-ratio="16 / 9" class="w-100">
    <iframe style="border: 0" id="api-iframe" ref="viewerIframeRef" class="w-100 h-100"></iframe>
  </v-responsive>
</template>