---
title: Creating annotations
description: Create annotations with the Sketchfab API
tag: [sketchfab, api, annotations]
image: /images/og-annotations-simple.jpg
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Create annotations

We can use the Sketchfab API to create new annotations. We've learned in the [Editing tutorial](./editing.html) about some of the properties of an annotation. These were the `title`, `content`, `eye` and `target`. When we add the `position` property, we can create a new annotation with the `createAnnotationFromWorldPosition` API function

```js
api.createAnnotationFromWorldPosition(
  [0.12, -3.57, -0.51],
  camera.position,
  camera.target,
  "New Title",
  "New Content",
  function (err, index) {
    if (!err) {
      window.console.log("Created new annotatation", index + 1);
    }
  },
);
```

::: info
Annotations created with the API are not saved to the model. When you reload the page, the annotations will be gone.
:::

<CodePenEmbed id="dyrKzPO" tab="result" />

In this example we're creating annotations in random locations whenever you click the `Create Annotation` button. I'm using one fixed camera position and the target or the camera is at the same sport as the annotation.

## Create annotations upon startup

A common use case is that you want to load a 3D model with a bunch of annotations already in place. these annotations could come from a CMS or another external source. We can use the exact same API function to create annotations upon startup.

```js
api.addEventListener("viewerready", () => {
  api.removeAllAnnotations(() => {
    annotations.forEach((annotation) => {
      createAnnotation(api, annotation);
    });
  });
});
```

In the `viewerready` event, I first use `removeAllAnnotations` before adding my own annotations. You can guess what `removeAllAnnotations` does.

<CodePenEmbed id="BabVddO" tab="result" />

In this example, I load the earth model with annotations at the locations of the 7 continents.

## Create annotations from a mouse click

The Sketchfab editor lets you add annotations by clicking on the model. It then records the clicked position and the camera position and target. We can do the same with the API.

```js
api.addEventListener(
  "click",
  function (info) {
    console.log("click at", info.position2D);
    if (info.instanceID) {
      console.log(info.position3D);
    }
  },
  { pick: "slow" },
);
```

This event listens to clicks on the 3D model. You get a bunch of information about the click. We're interested in the `position3D` property. This property is only available when we actually hit an object. This means you can only place annotations on objects, not in empty space. This works just like the Sketchfab editor. To capture the camera inforation, take a look at the [Camera tutorial](../camera/).

<CodePenEmbed id="JjzZrGM" tab="result" />
