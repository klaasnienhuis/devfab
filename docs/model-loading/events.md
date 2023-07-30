<script setup>
import CodePenEmbed from '../components/CodePenEmbed.vue'
</script>

# Event listeners

The Sketchfab API offers a handful of event listeners. The one you'll use the most is the `viewerready` event. This event tells us when the viewer is ready (surprise). This is important, because we can't do anything before. Once the viewer is ready we can access its scene data, for instance to find out how many materials there are in the scene.

```js{4}
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 1,
  success: (api) => {
    api.addEventListener("viewerready", () => console.log("Viewer is ready"))
  },
  error: () => console.error("Sketchfab API error")
});
```

In this example `autostart: 1` starts playing the 3D model. The `viewerready` event tells us when the model is ready. From this moment on, we can "talk" to the model through the `api` object.


<CodePenEmbed id="mdQqVoV/e15ad74980cad88070b0ac4c2989c370" tab="js" />

## Entrypoint

In practice, this is the entrypoint for some of your code when creating interactive experiences. Perhaps you want to set the background color or hide a bunch of objects directly after the model loads. You can put that code in the callback of the `viewerready` event.

```js{5}
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 0,
  success: (api) => {
    api.addEventListener("viewerready", () => {
      api.setBackground({ color: [0, 0.8, 0.6] });
    });
  },
  error: () => console.error("Sketchfab API error")
});
```

This example does not start the model automatically, because of `autostart: 0`. But we still want to change the background color after the user presses the play button. That's why the code to change the background color is placed in the callback of the `viewerready` event. That will guarantee we won't change the background color before the viewer is ready for it.

<CodePenEmbed id="ExObPMr/a3679a70f8d38a2c1b9f95fc30e0bc36" />
