<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Studio

"Studio" is a collection of settings that I made up. It's just a handy way to group a bunch of settings together. You can use these settings to change the look of the model.

<CodePenEmbed id="MWZKaXZ/8fb335cbd8865aa99250fb869041aec4" tab="result" />

In this example I'm overdoing it a bit, but it gives you an idea of what you can do with these settings. Here's what's happening when you drag the sliders. The `value` parameter is the value of the slider. It runs between 0 and 1.

## Background

The background color goes from white to dark grey. As with many other colors in Sketchfab, values run between 0 and 1.

```js
api.setBackground({
  color: [1 - value * 0.8, 1 - value * 0.8, 1 - value * 0.8],
});
```

## Lights

Lights are rather complex. In this example I keep it simple by increasing the intensity of the first light and changing its color from white to red.

```js
api.setLight(0, {
  intensity: value * 2.5,
  color: [1, 1 - value * 0.7, 1 - value * 0.7],
});
```

## Environment

The brightness of the environment decreases from 2 to 0.15.

```js
api.setEnvironment({
  exposure: 2 - 1.85 * value,
});
```

## Postprocessing

I'm really exaggerating here, adding grain, chromatic abberation and vignette. The tonemapping and color balance are quite heavy too.

```js
api.setPostProcessing({
  grainFactor: value * 0.25,
  chromaticAberrationFactor: value * 0.035,
  vignetteAmount: value * 0.5,
  toneMappingSaturation: 1 - value * 0.7,
  toneMappingContrast: value * 0.02,
  colorBalanceHigh: [0, 0, value * -0.65],
  colorBalanceMid: [0, 0, value * -0.85],
  colorBalanceLow: [0, 0, value * -0.25],
});
```
