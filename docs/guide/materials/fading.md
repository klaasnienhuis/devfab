---
title: Fade between material properties
description: Use the Sketchfab API to smoothly transition between material properties
---

<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Fade material properties

When changing a material property with the API, you get instant results. Sometimes you want to have a smoother transition, for instance when changing a color or opacity. We can use the API and a little bit of coding to make this happen.

::: info
You can only fade between material properties, not between textures.
:::

## Interpolation or Easing

When talking about fading properties, you'll need to work with something that's called "interpolation" or "easing". Easing determines the speed at which a value changes over time. For instance, you can have a linear interpolation, where the value changes at a constant speed. Or you can have an ease-in-out interpolation, where the value starts slow, then speeds up, and then slows down again.

We'll start with a linear an ease-in-out interpolation example.

<CodePenEmbed id="Rwvbxxj/8f06fffc38e9446e6798d88508381f4b" />

In this example I transition a color from red to green. There's a slider that makes a linear transition and a slider that meakes an ease-in-out transition. There's a third slider that controls both transitions at the same time. When you use the third slider you can clearly see the speed at which the color changes differ.

These two functions calculate the interpolation and return a color value. There's a great overview on [easings.net](https://easings.net/) with examples on many different types of interpolation wiht ready-to-go code.

```js
// Linear interpolation
const easeLinear = (x) => {
  return [1 - x, x, 0];
};
// Quint ease-in-out interpolation
const easeInOut = (x) => {
  const value =
    x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  return [1 - value, value, 0];
};
```

## Animating material properties

In the previous example we've used a slider to illustrate the interpolation. Now we're going to animate. We'll use the `setInterval()` method for this. This method calls a function every x milliseconds. We can use that to make out little material animations.

::: tip
You can take this a step further and use the `requestAnimationFrame()` method to animate your materials. For more control over the animations you can take a look at the excellent [GSAP](https://greensock.com/gsap/) library.
:::

<CodePenEmbed id="jOdNZEO/20bd2322c3c3111ec7f51faf9be38e96" />

Here's how we do a linear interpolation:

```js
let step = 100;
let direction = -1;

const stepInterval = () => {
  step += direction;
  if (step < 0) {
    direction = 1;
    step = 0;
    clearInterval(intervalID);
  } else if (step > 100) {
    direction = -1;
    step = 100;
    clearInterval(intervalID);
  }
};

const setOpacityLinear = () => {
  setOpacity(step / 100);
  stepInterval();
};

const intervalID = setInterval(setOpacityLinear, 20);
```

The `step` value starts at 100 and then decreases to 0. Dividing the `step` by 100 gives us the opacify factor. The `direction` variable determines if the `step` value increases or decreases. So, if you pressed the button to make the materials transparent (`step = 0`), the `direction` value becomes `1` and the `step` value increases the next time you press the button.

`setInterval(setOpacityLinear, 20)` means we run the `setOpacityLinear()` function every 20 milliseconds. We store the result of this function in the `intervalID` variable. This enables us to stop the interval with `clearInterval(intervalID)` whenever the `step` value reaches 0 or 100.
