---
layout: page
title: Product tour with the Sketchfab API
description: Create a 3D product tour with the Sketchfab API
tags: [sketchfab, api, product-tour]
image: /images/og-product-tour.jpg
---

<script setup>
import ProductTour from '../components/ProductTour.vue'
import CodePenEmbed from '../components/CodePenEmbed.vue'

const onClick = () => {
  window.location.href = './product-tour.html'
}
</script>

<ProductTour />

<v-btn @click="onClick" variant="tonal" class="m-4">Back to the tutorial</v-btn>
