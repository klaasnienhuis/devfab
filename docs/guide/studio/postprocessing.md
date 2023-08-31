<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Postprocessing

Postprocessing effects can be turned on and off with the API. You can also modify all the parameters of the effects. Some effects are "cheap", meaning that they don't require a lot of computing power. Others are "expensive" that will require some loading time. Screen Space Ambient Occlusion (SSAO) and Screen Space Reflection (SSR) are notably heavy.

Similar to the Sketchfab editor, you can toggle the entire postprocessing feature on and off, or you can toggle individual effects on and off.

## Available settings

You can get the postprocessing settings of a scene with `getPostProcessing`. It's a long list, but it should be self-explanatory.

```js
api.getPostProcessing(function (settings) {
  window.console.log(settings);
});
```

<CodePenEmbed id="GRPoaya/a53219390a6b6058e3dd1e4e5c0cca9a" tab="result" />

Once you have the list of settings, you can start modifying them.

## Modifying settings

The following example shows how to activate the bloom effect and modify its intensity with `setPostProcessing`. You need to provide your settings in an object. But you don't need to provide all the settings. You can just provide the ones you want to change.

```js
api.setPostProcessing(
  {
    enable: true,
    bloomEnable: true,
    bloomFactor: 1,
    bloomThreshold: 0.2,
    bloomRadius: 0.5
  },
  function () {
    window.console.log("Post-processing filters set");
  }
);
```

<CodePenEmbed id="JjwGqea/46d7bcdfdac05d1792a2c757cfe5fcb5" tab="result" />

In this example I first enable the bloom and vignette effects when the scene has loaded. Then the user can drag the sliders to change the intensity of these two effects.

::: info Documentation
Postprocessing API [documentation](https://sketchfab.com/developers/viewer/functions#api-section-postprocessing)
:::