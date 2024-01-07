---
layout: false
title: Scrolling navigation with the Sketchfab API
description: Scrolling navigation with GSAP and the Sketchfab API
tags: [sketchfab, api, scrolling, gsap]
image: /images/og-scrolling-navigation.jpg
---

<script setup>
import Scrolling from '../components/Scrolling.vue'
import CodePenEmbed from '../components/CodePenEmbed.vue'
import { onBeforeMount, ref } from 'vue'
const onClick = () => {
  window.location.href = './scrolling.html'
}
const id = ref('e4dd6d342fa044b99732b484985797b6')

onBeforeMount(() => {
  // If we have an id in the query string, use that instead
  window.location.search.substring(1).split('&').forEach((param) => {
    const [key, value] = param.split('=')
    if (key === 'id') {
      id.value = value
    }
  })
})
</script>

<Scrolling :id="id"/>
