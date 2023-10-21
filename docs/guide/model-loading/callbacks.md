---
title: Callbacks after loading a model
description: Get a callback after loading a Sketchfab model to start working with it
tag: [sketchfab, api, callback]
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Callbacks

We've seen how we can modify the behavior and appearance of an embedded sketchfab model with init parameters.

```js
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 1,
  autospin: 0.2,
  scrollwheel: 0,
});
```

We can also hook up our own code. The init function provides two callbacks: `success` and `error`. The success callback is used to perform actions once the model has loaded. You can do many things with the Sketchfab model, but only after it has been started. This calback is the only way to know when that is.

In this example, we log a message to the console when the model has been loaded and raise an error when there's an error with loading the sketchfab model.

```js
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 1,
  success: (api) => console.log("Sketchfab API success"),
  error: () => console.error("Sketchfab API error"),
});
```

<CodePenEmbed id="eYQeJVM/83086d655cab05d98f1e4e1632aba75b" tab="js" />

## API object

You see that the success callback passes an `api` object. This object is the key to interacting with your model. Anything we do afterwards with the model, goes through this object.
