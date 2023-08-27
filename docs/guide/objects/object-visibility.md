<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Object visibility

Now that we know how to interpret the [scenegraph](./scenegraph) and [nodemap](./nodemap), we can start to manipulate objects with the API. Let's start with showing and hiding objects.

```txt
0: e03ab7bb049346bd828ea8a561555010.fbx (MatrixTransform)
└─2: RootNode (MatrixTransform)
  ├─3: Teapot001 (MatrixTransform)
  │ └─4: Teapot001 (Group)
  │   ├─5: Teapot001_Orange_0 (Geometry)
  │   ├─16: Teapot001_Lime_0 (Geometry)
  │   ├─27: Teapot001_Green_0 (Geometry)
  │   └─38: Teapot001_Red_0 (Geometry)
  └─65: Cylinder001 (MatrixTransform)
    └─66: Cylinder001 (Group)
      └─67: Cylinder001_Disk_0 (Geometry)
```

## Show and hide

Showing and hiding an object is quite straightforward. We use the `show` and `hide` methods of the API. These two methods take a single argument, an `instanceID`. The following example shows how to hide the teapot with the `instanceID` of 3. It's usually safest to show and hide the objects with the type `MatrixTransform`. You can show and hide `Group` objects, but there's no guarantee they're present. Showing or hiding a `Geometry` object has no effect.

```js
api.hide(3);
```

To find the `instanceID` of an object, we can use the [nodemap](./nodemap). The following example shows a function that takes the nodemap and the name of an object as arguments. Remember the nodemap is not an array, but an object. We use `Object.values` to get an array of all the nodes. Then we use `Array.find` to find the node with the correct name and type.

```js
const findNode = (nodemap, name) => {
  return Object.values(nodemap).find((node) => {
    return node.name === name && node.type === "MatrixTransform";
  });
};
```

### What is the name?

Working with objects like this, requires you to know the names of your objects. If you don't know the names, you can find out by using the [nodemap](./nodemap) or the [scenegraph](./scenegraph).

## Hierarchy

When showing or hiding an object, all child objects will be shown or hidden as well. If you'd hide one of the two root nodes, with the `instanceID` 0 or 2, all other objects would be hidden too.

Here is an example that toggles the visibility of the teapot, the disc and the rootnode. 

<CodePenEmbed id="KKryzLY/7c78e4bec3a7146058e6aa5c1d2ae3d0" />