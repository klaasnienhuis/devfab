---
layout: doc
title: Scrolling navigation with the Sketchfab API
description: Scrolling navigation with GSAP and the Sketchfab API
tags: [sketchfab, api, scrolling, gsap]
image: /images/og-scrolling-navigation.jpg
---

<script setup>
import Scrolling from '../components/Scrolling.vue'
import CodePenEmbed from '../components/CodePenEmbed.vue'

</script>

<iframe class="mb-8" width="100%" height="500" src="./scrolling-fullscreen.html" frameborder="0"></iframe>

Check this out in fullscreen [here](./scrolling-fullscreen.html).

## Basic scrolling

We are going to create a simple scrolling navigation with the Sketchfab API and [GSAP](https://gsap.com/). We'll use the [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger) plugin to trigger animations when the user scrolls. The end goal is to use the camera positions of the annotations in a Sketchfab model and to scroll past all of them.

GSAP has a great toolset to help with this. It can do two things for us in this project:

- It can deal with the scrolling, detect how far along we are and manipulate the position of the iframe with the Sketchfab model in it.
- It can animate smoothly between camera positions (and any other property for that matter).

First we are going to create some space for the user to scroll. I want the 3D model to cover the entire screen. When the user scrolls down, the model should stay put, and not scroll out of view. GSAP comes into play here. The `ScrollTrigger` plugin allows users to scroll, while `pinning` the 3d model to the screen. This means that the model will stay in place while the user scrolls. Remember to disable scrolling the Sketchab model with the `scrollwheel: 0` init parameter.

```html
<div class="scroller">
  <div class="pin-spacer">
    <iframe id="api-frame"></iframe>
  </div>
</div>
```

```js
ScrollTrigger.create({
  trigger: ".scroller",
  start: "top top",
  end: "+=4000px",
  pin: "#api-frame",
  pinSpacer: ".pin-spacer",
});
```

This code works as follows:

- The top `div` with the class `scroller` is the trigger for the `ScrollTrigger`. When the user scrolls past this element, the `ScrollTrigger` will start.
- The `start` property tells the `ScrollTrigger` when to start. In this case, we want to start when the top of the `scroller` element reaches the top of the viewport.
- The `end` property tells the `ScrollTrigger` when to end. In this case, we want to end when the top of the `scroller` element reaches 4000 pixels from the top of the viewport. These 4000 pixels live outside of the screen, and we never see that space of the website.
- The `pin` property tells the `ScrollTrigger` what element to pin to the screen. In this case, we want to pin the `iframe` with the id `api-frame` to the screen.

The `pinSpacer` property tells the `ScrollTrigger` what element to use as a spacer. This spacer is used to fill the space that the pinned element leaves behind. Generally, we don't have to specify this ourselves. The `ScrollTrigger` will create a spacer for us. But that means that `ScrollTrigger` must change the `DOM` resulting in a reload of the page and 3D model. To avoid this, we create the spacer ourselves and `ScrollTrigger` fills in the details.

<CodePenEmbed id="qBvdjzO/ac8e9eadbbd9932ec306fcb1fb00c2f3" tab="result" />

The above example lets you scroll, while keeping the 3D model in place. The next step is to animate something when the user scrolls.

## Animation, timeline and scrolling

Just scrolling isn't very useful. GSAP is built to animate CSS properties, so let's start with that.

You can animate things with a so-called `timeline`. With the timeline you specify the object that you want to animate and one or more properties that you want to animate. To change the dimensions of the iframe, we use the following code:

```js
const timeline = gsap.timeline();
timeline.to("#api-frame", { width: "100vw", height: "100vh", duration: 1 });
timeline.to("#api-frame", { width: "70vw", height: "70vh", duration: 1 });
timeline.to("#api-frame", { width: "100vw", height: "100vh", duration: 1 });
```

- First we create a timeline with `gsap.timeline()`.
- Then we use the `.to` method to add an animation. The first argument is the element that we want to animate. The second argument is an object with the properties that we want to animate. In this case, we want to animate the `width` and `height` properties of the iframe. We can also specify the duration of the animation.

You can interpret these lines as key-frames. The inbetween values are calculated by GSAP. The result is a smooth animation between the key-frames.

### Use timeline in ScrollTrigger

We add this timeline to the `ScrollTrigger` like so:

```js highlight=7,8
ScrollTrigger.create({
  trigger: ".scroller",
  start: "top top",
  end: "+=2500px bottom",
  pin: "#api-frame",
  pinSpacer: ".pin-spacer",
  scrub: true,
  animation: timeline,
});
```

One thing to keep in mind is that the durations of the timeline are more like percentages of the scrolling distance. The user controls the speed of the scrolling. The durations determine how much of the scrolling distance is used for the animation. In this case, each of the three keyframes has the same "weight".

<CodePenEmbed id="XWGbzao/8289c48510cee8539042c9a8f9bb08b2" tab="result" />

## Timeline with camera motion

Instead of animating the size of the iframe, we want to animate the camera position. This means we can't animate the properties of a `div`. We need to specify our own object to hold properties that we want to animate.

```js
const camData = { px: 0, py: 0, pz: 0, tx: 0, ty: 0, tz: 0 };
```

This object can hold the x, y and z position of the camera and the target. We can use it like so:

```js
const timeline = gsap.timeline();
timeline.to(camData, {
  duration: 1,
  px: 10,
  py: 10,
  pz: 10,
  tx: 0,
  ty: 0,
  tz: 0,
});
```

Here we set a keyframe where the camera position is at `[10, 10, 10]`.

### Animating custom data

But where GSAP knows exactly what to do when we animate CSS properties, it doesn't know about our custom object. We need to tell GSAP how to animate with our object. We do this with the `onUpdate` event of the `ScrollTrigger`.

```js
onUpdate: (self) => {
  const pos = [camData.px, camData.py, camData.pz];
  const target = [camData.tx, camData.ty, camData.tz];
  api.setCameraLookAt(pos, target, 0);
};
```

This event fires everytime a scroll action happens. It interpolates each property in the timeline object (`camData`) for us. We then take this data and set the camera position and target with the `setCameraLookAt` method of the API. You can read more about working with the camera in the [camera guide](../guide/camera/#move-the-camera).

<CodePenEmbed id="VwRLraZ/2a3ac7885381577665b9dcef5796de8c" tab="result" />

## Using annotations

Let's replace the hardcoded camera positions with the camera positions of the annotations in the model. We can get the annotations with the `getAnnotations` method of the API. Read more about annotations in the [Guide](../guide/annotations/).

This is a relatively minor change in the code, but this setup can be used for any model with annotations.

<CodePenEmbed id="WNmvXXX/203de4f07d5dc2b8333224fd5dcf373e" tab="result" />

## Showing annotation texts

In addition to setting the camera positions, we can also show the annotation texts ourselves. I've added a `div` to the page to show the title and description. We also need to change the structure of the page a bit. The texts of the annotations needs to be pinned too, together with the 3D model.

### Not animating texts

To show this content, we can't really use the interpolation of the timeline. I can't smoothly animate from one text to the other. It's either one or the other. We need to add some logic for this.

First of all, each `camData` keyframe gets an index. Then in the `onUpdate` event, we round this index to an integer. We use that integer as an index to get the annotation texts.

```js
const currentIndex =
  self.direction === 1 ? Math.floor(camData.index) : Math.ceil(camData.index);
const annotation = annotations[currentIndex];
```

The `direction` property of the `ScrollTrigger` tells us if the user is scrolling up or down. We use this to determine if we need to round up or down. Then we use the `currentIndex` to get the annotation from the `annotations` array.

<CodePenEmbed id="bGZdYar/7fc020d53e6ac49da12520185b57a66e" tab="result" />

If you scroll past the annotations, you'll notice the camera positions and the texts seem out of sync. An annotation in Sketchfab is a point in space, but now we're scrolling past them. We need to adjust the timing of the annotations.

## Finetune annotation timing

We can make the annotation texts more synchronized with the camera positions. We can also make the camera linger a bit longer on the annotations positions and speed up in between them.

## Show texts early

```js
const currentIndex =
  self.direction === 1
    ? Math.floor(camData.index + 0.2)
    : Math.ceil(camData.index - 0.2);
```

By offsetting the index with 0.2, we show the annotation texts a bit earlier. So, when the camera is at the position of the annotation, the text is already visible.

## Easing

A GSAP timeline can use easing to adjust the speed of the animations. Just add `ease: "power3.inOut"` to a timeline keyframe. This makes the camera slow down around an annotation and speed up in between them.

These two adjustments improve the feel of the scrolling navigation a lot.

<CodePenEmbed id="bGZdYvo/6233bed8b22b0c60a45bc81c9833a87b" tab="result" />

## Conclusion

Using GSAP takes a bit of getting used to, but it is a great tool to animate things in a Sketchfab model.

The example with the statue at the top shows extra texts before and after the 3D model, but the scrolling bit works exactly as here in the tutorial. The camera motion uses the orbital camera movement from the [camera guide](../guide/camera/orbital-movement.md). Finally, I used a custom annotation (the orange dot). There's no tutorial for that yet.
