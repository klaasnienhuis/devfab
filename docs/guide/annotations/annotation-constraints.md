---
title: Camera and annotations
description: Closely control the camera motion with annotations and the Sketchfab API
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Annotations and the camera

When you click on an annotation, the camera moves to that annotation. That is the default behavior of annotations. Sometimes you want to closely control where a camera can go. Perhaps you have a car with annotations, but you don't want users to look under the car. You can use camera constraints for that. Even though Sketchfab doesn't allow the use of annotatins and camera constraints at the same time, with the API you can!

Let's figure out how to have annotations and constrain the camera at the same time. The goal is to get the smoothest user experience without bothering the user.

## No panning

<CodePenEmbed id="BavMeBw/f238a7f77053cafbb27e2c2ae8d5a32f" tab="result" />

This example has annotations and pan constraints. You can only do this with the API, not with the Sketchfab editor. First we enable the an constraints and then we enable the camera constraints feature. Read more about camera constraints here: [Camera constraints](../guide/camera/camera-constraints.html)

```js
api.setCameraConstraints({ usePanConstraints: true }, () => {
  api.setEnableCameraConstraints(true);
});
```

## Move the target

While this works, it's not a great user experience. When you click on an annotation and then try to pan the camera, the camera target snaps back to the original target location. That's what a pan constraint does: it locks the camera target to a single location. And that's the location that's baked in the scene. This is not what we want. We want to put the camera target to match the annotation that you click.

<CodePenEmbed id="YzdBbNN/a106d99c60519a58c2bd51495d33ce51" tab="result" />

This function takes the target of an annotation and aplies it to the camera constraints.

```js
const setCameraConstraints = (api, annotation) => {
  const constraints = { usePanConstraints: true, target: annotation.target };
  api.setCameraConstraints(constraints, () => {
    api.setEnableCameraConstraints(true);
  });
};
```

We can call this function whenever an annotation is selected. Use the `annotationSelect` event listener for that. If returns the `index` of the selected annotation in the callback. If no annotation is selected, it returns `-1`.

```js
api.addEventListener("annotationSelect", (index) => {
  if (index >= 0) {
    setCameraConstraints(api, annotationList[index]);
  }
});
```

You'll notice that the constraints now work, but somehow the motion is not as smooth as before. It's as if the camera doesn't reach the final destination. You'll see the difference when you click an annotation in this example and in the previous example. This is because we activate the camera constraints while the camera is still moving.

## Fix camera movement

We want to click on an annotation, let the camera move to the annotation and then activate the camera constraints. We can use the `setCameraLookAtEndAnimationCallback` method for that. This function will tell us whan a camera movement is over. And, lucky for us, it also works with annotations.

<CodePenEmbed id="mdavYqB/b53d5a0a4e207b6f8bb84fd3d1b4340b" tab="result" />

We've expanded the `setCameraConstraints` function to include the `setCameraLookAtEndAnimationCallback` method. We now do the following:

- Disable the camera constraints
- Start listening for the end of the camera movement
- When the camera movement is over, set the camera constraints
- Enable the camera constraints

This is very much alike the [Camera Conflicts](guide/camera/camera-constraints.html#camera-conflicts) example in the guide.

```js
const setCameraConstraints = (api, annotation) => {
  const constraints = { usePanConstraints: true, target: annotation.target };
  api.setEnableCameraConstraints(false, {}, () => {
    api.setCameraLookAtEndAnimationCallback(() => {
      api.setCameraConstraints(constraints, () => {
        api.setEnableCameraConstraints(true);
      });
    });
  });
};
```

We're almost there: the camera movement is smooth, the camera target doesn't snap around and we can't pan away from the model. There's one glitch: the first camera position when the model loads isn't constrained. Directly after the model loads, you can pan. And somehow, our current function does not work on the initial camera position. Sketchfab only starts tracking camera movement after the model is loaded.

## Fix the initial camera position

Because the scene has annotations stored in them, I can't get the initial camera position to have constraints. I'm not sure why, but anything I do in the `viewerready` event to apply camera constraints doesn't work.

A solution to this final issue is to take over the camera movement of the annotation. We can keep the annotations themselves and still detect when one is clicked. But instead of letting the annotation do the work, we can move the camera ourselves. We use the `setCameraLookAt` method for that. This is very similar to the [Camera constraints](../guide/camera/camera-constraints.html) topic.

To disable the camera movement that's triggered by the annotation, we use the fcollowing function:

```js
api.setAnnotationCameraTransition(true, true);
```

The result is this final codepen example that has camera constraints at all times.

<CodePenEmbed id="RwEOGpm/7f2332359fdc5ecb2f28c99cd92baa30" tab="result" />

::: info
Crucial to making the first camera movement constrained is the `camera: 0` init parameter.
:::
