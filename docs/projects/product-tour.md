---
title: Product tour with the Sketchfab API
description: Create a 3D product tour with the Sketchfab API
tags: [sketchfab, api, product-tour]
image: /images/og-product-showcase.jpg
---

<script setup>
import ProductTour from '../components/ProductTour.vue'
import CodePenEmbed from '../components/CodePenEmbed.vue'
</script>

# Product tour

<ProductTour />

A product tour is a great way to show off a product. It's a series of steps that guide the user through the highlights of the product. The user can interact with the product, get more information and even configure the product. The product tour makes efficient use of space on a webpage. The goal is to grab the user's attention and keep it.

In this tutorial I will point to the relevant sections in the guide to explain the principles behind the code. If this is your first time working with the Sketchfab API, I recommend you start with the [Getting started](../guide/model-loading/getting-started.html) tutorial.

## Features

This product tour has the following features:

- A 3D model of an examination table with annotations
- Very tight camera behavior
- A series of steps
- A sidebar with information
- Configuration options

The 3D model contains annotations, but all the contents will live in the web-app.

## The model

<CodePenEmbed id="zYyeoOg/3dae5827db7a6cdc2ed3d8d659425b11" tab="result" />

We want the model to show the hotspots, but not the annotation menu nor the annotation popups. We'll be making those ourselves shortly.

We're using the following settings:

```js
autostart: 1,
annotation_tooltip_visible: 0,
scrollwheel: 0,
ui_controls: 0,
ui_infos: 0,
ui_watermark: 0,
ui_stop: 0,
```

`annotation_tooltip_visible: 0` makes sure the annotation popup doesn't show up. `ui_controls: 0` hides all menus, including the annotation menu. Finally, `scrollwheel: 0` disables zooming with the mouse wheel. That is practical to keep the model in view and makes sure the user doesn't wander off. You'll notice that the annotations in Sketchfab are laid out with a sidebar in mind. Of course it's up to you how you want to arrange the annotations in your web-app.

Take a look at the [Menu and embedding](../guide/annotations/menu) for these settings and more.

## Step through annotations

<CodePenEmbed id="ExGrNKa/fb3fd39a0dcea8d04571a8413e17dd57" tab="result" />

I want to step through these annotations with a back/next button. Those buttons make the annotations easy to digest, one at a time. My model has only 7 annotations, but imagine you have 20 or 50. A simple back/next navigation will avoid your users feeling overwhelmed. I'm going to show a custom title in the sidebar and I'm moving the sidebar to the left or right depending on the position of the annotation.

Most of this section comes from the [Navigation example](../guide/annotations/navigation.html) in the guide.

When you first load the scene, get the annotations and keep track of how many there are. That will help you calculate the next or previous annotation id.

```js
currentId = currentId === 0 ? maxId : currentId - 1; // Get the previous annotation id
currentId = currentId === maxId ? 0 : currentId + 1; // Get the next annotation id
```

I have created an object with titles for each annotation and an alignment option. Moving the contents of the annotations into the web-app is practical. You don't have to go into the Sketchfab editor to make copy changes. We'll add more data to this object later.

```js
const annotations = {
  0: { title: "4040X General Examination Table", align: "right" },
  1: { title: "Side rails", align: "left" },
  2: { title: "Foot control", align: "left" },
  3: { title: "Central locking castors", align: "left" },
  4: { title: "Trendelenburg adjustment", align: "right" },
  5: { title: "Paper roll stand", align: "right" },
  6: { title: "Upholstery", align: "right" },
};
```

When an annotation is activated, I show the title in the sidebar and move the sidebar to the left or right depending on the alignment option. This is a rudimentary way to edit the CSS of the sidebar. You could also use a class and toggle that. Using a framework like react or vue would make this easier.

```js
const alignSidebar = (align) => {
  if (align === "right") {
    elSidebar.style.removeProperty("left");
    elSidebar.style.setProperty("right", "0px");
  } else {
    elSidebar.style.removeProperty("right");
    elSidebar.style.setProperty("left", "0px");
  }
};
```

### More content

Let's add some text for the annotations and some images. I'm adding to the `annotations` object. Here's an example of one of the annotations:

