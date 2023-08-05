<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { onMounted, ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  playersettings: {
    type: Object,
    required: false,
    default: {}
  },
  showGraph: {
    type: Boolean,
    required: false,
    default: false
  },
  showMaterials: {
    type: Boolean,
    required: false,
    default: false
  },
})
const viewerIframeRef = ref(null)
const tree = ref("");
const materialTree = ref({});

const recursePrint = (node) => {
  const name = `${node.instanceID}: ${node.name} (${node.type})`;
  const symbol = node.children?.length
    ? "\n" +
      node.children
        .map(recursePrint)
        .map((text, i, { length }) => {
          return i < length - 1
            ? "├─" + text.replace(/\n/g, "\n│ ")
            : "└─" + text.replace(/\n/g, "\n  ");
        })
        .join("\n")
    : "";
  return `${name}${symbol}`;
};

const createNodeHierarchy = (api) => {
  api.getSceneGraph(function (err, sceneGraph) {
    tree.value = recursePrint(sceneGraph);
    console.log(sceneGraph);
    console.log(tree.value);
  });
};

const createMaterialTree = (api) => {
  api.getMaterialList(function (err, materials) {
    materialTree.value = materials;
    console.log(materials);
  });
};
onMounted(() => {
  import('@sketchfab/viewer-api').then((module) => {
    const client = new module.default('1.12.1', viewerIframeRef.value);
    client.init(props.id, {
    success: (api) => {
      api.addEventListener("viewerready", () => {
        createNodeHierarchy(api);
        createMaterialTree(api);
      });
    },
      error: () => console.error("Sketchfab API error"),
      ...props.playersettings
    });
  })
})
</script>

<template>
  <v-responsive :aspect-ratio="16 / 9" class="w-100">
    <div class="scenegraph">
      <pre v-if="showGraph">{{ tree }}</pre>
      <VueJsonPretty v-if="showMaterials" :data="materialTree" :deep="3" />
    </div>
    <iframe style="border: 0" id="api-iframe" ref="viewerIframeRef" class="w-100 h-100"></iframe>
  </v-responsive>
</template>

<style>
.scenegraph {
  position: absolute;
  height: 100%;
  width: 50%;
  left: 0px;
  top: 0px;
  padding-left: 8px;
  overflow: auto;
  text-align: left;
  pointer-events: all;
  background: rgba(0, 0, 0, 0.5);
}
</style>