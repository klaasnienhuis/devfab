---
title: Navigate annotations with the Sketchfab API
description: Navigate the annotations with the Sketchfab API
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Navigation

We can navigate the annotations with the API. Instead of using the built-in annotation menu, we can create our own UI. 

## Back Next

This next example shows how to go through all annotations with a back- and next-button. At the same time, we're showing the contents of the annotation in a sidebar. This replaces the native notes, that we're hiding with `annotation_tooltip_visible: 0`.

<CodePenEmbed id="yLGErLy/8ba2d44d1f07817979cae47a5491f7c3" tab="result" />

This example does several things:

- Get a list of all annotations with `getAnnotationList`
- Keep track of the current annotation index and calculating the previous or next index
- Go to a specific annotation with `gotoAnnotation`
- Show the contents of the annotation in a sidebar

Get the list of annotations, just to find out how many there are. We need this to calculate the previous and next index.

```js
api.getAnnotationList((err, annotations) => {
  console.log(annotations.length);
});
```

When pressing the back- or next-button we need to calculate the previous or next index. We can do that by keeping track of the current index and adding to or subtracting from. The index needs to loop around, meaning that if we're at the last annotation and we press next, we need to go to the first annotation. And vice versa.

Get the previous index `currentId = currentId === 0 ? maxId : currentId - 1;`

Get the next index `currentId = currentId === maxId ? 0 : currentId + 1;`

When we have the index, we can go to the annotation with `gotoAnnotation`.

```js
api.gotoAnnotation(annotationIndex, {}, (err, id) => {
});
```

Finally, we get the contents of the annotation with `getAnnotation` and show some of it in the sidebar. An annotation actually has a lot of data in it, but we're only showing the index, title, description and the image that Sketchfab generates in the editor.


## Annotation event

I also want to detect when the user clicks a hotspot. We can then display the contents of the annotation in the sidebar. And we can also use this event to update the current index. This way we can keep track of the current annotation, even when the user clicks a hotspot.

```js
api.addEventListener("annotationSelect", (index) => {
  currentId = index;
  showAnnotationDetails(api, index);
});
```
