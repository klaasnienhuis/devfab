---
title: Rendering images of your 3D model
description: Render images of your 3D model up to 4k with the Sketchfab API
tag: [sketchfab, api, rendering]
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Rendering images

You can use Sketchfab to render images of your 3D model. Sketchfab calls this a screenshot. But it's a bit more than that. You can render at a different resolution than the viewport, up to 4k. You can also render PNG's with transparent backgrounds. Here's the `getScreenshot` method in action:

```js
api.getScreenShot(function(err, result) {
  window.console.log(result);
});
```

The result is a base64 encoded image. You can decide what to do with that. You can download it as a file, send to an API or even use it as a texture in your 3D model. Base64 encoded images are just a long string of text. It's up to you to convert it into something that's useful for you.

## img element

<CodePenEmbed id="XWoRvJK/67695ee85af0550ed79d436305686b0a" tab="result" />

This example renders and image and displays it in an image element on the page. You see that we can use the base64 image data directly as the `src` attribute of the image element. Here we provide the  `getScreenshot` method with additional arguments for the width. height.

```js
api.getScreenShot(1024, 1024, function (err, base64) {
  img.src = base64;
});
```

## Download image

The next example shows how you can download a render. Here's the code that I use to doenload a single image. There are probably many other ways to turn a base64 into an image file. This is just one way to do it.

```js
const downloadDesign = (data, name) => {
  const a = document.createElement("a");
  a.href = data;
  a.target = "_parent";
  a.download = `${name}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
```

<CodePenEmbed id="zYywgZZ/033f305912e542231a1a4deb74586bb4" tab="result" />

## Move camera

Until now we've rendered the current view. Sometimes you want to use a predefined camera angle to render from. First you move the camera. Once that's ready, you can make a render. We'll need to use the `setCameraLookAtEndAnimationCallback` callback to tell us when the camera is done moving. Read more about it in the chapter about detecting [camera movement](./camera/index.html/#are-we-moving)

```js
api.setCameraLookAt(settings.position, settings.target, 1, function (err) {
  api.setCameraLookAtEndAnimationCallback(function (err) {
    api.getScreenShot(1024, 1024, "image/png", function (err, base64) {
      downloadDesign(base64, "kettle");
    });
  });
});
```

Here's what's happening:
1. move the camera to a new position and target
2. set a callback that fires when the camera is done moving
3. render the image
4. download the image


<CodePenEmbed id="gOZWVxq/98ceb6dcbc182d43dad5553bd1e134fe" tab="result" />

# TODO

- transparent background
- render at different resolution
- render and use as texture