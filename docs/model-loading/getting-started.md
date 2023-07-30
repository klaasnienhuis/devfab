<script setup>
import CodePenEmbed from '../components/CodePenEmbed.vue'
</script>

# Getting started

Embedding a Sketchfab model in a website requires three things

1. An iframe
2. The sketchfab-viewer [javascript library][def]
3. A bit of code

```html:line-numbers{5,6,8-10}
<!DOCTYPE html>
<html lang="en" >
<head></head>
<body>
  <iframe id="api-frame"></iframe>
  <script src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js'></script>
  <script>
    const iframe = document.getElementById("api-frame");
    const client = new Sketchfab(iframe);
    client.init("dGUrytaktlDeNudCEGKk31oTJY");
  </script>
</body>
</html>
```

This code example shows a fully functioning website containing these three parts.

## Line by line

On line 5 we have an empty iframe. This is where the 3D model ends up in. You can apply CSS to this iframe, for instance setting the width or height.

```html
<iframe id="api-frame"></iframe>
```

On line 6 we load the sketchfab api. The URL changes from time to time because of version changes. Make sure to check the docs now and again for updates.

```html
<script src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js'></script>
```

On line 8 and 9 we create a new sketchfab viewer instance that is bound to the empty iframe on this page.

```js
const iframe = document.getElementById("api-frame");
const client = new Sketchfab(iframe);
```

The final step on line 10 is loading a specific model with the viewer. The ID is what you'd find in the model URL on sketchfab.com. You can load any model like this, it doesn't need to be a model in your own account.

```js
client.init("dGUrytaktlDeNudCEGKk31oTJY");
```

## Example

The sketchfab iframe is now populated with the 3D model and ready to go.

<CodePenEmbed id="JjerBWr/b85e4d2bc3ef371e2486730725e1e892" tab="js,result" />

::: info Links
Read the Sketchfab [docs](https://sketchfab.com/developers/viewer)
:::



[def]: https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js