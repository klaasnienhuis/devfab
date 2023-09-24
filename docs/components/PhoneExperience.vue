<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { useData } from 'vitepress'
const { isDark } = useData()

const playersettings = {
  autostart: 1,
  transparent: 1,
  scrollwheel: 0,
  ui_controls: 0,
  ui_infos: 0,
  ui_watermark: 0,
  ui_stop: 0,
}
const colors = [
  { name: 'pink', bgColor: 'bg-[#E3C8CA]', selectedColor: 'ring-pink-500' },
  { name: 'yellow', bgColor: 'bg-[#E5E0C1]', selectedColor: 'ring-purple-500' },
  { name: 'green', bgColor: 'bg-[#CAD4C5]', selectedColor: 'ring-blue-500' },
  { name: 'blue', bgColor: 'bg-[#CED5D9]', selectedColor: 'ring-green-500' },
  { name: 'black', bgColor: 'bg-[#35393B]', selectedColor: 'ring-yellow-500' },
]
const sizes = [
  { name: 'small', title: '6.1"' },
  { name: 'big', title: '6.7"' },
]
const constraints = {
  usePanConstraints: true,
  target: [0, 0, 0.08]
};
const backgrounds = {
  light: [255,255,255],
  dark: [97,97,100]
}

const scenenodes = {
  rootMatrixNode: null,
  iPhone_15_Plus_v1_002: null,
  iPhone_15_v1_002: null
};


const viewerIframeRef = ref(null)
const viewerready = ref(false)
const selectedColor = ref(colors[0])
const selectedSize = ref(sizes[0])
const api = ref(null)

const scenematerials = {
  "aluminium-color": null,
  "glass-clear-color": null,
  "glass-frosted-color": null,
  logo: null,
  screen: null,
  "metal-screws": null,
  "plastic-color": null,
  "plastic-color-edges": null,
  "body-back": null
};

const materialsettings = {
  pink: {
    main: [227, 200, 202],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-pink.png",
      uid: null
    }
  },
  yellow: {
    main: [229, 224, 193],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-yellow.png",
      uid: null
    }
  },
  green: {
    main: [202, 212, 197],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-green.png",
      uid: null
    }
  },
  blue: {
    main: [206, 213, 217],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-blue.png",
      uid: null
    }
  },
  black: {
    main: [53, 57, 59],
    screen: {
      url: "https://assets.codepen.io/2407400/screen-black.png",
      uid: null
    }
  }
};

function gammaCorrectRgb(rgb) {
  return rgb.map((v) => Math.pow(v / 255, 2.2));
}

const loadTexture = (textureData) => {
  return new Promise((resolve) => {
    if (textureData.uid === null) {
      api.value.addTexture(textureData.url, (err, uid) => {
        textureData.uid = uid;
        resolve(uid);
      });
    } else {
      resolve(textureData.uid);
    }
  });
};

const applyColors = async (colorname) => {
  // gamma correct colors and load texture
  const maincolor = gammaCorrectRgb(materialsettings[colorname].main);
  // const plasticcolor = gammaCorrectRgb(materialsettings[colorname].plastic);
  const uid = await loadTexture(materialsettings[colorname].screen);

  // set the colors on the relevant materials
  Object.keys(scenematerials).forEach((key) => {
    if (key !== "screen")
      scenematerials[key].channels.AlbedoPBR.color = maincolor;
  });

  // set the colors on the relevant materials
  scenematerials["screen"].channels.EmitColor.texture = { uid };

  // apply the adjusted materials to the scene
  Object.keys(scenematerials).forEach((key) => {
    api.value.setMaterial(scenematerials[key]);
  });
};

const showSize = (size) => {
  if (size === "small") {
    showSmall();
  } else {
    showBig();
  }
};

const showSmall = () => {
  api.value.translate(scenenodes.rootMatrixNode, [0, 0, 0], {
    duration: 1.0,
    easing: "easeInOutQuad"
  }, function (err, translateTo) {
    api.value.show(scenenodes["iPhone_15_v1_002"]);
    api.value.hide(scenenodes["iPhone_15_Plus_v1_002"]);
  });
};

const showBig = () => {
  api.value.translate(scenenodes.rootMatrixNode, [0.08, 0, 0], {
    duration: 1.0,
    easing: "easeInOutQuad"
  }, function (err, translateTo) {
    api.value.hide(scenenodes["iPhone_15_v1_002"]);
    api.value.show(scenenodes["iPhone_15_Plus_v1_002"]);
  });
};

