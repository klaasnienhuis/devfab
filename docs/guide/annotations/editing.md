---
title: Editing annotations
description: Edit annotations with the Sketchfab API
tag: [sketchfab, api, annotations]
image: /images/og-annotations-simple.jpg
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Editing annotations

We've seen how to view annotations and customize their appearance. Let's menipulate the annotations themselves. We will first edit the text of an annotation and then change the camera position linked to the annotation.

## Editing annotation text

Editing the contents of an annotation is done with the `updateAnnotation` method. That method takes two arguments: the id of the annotation and an object with the new properties. The id is 0-based. This means that the first annotation has `id = 0`. The properties we can change are:

- `title`: the title of the annotation
- `content`: the content of the annotation
- `eye`: the position of the camera when the annotation is activated
- `target`: the position of the target when the annotation is activated

We're looking at the first two here:

```js
api.updateAnnotation(
  1,
  {
    title: "updatedTitle",
    content: "updatedContent",
  },
  function (err, information) {
    if (!err) window.console.log(information);
  },
);
```

<CodePenEmbed id="gOEgyVV" tab="result" />

In the example above, we get the annotation when you click on it with the `annotationSelect` event. Read more about that [here](./navigation.html#annotation-event). When that happens, we get the annotation and take the title and body of the annotation and populate a form.

```js
api.getAnnotation(id, (err, info) => {
  elTitle.value = info.name;
  elBody.value = info.content.raw;
});
```

When you click the `Update Annotation` button, we take the title and bodytext and send it to the `updateAnnotation` method.

```js
api.updateAnnotation(currentAnnotationId, {
  title: elTitle.value,
  content: elBody.value,
});
```

The annotation is updated in realtime and the changes are visible immediately. Keep in mind these changes are not saved to the model. When you reload the page, the annotation will be back to its original state.

## Multilingual annotations

Bulk editing annotations in the Sketchfab editor is really tedious. A common approach in web-experiences is to place the annotations with the Sketchfab editor but to set the content with the API. This way, you can create multilingual annotations with the API without having to manage copies of the same model with different annotations.

<CodePenEmbed id="VwRPJaa" tab="result" />

In the example above we change the title and body of all annotations in a single loop. I've got an array with this information in three languages: English, Dutch and German. With the click of a single button you can replace the content of all annotations.

```js
const annotationData = [
  {
    nederlands: {
      title: "Overzicht",
      body: "Een overzicht van de hele scene.",
    },
    english: {
      title: "Overview",
      body: "An overview of the entire scene.",
    },
    deutsch: {
      title: "Überblick",
      body: "Ein Überblick über die gesamte Szene.",
    },
  },
];
```

This is part of the datastructure. Here you see the information of a single annotation in three languages.

## Editing the camera position

We can also change the camera position linked to an annotation. This is done with the `updateAnnotation` method as well. The `eye` and `target` properties are 3D vectors. We can use the `getCameraLookAt` method to get the current position of the camera and target. We can then change the x, y and z coordinates of the annotation. Read more about working with cameras [here](../camera/).

```js
api.getCameraLookAt((err, camera) => {
  api.updateAnnotation(annotationId, {
    eye: camera.position,
    target: camera.target,
  });
});
```

In this code example we get the current camera postion and target. Then we update the annotation with the new camera position and target. Next time you click on this annotation, it will use the updated camera position.

<CodePenEmbed id="OJqWKeL" tab="result" />

In this example, you can select an annotation, then move the camera and press the `Update Annotation` button. The camera position linked to the annotation will be updated.
