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

We can use the Sketchfab API to create new annotations. We've learned in the [Editing annotations tutorial](./editing.html) about some of the properties of an annotation. These were the `title`, `content`, `eye` and `target`. When we add the `position` property, we can create a new annotation with the `api.createAnnotationFromWorldPosition` API function.

```js
api.createAnnotationFromWorldPosition(
  position,
  eye,
  target,
  "New Title",
  "New Content",
  function (err, index) {
    if (!err) {
      window.console.log("Created new annotatation", index + 1);
    }
  },
);
```

Keep in mind you need three coordinates for a fresh annotation:

- `position`: the position of the annotation in the 3D scene
- `eye`: the position of the camera when the annotation is activated
- `target`: the position of the target when the annotation is activated

The `position` and `target` can be the same coordinate, but they don't need to be. That really depends on your use-case.

::: info
Annotations created with the API are not saved to the model. When you reload the page, the annotations will be gone.
:::

<CodePenEmbed id="dyrKzPO" tab="result" />

In this example we're creating annotations in random locations whenever you click the `Create Annotation` button. I'm using one fixed camera position and the target is at the same spot as the annotation.

## Create upon startup

A common use case is that you want to load a 3D model with a bunch of annotations already in place. these annotations could come from a CMS or another external source. We use the exact same API function to create annotations upon startup.

```js
api.addEventListener("viewerready", () => {
  api.removeAllAnnotations(() => {
    annotations.forEach((annotation) => {
      createAnnotation(api, annotation);
    });
  });
});
```

In the `viewerready` event, I first use `api.removeAllAnnotations` before adding my own annotations. You can guess what `api.removeAllAnnotations` does.

<CodePenEmbed id="BabVddO" tab="result" />

In this example, I load the earth model with annotations at the locations of the 7 continents. These annotations don't exist in the 3D model, only in code.

## Create from a mouse click

The Sketchfab editor lets you add annotations by clicking on the model. It then records the clicked position and the camera position and target. We can do the same with the API.

```js
api.addEventListener(
  "click",
  function (info) {
    if (info.instanceID) {
      console.log(info.position3D);
    }
  },
  { pick: "fast" }, // use { pick: "slow" } for animated or high-poly models
);
```

This event listens to clicks on the 3D model. You get a bunch of information about the click. We're interested in the `position3D` property. This property is only available when we actually hit an object. This means you can only place annotations on objects, not in empty space. This works just like the Sketchfab editor. To capture the camera information, take a look at the [Camera tutorial](../camera/).

<CodePenEmbed id="JjzZrGM" tab="result" />

In this example you can click on the 3D model to add an annotation. When you uncheck the "Editing mode" checkbox, you can click the model without adding annotations.

## Animated models

Using `createAnnotationFromWorldPosition` together with the `click` event will work on animated models too. Make sure to replace the `{ pick: "fast" }` with `{ pick: "slow" }` to get click-results when the model is animated. However, the annotations will not move with the model. To make annotations stick to the model, use the `createAnnotation` function. It casts a ray and "glues" the annotation to the model where the ray intersects.

```js
api.createAnnotation(
  positionStart,
  positionEnd,
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

This function takes almost the same arguments as `createAnnotationFromWorldPosition`. The difference is that `createAnnotationFromWorldPosition` creates the annotation wherever we specify, either on a mesh or in mid-air. `createAnnotation` will cast a ray and and always put the annotation on a mesh.

<CodePenEmbed id="OJqwQLa" tab="result" />

This example is almost the same as the previous example. When you click the model, it casts a ray from the camera to the clicked position and creates the annotation. When you uncheck the "Editing mode" checkbox, you can click the model without adding annotations. Sometimes, pausing the model helps to place annotations.
