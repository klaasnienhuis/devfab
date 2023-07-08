<script setup>
import ModelLoading from '../components/ModelLoading.vue'
</script>

# Initialization options

There are many options when loading a Sketchfab model. If we don't say otherwise, a model is loaded like so:

<ModelLoading />

The iframe is populated with the model, but the model has not started yet. And when you manually start the model, by clicking on the play-button, the viewer shows a title, the inspector, sketchfab logo and more. This is the default embed.

## Behavior and appearance

The viewer can be customized. You can change both the behavior of the viewer and the appearance of it. These options are added to the init function as a second argument. There are many options. Let's start with a few.

```js
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 1,
  autospin: 0.2,
  scrollwheel: 0
});
```

- `autostart: 1` immediately starts the viewer. It's similar to an embedded video, that automatically starts playing. 

- `autospin: 0.2` spins the model slowly

- `scrollwheel: 0` disables the scrollwheel on the 3d model. This is practical when embedding models on ecommerce sites for instance.

<ModelLoading :playersettings="{autostart: 1, autospin: 0.2, scrollwheel: 0}" />

Instead of just loading the model, it's now started too and rotates slowly. Don't do this when you have many 3D models on a single page! You can find all the init options in the [Sketchfab documentation](https://sketchfab.com/developers/viewer/initialization). Some options are available for all accounts, other options require an enterprise account.
