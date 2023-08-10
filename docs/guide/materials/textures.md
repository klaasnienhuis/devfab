<script setup>
import ModelLoading from '../../components/ModelLoading.vue'
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Textures

Most material channels will accept a texture as input. The texture can be a file uploaded to Sketchfab, a texture from the model's original file, a file from a server or a file from disc. In this section we'll look at how to use textures in your materials.

## Texture list

First, we should get a list of the textures available in the model. You can do this with the `getTextureList` method:

```js
api.getTextureList(function (err, texturelist) {
  console.log(texturelist);
});
```

<CodePenEmbed id="QWJXypx/e12f2cb90ff0ebe6d8e83e503b2d8250" />

The list of textures contains the filenames and uids of the textures that are available in the Sketchfab scene. We will use the name and uid later to refer to the texture. Only textures that are used in a material are available to the API. If you have uploaded textures in the Sketchfab editor, but you haven't applied them to channels in materials, you won't see them in the list.

```js{2,3}
{
  name: "uvgrid1024-colour.png",
  uid: "1d37ac1c53a34f74b74504a53043f278",
  colorSpace: "unknown",
  createdAt: "2023-08-10T20:59:05.893014",
  images: [],
  updatedAt: "2023-08-10T20:59:09.283886",
}
```

## Textures in materials

Textures also show up in the materials. Here is a list of the two materials in the scene. Each material contains a texture.

<ModelLoading id="3e1a54cc0bb849f4a553b98ea401b7b4" :showMaterials="true" :playersettings="{autostart:1}" />

```js
"AlbedoPBR": {
  "enable": true,
  "factor": 1,
  "UVTransforms": {
    "scale": [ 1, 1 ],
    "offset": [ 0, 0 ],
    "rotation": 0
  },
  "texture": {
    "magFilter": "LINEAR",
    "minFilter": "LINEAR_MIPMAP_LINEAR",
    "wrapS": "REPEAT",
    "wrapT": "REPEAT",
    "textureTarget": "TEXTURE_2D",
    "internalFormat": "RGB",
    "texCoordUnit": 0,
    "uid": "1d37ac1c53a34f74b74504a53043f278"
  }
}
```

This is the AlbedoPBR channel of the teapot material. You see there's no more color property, like we saw in the [Material Channels](./channels) topic. Instead, there's a `texture` property. Instead there's not a texture object. For almost all channels, color and texture are mutually exclusive. IF you want to add a texture, you need to remove a color and vice versa. You need to take care of this yourself.

The texture property contains the uid of the texture we saw in the texture list. This is how the API knows which texture to use in the material. We'll ignore all other texture properties for now. There's also a UVTransforms property. This is used to transform the texture coordinates. We'll look at this later.

## Changing textures

Now that we know how to get the list of textures and how to find them in the materials, let's look at how to change them. We'll start with the texture list. Then we find our textures by name, update teh material channel. Finally we'll use the `setMaterial` method to change the texture of the teapot material.

This is the process how you can change textures that are already on the Sketchfab scene.

<CodePenEmbed id="OJaeMvQ/c2377cf0b264ae0d16ea0af344ae1b08" />

Here is the critical part of the code:

```js
const dotsTexture = texturelist.find((item) => item.name === "dots.png");
potMaterial.channels.AlbedoPBR.texture.uid = dotsTexture.uid;
api.setMaterial(potMaterial);
```

## Loading new textures

You can also load new textures into the scene. This is useful when you have many texture variations and don't want to load all of them in the Sketchfab model. Loading textures on demand can save bandwidth and improve performance.



<CodePenEmbed id="zYMVrev/35d222c624f6acff91a2689a622c5501" />