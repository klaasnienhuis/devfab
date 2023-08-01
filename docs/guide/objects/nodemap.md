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

This example logs the nodemap to the console. The nodemap is not an array, but an object with the `instanceID` as index.

<CodePenEmbed id="dyQZOWM/e4040e5e359685ff1e14dfdb7f947996" />

## Flat list

The nodemap is a flat list of nodes. This is very convenient as it's much easier to search a flat list than a hierarchy. In the example you see a single node with all its properties. For now, we're only interested in the name and instanceID

**All nodes**

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

**A single node**

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

## Too many objects

Even though the scene contains two objects (a teapot and a disc), the nodemap contains 8 entries. Some of these entries even have the same name. What does this mean? What are all these other objects doing in the nodemap? To understand this, we need to look at the [scenegraph](./scenegraph).