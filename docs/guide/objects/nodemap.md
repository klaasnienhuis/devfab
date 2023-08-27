<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# NodeMap

A Sketchfab scene contains nodes. A node typically represents a piece of geometry. Sketchfab structures nodes in a hierarchy, like almost all 3D software does. This means a Sketchfab scene has a rootnode. That rootnode has children and each child can have children, and so on.

Each node has a unique ID that's assigned by Sketchfab: the `instanceID`. This ID is the key to all node operations, such as showing and hiding, moving and rotating. We can't predict this ID and we can't assume it will stay the same when the scene has changed through a reupload. The only way to find out what ID an object has is to search for an object by its name. You can do this with the `NodeMap`.

## Reading the nodemap

```js
api.getNodeMap(function (err, nodeMap) {
  console.log(nodeMap)
});
```

You can only use the `getNodeMap` function after the model has been loaded. If you log the nodemap to the console, you can see the names and instanceID's of all nodes in the scene. This is very useful. First of all, you might actually not know the names of the nodes in the scene. Perhaps you didn't create the model, or your 3D software doens't give you control over the names. Secondly, the instanceID is the only way to interact with a node. You can't use the name to show or hide an object. You need the instanceID.

<CodePenEmbed id="dyQZOWM/e4040e5e359685ff1e14dfdb7f947996" />

This example code prints out the instanceID and name to the screen. The nodemap is not an array, but an object with the `instanceID` as index.

## Flat list

The nodemap is a flat list of nodes. This is very convenient as it's much easier to search a flat list than a hierarchy.

**A single node**

This is all the information we get for each node. For now, we're only interested in the name and instanceID. In future tutorials we'll look at the `localMatrix` and `worldMatrix`. In the [scenegraph](./scenegraph.md) tutorial we'll look at the `children`. In the [object visibility](./object-visibility.md) tutorial we'll look at the `type`.

```js{2-3}
{
  ​​name: "RootNode",
  ​instanceID: 2,
  ​​type: "MatrixTransform",
  children: [ {}, {} ],
  ​localMatrix: [ 1, 0, 0, … ]​,
  materialID: null,
  ​​nodeMask: -1,
  ​​worldMatrix: [ 1, 0, 0, … ],
}
```

**All nodes**

This is the complete nodemap of the scene with the teapot. It's a flat list of nodes. The index is the `instanceID`. I have hidden the information we don't need for brevity.

```js
{
  0: { name: "34632ee1cb8f4ded8e8a1759bae0e2a3.fbx", instanceID: 0, … }​,
  2: { name: "RootNode", instanceID: 2, … }​,
  3: { name: "Teapot001", instanceID: 3, … }​,
  4: { name: "Teapot001", instanceID: 4, … }​,
  5: { name: "Teapot001_Pot_0", instanceID: 5, … }​,
  22: { name: "Cylinder001", instanceID: 22, … }​,
  23: { name: "Cylinder001", instanceID: 23, … }​,
  24: { name: "Cylinder001_Disk_0", instanceID: 24, … },
}
```

## Too many objects?

Even though the scene contains two objects (a teapot and a disc), the nodemap contains 8 entries. Some of these entries even have the same name. What does this mean? What are all these other objects doing in the nodemap? To understand this, we need to look at the [scenegraph](./scenegraph).