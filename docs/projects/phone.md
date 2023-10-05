---
title: Product showcase with the Sketchfab API
description: Create a 3D product showcase with the Sketchfab API
tags: [sketchfab, api, product-showcase]
image: /images/og-product-showcase.jpg
---

<script setup>
import PhoneExperience from '../components/PhoneExperience.vue'
import CodePenEmbed from '../components/CodePenEmbed.vue'
</script>

# Phone Showcase

<PhoneExperience />

Let's create a product showcase for a phone. A 3D product showcase should show the product in a compelling way. Because we're using 3D models, we can add interactivity. But let's not overdo it. We want to show the product, not show off 3D tech. The interactivity should be subtle and enhance the experience. 

I will point to the relevant sections in the guide to explain the principles behing the code. If this is your first time working with the Sketchfab API, I recommend you start with the [Getting started](../guide/model-loading/getting-started.html) tutorial.

## Features

This phone showcase has the following features:

- A 3D model of a phone
- Size options
- Move model
- Color options

The 3D model is based on a model from the Sketchfab store. It's been modified to make the materials easy to update. I also added a simple hierarchy to make showing and hiding the model easier.

## Size options

<CodePenEmbed id="abPqQjE/0fd7257fe79db7dbcd1be7d07464c698" tab="result" />

The model contains two phones. A 6.1" model and a 6.7" model. We can switch between them by hiding and showing the right parts of the model. 

Check out the [Showing and hiding](../guide/objects/object-visibility) tutorial for the basiscs of this technique.

This part of the code searches the nodemap for the two objects I want to target: `iPhone_15_Plus_v1_002` and `iPhone_15_v1_002`. I store the instanceID's in an object called `scenenodes`. Once I have the instanceID's, I can use them to `show` and `hide` the objects.

```js
const scenenodes = {
  iPhone_15_Plus_v1_002: null,
  iPhone_15_v1_002: null
};

api.addEventListener("viewerready", () => {
  api.getNodeMap(function (err, nodeMap) {
    Object.keys(scenenodes).forEach((key) => {
      const node = findNode(nodeMap, key);
      if (node) scenenodes[key] = node.instanceID;
    });
  });
});

api.show(scenenodes["iPhone_15_v1_002"]);
api.hide(scenenodes["iPhone_15_Plus_v1_002"]);
```

## Moving the phones

<CodePenEmbed id="eYbVQGg/af4e7ca6fad2dd77b909c101e8ed5177" tab="result" />

Let's add some movement to the phones. When toggling between the phone sizes, we should put the active phone in the center of the screen. We can do this by moving the model. We haven't covered moving models yet in teh guide. The process is quite straightforward. First we need to find the instanceID of the object we want to move, then we can move it. In our example, we want to move the root of the scene.
  
