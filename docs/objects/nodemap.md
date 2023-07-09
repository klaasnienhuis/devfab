# NodeMap

A Sketchfab scene contains nodes. A node is a piece of geometry for instance. Sketchfab structures nodes in a hierarchy, like almost all 3D software does. This means a Sketchfab scene has a rootnode. That rootnode has children and each child can have children, and so on.

Each node has a unique ID that's assigned by Sketchfab: the `instanceID`. This ID is the key to all node operations, such as showing and hiding, moving and rotating. We can't predict this ID and we can't assume it will stay the same when the scene has changed through a reupload. The only way to find out what ID an object has is to search for an object by its name. You can do this with the `NodeMap`.

## Reading the nodemap

```js
api.getNodeMap(function (err, nodeMap) {
  console.log(nodeMap)
});
```

This example logs the nodemap to the console. The nodemap is not an array, but an object with the `instanceID` as index. Here is the result of that nodemap for the example scene.

```js
0: Object { name: "Root", instanceID: 0, ... }
2: Object { name: "skelet", instanceID: 2, ... }
3: Object { name: "GeodeGroup26934", instanceID: 3, ... }
4: Object { name: "skelet_0", instanceID: 4, ... }
16: Object { name: "skelet_0", instanceID: 16, ... }
24: Object { name: "skelet_0", instanceID: 24, ... }
44: Object { name: "olifant_klein", instanceID: 44, ... }
45: Object { name: "Geodeolifant_klein", instanceID: 45, ... }
46: Object { name: "olifant_klein_0", instanceID: 46, ... }
```
<iframe height="500" style="width: 100%;" scrolling="no" title="Sketchfab Objects - Nodemap" src="https://codepen.io/klaasnienhuis/embed/eYQeBvX?default-tab=result&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/klaasnienhuis/pen/eYQeBvX">
  Sketchfab Objects - Nodemap</a> by Klaas Nienhuis (<a href="https://codepen.io/klaasnienhuis">@klaasnienhuis</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>





<iframe height="500" style="width: 100%;" scrolling="no" title="Sketchfab Objects - Nodemap 2" src="https://codepen.io/klaasnienhuis/embed/dyQZOWM/e4040e5e359685ff1e14dfdb7f947996?default-tab=result&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/klaasnienhuis/pen/dyQZOWM/e4040e5e359685ff1e14dfdb7f947996">
  Sketchfab Objects - Nodemap 2</a> by Klaas Nienhuis (<a href="https://codepen.io/klaasnienhuis">@klaasnienhuis</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


```api.getNodeMap((err, nodes) => console.log(nodes))```

The nodemap is a flat list of nodes. This is very convenient as it's much easier to search a flat list than a hierarchy. In the code example you see a single node with all its properties. For now, we're only interested in the name, type and instanceID

​
