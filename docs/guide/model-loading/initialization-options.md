---
title: Sketchfab Initialization options
description: Load your Sketchfab model with the right bhaavior and appearance
tag: [sketchfab, api, initialization-options]
---

<script setup>
import ModelLoading from '../../components/ModelLoading.vue'
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Initialization options

There are many options when loading a Sketchfab model. If we don't say otherwise, a model is loaded like so:

<ModelLoading id="dGUrytaktlDeNudCEGKk31oTJY" :showGraph="true" />

The iframe is populated with the model, but the model has not started yet. And when you manually start the model, by clicking on the play-button, the viewer shows a title, the inspector, sketchfab logo and more. This is the default embed.

## Behavior and appearance

The viewer can be customized. You can change both the behavior of the viewer and the appearance of it. These options are added to the init function as a second argument. There are many options. Let's start with a few.

```js
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 1,
  autospin: 0.2,
  scrollwheel: 0
});
```

- `autostart: 1` immediately starts the viewer. It's similar to an embedded video, that automatically starts playing. 

- `autospin: 0.2` spins the model slowly

- `scrollwheel: 0` disables the scrollwheel on the 3d model. This is practical when embedding models on ecommerce sites for instance.

<CodePenEmbed id="MWzOKrr/3a4868323ef37b8f918581ac658b97ef" />

Instead of just loading the model, it's now started too and rotates slowly. Don't do this when you have many 3D models on a single page! You can find all the init options in the [Sketchfab documentation](https://sketchfab.com/developers/viewer/initialization). Some options are available for all accounts, other options require an enterprise account.

# Examples

You can find all available initialization parameters [here](https://sketchfab.com/developers/viewer/initialization). You can combine the ones you'd like. But there are so many, it's hard to get a good overview.

You can look at the Embed viewer popup that's documented [here](https://help.sketchfab.com/hc/en-us/articles/203509907-Embedding-your-3D-models). This is an interactive popup that interactively shows what most of these settings do.

## Camera constraints

You can set the camera constraints with the init parameters. For these settings in particular you need at least a Pro Sketchfab account.

```js
{
  orbit_constraint_pan: 1,
  orbit_constraint_pitch_down: 0,
  orbit_constraint_pitch_up: Math.PI / 6,
  orbit_constraint_zoom_in: 50,
  orbit_constraint_zoom_out: 80
}
```

<CodePenEmbed id="MWzOyaP/7e86fcc7dd363168344dd10607890879" />

## Cleaned up viewer

Sketchfab adds many tools and information to the viewer window. When integrating a 3d model in a website, you might want to remove some or all of these items. Here are the init parameters to clean up the viewer. You'll need at least a Premium Sketchfab account to use these. 

```js
{
  ui_controls: 0,
  ui_infos: 0,
  ui_watermark: 0,
  ui_stop: 0
}
```

<CodePenEmbed id="ZEmaWOV/c0d0a4def61617f2d3ae14099f6a1d37" />

## Secret settings

Not all available settings are documented. One is especially interesting:

```js
graph_optimizer: 1,
```

This setting is aimed at optimizing the performance of the model. `graph_optimizer: 1` optimizes the geometry. I don't know its inner workings, but I assume it merges objects together to reduce the strain on the graphics card.
