# Event listeners

The Sketchfab API offers a handful of event listeners. The one you'll use the most is the `viewerready` event. This event tells us when the viewer is ready (duh). This is important, because we can't do anything before. Once the viewer is ready we can access its scene data, for instance to find out how many materials there are in the scene.

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

## Entrypoint

In practice, this is the entrypoint for some of your code when creating interactive experiences. Perhaps you want to set the background color or hide a bunch of objects directly after the model loads. You can put that code in the callback of the `viewerready` event.