const findNode = (nodemap, name) => {
  return Object.values(nodemap).find((node) => {
    return node.name === name && node.type === "MatrixTransform";
  });
};

const setBackground = () => {
  const color = gammaCorrectRgb(backgrounds[isDark.value ? 'dark' : 'light'])
  const backgroundSetting = { color}
  if (api.value)
    api.value.setBackground(backgroundSetting, function (err) {});
}

watch(isDark, () => {
  setBackground()
})
onMounted(() => {
  import('@sketchfab/viewer-api').then((module) => {
    const client = new module.default('1.12.1', viewerIframeRef.value);
    client.init("e1dea0dd86f24480a8ff05fd0a33c206", {
    success: (_api) => {
      _api.addEventListener("viewerready", () => {
        viewerready.value = true;
        _api.getRootMatrixNode((err, instanceID) => {
          scenenodes.rootMatrixNode = instanceID;
        });
        _api.getNodeMap(function (err, nodeMap) {
          Object.keys(scenenodes).forEach((key) => {
            const node = findNode(nodeMap, key);
            if (node) scenenodes[key] = node.instanceID;
          });
          showSize('small');
        });
        _api.getMaterialList(function (err, materials) {
          materials.forEach((item) => {
            if (scenematerials[item.name] === null)
              scenematerials[item.name] = item;
          });
          // apply the pink colors as a default after starting up
          applyColors("pink");
        });
        _api.setCameraConstraints(constraints, function (err) {
          _api.setEnableCameraConstraints(true, {});
          _api.setCameraLookAt([0, 0.5, 0.08], [0, 0, 0.08], 1, function (err) {});
        });
        setBackground()
//         _api.setBackground({transparent: true}, function() {
//     window.console.log('Background changed');
// });
      });
      api.value = _api
    },
      error: () => console.error("Sketchfab API error"),
      ...playersettings
    });
  })
})
</script>



<template>
  <v-responsive :aspect-ratio="4 / 3" class="w-100">
    <!-- <div class="w-100 h-100 absolute top-0" :class="[isDark ? 'bg-purple-600' : 'bg-lime-300']"></div> -->
    <iframe style="border: 0" id="api-iframe" ref="viewerIframeRef" class="w-100 h-100 absolute"></iframe>
    <div class="w-full h-16 absolute bottom-0 flex justify-center content-center space-x-3">
      <RadioGroup v-model="selectedColor">
        <div 
          class="h-14 flex items-center space-x-3 rounded-full p-4 ring-1"
          :class="[
            isDark ? 'bg-gray-800 ring-white/10' : 'bg-gray-100 ring-black/10',
          ]"
        >
          <RadioGroupOption as="template" v-for="color in colors" :key="color.name" :value="color" v-slot="{ active, checked }"  @click="applyColors(color.name)">
            <div :class="[
              active && checked ? 'ring ring-offset-1' : '',
              !active && checked ? 'ring-2' : '',
              isDark ? 'ring-gray-100' : 'ring-gray-900',
              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none shadow-inner '
            ]">
              <span aria-hidden="true" :class="[color.bgColor, 'h-6 w-6 rounded-full border border-black border-opacity-10']" />
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
      <RadioGroup v-model="selectedSize">
        <div 
          class="h-14 flex items-center bg-gray-100 rounded-full p-1 ring-1"
          :class="[
            isDark ? 'bg-gray-800 ring-white/10' : 'bg-gray-100 ring-black/10',
          ]"
        >
          <RadioGroupOption as="template" v-for="size in sizes" :key="size.name" :value="size" v-slot="{ active, checked }"  @click="showSize(size.name)">
            <div :class="[
              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none '
            ]">
              <RadioGroupLabel as="span" class="sr-only">{{ size.title }}</RadioGroupLabel>
              <span aria-hidden="true" :class="[
                'content-center flex items-center justify-center font-semibold',
                checked && !isDark ? 'bg-gray-800 text-white' : '',
                checked && isDark ? 'bg-gray-100 text-black' : '',
                'h-12 w-12 rounded-full']"
              >{{ size.title }}</span>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>      
    </div>
  </v-responsive>
</template>