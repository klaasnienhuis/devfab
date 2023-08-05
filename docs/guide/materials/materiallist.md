<script setup>
import ModelLoading from '../../components/ModelLoading.vue'
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Material list

The material list is a list of materials in the current scene. This example shows the material list of a model with 2 materials.

<ModelLoading id="c2fb3b0dbd4c4071bf9b4656ed41a432" :showMaterials="true" :playersettings="{autostart:1}" />

You can get the list of material with the following function

```js
api.getMaterialList(function (err, materials) {
  console.log(materials);
});
```

The result is an array of materials, unlike the nodeMap which is an object. Each material has a bunch of properties. `name` and `channels` are the most important ones. This is an example of a single material:

```js{2,3}
{
  name: "Disk"
  channels: {…}
  cullFace: "DISABLE"
  id: "3c7979b5-021f-4841-ae30-813ca3937cd3"
  reflection: 0.1
  shadeless: false
  stateSetID: 2
  version: 3
}
```

Materials also get an id from Sketchfab. But unlike the instanceID of objects, the id of a material is hardly used. In case you don't create materials from scratch, you can get the list of materials when the scene loads. It will not change during the lifetime of the scene. You identfiy materials by their name. These are the names you created in your 3D software. Make sure to use unique material names.

Now that we know how to get the list of materials, let's look at how to change them.

::: info Links
Read the Sketchfab docs: [get material list](https://sketchfab.com/developers/viewer/functions#api-getMaterialList)
:::