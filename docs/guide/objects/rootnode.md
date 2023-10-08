<script setup>
import ModelLoading from '../../components/ModelLoading.vue'
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Rootnode

In some cases, the 3D scene apparently has no rootnode that can be shown or hidden. This happens especially with 3D scans that come straight out of the scan software. These scenes do have a single node at the top of the scenegraph. But you won't be able to manipulate it.

<ModelLoading id="ccbb631ba89a42bfb22dc46f42b58259" :showGraph="true" :playersettings="{autostart:1}" />

In this example, the top node has the type `Group` instead of the expected `MatrixTransform`.

If you want to show or hide the model, you need to get the rootnode with an undocumented method:

```js
api.getRootMatrixNode((err, instanceID) => {});
```

This function gets `instanceID` of the rootnode in the scene. You can then use this `instanceID` to show or hide the model.

<CodePenEmbed id="qBQvBjO/41b0dfa61d9be0a8a3e73e834b857a4b" />

This is a side-by-side comparison. The (wrong) rootnode that I can get through the scenegraph won't work to show and hide the model. The rootnode that I get with `getRootMatrixNode` does work.
