<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Camera

Sketchfab enables you to take control over the camera in the scene. You can move the camera from A to B, set the field of view, center the camera and a few other things. But before we start manipulating the camera we need to get information from the camera and understand what it means.

## Position and Target

A camera in Sketchfab works with a position and a target. The position is where your eye is located in the scene. The target is the point in the scene you're looking at. Both positions are a position in space with an x, y, z coordinate. To get this info, you can use the `getCameraLookAt` method.

```js
api.getCameraLookAt(function (err, camera) {
  window.console.log(camera.position); // [x, y, z]
  window.console.log(camera.target); // [x, y, z]
});
```

Notice that the `camera` object, returned by the API, has a `position` and a `target` property. Both are arrays with three numbers.

<CodePenEmbed id="eYbpZKK/480a125cd069378399e055d51457f775" tab="result" />

Navigate in this scene and press the "Get camera" button to see the camera data.

## Move the camera

It often happens you want to move the camera to a predefined spot, such as a side view or a top view of a product or place. You can do this by setting the position and target of the camera. The `setCameraLookAt` method takes three arguments: a position, a target and a duration. The duration is the time Sketchfab takes to move the camera from its current location to the new location.

```js
api.setCameraLookAt([0, 13, 10], [0, 10, 0], 4.3, function (err) {});
```

Note that the two positions are arrays with three numbers. The duration is a number in seconds.

<CodePenEmbed id="oNJjxmv/a6e19520a0817a013497be2b7b46bc1a" tab="result" />

This example shows you how to move the camera to predefined positions. Note that the "Side" and "Other Side" locations are exactly opposite from each other. When moving between these two positions, the camera makes a yanky movement when it closely passes the target. It's generally best to avoid this. We'll talk more about this when discussing zoom and pan [constraints](./camera-constraints.md#camera-conflicts).

## Are we moving?

When creating interactive experiences, it's important to know when the camera is moving and when it has stopped. For instance, you might want to move the camera to an object and when you arrive, change the material.

Sketchfab offers a `camerastart` and a `camerastop` event. These events are fired when the camera starts moving and when it stops moving. You can listen to these events with the `addEventListener` method. There's also the `setCameraLookAtEndAnimationCallback` function. This is a very targeted way to detect whether the camera has stopped moving. Let's try them both.

<CodePenEmbed id="MWZaegq/06a85dad7f660956092b1191e2d4c536" tab="result" />

```js
let isCameraMoving = true;
api.setCameraLookAt(camera.position, camera.target, 3, function (err) {
  api.setCameraLookAtEndAnimationCallback(function (err) {
    isCameraMoving = false;
  });
});
```

In this example we use the `setCameraLookAtEndAnimationCallback` method to detect when the camera has stopped moving. We set a variable `isCameraMoving` to `true` right before we start moving the camera. Then within the callback of the `setCameraLookat` we add the `setCameraLookAtEndAnimationCallback` method. The callback of that method tells us when the camera is done moving. This is really practical because it's very targeted. This method does not react to manual navigation of the scene by users.

::: warning
If you set the duration of `setCameraLookAt` to 0, the callback of `setCameraLookAtEndAnimationCallback` is never called. If you need an instant camera movement but still want to know when the movement is done, use a very short duration instead.
:::

::: warning
`setCameraLookAt` will always act as if it's moving the camera. Even if the camera is already at the target location. Press the "Front" button twice, and you'll see what this means. Sketchfab does not offer a watertight way to detect motion with the `setCameraLookAtEndAnimationCallback` method.
:::

### Camera event listeners

<CodePenEmbed id="/LYMpZpE/5a77653806e2e5994cbadf66de213bd9" tab="result" />

```js
api.addEventListener("camerastart", () => {
  isCameraMoving = true;
});
api.addEventListener("camerastop", () => {
  isCameraMoving = false;
});
```

This example uses the two events to detect camera movement. It will react to all camera movement: both user navigation and API camera movement. This is a more general approach than the previous example.

::: warning
There is no reliable way to tell whether the user is moving the camera by navigating or whether the camera is moved by the API. You'll need to keep track of this by combining the event and callback methods.
:::

## Orbit and Look around

By default, the camera will orbit around the target. This is practical when viewing objects in space. But sometimes you want to look around instead. Looking around means that the target of the camera orbits around the camera and the camera stays put. This is practical when you're viewing spaces from the inside. There is an `fps` navigation mode that you can use. But we can also use the API to set the camera to look around.

<CodePenEmbed id="BavjNPK/b81e9a5f44ce328b5e0720905ec3b5cf" tab="result" />

The trick is to place the target really close to the camera. The camera will still orbit the target, but it will appear as if the camera is looking around. In this example we use the `setCameraLookAt` method to set the target to the camera position. We also set the duration to 0.01, so the camera instantly moves to the new location.
