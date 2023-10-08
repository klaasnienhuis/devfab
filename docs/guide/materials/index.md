<script setup>
import CodePenEmbed from '../../components/CodePenEmbed.vue'
</script>

# Material overview

Materials can be challenging to work with. In this guide, I'll walk you through the common tasks of working with materials. Let's start with an example:

<CodePenEmbed id="OJaqJoZ/36182ec549c6485675e62cbf964ab0ed" />

This example performs all the common tasks of when changing existing materials:

- get the list of existing materials with `getMaterialList`
- finding the material you want to work with by name
- changing the material properties, in this case `AlbedoPBR.color`
- sending the changed material back to Sketchfab with `setMaterial`

## Change material or create material?

There are two ways to change materials in your scene: edit an exisiting material or create a new material. Both have their merit. When you update an existing material, you can't change what objects this material is applied to. When you create new materials, you have to specify which objects should use this material.

::: info Links
Read the Sketchfab docs: [existing materials](https://sketchfab.com/developers/viewer/functions#api-setMaterial) and [new materials](https://sketchfab.com/developers/viewer/functions#api-createMaterial)
:::

Most examples in this guide will use existing materials, but I'll also show you how to create new materials.
