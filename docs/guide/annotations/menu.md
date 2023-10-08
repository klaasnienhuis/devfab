---
title: Control the menu and embedding
description: Control behavior and appearance of the menu and embedding with the Sketchfab API
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Menu and embedding

By using the init parameters, you can influence looks and behavior of the annotations. This is a low-effort methods of creating guided tours or product showcases. Here are some examples.

Read up on how to use the [Initialization options](/guide/model-loading/initialization-options)

## Clean embed with annotations

This is the cleanest embed with annotations that you can get. Use the following init parameters:

```js{2-3}
autostart: 1,
ui_annotations: 1,
ui_general_controls: 0,
ui_infos: 0,
ui_watermark: 0,
ui_stop: 0
```

`ui_annotations: 1` turns on the annotations menu. `ui_general_controls: 0` hides the controls in the bottom right of the iframe.

<CodePenEmbed id="gOZKqzM/4a13fa9ba278aca30322e86269d7952e" tab="result" />

## Autoplay with annotations

Hide the annotation menu and loop through the available annotations automatically. When you navigate the model, the autoplay stops temporarily. Ideally you'd use the API to stop the autoplay when someone interacts with the model, but that's not possible out-of-the-box. Use the following init parameters:

```js{3-4}
autostart: 1,
ui_general_controls: 0,
ui_annotations: 0,
annotation_cycle: 2,
ui_infos: 0,
ui_watermark: 0,
ui_stop: 0
```

`annotation_cycle: 2` will loop through the annotations with a 2-second interval.

<CodePenEmbed id="oNJymVg/1ba3ce665306a688987206688bb202c0" tab="result" />

## Kiosk mode

You'll notice that this 2-second interval is too short to read the annotations. We can hide the hotspots and notes and block interaction with the model altogether to create a kiosk mode. Use the following init parameters:

```js{5}
autostart: 1,
ui_general_controls: 0,
ui_annotations: 0,
annotation_cycle: 2,
annotations_visible: 0,
ui_infos: 0,
ui_watermark: 0,
ui_stop: 0
```

<CodePenEmbed id="gOZKEpR/332b3a6c586f9a17845b783e981d74a4" tab="result" />

`annotations_visible: 0` hides the annotations altogether.

To disable navigation, I've added the following to the `success` callback. `setUserInteraction` can disable or enable all interaction with the model.

```js
api.addEventListener("viewerready", () => {
  api.setUserInteraction(false);
});
```

However, even with user interaction turned off, when you try to orbit the model (which you now can't), the autoplay stops. As an alternative you can disable all mouse interaction with the iframe by adding `pointer-events: none` to the iframe's CSS.