```js
4: {
  title: "Trendelenburg adjustment",
  align: "right",
  text: "Manual Trendelenburg adjustment (max. 12°) with lever at foot end",
  src: "./trendelenburg.jpg",
},
```

<CodePenEmbed id="KKbJaPw/23064d8aa08e10c8e92c8085b6cc11a4" tab="result" />

## Configuration: Visibility

While this should not be a full configurator, we can add a few options to the sidebar. I want to toggle visibility on some objects and change the upholstery. We're adding the configuration controls to the annotation sidebar.

We're adding even more data to the `annotations` object. Here's a sample that shows how to keep track of visibility. `objects: ["handle"]` is an array of objectnames in the Sketchfab scene. We'll store the `instanceID` of all the objects with these names in the `ids` array. The `state` property is a boolean that keeps track of the visibility state.

```js
toggle: {
  objects: ["handle"],
  state: true,
  ids: [],
},
```

<CodePenEmbed id="QWzYdNw/a19c9c48a517197b4e520f7f72f9fbc9" tab="result" />

When the scene loads, we should find the instanceID's of the objects we want to toggle. We can use the `getNodeMap` function to get the instanceID's. We'll store them in the `ids` array of each annotation. The following code gets the nodemap and then loops over all my annotations and finds the instanceID's of the objects that are in the `toggle` object. I'm using a helper function to filter the nodemap. I'm using `Array.filter` instead of `Array.find` because there can be multiple objects with the same name.

```js
const filterNodes = (nodemap, name) => {
  return Object.values(nodemap).filter((node) => {
    return node.name === name && node.type === "MatrixTransform";
  });
};

api.getNodeMap(function (err, nodeMap) {
  Object.keys(annotations).forEach((key) => {
    if (annotations[key].toggle) {
      annotations[key].toggle.objects.forEach((object) => {
        const nodes = filterNodes(nodeMap, object);
        if (nodes) {
          nodes.forEach((node) => {
            annotations[key].toggle.ids.push(node.instanceID);
          });
        }
      });
    }
  });
});
```

Then, when the user clicks the toggle button, we can loop over the `ids` array and toggle the visibility of the objects. Here you'll see that I take the ids of the current annotation to show or hide objects. The `state` property is to keep track of the visibility state.

```js
const toggleAnnotation = (api) => {
  if (annotations[currentId].toggle.state) {
    annotations[currentId].toggle.ids.forEach((id) => {
      api.hide(id);
    });
  } else {
    annotations[currentId].toggle.ids.forEach((id) => {
      api.show(id);
    });
  }
  annotations[currentId].toggle.state = !annotations[currentId].toggle.state;
};
```

For more info on showing and hiding objects, check out the [Showing and hiding](../guide/objects/object-visibility) tutorial.

## Configuration: Material

Changing colors wraps up the product tour. We're adding three buttons to one of the annotations to change the color of the upholstery.

<CodePenEmbed id="PoXVWOr/dcec65eff29ffedc660105181bd98a5b" tab="result" />

This is the list of colors we're using and the methods to change the `AlbedoPBR` color of the upholstery material.

```js
const colors = {
  silver: { rgb: [157, 157, 157] },
  sunrise: { rgb: [214, 164, 67] },
  lagoon: { rgb: [53, 113, 137] },
};

function gammaCorrectRgb(rgb) {
  return rgb.map((v) => Math.pow(v / 255, 2.2));
}

const applyColors = async (api, colorname) => {
  const maincolor = gammaCorrectRgb(colors[colorname].rgb);
  skaiMaterial.channels.AlbedoPBR.color = maincolor;
  api.setMaterial(skaiMaterial);
};
```

Before we can edit the material, we must first get it from the mateiral list. This is done in the `viewerready` event. We're looking for a material iwth the name `Skai`. Once we have the material, we can call the `applyColors` function to change the color.

```js
api.getMaterialList((err, materials) => {
  skaiMaterial = materials.find((m) => m.name === "Skai");
  applyColors(api, "silver");
});
```

Read more about changing materials here [Change materials](../guide/materials/colors).

Read more about the material list here [Material list](../guide/materials/materiallist).
