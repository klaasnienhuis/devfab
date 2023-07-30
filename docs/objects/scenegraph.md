<script setup>
import CodePenEmbed from '../components/CodePenEmbed.vue'
</script>

# SceneGraph

The nodes in a Sketchfab scene are organized in a hierarchy. This hierarchy is called the `SceneGraph`. The SceneGraph is a tree structure, where each node can have children and each child can have children, and so on. While the SceneGraph is harder than the [NodeMap](../objects/nodemap) to work with, it's the best way to understand how a Sketchfab scene is organized.

<CodePenEmbed id="rNQQbxz/690d3035ff08a5410d62135261672c7f" />

This is the scenegraph of the scene with the teapot and disc. The original 3D model (created in 3dsMax) contains two objects, called `Teapot001` and `Cylinder001`. These are the hightlighted objects with the ID 3 and 22. 

```txt{3,6}
0: 34632ee1cb8f4ded8e8a1759bae0e2a3.fbx (MatrixTransform)
└─2: RootNode (MatrixTransform)
  ├─3: Teapot001 (MatrixTransform)
  │ └─4: Teapot001 (Group)
  │   └─5: Teapot001_Pot_0 (Geometry)
  └─22: Cylinder001 (MatrixTransform)
    └─23: Cylinder001 (Group)
      └─24: Cylinder001_Disk_0 (Geometry)
```

## Root node

The file that's uploaded to Sketchfab is an .fbx in this case. When exporting from 3dsMax to .fbx, a `RootNode` is added. This is a node that contains the entire scene. Sometimes an extra node is added with a random ID. This depends on the file format. Some other file formats seemingly don't have a rootnode. This happens with files uploaded from some scan apps.

## Geometry node

The fbx exporter splits each object into two nodes: a `MatrixTransform` and a `Geometry`. The name of the `Geometry` node is a combination of the object name and the material name. In my scene, the material of the Teapot is called `Pot` and the material of the disc is called `Disk`.

## Group nodes

A `Group` node is inserted between the `MatrixTransform` and the `Geometry` node. This is a node that can contain multiple nodes. In this case, the `Group` node contains a single node, the `Geometry` node. It's a result of the way the fbx exporter works. The exporter creates a `Group` node for each material. If an object has a single material, the `Group` node contains a single `Geometry` node. If an object has multiple materials, the `Group` node contains multiple `Geometry` nodes.

Here's an example of a scene with a single object that has multiple materials. 

<CodePenEmbed id="PoxxvOj/fff744947a56c685fbe1908e9a037181" />

::: warning
This model structure differs per 3d software and exported file format. But the general idea should be the same for other formats.
:::