Look at [Get the rootnode](../guide/objects/rootnode.html) to learn how to get the instanceID of the root node. Read the Sketchfab docs about [translating](https://sketchfab.com/developers/viewer/functions#api-translate) to learn how to move the model.

```js
api.addEventListener("viewerready", () => {
  let rootID = null;
  api.getRootMatrixNode((err, instanceID) => {
    rootID = instanceID;
  });
  api.translate(rootID, [0.08, 0, 0], {
    duration: 1.0,
    easing: "easeInOutQuad"
  });
});
```

`api.translate` takes three arguments. The first is the instanceID of the object we want to move. The second is the position we want to move to. The third is an object with options. We can set the `duration` and `easing` of the movement. Easing is a way to control the speed and accelleration of the movement.

### Camera constraints

To get an easy-to-understand experience, we should reduce the freedom users have navigating the scene. Only orbit the camera, don't allow zooming or panning. That helps to focus on the product. It also makes it easy to embed the product showcase on a website. The user can't get lost in the scene.

Here we disable panning, and set the camera target to the center of the phone. We also se the initial camera position to look at the center of the phone from the front. Read about camera constraints here: [Camera constraints](../guide/camera/camera-constraints.html)

```js
const constraints = {
  usePanConstraints: true,
  target: [0, 0, 0.08]
};
api.setCameraConstraints(constraints, function (err) {
  api.setEnableCameraConstraints(true, {});
  api.setCameraLookAt([0, 0.5, 0.08], [0, 0, 0.08], 1, function (err) {});
});
```

We can block the scrollwheel, and effectively disable zooming, with the init parameter `scrollwheel: 0`. Read more about init parameters here: [Initialization options](../guide/model-loading/initialization-options.html#behavior-and-appearance)


## Colors

<CodePenEmbed id="JjwpeXy/0662457d6b83da49dbd96ff1823d2048" tab="result" />

Setting the colors takes the most effort for two reasons: first we need to determine the right colors. This is not always straightforward with the metallic, plastic and glass materials. Secondly there are many materials that change color at the same time. We need to properly manage this.

Let's get the materials that we want to manipulate and store them in an object for easy access. The `scenematerials` object contains the names of the materials in the Sketchfab scene. Once the scene has loaded, we use `getMaterialList` to get the materials that we need. Read more about getting materials in [Material List](../guide/materials/materiallist.html)

```js
const scenematerials = {
  "aluminium-color": null,
  "glass-clear-color": null,
  "glass-frosted-color": null,
  logo: null,
  screen: null,
  "metal-screws": null,
  "plastic-color": null,
  "plastic-color-edges": null,
  "body-back": null
};
api.getMaterialList(function (err, materials) {
  materials.forEach((item) => {
    if (scenematerials[item.name] === null)
      scenematerials[item.name] = item;
  });
});
```

Now that we have the materials, we can change the colors. In most of the materials, we can change the `AlbedoPBR` color. On the screen we want to exchange the texture. I use several topics from the guide to make this happen:

- [Change material color](../guide/materials/colors.html). Also takes care of the gamma correction
- [Change material texture](../guide/materials/textures.html#reusing-textures). Also tackles reusing a texture.

To easily manage the colors, I've created an object containing the color values and texture URL's

```js
const materialsettings = {
  pink: {
    main: [227, 200, 202],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-pink.png"
    }
  },
  yellow: {
    main: [229, 224, 193],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-yellow.png"
    }
  },
  green: {
    main: [202, 212, 197],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-green.png"
    }
  },
  blue: {
    main: [206, 213, 217],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-blue.png"
    }
  },
  black: {
    main: [53, 57, 59],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-black.png"
    }
  }
};
```

Applying the colors is a matter of looping over the materials and setting the right color.

- Gamma correct the color
- Loop over the materials and set the color
- Apply the materials to the scene

```js
const colorname = "pink";
const maincolor = gammaCorrectRgb(materialsettings[colorname].main);

Object.keys(scenematerials).forEach((key) => {
  if (key !== "screen")
    scenematerials[key].channels.AlbedoPBR.color = maincolor;
});

Object.keys(scenematerials).forEach((key) => {
  api.setMaterial(scenematerials[key]);
});
```

Setting the texture is similar. We use a function to make sure we can reuse the same texture in case a user picks the same color again. This `loadTexture` uses a Promise instead of a callback for convenience. Learn more about promises on the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js
const loadTexture = (api, textureData) => {
  return new Promise((resolve) => {
    if (textureData.uid === undefined) {
      api.addTexture(textureData.url, (err, uid) => {
        textureData.uid = uid;
        resolve(uid);
      });
    } else {
      resolve(textureData.uid);
    }
  });
};
const colorname = "pink";
const uid = await loadTexture(api, materialsettings[colorname].screen);

scenematerials["screen"].channels.EmitColor.texture = { uid };

Object.keys(scenematerials).forEach((key) => {
  api.setMaterial(scenematerials[key]);
});
```

## Assembling the code

Now that we have all the elements, we can assemble it into a working example. The example at the top of the page contains nice styling with CSS. In the following CodePen example, I've left out the fancy CSS. This helps to focus on the code, and makes it a bit easier to reuse.


<CodePenEmbed id="ZEVrdRL/b7f7824da4001dbc1fe46ee3aab63503" tab="result" />

## Conclusion

Creating a compelling product showcase does not need an awful lot of features. However, it does need a lot of attention to detail. It's important to make it easy to use, but also easy to scroll past. The interactivity should be subtle and enhance the experience.

The example on this page can be enhanced. I see the following opportunities:

- Add a custom loading screen.
- Enhance the camera movement, smoothly locking to preferred camera angles.
- Make the materials and lighting look better! I'm not the best at materials and lighting. I'm sure you can do better.
- Instead of showing and hiding a model, create a fancy fade-in and fade-out animation.

I'd love to see what you can do with this project. Feel free to share your results with me, or reach out if you have any questions.

[![Form](https://img.shields.io/badge/Klaas_Nienhuis-Contact-red)][form]

[form]: https://klaasnienhuis.freshsales.io/web_forms/404bcc64bc2b7d2fadc81f06d07264e35c21a9cc6c36e680a1bd52d8b929b501/form.html